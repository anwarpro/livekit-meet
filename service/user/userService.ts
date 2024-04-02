import axios from "axios";
import { User, UserResponse } from "../../types/user";
import objectToParams from "../../utils/objectToParams";

const getAuthorization = () => {
    // Getting user token and set to session storage
    try {
        const sessionStorageToken = localStorage.getItem("jwt-token") || null;
        const token = sessionStorageToken && JSON.parse(sessionStorageToken);
        axios.defaults.headers.common = { Authorization: `${token}` };
    } catch (error) { }

};

const API_URL = process.env.NEXT_PUBLIC_API_URL + "user";

class UserService {
    constructor() {
        getAuthorization();
    }

    getAllUsers = (search:string, page: number, limit: number,role: string) => {
        return axios.get<User[]>(`${API_URL}/all`);
    };


}
const userService = new UserService()
export default userService;
