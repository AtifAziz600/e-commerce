const express = require("express");
const router = express.Router();
const path = require("path");
const {upload} = require("../multer");
const User = require("../model/user");
const fs = require("fs");
const ErrorHandler = require("../utils/ErrorHandler");
const sendMail = require("../utils/sendMail");

router.post("/create-user", upload.single("file"), async (req,res,next) => {
  try {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error deleting file " });
        } else {
          res.json({ message: "File deleted successfully " });
        }
      });
      return next(new ErrorHandler("User already exists", 400));
    }

    const filename = req.file.filename;
    const fileURL = path.join(filename);
    const user = {
      name: name,
      email: email,
      password: password,
      avatar: fileURL,
    };
    const activationToken = createActivationToken(user);
    const activationURL = `http://localhost:3000/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Account activation",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationURL}`,
      })
      res.status(201).json({
        success: true,
        message: `Please check your email- ${user.email} to activate your account`
      })
    } catch (error) {
      return next(new ErrorHandler(error.message, 500))
    }

  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
  // create activation token
  const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
      expiresIn: "10m",
    });
  };
});

module.exports = router;