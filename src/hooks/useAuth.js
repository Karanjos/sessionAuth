import axios from "axios";
import { useSelector } from "react-redux";

export function useAuth() {
  const { refresh_token } = useSelector((state) => state.user);

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/refresh-token",
        { token: refresh_token },
        {
          withCredentials: true,
        }
      );
      if (response.statusText === "OK") {
        const { access_token } = response.data;
        localStorage.setItem("access_token", access_token);
        // set cookies
        document.cookie = `access_token=${access_token}`;
        return access_token;
      }
      return null;
    } catch (error) {
      console.log("error from refresh token - useAuth:", error);
      return null;
    }
  };

  const fetchWithAuth = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (response.status === 403 || response.status === 401) {
      const access_token = await refreshToken();
      localStorage.setItem("access_token", access_token);
      if (access_token) {
        return fetchWithAuth(url, options);
      }
    }

    return response;
  };

  return { fetchWithAuth, refreshToken };
}
