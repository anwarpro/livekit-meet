import axios from "axios";
import { UserResponse } from "../../types/user";
import objectToParams from "../../utils/objectToParams";
import { GET } from "../../utils/axios.config";

const getAuthorization = () => {
    // Getting user token and set to session storage
    try {
        const sessionStorageToken = sessionStorage.getItem("jwt-token") || null;
        const token = sessionStorageToken && sessionStorageToken;
        axios.defaults.headers.common = { Authorization: `${token}` };
        console.log("🚀 ~ getAuthorization ~ token:", token)

    } catch (error) { }

};

const API_URL = process.env.NEXT_PUBLIC_API_URL + "user";

class AuthService {
    constructor() {
        getAuthorization();
    }
    // Current logged in user token from ph
    verifyCookie = async () => {

        const domain =
            process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ||
                process.env.NEXT_PUBLIC_ENVIRONMENT === 'stage'
                ? 'https://jsdude.com/api/user'
                : 'https://web.programming-hero.com/api/user';

        return GET<{ success: boolean, token: string }>(`${domain}/verify-cookie`, {
            method: 'GET',
            withCredentials: true,
        });

    };

    getUser = (token: string, cached?: boolean) => {
        return GET<UserResponse>(`${API_URL}/${objectToParams({ cached })}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

    };


}
const authService = new AuthService()
export default authService;
