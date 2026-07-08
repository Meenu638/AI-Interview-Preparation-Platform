const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

const uploadBuffer = (buffer, folder, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(ApiError.internal(`Cloudinary upload failed: ${error.message}`));
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

const uploadAvatarBuffer = (buffer, userId) =>
  uploadBuffer(buffer, `ai-interview-platform/avatars/${userId}`, 'image');

const uploadResumeBuffer = (buffer, userId) =>
  uploadBuffer(buffer, `ai-interview-platform/resumes/${userId}`, 'raw');

const deleteAsset = (publicId, resourceType = 'image') =>
  cloudinary.uploader.destroy(publicId, { resource_type: resourceType });

module.exports = { uploadAvatarBuffer, uploadResumeBuffer, deleteAsset };
