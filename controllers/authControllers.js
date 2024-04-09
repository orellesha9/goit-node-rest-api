import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import * as authServices from "../services/authServices.js";
import gravatar from "gravatar";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
const { JWT_SECRET } = process.env;

const posterPath = path.resolve("public", "avatars");

const singnup = async (req, res) => {
  const { email, password } = req.body;

  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const URL = gravatar.url(email);
  console.log(URL);
  const newUser = await authServices.signup({
    ...req.body,
    password: hashPassword,
    avatarURL: URL,
  });
  console.log(newUser);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const singin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;

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
  try {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка сервера" });
  }
};

export default {
  singnup: ctrlWrapper(singnup),
  singin: ctrlWrapper(singin),
  getCurrent: ctrlWrapper(getCurrent),
  singout: ctrlWrapper(singout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
