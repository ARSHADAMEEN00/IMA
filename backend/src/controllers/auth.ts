import { RequestHandler, } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import env from "../util/validateEnv";
import asyncHandler from "express-async-handler";
import { USER_IDENTITY } from "./user";
import mongoose from "mongoose";


export const getAuthenticatedUser: RequestHandler = asyncHandler(
    async (req, res, next) => {
        const { userId } = req.body.UserInfo

        try {
            const user = await UserModel.findById(userId).select("-password").lean().exec();
            if (!user) {
                throw createHttpError(404, "User Not Found");
            }

            const authenticatedUser = {
                user,
                isSuccess: true,
                message: ""
            }
            res.status(200).json(authenticatedUser)

        } catch (error) {
            next(error)
        }
    }
)


interface SignUpBody {
    username?: string,
    phoneNumber: number,
    password?: string,
    email?: string,
    userId?: string
    role: string
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = asyncHandler(async (req, res, next) => {
    const role = 'customer'
    const { username, phoneNumber, password, email } = req.body

    try {

        if (!username) {
            throw createHttpError(400, "User name is Required");
        }
        if (!email) {
            throw createHttpError(400, "Email is Required");
        }
        if (!password) {
            throw createHttpError(400, "Password is Required");
        }
        if (!phoneNumber) {
            throw createHttpError(400, "Phone Number is Required");
        }

        if (String(phoneNumber).length !== 10) {
            throw createHttpError(400, "Phone number must has exactly 10 characters.");
        }

        const existingUsername = await UserModel.findOne({ phoneNumber: phoneNumber }).lean().exec();
        if (existingUsername) {
            throw createHttpError(409, "Phone Number already taken. Please choose a different one or log in instead.");
        }

        const existingEmail = await UserModel.findOne({ email: email }).lean().exec();
        if (existingEmail) {
            throw createHttpError(409, "A user with this email address already exists. Please log in instead.");
        }

        const hashedPass = await bcrypt.hash(password, 10) //hash password

        const generateUserId = async () => {
            const lastUser = await UserModel.findOne().sort({ _id: -1 })
            if (lastUser) {
                const lastUserId = parseInt(lastUser.userIdentity.substring(3));

                return USER_IDENTITY + (lastUserId + 1).toString().padStart(3, '0');
            }
            return USER_IDENTITY + '001'
        }

        const userIdentity = await generateUserId()

        const newUser = await UserModel.create({
            email,
            username,
            phoneNumber,
            password: hashedPass,
            role,
            userIdentity
        })

        newUser['password'] = ''

        if (newUser) { //user created success
            const token = jwt.sign({ userId: newUser?._id }, env.JWT_KEY)

            const userWithToken = {
                user: newUser,
                isSuccess: true,
                message: "Successfully created the account, login to continue"
            }
            res.status(201).json(userWithToken)
        } else {
            throw createHttpError(400, 'Invalid user data received')
        }
    } catch (error) {
        next(error)
    }
});

interface LoginBody {
    username: string,
    password: string
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = asyncHandler(async (req, res, next) => {
    const username = req.body.username
    const password = req.body.password

    try {
        if (!username || !password) {
            throw createHttpError(400, 'All fields are required');
        }

        const user = await UserModel.findOne({ username: username }).select("+password +email").lean().exec()

        if (!user) {
            throw createHttpError(400, "Invalid credentials");
        }

        if (!user?.isActive) {
            throw createHttpError(400, 'Your account is unauthorized and deactivated, to activate your account contact admin');
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            throw createHttpError(400, "Password Not Match");
        }

        user['password'] = ''

        // const token = jwt.sign({ userId: user && user?._id }, env.JWT_KEY)
        const token = jwt.sign({
            "UserInfo": {
                "userId": user._id,
                "username": user.phoneNumber,
                "role": user.role
            }
        },
            env.JWT_KEY,
            { expiresIn: '1d' }
        )


        const refreshToken = jwt.sign(
            { "username": user.username }, env.JWT_KEY,
            { expiresIn: '1d' }
        )

        res.cookie('jwt', refreshToken, {
            httpOnly: true, //accessible only by web server
            secure: false, //https
            sameSite: "none", //cross-site cookie 
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        if (token) {
            const newUser = {
                user,
                token: token,
                message: "User Authenticated Successfully",
                isSuccess: true
            }
            req.session.userId = user?._id
            res.status(201).json(newUser)
        }

    } catch (error) {
        next(error)
    }
})

export const refresh: RequestHandler = (req, res) => {
    const cookies = req.cookies

    console.log("cookies :", cookies)

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(refreshToken, env.REFRESH_JWT_KEY,
        async (err: any, decoded: any) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const user = await UserModel.findOne({ username: decoded.username })

            if (!user) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign({
                "UserInfo": {
                    "userId": user._id,
                    "username": user.username,
                    "role": user.role
                }
            },
                env.JWT_KEY,
                { expiresIn: '60s' }
            )

            res.status(200).json({ token: accessToken })

        })
}


export const logout: RequestHandler = async (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error)
        } else {
            res.status(200).json({
                message: "Successfully logged out",
                isSuccess: true
            })
        }
    })

    // const cookies = req.cookies

    // if (!cookies?.jwt) return res.sendStatus(204)

    // res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })

    // res.sendStatus(200)

}


interface UpdatedUserPasswordBody {
    oldPassword?: string,
    newPassword?: string,
    UserInfo?: any
}

//update user
export const updateUserPassword: RequestHandler<any, unknown, UpdatedUserPasswordBody, unknown> = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body
    const { userId } = req.body.UserInfo

    try {
        if (!oldPassword || !newPassword) {
            throw createHttpError(400, "oldPassword and newPassword required");
        }

        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "invalid user id");
        }

        const user = await UserModel.findById({ _id: userId }).exec()

        if (!user) {
            throw createHttpError(404, "User not found");
        }

        const passwordMatch = await bcrypt.compare(oldPassword, user.password)

        if (!passwordMatch) {
            throw createHttpError(400, "Old Password Not Match");
        }

        const hashedPass = await bcrypt.hash(newPassword, 10) //hash password

        user.password = hashedPass

        await user.save();

        res.status(200).json({
            isSuccess: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        next(error)
    }
});
