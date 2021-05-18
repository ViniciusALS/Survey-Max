import dotenv from 'dotenv';
import { Request, Response } from 'express';
import UserQueries from '../database/UserQueries';
import bcrypt from 'bcrypt';
import RequestError from '../models/RequestError';
import AuthController from './AuthController';

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
			return res.sendStatus(500).send(errors);
		}
	}


	public static async signIn(req: Request, res: Response): Promise<Response> {

		try {
			const user = await UserQueries.findAccountByEmail(req.body.email);

			if (!user)
				return res.status(404).json({ 'errors': RequestError.userDoesNotExist });


			const isPasswordRight = await bcrypt.compare(req.body.password, user.hashedPassword);

			if (!isPasswordRight)
				return res.status(401).json({ 'errors': RequestError.incorrectPassword });


			const accessToken = AuthController.generateAccessToken(user.AccountsId);
			const refreshToken = await AuthController.generateRefreshToken(user.AccountsId);

			return res.status(200).json({ accessToken, refreshToken });
		}
		catch (errors) {
			return res.sendStatus(500).send(errors);
		}
	}
}
