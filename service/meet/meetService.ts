import axios from "axios";
import { MeetResponse } from "../../types/user";
import objectToParams from "../../utils/objectToParams";
import { IMeet } from "../../types/meet";

const getAuthorization = () => {
    // Getting user token and set to session storage
    try {
        const sessionStorageToken = sessionStorage.getItem("jwt-token") || null;
        const token = sessionStorageToken && JSON.parse(sessionStorageToken);
        axios.defaults.headers.common = { Authorization: `${token}` };
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

    joinMeet = (roomId: string) => {
        return axios.get<MeetResponse>(`${API_URL}/join/${roomId}`);
    };

    upcomingSchedule = () => {
        return axios.get<IMeet>(`${API_URL}/schedule/upcoming`);
    };

}
const meetService = new MeetService()
export default meetService;
