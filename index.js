const path = requiere('path');
const express = require('express');
const cors = require('cors');
const { dbConnextion } = require('./database/config');
require('dotenv').config();

//* Crear servidor de express
const app = express();

//* Base de datos
dbConnextion();

//* Mostrar directorio publico
app.use(express.static('public'));

//* Lectura y parseo de body
app.use(express.json());

//* Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.use('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
})

//* Escuchar peticiones
app.listen(process.env.PORT, () => {
	console.log(`Corriendo en servidor ${process.env.PORT}`);
});
