import axios from "axios"
import { configs } from "../config/configs"
import { store } from "@/store/store";

export const request = async (url = "", method = "get", data = {}) => {
    const state = store.getState();
    const token = state.token?.value || state.token;

    // 1. Only set Accept by default
    let headers = {
        "Accept": "application/json",
    };

    // 2. Only add Content-Type: application/json if it is NOT FormData
    if (!(data instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }
    // (If it IS FormData, we leave Content-Type completely blank so Axios can generate the proper multipart boundary automatically)

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return await axios({
        url: configs.base_url + url,
        method: method,
        data: data,
        // headers: {
        //     ...headers,
        //     Authorization: "Bearer " + token,
        // },
        headers: headers,
    })
        .then((res) => {
            console.log("Response Data :", res);
            return res.data;
        })
        .catch((error) => {
            console.log("Response error :", error);
            const responseError = error?.response;
            if (responseError) {
                const status = responseError.status;


                if (status === 401) {
                    console.log("Session expired. Logging out...");
                    // Force the browser to clear localStorage and go to login
                    localStorage.clear();
                    // If they were in the admin area, send them to admin login
                    if (window.location.pathname.startsWith("/admin")) {
                        window.location.href = "/admin/login";
                    } else {
                        window.location.href = "/auth/login";
                    }
                }
                // ✅ NEW: Handle 403 Forbidden (If User tries to do Admin things)
                if (status === 403) {
                    console.log("Access Denied: Kicking back to home...");
                    window.location.href = "/";
                    return { error: true, message: "Access Denied" };
                }

                if (status === 500) {
                    console.log("External server error.");
                }

                const errors = responseError?.data?.errors;
                return {
                    error: true,
                    status: status,
                    errors: errors,
                    message: responseError?.data?.message
                };
            }

            return { error: true, message: "Network Error" };
        });
};
