const express = require('express');
const mongoose = require('mongoose');

const app = express();

//cors
const cors = require('cors');
var corsOptions = {
    origin: '*', // Reemplazar con dominio
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

require('dotenv').config()

app.use(express.json()); //para json
app.use(express.urlencoded({ extended: true })); //para formularios

// Conexión a Base de datos
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@node.vrslbjn.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
mongoose.connect(uri,   
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('Base de datos conectada'))
.catch(e => console.log('error db:', e))

//importar rutas 
const authRoutes = require('./routes/auth');
const validar = require('./routes/validar-token');
const admin = require('./routes/admin');


// route middlewares
app.use('/api/user', authRoutes);
app.use('/api/admin', validar, admin);

app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'funciona!'
    })
});

// iniciar server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`servidor andando en: ${PORT}`)
})
