import { Router, Response } from 'express';
import UserController from './controllers/UserController';
// import AccountController from './controllers/AccountController';
import ValidationController from './controllers/ValidationController';
import AuthController from './controllers/AuthController';


const routes = Router();

routes.get('/', (_, res:Response) => res.status(204).send());

routes.post('/api/signup',
	ValidationController.signUp,
	ValidationController.uniqueUsername,
	ValidationController.uniqueEmail,
	UserController.signUp);

routes.post('/api/signin',
	ValidationController.signIn,
	UserController.signIn);

routes.get('/api/refreshToken',
	AuthController.refreshToken);

routes.post('/api/createSurvey',
	AuthController.checkAccessToken,
	UserController.createSurvey);


export default routes;
