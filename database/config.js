const { mongoose } = require('mongoose');
require('dotenv').config();

const dbConnextion = async () => {
	try {
		await mongoose.connect(process.env.DB_CNN);

		console.log('DB Online');
	} catch (error) {
		console.log(error);
		throw new Error('Error al inicializar Base de Datos');
	}
};
module.exports = { dbConnextion };
