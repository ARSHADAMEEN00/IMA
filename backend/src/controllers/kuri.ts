import { RequestHandler } from "express";
import KuriSchemaModel from "../models/kuri";
import createHttpError from "http-errors";
import mongoose, { QueryOptions } from "mongoose";


export const getKuri: RequestHandler = async (req, res, next) => {
  const { userId } = req.body.UserInfo
  const search = req.query.search
  const limit = req.query.limit || '10'

  const queryData: QueryOptions = {
    $or: [
      { name: { $regex: search ? search : "", $options: "i" } },
    ]
  }

  if (userId) {
    queryData["userId"] = userId;
  }

  try {
    const Kuri = await KuriSchemaModel.find(queryData).sort({ createdAt: -1 }).limit(Number(limit)).exec();
    const total = await KuriSchemaModel.count()

    res.status(200).json({
      list: Kuri,
      isSuccess: true,
      message: "",
      total,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getKuriDetail: RequestHandler = async (req, res, next) => {
  const KuriId = req.params.KuriId;

  try {
    if (!mongoose.isValidObjectId(KuriId)) {
      throw createHttpError(400, "invalid Kuri id");
    }

    const Kuri = await KuriSchemaModel.findById(KuriId).exec();


    if (!Kuri) {
      throw createHttpError(404, "Kuri not found");
    }
    res.status(200).json({
      service: Kuri,
      isSuccess: true,
      message: ""
    });

  } catch (error) {
    console.error(error);
    next(error);
  }
};

interface KuriBody {
  name: string;
  description: string;
  totalAmount: number;
  emiAmount: number;
  isCompleted?: boolean;
  isActive?: boolean
  UserInfo: never;
  installments: any;
  startDate: Date
}

// function createInstallments(totalAmount: number, emiAmount: number, startDate: Date) {
//   const totalInstallments = Math.ceil(totalAmount / emiAmount);
//   const installments = [];
//   const currentDate = new Date(startDate);

//   for (let i = 1; i <= totalInstallments; i++) {
//     const installment = {
//       InstallmentNo: i,
//       isCompleted: false,
//       date: i === 1 ? currentDate : currentDate.setMonth(currentDate.getMonth() + 1)
//     };

//     installments.push(installment);
//   }

//   return installments;
// }
function generateInstallments(totalAmount: number, emiAmount: number, startDate: Date) {
  const totalInstallment = [];
  const currentDate = new Date(startDate);
  let remainingAmount = totalAmount;

  let installmentNo = 1;
  while (remainingAmount > 0) {
    totalInstallment.push({
      InstallmentNo: installmentNo,
      isCompleted: false,
      date: currentDate.toISOString().split('T')[0], // Format the date as "YYYY-MM-DD"
    });

    remainingAmount -= emiAmount;
    installmentNo++;

    // Move to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Mark the last installment as completed if it covers the remaining amount
  // if (remainingAmount <= 0) {
  //   totalInstallment[totalInstallment.length - 1].isCompleted = true;
  // }

  return totalInstallment;
}


export const createKuri: RequestHandler<unknown, unknown, KuriBody, unknown> = async (req, res, next) => {
  const { name, description, totalAmount, emiAmount, isCompleted, isActive, startDate } = req.body

  const { userId } = req.body.UserInfo

  try {
    if (!name || !totalAmount || !emiAmount || !startDate) {
      throw createHttpError(400, "Please fill the required fields");
    }

    // const totalAmount = 1000;
    // const emiAmount = 200;
    // const startDate = '2023-01-01';

    // const installments = createInstallments(totalAmount, emiAmount, startDate);
    const installments = generateInstallments(totalAmount, emiAmount, startDate);

    const newKuri = await KuriSchemaModel.create({
      name,
      description,
      totalAmount,
      emiAmount,
      isCompleted,
      isActive,
      userId,
      installments,
      startDate
    });

    res.status(201).json(
      {
        kuri: newKuri,
        isSuccess: true,
        message: "Kuri Created SuccessFully"
      }
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
};


interface UpdateKuriParams {
  KuriId: string;
}

export const updateKuri: RequestHandler<UpdateKuriParams, unknown, KuriBody, unknown> = async (req, res, next) => {
  const { isCompleted, isActive, installments } = req.body
  const { userId } = req.body.UserInfo

  const KuriId = req.params.KuriId;

  try {

    if (!mongoose.isValidObjectId(KuriId)) {
      throw createHttpError(400, "invalid Kuri id");
    }

    const Kuri = await KuriSchemaModel.findById(KuriId).exec();

    if (!Kuri) {
      throw createHttpError(404, "Kuri not found");
    }

    if (Kuri?.userId.toString() !== userId) {
      throw createHttpError(404, "You do not have access to this Kuri");
    }

    // Kuri.isCompleted = isCompleted ? isCompleted : false;

    // const updateKuri = await Kuri.save();

    const updateKuri = await KuriSchemaModel.findOneAndUpdate(
      { _id: KuriId },
      {
        isCompleted,
        isActive,
        installments
      },
      { new: true }
    );

    res.status(200).json({
      kuri: updateKuri,
      isSuccess: true,
      message: "Kuri Updated SuccessFully"
    });

  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteKuri: RequestHandler = async (req, res, next) => {
  const KuriId = req.params.KuriId;

  try {

    if (!mongoose.isValidObjectId(KuriId)) {
      throw createHttpError(400, "invalid Kuri id");
    }

    const Kuri = await KuriSchemaModel.findByIdAndDelete(KuriId)

    if (!Kuri) {
      throw createHttpError(404, "Kuri not found");
    }

    res.status(200).json({
      kuriId: KuriId,
      isSuccess: true,
      message: "Kuri Deleted SuccessFully"
    })
  } catch (error) {
    console.error(error);
    next(error);
  }
};
