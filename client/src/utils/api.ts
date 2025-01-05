import axios from "axios";
import Cookies from "js-cookie";

const base_url = `http://localhost:3000`;

interface userLogin {
  username: string;
  password: string;
}

export type Role = "user" | "owner";

export interface User {
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  email: string;
  password?: string;
  role: Role | undefined;
  plan?: "Standard" | "Gold" | "Platinum";
}

export const signUp = async (user: User) => {
  try {
    const response = await axios.post(`${base_url}/api/user/signup`, user);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const signIn = async (user: userLogin) => {
  try {
    const response = await axios.post(`${base_url}/api/user/signIn`, user, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const isUserValid = async () => {
  try {
    const jwt = Cookies.get("jwt");
    const response = await axios.get(`${base_url}/api/user/validateToken`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    return response.data;
  } catch (error: any) {
    return null;
  }
};

export const getFilteredPosts = async (filters) => {
  try {
    const jwt = Cookies.get("jwt");

    // Construct the query string from the filters object
    const queryParams = new URLSearchParams(filters).toString();

    // Make the GET request with query parameters
    const response = await axios.get(
      `${base_url}/api/post/getFilteredPosts?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};

export const getAllBusiness = async () => {
  try {
    const response = await axios.get(`${base_url}/api/business/getAll?page=1`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const deleteCookie = async () => {
  try {
    Cookies.remove("jwt");
  } catch (error) {
    console.log(error);
  }
};

export const toggleBusinessInSaved = async (
  businessId: string
): Promise<string> => {
  const jwt = Cookies.get("jwt");
  try {
    const response = await axios.post(
      `${base_url}/api/user/add-business`,
      { businessId }, // This is the request body
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true, // Ensure cookies are included for authentication
      }
    );

    return response.data.message; // Return the success message
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
