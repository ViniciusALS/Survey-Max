import { body } from 'express-validator';


export default class ValidationModel {

	static signup = [
		body('firstName').exists().withMessage('firstName field missing.').trim(),

		body('lastName').exists().withMessage('lastName field missing.').trim(),

		body('userName').exists().withMessage('userName field missing.').trim(),

		body('email').exists().withMessage('email field missing.')
			.if(body('email').exists())
			.trim().isEmail().normalizeEmail().withMessage('Email format is incorrect.'),

		body('password').exists().withMessage('password field missing.')
			.if(body('password').exists())
			.isLength({ min: 7 }).withMessage('Password should be at least 7 characters long.')
	];
}
