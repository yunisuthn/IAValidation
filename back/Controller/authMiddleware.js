const jwt = require ('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../Models/User')

const protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            //Get token from heder
            token = req.headers.authorization.split(' ')[1]

            //Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            //Get user form the token

            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            console.log("erreur", error);
            res.status(401)
            return next(new Error('Not authorized'));
            
        }
    }

    if (!token) {
        res.status(401)
        
        return next(new Error('Not authorized, no token'));
    }
})

module.exports = {protect}