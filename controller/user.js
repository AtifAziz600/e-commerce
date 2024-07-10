const express = require("express");
const router = express.Router();
const path = require("path");
const {upload} = require("../multer");
const User = require("../model/user");
const fs = require("fs");
const ErrorHandler = require("../utils/ErrorHandler")

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
                res.status(500).json({ message: "Error deleting file "});
            } else {
                res.json({ message: "File deleted successfully "})
            }
        })
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
      const newUser = await User.create(user);
      res.status(200).json({
        success: true,
        newUser,
      });
  } catch (error) {
    return next(new ErrorHandler(error.message), 400)
  }
    
});

module.exports = router;