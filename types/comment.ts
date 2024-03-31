import { User } from "./user";

interface Comment {
  _id: string;
  commentBody: string;
  parentId?: string;
  commentedBy: Pick<
    User,
    "profileImage" | "fullName" | "email" | "_id" | "role"
  >;
  postId: string;
  createdAt: string;
  replies?: Comment[];
  images?: string[];
}
export default Comment;

export interface CommentResponse {
  comment: Comment;
  message: string;
}
