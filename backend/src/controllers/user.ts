import { RequestHandler, } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user"
import asyncHandler from "express-async-handler";
import mongoose, { QueryOptions } from "mongoose";
import bcrypt from "bcrypt"

export const USER_IDENTITY = 'USR'

// get all user by admin
export const getAllUsers: RequestHandler = asyncHandler(async (req, res, next) => {
    const page = req.query.page
    const search = req.query.search
    const limit = req.query.limit || '10'
    const type = req.params.type
    const sortBy = req.query.sortBy
    const sortDirection = req.query.sortDirection


    const queryData: QueryOptions = {
        $or: [
            { username: { $regex: search ? search : "", $options: "i" } },
            { email: { $regex: search ? search : "", $options: "i" } },
            { userIdentity: { $regex: search ? search : "", $options: "i" } },
        ],
    }

    if (type && type !== 'all') {
        queryData["role"] = type
    }

    const sortDirectionHandle = () => {
        if (sortDirection === 'asc') {
            return 1
        }
        return -1
    }

    const sortByData: any = () => {
        switch (sortBy) {
            case 'username':
                return { username: sortDirectionHandle() }
            case 'email':
                return { email: sortDirectionHandle() }
            case 'role':
                return { role: sortDirectionHandle() }
            case 'createdAt':
                return { createdAt: sortDirectionHandle() }
            case 'isActive':
                return { isActive: sortDirectionHandle() }
            case 'userIdentity':
                return { userIdentity: sortDirectionHandle() }

            default:
                return { createdAt: -1 }
        }
    }

    try {
        const user = await UserModel.find(queryData).sort(sortByData()).select("-password").limit(Number(limit)).skip((Number(page ? page : 1) - 1) * Number(limit)).exec();
        const total = await UserModel.count()

        res.status(200).json({
            list: user,
            total,
            page: page ? page : 1,
            isSuccess: true,
            message: ""
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

export const getUserDetails: RequestHandler = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId
    try {
        const user = await UserModel.findOne({ _id: userId }).select('-password').lean().exec();

        res.status(200).json({
            user,
            isSuccess: true,
            message: ""
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

interface SignUpBody {
    username?: string,
    password?: string,
    email?: string,
    userId?: string,
    role: string
}

export const createUser: RequestHandler<unknown, unknown, SignUpBody, unknown> = asyncHandler(async (req, res, next) => {
    const { username, password, email, role } = req.body

    try {

        if (!username || !email || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        if (!Array.isArray(role) || !role.length) {
            throw createHttpError(404, "Please  Select a role, role is required for a user");
        }

        const existingUsername = await UserModel.findOne({ username: username }).lean().exec();
        if (existingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different one");
        }

        const existingEmail = await UserModel.findOne({ email: email }).lean().exec();
        if (existingEmail) {
            throw createHttpError(409, "A user with this email address already exists.");
        }

        const hashedPass = await bcrypt.hash(password, 10) //hash password

        const generateUserId = async () => {
            const lastUser = await UserModel.findOne().sort({ _id: -1 })
            if (lastUser) {
                const lastUserId = parseInt(lastUser.userIdentity.substring(3));

                return USER_IDENTITY + (lastUserId + 1).toString().padStart(3, '0');
            } else return USER_IDENTITY + '001'
        }

        const userIdentity = await generateUserId()

        const newUser = await UserModel.create({
            email,
            username,
            password: hashedPass,
            role,
            userIdentity
        })

        newUser['password'] = ''

        if (newUser) {
            res.status(201).json({
                user: newUser,
                isSuccess: true,
                message: "User created successFully"
            })
        } else {
            throw createHttpError(400, 'Invalid user data received')
        }
    } catch (error) {
        next(error)
    }
});

interface UpdatedUserBody {
    username?: string,
    email?: string,
    userId?: string
    user?: any,
    role?: string,
    isActive: boolean
}
interface UpdateUserParams {
    userId: string;
}

//update user
export const updateUser: RequestHandler<any, unknown, UpdatedUserBody, unknown> = asyncHandler(async (req, res, next) => {
    const { username, email, role, isActive } = req.body
    const userId = req.params.userId;

    try {
        if (!username || !email || !Array.isArray(role) || !role?.length || typeof isActive !== 'boolean') {
            throw createHttpError(400, "Parameters missing");
        }

        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "invalid user id");
        }

        const user = await UserModel.findById({ _id: userId }).exec()

        const existingUsername = await UserModel.findOne({ username: username }).lean().exec();
        if (existingUsername && existingUsername?._id.toString() !== userId) {
            throw createHttpError(409, "Username already taken. Please choose a different one or log in instead.");
        }

        const existingEmail = await UserModel.findOne({ email: email }).lean().exec();
        if (existingEmail && existingEmail?._id.toString() !== userId) {
            throw createHttpError(409, "A user with this email address already exists. Please log in instead.");
        }

        if (!user) {
            throw createHttpError(404, "User not found");
        }

        user.username = username
        user.email = email
        user.role = role
        user.isActive = isActive

        // const updatedUser = await UserModel.findByIdAndUpdate(
        //     { _id: userId },
        //     {
        //         email,
        //         username,
        //         role,
        //         isActive
        //     }
        // );

        const updatedUser = await user.save();

        res.status(200).json({
            user: updatedUser,
            isSuccess: true,
            message: "User Details Updated Successfully"
        });

    } catch (error) {
        next(error)
    }
});

interface UpdatedUserPasswordBody {
    oldPassword?: string,
    newPassword?: string,
    userId?: string
    user?: any
}

//update user
export const updateUserPassword: RequestHandler<any, unknown, UpdatedUserPasswordBody, unknown> = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body
    const userId = req.params.userId;

    try {
        if (!oldPassword || !newPassword) {
            throw createHttpError(400, "Parameters missing");
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

//delete user
export const deleteUser: RequestHandler = async (req, res, next) => {
    const userId = req.params.userId
    try {

        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "invalid user id");
        }

        // const notes = await NoteModel.findOne({ userId: userId }).lean().exec()

        // if (notes) {
        //     return res.status(400).json({ message: 'User has assigned notes ' })
        // }

        const user = await UserModel.findByIdAndDelete(userId)

        if (!user) {
            throw createHttpError(404, "User not found");
        }
        // const result = await user.deleteOne()

        res.status(200).json({
            userId: userId,
            message: "user deleted successfully",
            isSuccess: true,
        })

    } catch (error) {
        console.error(error);
        next(error);
    }
};

//delete multiple user
export const deleteMultipleUser: RequestHandler = async (req, res, next) => {
    const { userIds } = req.body

    try {

        const isValid = userIds?.every((id: string) => mongoose.isValidObjectId(id));

        if (!isValid) {
            throw createHttpError(400, "invalid user id");
        }

        UserModel.deleteMany({ _id: { $in: userIds?.map((id: string) => id) } })
            .then(result => {
                res.status(200).json({
                    userIds,
                    message: `${result.deletedCount} users deleted successfully`,
                    isSuccess: true,
                })
            })
            .catch(error => {
                throw createHttpError(404, "Users not found");
            });

    } catch (error) {
        console.error(error);
        next(error);
    }
};