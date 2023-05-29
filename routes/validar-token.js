const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['auth-token'];
    if (!token) { return res.status(401).json({ message: 'No existe el token' })}

    try {
        const verificar = jwt.verify(token, process.env.TOKEN_SECRET); //informacion del usuario
        req.user = verificar;
        next()
    }catch (error) {
        res.status(401).json({ message: 'No existe el token' })
    }
}

module.exports = verifyToken;