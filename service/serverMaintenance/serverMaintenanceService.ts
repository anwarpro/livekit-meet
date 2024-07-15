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

    allNotice = (page?: number, limit?: number) => {
        return axios.get(`${API_URL}/all-notice?page=${page}&limit=${limit}`)
    }

    noticeById = (id: string) => {
        return axios.get(`${API_URL}/single-notice/${id}`)
    }

    updateNotice = (id: string, payload: any) => {
        return axios.patch(`${API_URL}/update-notice/${id}`, { ...payload })
    }

    deleteNotice = (id: string) => {
        return axios.delete(`${API_URL}/delete-notice/${id}`)
    }

}
const maintenanceService = new serverMaintenanceService()
export default maintenanceService;
