const jwt = require("jsonwebtoken");
const createError  = require("../utils/error.js");

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  //if there's any token
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  //verify token against user credentials
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    
    //add new 'user' key to req obj, to store the credentials(user)
    req.userTokenInfo = user;
    
    //move to next fxn
    next();
  });
};

const verifyUser = (req, res, next) => {

  //avoid 'next' so that other /routes/users fxn will nt run, since verifyToken() also has a return
  verifyToken(req, res, () => {
    
    //check 'token user id' against param. OR check 'if token user isAdmin' is true
    if (req.userTokenInfo.id === req.params.id || req.userTokenInfo.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    //check 'if token user isAdmin' is true
    if (req.userTokenInfo.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

module.exports = { verifyToken, verifyUser, verifyAdmin }