//create tokens and saving it in cookies
const sendToken = (user, statusCode, res) => {
    const token = user.getToken();

    //option for cookies
    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }
};

res.status(statusCode).cookies("token", token.options).json({
    success: true,
    user,
    token,
})

module.exports = sendToken 

