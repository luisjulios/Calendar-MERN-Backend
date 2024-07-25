/*
Rutas de CRUD / Events
host + /api/events
*/
const { Router } = require('express');
const {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
} = require('../controllers/events');
const { validateJWT } = require('../middlewares/validate-jwt');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/fieldValidators');
const { isDate } = require('../helpers/isDate');
const router = Router();

router.use(validateJWT);

router.get('/', getEvents);
router.post(
	'/',
	[
		check('title', 'Titulo es requerido').not().isEmpty(),
		check('start', 'Fecha de inicio es requerida').custom(isDate),
		check('end', 'Fecha fin es requerida').custom(isDate),
		validateFields,
	],
	createEvent
);
router.put('/:id', [check(), check(), check()], updateEvent);
router.delete('/:id', [check(), check(), check()], deleteEvent);

module.exports = router;
