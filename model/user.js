const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
    type: String,
    require: [true, "Please enter your User Name"]
    },
    email: {
        type: String,
        require: [true, "Please enter your Email"],
    },
    password: {
        type: String,
        require: [true, "Please enter your Password"],
        minLength: 4,
        select: false
    },
    phoneNumber: {
        type: Number,
    },
    addresses: [
        {
            country: {
                type: String,
            },
            city: {
                type: String,
            },
            address1: {
                type: String,
            },
            address2: {
                type: String,
            },
            zipCode: {
                type: Number,
            },
            addressType: {
                type: String,
            }
        }
    ],
    role: {
        type: String,
        default: "user",
    },
    avatar: {
        public_id: {
            type: String,
            require: true,
        },
        url: {
            type: String,
            require: true,
        }
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    resetPasswordToken: String,
    resetTokenTime: Date,
});

//hash password

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 16);
});

// jwt token
userSchema.methods.getJWToken = function () {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRES,
    });
};

//compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);