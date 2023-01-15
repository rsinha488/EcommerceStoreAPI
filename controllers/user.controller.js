const User = require('../models/Users');
const BigPromise = require('../middlewares/bigPromise');
const CustomError = require('../utils/customError');
const cookieToken = require('../utils/cookieToken');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');

exports.signup = BigPromise(async (req, res, next) => {

    let result;
    console.log(req.files);
    console.log("req=", req.files);
    if (req.files) {
        let file = req.files.photo;
        console.log("PIV=", file)
        result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: 'ecommercestoreusers',
            width: 150,
            crop: "scale"
        });
    }

    const { name, email, password } = req.body;
    if (!email || !name || !password) {
        return next(new CustomError('Name, email and password are required', 400));
    }
    const user = await User.create({
        name, email, password, photo: {
            id: result.public_id,
            secure_url: result.secure_url,
        }
    });
    cookieToken(user, res);
})

