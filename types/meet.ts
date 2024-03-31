export type IMeet = {
    _id: string;
    meetId?: string;
    title: string;
    hostId: string;
    hostName: string;
    hostTeam: string;
    hostProfile: string;
    isScheduled: boolean;
    internalParticipantList?: string[];
    externalParticipantList?: string[];
    createdAt?: Date;
    updatedAt?: Date;
    startTime?: Date;
    endTime?: Date;
}
export type IMeetTokenResponse = {
    roomId: string;
    accessToken: string;
}
export type IMeetTokenResponseGuest = {
    roomId: string;
    accessToken: string;
    email: string;
    name: string;
    role: string;
}
