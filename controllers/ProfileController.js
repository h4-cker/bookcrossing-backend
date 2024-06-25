import UserModel from "../models/User.js";
import AdModel from "../models/Ad.js";
import BookModel from "../models/Book.js";
import bcrypt from "bcrypt";

export const getAllUsers = async (req, res) => {
  try {
    const users = await AdModel.find().exec();

    if (users.length) {
      return res.json(users);
    } else {
      return res.json({
        message: "Пользователи не найдены",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Не удалось получить пользователей",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.params.id;
    const me = await UserModel.findOne({ _id: userId }).exec();

    if (!me) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    } else {
      delete me._doc.passwordHash;
      return res.json({ userInfo: me, accountOwner: req.accountOwner });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Не удалось получить пользователя",
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Неверный пароль" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        passwordHash: passwordHash,
      }
    );

    return res.status(200).json({
      message: "Пароль обновлен",
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Не удалось обновить пароль",
    });
  }
};

export const updateEmail = async (req, res) => {
  try {
    const userId = req.userId;
    const { email, password } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Неверный пароль" });
    }

    await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        email: email,
      }
    );

    return res.status(200).json({
      message: "Почта обновлена",
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Не удалось обновить почту",
    });
  }
};

export const updateName = async (req, res) => {
  try {
    const userId = req.userId;
    const name = req.body.name;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        name: name,
      }
    );

    return res.status(200).json({
      message: "Имя обновлено",
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Не удалось обновить имя",
    });
  }
};

export const removeMe = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const ads = await AdModel.find({ user: userId });

    const contentIds = ads.map((ad) => {
      return ad.content._id;
    });

    await BookModel.deleteMany({
      _id: { $in: contentIds },
    });

    await AdModel.deleteMany({
      user: userId,
    });

    await UserModel.deleteOne({ _id: userId });

    return res.status(200).json({
      message: "Пользователь удален",
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Не удалось удалить пользователя",
    });
  }
};

export const setAvatar = async (req, res) => {
  try {
    const userId = req.userId;
    const avatarUrl = req.body.avatarUrl;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        avatarUrl: avatarUrl,
      }
    );

    return res.status(200).json({
      message: "Аватар обновлен",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Не удалось обновить аватар",
    });
  }
};
