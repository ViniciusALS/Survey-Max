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

	private static async checkValidation(req: Request, res: Response, next: NextFunction, validations: ValidationChain[]): Promise<void> {
		const isValidRequest = await ValidationController.validateRequest(req, res, validations);
		if (!isValidRequest)
			return;

		next();
	}

	public static async signUp(req: Request, res: Response, next: NextFunction):Promise<void> {

		const validations: ValidationChain[] = ValidationModel.signUp;

		await ValidationController.checkValidation(req, res, next, validations);
	}

	public static async uniqueUsername(req: Request, res: Response, next: NextFunction): Promise<void> {

		if (await UserQueries.findAccountByUsername(req.body.userName)) {
			const errors = RequestError.usernameAlreadyExists;
			res.status(400).json({ errors });
			return;
		}

		next();
	}

	public static async uniqueEmail(req: Request, res: Response, next: NextFunction): Promise<void> {

		if (await UserQueries.findAccountByEmail(req.body.email)) {
			const errors = RequestError.emailAlreadyExists;
			res.status(400).json({ errors });
			return;
		}

		next();
	}


	public static async signIn(req: Request, res: Response, next: NextFunction):Promise<void> {

		const validations: ValidationChain[] = ValidationModel.signIn;

		await ValidationController.checkValidation(req, res, next, validations);
	}


	public static async createSurvey(req: Request, res: Response, next: NextFunction):Promise<void> {

		const validations: ValidationChain[] = ValidationModel.createSurvey;

		await ValidationController.checkValidation(req, res, next, validations);
	}

	public static async editSurvey(req: Request, res: Response, next: NextFunction):Promise<void> {

		const validations: ValidationChain[] = ValidationModel.editSurvey;

		await ValidationController.checkValidation(req, res, next, validations);
	}

	public static async createQuestion(req: Request, res: Response, next: NextFunction):Promise<void> {

		const validations: ValidationChain[] = ValidationModel.createQuestion;

		await ValidationController.checkValidation(req, res, next, validations);
	}

	public static async editQuestion(req: Request, res: Response, next: NextFunction):Promise<void> {

		const validations: ValidationChain[] = ValidationModel.editQuestion;

		await ValidationController.checkValidation(req, res, next, validations);
	}

	public static async createOption(req: Request, res: Response, next: NextFunction):Promise<void> {

		const validations: ValidationChain[] = ValidationModel.createOption;

		await ValidationController.checkValidation(req, res, next, validations);
	}

	public static async editOption(req: Request, res: Response, next: NextFunction):Promise<void> {

		const validations: ValidationChain[] = ValidationModel.editOption;

		await ValidationController.checkValidation(req, res, next, validations);
	}

	public static async deleteOption(req: Request, res: Response, next: NextFunction):Promise<void> {

		const validations: ValidationChain[] = ValidationModel.deleteOption;

		await ValidationController.checkValidation(req, res, next, validations);
	}

	public static async deleteQuestion(req: Request, res: Response, next: NextFunction):Promise<void> {

		const validations: ValidationChain[] = ValidationModel.deleteQuestion;

		await ValidationController.checkValidation(req, res, next, validations);
	}

	public static async deleteSurvey(req: Request, res: Response, next: NextFunction):Promise<void> {

		const validations: ValidationChain[] = ValidationModel.deleteSurvey;

		await ValidationController.checkValidation(req, res, next, validations);
	}
}
