import express, { Router } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "myaccesssecret";
const refreshTokenSecret =
  process.env.REFRESH_TOKEN_SECRET || "myrefreshsecret";

const app = express();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  refresh_token: String,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    email.length === 0 ||
    password.length === 0 ||
    username.length === 0
  )
    return res.status(400).json({ message: "Please fill all the details!" });

  const user = new User({ username, email, password });

  try {
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || email.length === 0 || password.length === 0)
    return res.status(400).json({ message: "Please fill all the details!" });

  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found!" });

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched)
    return res.status(401).json({ message: "password is incorrect!" });

  try {
    const access_token = generateAccessToken({
      id: user._id,
      email: user.email,
    });

    const refresh_token = generateRefreshToken({
      id: user._id,
    });

    user.refresh_token = refresh_token;
    await user.save();

    const { password, ...rest } = user._doc;

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    return res.status(200).cookie("access_token", access_token, options).json({
      message: "Sign in successfull!",
      user: rest,
      access_token,
      refresh_token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.access_token || req.headers.authorization;

    console.log("token :", token);

    if (!token) {
      console.log("token not present");

      return res
        .status(401)
        .json({ message: "Token is not present | Unauthorized access!" });
    }

    const decodedToken = await jwt.verify(token, accessTokenSecret);

    console.log("decodedToken :", decodedToken);

    const user = await User.findById(decodedToken?.id);

    console.log("user :", user);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Token expired | Unauthorized access!" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("error in verify user :", error);

    return res.status(401).json({ message: error.message });
  }
};

const generateAccessToken = (user) => {
  console.log("user generate acce ss token :", user);

  return jwt.sign(user, accessTokenSecret, { expiresIn: "30s" });
};

const generateRefreshToken = (user) => {
  console.log("user generate refresh token :", user);
  return jwt.sign(user, refreshTokenSecret, { expiresIn: "5m" });
};

app.post("/refresh-token", async (req, res) => {
  const { token } = req.body;

  console.log("token refresh token :", token);

  if (!token) {
    return res.status(403).json({ message: "Token is required!" });
  }

  await jwt.verify(token, refreshTokenSecret, (err, user) => {
    console.log("user123 :", user);

    const access_token = generateAccessToken({
      id: user.id,
      email: user.email,
    });

    if (err)
      return res.status(403).json({ message: "Refresh token is not valid" });

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    return res
      .status(200)
      .cookie("access_token", access_token, options)
      .json({ message: "Successfully refreshed the session" });
  });
});

app.get("/users", verifyUser, async (req, res) => {
  console.log("entered in users route");

  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
});

app.get("/signout", async (req, res) => {
  try {
    console.log("entered in signout route");

    const decodedToken = await jwt.verify(
      req.cookies.access_token,
      accessTokenSecret
    );
    console.log("user : hey here2", user);

    if (!decodedToken) {
      return res.status(401).json({ message: "not authorized" });
    }
    console.log("user : hey here1", user);

    const user = await User.findById(decodedToken?.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized access!" });
    }

    console.log("user : hey here", user);

    user.refresh_token = "";
    await user.save();

    return res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "logout successfull" });
  } catch (error) {
    console.log("error in signout route :", error);
    return res.status(500).json({ message: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
