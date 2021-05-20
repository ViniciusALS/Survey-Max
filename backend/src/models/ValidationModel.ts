import { body } from 'express-validator';


export default class ValidationModel {

	static signUp = [
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

	static signIn = [
		body('email').exists().withMessage('email field missing.')
			.if(body('email').exists())
			.trim().isEmail().normalizeEmail().withMessage('Email format is incorrect.'),

		body('password').exists().withMessage('password field missing.')
			.if(body('password').exists())
			.isLength({ min: 7 }).withMessage('Password should be at least 7 characters long.')
	];

	static createSurvey = [
		body('title').exists().withMessage('title field missing.')
	];

	static editSurvey = [
		body('surveyId').exists().withMessage('surveyId field missing.'),

		body('title').exists().withMessage('title field missing.')
	];

	static createQuestion = [
		body('surveyId').exists().withMessage('surveyId field missing.'),

		body('question').exists().withMessage('question field missing.')
	];

	static editQuestion = [
		body('questionId').exists().withMessage('surveyId field missing.'),

		body('question').exists().withMessage('question field missing.')
	];

	static createOption = [
		body('questionId').exists().withMessage('questionId field missing.'),

		body('option').exists().withMessage('option field missing.')
	];

	static editOption = [
		body('optionId').exists().withMessage('optionId field missing.'),

		body('option').exists().withMessage('option field missing.')
	];

	static deleteOption = [
		body('optionId').exists().withMessage('optionId field missing.')
	];
}
