import Cookies from "js-cookie";

// Function to save token and user details
export const saveAuthData: (token: string, user: string) => void = (
  token,
  user
) => {
  Cookies.set("jwt_token", token, {
    expires: 7,
    secure: true,
    sameSite: "Strict",
  });
  Cookies.set("user_data", JSON.stringify(user), {
    expires: 7,
    secure: true,
    sameSite: "Strict",
  });
};

//function to get token and user details
export const getAuthData = (): {
  token?: string;
  user?: { name: string; email: string; id: string } | null;
} => {
  const token = Cookies.get("jwt_token");
  const user: { name: string; email: string; id: string } | null = Cookies.get(
    "user_data"
  )
    ? JSON.parse(Cookies.get("user_data")!)
    : null;
  return { token, user };
};

//function to remove token and user details
export const clearAuthData: () => void = () => {
  Cookies.remove("jwt_token");
  Cookies.remove("user_data");
};
