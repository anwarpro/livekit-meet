import axios, { AxiosInstance } from "axios";
import { UserResponse } from "../../types/user";
import objectToParams from "../../utils/objectToParams";
import { GET } from "../../utils/axios.config";

const getAuthorization = () => {
    // Getting user token and set to session storage
    try {
        const sessionStorageToken = sessionStorage.getItem("jwt-token") || null;
        const token = sessionStorageToken && JSON.parse(sessionStorageToken);
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common = { Authorization: `${token}` };

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

    getUser = (cached?: boolean) => {
        return axios.get<UserResponse>(`${API_URL}/${objectToParams({ cached })}`);
    };


}
const authService = new AuthService()
export default authService;
