const express = require("express");
const router = express.Router();
const path = require("path");
const {upload} = require("../multer");
const User = require("../model/user");
const fs = require("fs");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendMail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");


router.post("/create-user", upload.single("file"), async (req,res,next) => {
  
  try {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });
    
    if (userEmail) {
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      console.log(filename)
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
    console.log(filename);
    const user = {
      name: name,
      email: email,
      password: password,
      avatar: fileURL,
    };
    const activationToken = createActivationToken(user);
    console.log(createActivationToken);
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
  
});
// create activation token inisialize korar somoye function use korar age inisialize ta thakte hobe
  const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
      expiresIn: "10m",
    });
  };


//activate user
router.post("/activation", catchAsyncError(async (req, res, next) => {
  try {
    const { activation_token } = req.body;
    const newUser = 
    jwt.verify(
      activation_token, 
      process.env.ACTIVATION_SECRET
    );

    if(!newUser) {
      return next(new ErrorHandler("Invalid Token!", 400));
    }
    const { name, email, password, avatar } = newUser;

    User.create({
      name,
      email,
      password,
      avatar,
    });

    sendToken(newUser, 201, res)
    
  } catch (error) {
    return next(new ErrorHandler(error.message, 500))
  }
} 
))

module.exports = router;