import express from "express";
import { GetCurrentUser, LoginUser, LogoutUser, RequestPasswordResetOTP, RequestRegistrationOTP, ResendOTP, ResetPassword, VerifyAndRegister, VerifyPasswordResetOTP } from "../Controllers/AuthControllers.js";
import isAuthenticated from "../Middlewares/Auth.js";
import { getDashboardMetrixData } from "../Controllers/DashboardMetrixController.js";

const AuthRouter = express.Router();


// Register Route
AuthRouter.post('/login', LoginUser);
AuthRouter.get('/current-user', isAuthenticated, GetCurrentUser);
AuthRouter.post('/logout', isAuthenticated, LogoutUser);
AuthRouter.post('/register/request-otp', RequestRegistrationOTP);
AuthRouter.post('/register/verify', VerifyAndRegister);
AuthRouter.post('/resend-otp', ResendOTP);
AuthRouter.post('/password/request-otp', RequestPasswordResetOTP);
AuthRouter.post('/password/verify-otp', VerifyPasswordResetOTP);
AuthRouter.post('/password/reset', ResetPassword);
AuthRouter.get('/dashboard-metrix', isAuthenticated, getDashboardMetrixData);

export default AuthRouter;
