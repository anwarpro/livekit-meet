import axios from "axios";
import { IAttendance } from "../../types/attendance";

const getAuthorization = () => {
    // Getting user token and set to session storage
    try {
        const sessionStorageToken = sessionStorage.getItem("jwt-token") || null;
        const token = sessionStorageToken && sessionStorageToken;
        axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
    } catch (error) { }

};

const API_URL = process.env.NEXT_PUBLIC_API_URL + "attendance";

class AttendanceService {
    constructor() {
        getAuthorization();
    }

    trackParticipantActivity = (payload: any) => {
        return axios.post<IAttendance>(`${API_URL}/`, { ...payload });

    };

    getAttendance = (id: any) => {
        return axios.get<IAttendance>(`${API_URL}?meetId=${id}`);
    }


}
const attendanceService = new AttendanceService()
export default attendanceService;
