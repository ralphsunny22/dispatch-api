const jwt = require("jsonwebtoken");
const createError  = require("../utils/error.js");

const verifyRiderToken = (req, res, next) => {
  const token = req.cookies.rider_access_token;
  // return res.send({token});
  //if there's any token
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  //verify token against user credentials
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, rider) => {
    if (err) return next(createError(403, "Token is not valid!"));
    // return res.send({rider});
    
    //add new 'user' key to req obj, to store the credentials(user)
    req.riderTokenInfo = rider;
    
    //move to next fxn
    next();
  });
};

const verifyRider = (req, res, next) => {

  //avoid 'next' so that other /routes/users fxn will nt run, since verifyToken() also has a next()
  verifyRiderToken(req, res, () => {
    
    //check 'token user id' against param. OR check 'if token user isAdmin' is true
    if (req.riderTokenInfo.id === req.params.id ) {
      next();
    } else {
      return next(createError(403, "You are not authorized3!"));
    }
  });
};

// const verifyAdmin = (req, res, next) => {
//   verifyToken(req, res, () => {
//     //check 'if token user isAdmin' is true
//     if (req.userTokenInfo.isAdmin) {
//       next();
//     } else {
//       return next(createError(403, "You are not authorized2!"));
//     }
//   });
// };

module.exports = { verifyRiderToken, verifyRider }