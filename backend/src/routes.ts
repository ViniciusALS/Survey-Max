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
	ValidationController.createSurvey,
	AuthController.checkAccessToken,
	UserController.createSurvey);

routes.post('/api/editSurvey',
	ValidationController.editSurvey,
	AuthController.checkAccessToken,
	AuthController.checkUserOwnsSurvey,
	UserController.editSurvey);

routes.post('/api/createQuestion',
	ValidationController.createQuestion,
	AuthController.checkAccessToken,
	AuthController.checkUserOwnsSurvey,
	UserController.createQuestion);

routes.post('/api/editQuestion',
	ValidationController.editQuestion,
	AuthController.checkAccessToken,
	AuthController.checkUserOwnsQuestion,
	UserController.editQuestion);

routes.post('/api/createOption',
	ValidationController.createOption,
	AuthController.checkAccessToken,
	AuthController.checkUserOwnsQuestion,
	UserController.createOption);

routes.post('/api/editOption',
	ValidationController.editOption,
	AuthController.checkAccessToken,
	AuthController.checkUserOwnsOption,
	UserController.editOption);

routes.delete('/api/deleteOption',
	ValidationController.deleteOption,
	AuthController.checkAccessToken,
	AuthController.checkUserOwnsOption,
	UserController.deleteOption);

export default routes;
