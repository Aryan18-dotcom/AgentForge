import cloudinary from "../Configs/Cloudinary.js";

export const uploadToCloudinary = async (fileBuffer: Buffer, folder: string) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
                folder: `agentForge_assets/${folder}`,
                allowedFormats: ["txt", "pdf", "doc", "docx", "rtf", "csv"],
            },
            (error, result) => {
                if (error) return reject(error);
                if (!result?.secure_url) return reject(new Error("Cloudinary upload failed to return secure URL"));
                resolve(result.secure_url);
            },
        ).end(fileBuffer);
    });
};