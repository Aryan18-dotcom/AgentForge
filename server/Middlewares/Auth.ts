import { Request, Response, NextFunction } from "express";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    // Check if the user is authenticated
    if (req.session && req.session.isLoggedIn && req.session.userId) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized access, Log in first' });
    }
};
export default isAuthenticated;