const { response } = require('express');
const User = require('../models/User-model');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {
	const { email, password } = req.body;
	try {
		let user = await User.findOne({ email });
		if (user) {
			return res.status(409).json({
				ok: false,
				msg: 'Usuario ya registrado',
			});
		}

		user = new User(req.body);
		//* Encriptar password
		const salt = bcrypt.genSaltSync();
		user.password = bcrypt.hashSync(password, salt);
		await user.save();

		//Generar JWT

		const token = await generateJWT(user.id, user.name);

		return res.status(201).json({
			ok: true,
			uid: user.id,
			name: user.name,
			token,
		});
	} catch (error) {
		return res.status(500).json({
			ok: false,
			msg: 'Por favor, comunicarse con el administrador',
		});
	}
};

const loginUser = async (req, res = response) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				ok: false,
				msg: 'Usuario  y/o contraseña no son correctos',
			});
		}

		//Confirmar passwords
		const validPassword = bcrypt.compareSync(password, user.password);
		if (!validPassword) {
			return res.status(400).json({
				ok: true,
				msg: 'Password inválida',
			});
		}

		//Generar JWT
		const token = await generateJWT(user.id, user.name);

		return res.status(200).json({
			ok: true,
			uid: user.id,
			name: user.name,
			token,
		});
	} catch (error) {
		return res.status(500).json({
			ok: false,
			msg: 'Por favor, comunicarse con el administrador',
		});
	}
};

const renewToken = async (req, res = response) => {
	const { uid, name } = req;
	const token = await generateJWT(uid, name);
	return res.json({
		ok: true,
		uid,
		name,
		token,
	});
};

module.exports = {
	createUser,
	loginUser,
	renewToken,
};
