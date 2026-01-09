import axios from "axios";
import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";
import config from "@/config";

// use this to interact with our own API (/app/api folder) from the front-end side
// See https://shipfa.st/docs/tutorials/api-call
const apiClient = axios.create({
  baseURL: "/api",
});

apiClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    let message = "";
    const status = error.response?.status;

    if (status === 401) {
      // User not auth, ask to re login
      toast.error("Please login");
      // Sends the user to the login page
      redirect(config.auth.loginUrl);
    } else if (status === 403) {
      // User not authorized, must subscribe/purchase/pick a plan
      message = "Pick a plan to use this feature";
    } else if (status === 404) {
      // 404 is expected for some endpoints (e.g., new pages), don't show toast or log as error
      // The calling code should handle 404s appropriately
      message = error?.response?.data?.error || error.message || error.toString();
      error.message = typeof message === "string" ? message : JSON.stringify(message);
      // Don't log 404s as errors - they're expected behavior for new pages
      return Promise.reject(error);
    } else {
      message =
        error?.response?.data?.error || error.message || error.toString();
    }

    error.message =
      typeof message === "string" ? message : JSON.stringify(message);

    console.error(error.message);

    // Automatically display errors to the user (except 404s which are handled above)
    if (error.message) {
      toast.error(error.message);
    } else {
      toast.error("something went wrong...");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
