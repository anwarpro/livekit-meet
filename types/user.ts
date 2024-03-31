import { AccessToken } from 'livekit-server-sdk';
export interface User {
  id: string;
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  batch: string[];
  isBanned?: boolean;
  isSuspend?: boolean;
  suspendTill?: Date | null;
  isDeactivated?: boolean;
  role: 'student' | 'moderator' | 'admin' | 'super-admin';
  profileImage: string;
  token?: string;
  courses?: string[];
  roll?: string;
}

export type UserInfo = Pick<
  User,
  | 'batch'
  | 'email'
  | 'fullName'
  | 'profileImage'
  | 'role'
  | '_id'
  | 'roll'
  | 'phone'
>;

export interface UserState {
  isLoggedIn: boolean;
  loading: boolean;
  error: boolean;
  message: string | null;
  user: User | null;
}

export interface UserResponse {
  user: User;
  token: string;
}
export interface MeetResponse {
  roomId: string;
  accessToken: string;
}

export interface CountList {
  count: number;
  _id: User['role'];
}
