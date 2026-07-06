export const authDto = {
  authResponse: (user) => {
    return {
      id: user.id || user._id.toString(),
      email: user.email,
      role: user.role,
      isActive: user.isActive
    };
  }
};
