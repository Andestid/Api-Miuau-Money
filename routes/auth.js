const router = require('express').Router();
const User = require('../models/user');

const Joi = require('@hapi/joi'); // validation library
const bcrypt = require('bcrypt'); //encriptar contraseñas
const jwt = require('jsonwebtoken'); //generar token

const SchemaRegister = Joi.object({
name: Joi.string().min(6).max(255).required(),
email: Joi.string().min(6).max(255).required().email(),
password: Joi.string().min(6).max(255).required()
})

const SchemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
})

router.post('/login', async (req, res) => {

    const { error } = SchemaLogin.validate(req.body) //solo el atrapamos el error si existe    
    if (error) {
        return res.status(400).json(
            {error: error.details[0].message}
        )
    }

    const user = await User.findOne({ email: req.body.email }) //buscamos usuario si existe
    if (!user) {
        return res.status(400).json({
            error:true,message: 'Usuario no encontrado'
        })     
    }
    const passvalidacion = await bcrypt.compare(req.body.password, user.password) //comparamos la contraseña
    if (!passvalidacion) {return res.status(400).json({error:true,message: 'Contraseña incorrecta'});  
}

    //crear token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    },process.env.TOKEN_SECRET)

    res.header('auth-token', token).json({
        error: null,
        data: 'exito bienvenido',
        token: token
    })

}) 
    

router.post('/register', async (req, res) => {


    const { error } = SchemaRegister.validate(req.body) //solo el atrapamos el error si existe    
    if (error) {
        return res.status(400).json(
            {error: error.details[0].message}
        )
    }

    const existeEmail = await User.findOne({email: req.body.email}) //Validacion email
    if(existeEmail) 
        return res.status(400).json({
            error:true,message: 'El email ya existe'
        }) 
    
    //Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: passwordHash
    })
    try{
        const userDB = await user.save();
        res.json({
            error:null,
            data: userDB
        })
    }catch(error){
        res.status(400).json(error);
    }
})


module.exports = router;
