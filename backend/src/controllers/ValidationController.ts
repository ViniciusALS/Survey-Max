import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import ValidationModel from '../models/ValidationModel';
import RequestError from '../models/RequestError';
import UserQueries from '../database/UserQueries';


export default class ValidationController {

	private static async validateRequest(req:Request, res:Response, validations: ValidationChain[]):Promise<boolean> {

		await Promise.all(validations.map(validation => validation.run(req)));

		const errors = RequestError.expressValidatorErrorsMsgCleaner(
			validationResult(req).array());

		if (errors.length > 0) {
			res.status(400).json({ errors });
			return false;
		}

		return true;
	}


	// private static localSigninValidation = [
	// 	body('email').exists().withMessage('Email field missing.')
	// 		.if(body('email').exists())
	// 		.trim().isEmail().normalizeEmail().withMessage('Email format is incorrect.'),

	// 	body('password').exists().withMessage('Password field missing.')
	// 		.if(body('password').exists())
	// 		.isLength({ min: 7 }).withMessage('Password should be at least 7 characters long.')
	// ];


	public static async signUp(req: Request, res: Response, next: NextFunction):Promise<void> {

		const validations: ValidationChain[] = ValidationModel.signUp;

		const isValidRequest = await ValidationController.validateRequest(req, res, validations);
		if (!isValidRequest)
			return;


		if (await UserQueries.findAccountByUsername(req.body.userName)) {
			const errors = RequestError.userAlreadyExists;
			res.status(400).json({ errors });
			return;
		}

		next();
	}


	public static async signIn(req: Request, res: Response, next: NextFunction):Promise<void> {

		const validations: ValidationChain[] = ValidationModel.signIn;

		const isValidRequest = await ValidationController.validateRequest(req, res, validations);
		if (!isValidRequest)
			return;

		next();
	}
}
