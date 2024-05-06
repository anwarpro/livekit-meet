export type IAttendance = {
    identity: string;
    meetId: string;
    eventType: "participant_joined" | "participant_left";
}
export type IAttendanceUserResponse = {
    meetId: string;
    userList: string[];
}
export type IAttendanceResponse = {
    meetId: string;
    userId: string;
    joinList: Date[];
    leftList: Date[];
}