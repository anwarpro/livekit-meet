import axios from "axios";
import { MeetResponse } from "../../types/user";
import { IMeet, IMeetHostControl } from "../../types/meet";

const getAuthorization = () => {
    // Getting user token and set to session storage
    try {
        const sessionStorageToken = sessionStorage.getItem("jwt-token") || null;
        const token = sessionStorageToken && sessionStorageToken;
        axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
    } catch (error) { }

};

const API_URL = process.env.NEXT_PUBLIC_API_URL + "maintenance";

class serverMaintenanceService {
    constructor() {
        getAuthorization();
    }

    addNotice = (payload: any) => {
        return axios.post<MeetResponse>(`${API_URL}/create-notice`, { ...payload });
    };

    checkServerHealth = () => {
        return axios.get(`${API_URL}/server-health`)
    }

}
const maintenanceService = new serverMaintenanceService()
export default maintenanceService;
