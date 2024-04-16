import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import * as authServices from "../services/authServices.js";
import gravatar from "gravatar";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";
const { JWT_SECRET, PROJECT_URL } = process.env;

const posterPath = path.resolve("public", "avatars");

const singnup = async (req, res) => {
  const { email, password } = req.body;

  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  const URL = gravatar.url(email);
  console.log(URL);
  const newUser = await authServices.signup({
    ...req.body,
    password: hashPassword,
    verificationToken,
    avatarURL: URL,
  });
  console.log(newUser);

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: ` <a target="_blank" href="${PROJECT_URL}/api/users/verify/${verificationToken}">
        Click verify email
      </a>`,
  };

  await sendEmail(verifyEmail);
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await authServices.findUser({ verificationToken });
  console.log(user);
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await authServices.updateUser(
    { _id: user._id },
    { verify: true },
    { verificationToken: "" }
  );

  res.json({
    message: "Verification successful",
  });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: ` <a target="_blank" href="${PROJECT_URL}/api/users/verify/${user.verificationToken}">
      Click verify email
    </a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
};

const singin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;
  const { JWT_SECRET } = process.env;
  const payload = { id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await authServices.updateUser({ _id: id }, { token });
  res.json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const singout = async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { token: "" });

  res.json(204, "");
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "File not found" });
  }
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;

  const newPath = path.join(posterPath, filename);

  await fs.rename(oldPath, newPath);
  const avatar = path.join("avatars", filename);

  const image = await Jimp.read(newPath);
  await image.resize(250, 250).writeAsync(newPath);

  await authServices.updateUser({ _id }, { avatarURL: avatar });

  res.status(200).json({
    avatarURL: avatar,
  });
};

export default {
  singnup: ctrlWrapper(singnup),
  verify: ctrlWrapper(verify),
  singin: ctrlWrapper(singin),
  resendVerify: ctrlWrapper(resendVerify),
  getCurrent: ctrlWrapper(getCurrent),
  singout: ctrlWrapper(singout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
