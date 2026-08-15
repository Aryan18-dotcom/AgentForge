import multer from "multer";
import isAuthenticated from "../Middlewares/Auth.js";
import express from "express";
import { getUserDetails, updateUserProfileSettings } from "../Controllers/UserSettingsController.js";

export const UserSettingsRouter = express.Router();

// Configure multer for file uploads (e.g., profile pictures)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 15 * 1024 * 1024,
        fieldSize: 15 * 1024 * 1024
    }
});

UserSettingsRouter.get("/details", isAuthenticated, getUserDetails);
UserSettingsRouter.put("/update-profile", isAuthenticated, upload.single("profilePicture"), updateUserProfileSettings);
