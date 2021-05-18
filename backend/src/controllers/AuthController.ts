import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import RequestError from '../models/RequestError';
import TokenQueries from '../database/TokensQueries';
import jwt from 'jsonwebtoken';

dotenv.config({ path: 'secure/.env' });

interface Token {
	userId: number,
	iat: number,
	exp: number
}

export default class AuthController {

	public static generateAccessToken(userId:number):string {
		return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
			expiresIn: '10s'
		});
	}


	public static async generateRefreshToken(userId:number):Promise<string> {
		const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!);

		await TokenQueries.addRefreshToken(userId, refreshToken);

		return refreshToken;
	}


	public static checkAccessToken(req: Request, res: Response, next: NextFunction): void {

		const bearesHeader = req.headers.authorization;

		if (typeof bearesHeader === 'undefined') {
			const errors = RequestError.missingAuthHeader;
			res.status(403).json({ errors });
			return;
		}

		const token = bearesHeader.split(' ')[1];

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (error, authData) => {
			if (error) {

				if (error.message === 'jwt expired') {
					res.status(403).send({ errors: RequestError.tokenExpired });
				}
				else {
					console.log(error);
					res.status(403).send();
				}

				return;
			}

			const verifiedToken = <Token>authData;

			req.id = verifiedToken.userId;

			next();
		});
	}


	public static refreshToken(req: Request, res: Response): Response {


		const refreshToken = req.header('refreshToken');

		if (typeof refreshToken === 'undefined') {
			const errors = RequestError.missingAuthHeader;
			return res.status(403).json({ errors });
		}


		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (error:any, authData:any) => {
			if (error) {
				console.log(error);
				return res.status(403).send();
			}

			const verifiedToken = <Token>authData;

			const accessToken = AuthController.generateAccessToken(verifiedToken.userId);

			return res.status(200).json({ accessToken });
		});

		return res.sendStatus(500);
	}
}
