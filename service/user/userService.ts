import axios from 'axios';
import { User, UserResponse } from '../../types/user';
import objectToParams from '../../utils/objectToParams';

const getAuthorization = () => {
  // Getting user token and set to session storage
  try {
    const sessionStorageToken = sessionStorage.getItem("jwt-token") || null;
    const token = sessionStorageToken && sessionStorageToken;
    axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
  } catch (error) { }

};

const API_URL = process.env.NEXT_PUBLIC_API_URL + 'user';

class UserService {
  constructor() {
    getAuthorization();
  }

  getAllUsers = (search: string, page: number, limit: number, role: string) => {
    return axios.get<User[]>(`${API_URL}/all?role=${role}&limit=${limit}&page=${page}&search=${search}`);
  };

  updateUser = (id: string, payload: any) => {
    return axios.patch<UserResponse>(`${API_URL}/${id}`, { ...payload });
  };

  addManualUser = (payload: any) => {
    return axios.post<UserResponse>(`${API_URL}/add-manual-user`, { ...payload });
  };

}
const userService = new UserService();
export default userService;
