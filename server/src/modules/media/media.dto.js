export const mediaDto = {
  uploadResponse: (result) => {
    return {
      url: result.secure_url || result.url,
      publicId: result.public_id
    };
  }
};
