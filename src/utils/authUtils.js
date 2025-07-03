export const getUserToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token || "";
  } catch {
    return "";
  }
};

export const setUserToken = (token) => {
  try {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    localStorage.setItem("user", JSON.stringify({ ...user, token }));
  } catch {
    localStorage.setItem("user", JSON.stringify({ token }));
  }
};
