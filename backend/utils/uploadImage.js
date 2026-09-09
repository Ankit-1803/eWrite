const cloudinary = require("cloudinary").v2;

// Upload image to Cloudinary
async function uploadImage(imagePath) {
    try {
        const result = await cloudinary.uploader.upload(imagePath, {
            folder: "blog app",
        });
        return result;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
}

// Delete image from Cloudinary
async function deleteImageFromCloudinary(imageId) {
    try {
        await cloudinary.uploader.destroy(imageId);
    } catch (error) {
        console.error("Cloudinary delete error:", error);
    }
}

module.exports = {
    uploadImage,
    deleteImageFromCloudinary,
};