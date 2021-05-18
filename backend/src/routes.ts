import { Router, Response } from 'express';
import UserController from './controllers/UserController';
// import AccountController from './controllers/AccountController';
import ValidationController from './controllers/ValidationController';
// import authController from './controllers/AuthController';


const routes = Router();

routes.get('/', (_, res:Response) => res.status(204).send());

routes.post('/api/signup',
	ValidationController.signUp,
	UserController.signUp);

routes.post('/signin',
	ValidationController.signIn,
	UserController.signIn);

// routes.get('/refreshToken', authController.refreshToken);

// routes.post('/logout', authController.logout);


// routes.post('/updateProfilePicture', AccountController.updateProfilePicture);


export default routes;
