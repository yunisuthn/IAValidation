const User = require('../Models/User')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')

const login = async (req, res, next) => {
    const {email, password} = req.body    
    try {
        const user = await User.findOne({email: email})
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email,
                role: user.role,
                token: generateToken(user._id)
            })
        }else{
            res.json('error')
        }
    } catch (error) {
        next(error)
    }
    
}

const signup = async (req, res, next) => {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password || !role) {
        return next(new Error('Please add all fields'));
    }

    try {
        const checkUser = await User.findOne({email: email})
        if (checkUser) {
            return next(new Error('User already exist'));
        }
        
        const salt = await bcrypt.genSalt(10)
        const hashedPasword = await bcrypt.hash(password, salt)
        
        const user = await User.create(
            {
                name,
                email,
                password: hashedPasword,
                role
            }
        )
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            })
        }
        
    } catch (error) {
        next(error); // Passer toute erreur au middleware de gestion des erreurs
    }
    
}

const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    login, signup
}