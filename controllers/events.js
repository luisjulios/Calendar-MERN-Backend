const { response } = require('express');
const Event = require('../models/Event-model');

const getEvents = async (req, res = response) => {
	let events = await Event.find({ user: req.uid }).populate('user', 'name');

	return res.status(200).json({
		ok: true,
		events,
	});
};

const createEvent = async (req, res = response) => {
	const event = new Event(req.body);

	try {
		event.user = req.uid;
		const saveEvent = await event.save();

		return res.status(200).json({
			ok: true,
			event: saveEvent,
		});
	} catch (error) {
		return res.status(500).json({
			ok: false,
			msg: 'Por favor, comunicarse con el administrador',
		});
	}
};

const updateEvent = async (req, res = response) => {
	const eventId = req.params.id;
	const uid = req.uid;
	try {
		const event = await Event.findById(eventId);

		if (!event) {
			return res.status(404).json({
				ok: false,
				msg: 'Evento no existe',
			});
		}

		if (event.user.toString() !== uid) {
			return res.status(401).json({
				ok: false,
				msg: 'No tiene priviliegios de editar este evento',
			});
		}

		const newEvent = {
			...req.body,
			user: uid,
		};

		const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {
			new: true,
		});

		return res.status(200).json({
			ok: true,
			updatedEvent,
		});
	} catch (error) {
		return res.status(500).json({
			ok: false,
			msg: 'Por favor, comunicarse con el administrador',
		});
	}
};

const deleteEvent = async (req, res = response) => {
	const eventId = req.params.id;
	const uid = req.uid;
	try {
		const event = await Event.findById(eventId);

		if (!event) {
			return res.status(404).json({
				ok: false,
				msg: 'Evento no existe',
			});
		}

		if (event.user.toString() !== uid) {
			return res.status(401).json({
				ok: false,
				msg: 'No tiene priviliegios de eliminar este evento',
			});
		}

		await Event.deleteOne(event);

		return res.status(200).json({
			ok: true,
			msg: 'Evento eliminado',
		});
	} catch (error) {
		return res.status(500).json({
			ok: false,
			msg: 'Por favor, comunicarse con el administrador',
		});
	}
};

module.exports = {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
};
