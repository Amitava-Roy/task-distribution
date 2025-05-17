const ResponseDto = require("../utils/ResponseDto");
const User = require("../models/userModel");
const asyncHandler = require("../utils/createAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { promisify } = require("util");

const signToken = (userData, expirationTime = "90d") => {
  return jwt.sign({ id: userData._id }, process.env.JWT_SECRET, {
    expiresIn: expirationTime,
  });
};

const maketokenAndSend = (res, userData) => {
  const token = signToken(userData);

  const userDetails = {
    name: userData.username,
    email: userData.email,
    id: userData._id,
  };

  res
    .status(200)
    .json(
      new ResponseDto("User created sucessfully.", 1, { userDetails, token })
    );
};

exports.signUP = asyncHandler(async (req, res) => {
  const userData = await User.create(req.body);

  if (!userData) return next(new AppError("Counld not save user", 500, 0));

  maketokenAndSend(res, userData);
});

exports.signIn = asyncHandler(async (req, res, next) => {
  if (!req.body.password) return next(new AppError("Need password for login"));
  if (!req.body.email) return next(new AppError("Need email to login."));

  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );

  if (!user) return next(new AppError("Could not find email.Register first."));
  if (!(await user.isPasswordMatching(req.body.password, user.password)))
    return next(new AppError("provided wrong password."));

  maketokenAndSend(res, user);
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(new AppError("cant accesss with out loging in.", 404));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...allowedRoles) =>
  asyncHandler(async (req, res, next) => {
    if (!allowedRoles.includes(req.user.role))
      return next(new AppError("You are not authorized to do this.", 401));

    next();
  });
