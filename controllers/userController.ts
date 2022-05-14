import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from 'bcrypt';
import User, { IUserRequest } from "../models/User";
import generateToken from "../utils/generateToken";
import { sendEmail } from "../services/sendEmailMsg";
import {startSession} from "mongoose";

// @Desc Register user
// @Route /api/users/register
// @Method POST
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, avatar } = req.body;

  const user = new User({
    name,
    email,
    password,
    avatar
  });

  await user.save();

  res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
  });
});

// @Desc Login user
// @Route /api/users/login
// @Method POST
export const login = asyncHandler(async (req: Request, res: Response) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email })

  if(!user) {
    res.status(401);
    throw new Error("User not found");
  }

  if(await user.comparePassword(password)) {

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });

  } else {
    res.status(401);
    throw new Error("Email or password incorrect");
  }

})

// @Desc Update profile
// @Route /api/users/update
// @Method PUT
export const updateProfile = asyncHandler(async (req: IUserRequest, res: Response) => {

  let user = await User.findById(req.user.id);

  if(!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const { name, email, avatar } = req.body;

  user = await User.findByIdAndUpdate(req.user.id, {
    name, email, avatar
  }, { new: true }).select("-password");

  res.status(201).json({
    id: user?._id,
    name: user?.name,
    email: user?.email,
    avatar: user?.avatar,
    isAdmin: user?.isAdmin,
    token: generateToken(user?._id)
  });

})

// @Desc Update password
// @Route /api/users/update/password
// @Method PUT
export const updatePassword = asyncHandler(async(req: IUserRequest, res: Response) => {

  let user = await User.findById(req.user.id);

  if(!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const { oldPassword, newPassword } = req.body;

  if((await user.comparePassword(oldPassword))) {

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    user = await User.findByIdAndUpdate(req.user.id, {
      password: hash
    }, { new: true });

    res.status(201).json({
      id: user?._id,
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar,
      isAdmin: user?.isAdmin,
      token: generateToken(user?._id)
    });

  } else {
    res.status(401);
    throw new Error("Old password incorrect");
  }

})

// @Desc Get all users 
// @Route /api/users
// @Method GET
export const getAll = asyncHandler(async (req: Request, res: Response) => {

  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const count = await User.countDocuments();
  const users = await User.find({}).select("-password").limit(pageSize).skip(pageSize * (page - 1));
  res.status(201).json({  
      users,
      page,
      pages: Math.ceil(count / pageSize),
      count
  });

})

// @Desc Get single user by ID
// @Route /api/users/:id
// @Method GET
export const getSingleUser = asyncHandler(async (req: Request, res: Response) => {

  const user = await User.findById(req.params.userId).select("-password");

  if(!user) {
    res.status(401);
    throw new Error("User not found");
  }

  res.status(201).json(user);

})

// @Desc Update user by ID
// @Route /api/users/:id
// @Method PUT
export const updateUser = asyncHandler(async (req: Request, res: Response) => {

  let user = await User.findById(req.params.userId);

  if(!user) {
    res.status(401);
    throw new Error("User not found");
  }

  try {
    user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true }).select("-password");

    res.status(201).json({
      message: "User updated successfully."
    });
  } catch (error) {
    res.status(400).json({
      error
    })
  }

})

// @Desc Delete user by ID
// @Route /api/users/:id
// @Method DELETE
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {

  let user = await User.findById(req.params.userId);

  if(!user) {
    res.status(401);
    throw new Error("User not found");
  }

  await User.findByIdAndDelete(req.params.userId);

  res.status(201).json({});

})

// @Desc Forgot Password
// @Route /api/users/forgot
// @Method POST
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const session = await startSession();
  const opts = { session, returnOriginal: false };
  
  try {
    const { email } = req.body;

    if (!email) {
      res
        .status(400)
        .json({ error: "You must enter an email address." }).end();
    }

    session.startTransaction();

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new Error("No user found for this email address.");
    }

    const resetToken = generateToken(existingUser._id);

    existingUser.resetPasswordToken = resetToken;
    existingUser.save(opts);
    
    try {
      await sendEmail(
        existingUser.email,
        "reset",
        req.headers.host as String,
        resetToken
      );
    } catch (error: any) {
      console.log(error);
      
      throw new Error(error.message);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Please check your email for the link to reset your password.",
      token: resetToken
    });
  } catch (error: any) {

    await session.abortTransaction();
    session.endSession();

    res.status(400).json({
      error: "Your request could not be processed. Please try again."
    });
  }
})

export const resetPassword = async (req: Request, res: Response) => {
  const session = await startSession();
  const opts = { session, returnOriginal: false };

  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "You must enter a password." });
    }

    session.startTransaction();

    const resetUser = await User.findOne({
      resetPasswordToken: req.params.token,
    });

    if (!resetUser) {
      throw new Error("Your token has expired. Please attempt to reset your password again.");
    }

    resetUser.password = password;
    resetUser.resetPasswordToken = "";

    resetUser.save(opts);

    try {
      await sendEmail(resetUser.email, "reset-confirmation", req.headers.host as String);
    } catch (err) {
      throw new Error("Cannot send email!")
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message:
        "Password changed successfully. Please login with your new password.",
    });
  } catch (error) {

    await session.abortTransaction();
    session.endSession();

    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
}

export const searchUser = asyncHandler (async (req: Request, res: Response) => {
  const {value} = req.body;

  try {
    const users = await User.find({
      $or : [
        {
          name: {$regex: value},
        },
        {
          email: {$regex: value}
        }
      ]
    });

    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const count = users.length;

    res.status(200).json({
      users,
      page,
      pages: Math.ceil(count / pageSize),
      count
    })
  } catch (error: any) {
    throw new Error(error)
  }
})

export const getAccount = asyncHandler (async (req: IUserRequest, res: Response) => {
  const user = await User.findById(req.user._id).select("-password");

  if(!user) {
    res.status(400);
    throw new Error("User not found");
  }

  res.status(201).json(user);
})