export const getUserToken = () => {
  const user = localStorage.getItem("user");
  if (!user) return null;
  try {
    return JSON.parse(user).token;
  } catch {
    return null;
  }
};
