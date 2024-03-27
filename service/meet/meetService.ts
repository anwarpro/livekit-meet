import axios from "axios";
import { MeetResponse } from "../../types/user";
import objectToParams from "../../utils/objectToParams";

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

    joinMeet = (roomId: string) => {
        return axios.get<MeetResponse>(`${API_URL}/join/${roomId}`);
    };

}
const meetService = new MeetService()
export default meetService;
