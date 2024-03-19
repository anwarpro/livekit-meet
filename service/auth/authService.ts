import axios from "axios";

const getAuthorization = () => {
    // Getting user token and set to session storage
    try {
        const sessionStorageToken = sessionStorage.getItem("jwt-token") || null;
        const token = sessionStorageToken && JSON.parse(sessionStorageToken);
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

        // const domain =
        //     process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ||
        //         process.env.NEXT_PUBLIC_ENVIRONMENT === 'stage'
        //         ? 'https://jsdude.com/api/user/verify-cookie'
        //         : 'https://web.programming-hero.com/api/user/verify-cookie';

        return axios.get<{ success: boolean, token: string }>(`${API_URL}/verify-cookie`, {
            headers: {
                withCredentials: true,
            }
        });
    };

}
const authService = new AuthService()
export default authService;
