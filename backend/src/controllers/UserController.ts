import dotenv from 'dotenv';
import { Request, Response } from 'express';
import UserQueries from '../database/UserQueries';
import bcrypt from 'bcrypt';
import RequestError from '../models/RequestError';
import AuthController from './AuthController';
import SurveyQueries from '../database/SurveyQueries';
import QuestionQueries from '../database/QuestionQueries';
import OptionQueries from '../database/OptionQueries';

dotenv.config({ path: 'secure/.env' });


export default class UserController {

	public static async signUp(req: Request, res: Response): Promise<Response> {

		try {
			const fistName: string = req.body.firstName;
			const lastName: string = req.body.lastName;
			const username: string = req.body.userName;
			const email: string = req.body.email;
			const hashedPassword: string = await bcrypt.hash(req.body.password, 10);

			const userId = await UserQueries.createUser(fistName, lastName, username, email, hashedPassword);

			const accessToken = AuthController.generateAccessToken(userId);
			const refreshToken = await AuthController.generateRefreshToken(userId);

			return res.status(200).json({ accessToken, refreshToken });
		}
		catch (errors) {
			return res.status(500).send(errors);
		}
	}


	public static async signIn(req: Request, res: Response): Promise<Response> {

		try {
			const user = await UserQueries.findAccountByEmail(req.body.email);

			if (!user)
				return res.status(404).json({ 'errors': RequestError.userDoesNotExist });


			const isPasswordRight = await bcrypt.compare(req.body.password, user.hashPassword);

			if (!isPasswordRight)
				return res.status(401).json({ 'errors': RequestError.incorrectPassword });


			const accessToken = AuthController.generateAccessToken(user.id);
			const refreshToken = await AuthController.generateRefreshToken(user.id);

			return res.status(200).json({ accessToken, refreshToken });
		}
		catch (errors) {
			return res.status(500).send(errors);
		}
	}

	public static async createSurvey(req: Request, res: Response): Promise<Response> {

		try {

			const userId = req.id;
			const surveyTitle = req.body.title;

			const surveyId = await SurveyQueries.createSurvey(userId!, surveyTitle);

			return res.status(200).json({ surveyId });
		}
		catch (errors) {
			return res.status(500).send(errors);
		}
	}

	public static async editSurvey(req: Request, res: Response): Promise<Response> {

		try {

			const userId = req.id;
			const surveyId = req.body.surveyId;
			const newSurveyTitle = req.body.title;

			await SurveyQueries.editSurvey(userId!, surveyId, newSurveyTitle);

			return res.sendStatus(200);
		}
		catch (errors) {
			return res.status(500).send(errors);
		}
	}

	public static async createQuestion(req: Request, res: Response): Promise<Response> {

		try {
			const surveyId = req.body.surveyId;
			const question = req.body.question;

			const questionId = await QuestionQueries.createQuestion(surveyId, question);

			return res.status(200).json({ questionId });
		}
		catch (errors) {
			return res.status(500).send(errors);
		}
	}

	public static async editQuestion(req: Request, res: Response): Promise<Response> {

		try {

			const questionId = req.body.questionId;
			const newQuestion = req.body.question;

			await QuestionQueries.editQuestion(questionId, newQuestion);

			return res.sendStatus(200);
		}
		catch (errors) {
			return res.status(500).send(errors);
		}
	}

	public static async createOption(req: Request, res: Response): Promise<Response> {

		try {
			const questionId = req.body.questionId;
			const option = req.body.option;

			const optionId = await OptionQueries.createOption(questionId, option);

			return res.status(200).json({ optionId });
		}
		catch (errors) {
			return res.status(500).send(errors);
		}
	}

	public static async editOption(req: Request, res: Response): Promise<Response> {

		try {
			const optionId = req.body.optionId;
			const option = req.body.option;

			await OptionQueries.editOption(optionId, option);

			return res.sendStatus(200);
		}
		catch (errors) {
			return res.status(500).send(errors);
		}
	}

	public static async deleteOption(req: Request, res: Response): Promise<Response> {

		try {
			const optionId = req.body.optionId;

			await OptionQueries.deleteOption(optionId);

			return res.sendStatus(200);
		}
		catch (errors) {
			return res.status(500).send(errors);
		}
	}
}
