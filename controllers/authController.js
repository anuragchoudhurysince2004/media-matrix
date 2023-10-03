const User = require("./../models/user");
const { promisify } = require("util");
const JWT = require("jsonwebtoken");
const signToken = (id) => {
    return JWT.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
//register a new user
exports.register = async (req, res) => {
    try {
        const { email, password, name, department } = req.body;
        const data = await User.create({
            email: email,
            password: password,
            name,
            department,
        });
        const token = signToken(data._id);
        res.status(200).json({
            status: "success",
            message: "registration successful",
            token,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//logging in a user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //1)check if email and password exist
        if (!email || !password) {
            throw new Error("Please provide email and password");
        }
        //2)check if user exist and password is correct
        const user = await User.findOne({ email });
        if (!user || !(password === user.password)) {
            throw new Error("Incorrect email or password");
        }
        //3)if everything ok send the token to the client
        const token = signToken(user._id);
        res.cookie("jwt", token, {
            expiresIn: new Date(
                Date.now() +
                    process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
        });
        res.status(200).json({ status: "success", token });
    } catch (err) {
        res.status(400).json({
            result: "fail",
            error: err.message,
        });
    }
};

//logging user out
exports.logout = (req, res) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: "success" });
};
//building a function that will look if the user is logged in
exports.protect = async (req, res, next) => {
    try {
        // getting token and check if it's there
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
            // res.status(200).json({
            //     status: "success",
            //     token,
            // });
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }
        if (!token) {
            return next(new Error("You are not logged in !!"));
        }
        //verification of token
        const decoded = await promisify(JWT.verify)(
            token,
            process.env.JWT_SECRET
        );
        //check if user still exist
        const freshUser = await User.findById(decoded.id);
        if (!freshUser) {
            return next(new Error("user no longer exist"));
        }
        //check if user changed password after the token was issued
        //will do this later have edit schema add schema method ..........
        res.locals.user = freshUser;
        req.user = freshUser;
        next();
    } catch (err) {
        res.status(401).json({
            status: "fail",
            message: err.message,
            err: err,
        });
        // console.log(err);
    }
};

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            // 1) verify token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );

            // 2) Check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }

            // 3) Check if user changed password after the token was issued
            // if (currentUser.changedPasswordAfter(decoded.iat)) {
            //   return next();
            // }

            // THERE IS A LOGGED IN USER
            res.locals.user = currentUser;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
};
