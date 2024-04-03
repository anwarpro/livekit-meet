import axios from "axios";
import { MeetResponse } from "../../types/user";
import objectToParams from "../../utils/objectToParams";
import { IMeet } from "../../types/meet";

const getAuthorization = () => {
    // Getting user token and set to session storage
    try {
        const sessionStorageToken = sessionStorage.getItem("jwt-token") || null;
        const token = sessionStorageToken && sessionStorageToken;
        axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
    } catch (error) { }

};

const API_URL = process.env.NEXT_PUBLIC_API_URL + "meet";

class MeetService {
    constructor() {
        getAuthorization();
    }

    getInstantMeet = () => {
        return axios.get<MeetResponse>(`${API_URL}/create`);
    };

    addScheduleMeeting = (payload: any) => {
        return axios.post<MeetResponse>(`${API_URL}/schedule`, { ...payload });
    };

    reScheduleMeeting = (id: string, payload: IMeet) => {
        return axios.put<MeetResponse>(`${API_URL}/schedule/update_meet/${id}`, { ...payload });
    };

    joinMeet = (roomId: string, user_t?: string, token?: string) => {
        if (user_t) {
            return axios.get<MeetResponse>(`${API_URL}/join/${roomId}?user_t=${user_t}`);
        } else {
            return axios.get<MeetResponse>(`${API_URL}/join/${roomId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
    };

    upcomingSchedule = (token?: string) => {
        if (token) {
            return axios.get<IMeet>(`${API_URL}/schedule/upcoming`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } else {
            return axios.get<IMeet>(`${API_URL}/schedule/upcoming`);
        }

    };

    previousSchedule = () => {
        return axios.get<IMeet>(`${API_URL}/schedule/previous`);
    };

}
const meetService = new MeetService()
export default meetService;
