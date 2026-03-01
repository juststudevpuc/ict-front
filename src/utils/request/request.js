import axios from "axios"
import { configs } from "../config/configs"
import { store } from "@/store/store";

export const request = async (url = "", method = "get", data = {}) => {
    const token = store.getState().token?.value;

    let headers = {
        Accept: "application/json",
        "content-type": "application/json"
    };

    if (data instanceof FormData) {
        headers["Content-Type"] = "multipart/form-data";
    }

    return await axios({
        url: configs.base_url + url,
        method: method,
        data: data,
        headers: {
            ...headers,
            Authorization: "Bearer " + token,
        },
    })
        .then((res) => {
            console.log("Response Data :", res);
            return res.data;
        })
        .catch((error) => {
            console.log("Response error :", error);
            const responseError = error?.response;
            if (responseError) {
                const status = error?.response;
                if (status == 500) {
                    console.log("External error.");
                }
                const errors = responseError?.data?.errors;

                return {
                    error : true,
                    errors : errors,
                }
            }
        });
};
