import { Status } from '@/data/options';
import { User } from './user';

export interface Tags {
  text: string;
  tags: string[];
}

export interface PostModal {
  postBody: string;
  platform: string;
  title: string;
  authorEmail?: string;
  postType?: PostType | '';
}

export interface PostForEdit {
  _id: string;
  postBody: string;
  platform: string;
  status?: string;
  priority?: string;
  note?: string;
  batch?: string;
  tagList: string[];
}

export interface PostState {
  tagList: string[];
  fileList: File[];
  userPosts: Post[];
  hasMore: boolean;
  page: number;
  refetching: boolean;
  refectPinPost: boolean;
  showEmoji: boolean;
  postForEdit: PostForEdit | null;
  isModalOpen: boolean;
  bookmarkedPostIds: string[];
  refetchBookmark: boolean;
  reportToAdmin: boolean;
  reportedPostId: string;
  refetchComment: boolean;
}

export type ImagesOrVideo = {
  src: string;
  type: 'image' | 'video';
};

export type Repost = {
  email: string;
  repostId: string;
};

type StatusHistory = {
  status: Status;
  updatedAt: Date;
  updatedBy: Pick<User, '_id' | 'fullName' | 'email' | 'profileImage'>[];
};

type PostType =
  | 'repost'
  | 'repost-addition'
  | 'Bugs'
  | 'Feature Requests'
  | 'Improvements'
  | 'Suggestion'
  | 'Queries';

interface Post {
  title?: string;
  _id: string;
  postBody?: string;
  inprogressTime?: Date;
  postType: PostType;
  tags?: string[];
  platform?: string;
  imagesOrVideos?: ImagesOrVideo[];
  status: Status;
  isCommentOff: boolean;
  isCommentOffBy?: 'user' | string;
  createdAt: string;
  updatedAt: string;
  author: Pick<
    User,
    '_id' | 'fullName' | 'email' | 'batch' | 'role' | 'profileImage' | 'id'
  >;
  reposts?: Repost[];
  commentsCount: number;
  editedBy: 'user' | 'admin' | 'N/A';
  editedHistory: string[];
  priority?: 'High' | 'Medium' | 'Low';
  note?: string;
  batch: string;
  isPinned?: boolean;
  isEdited?: boolean;
  mainPost?: Post;
  statusHistory?: StatusHistory[];
  postedBy?: string;
}

export type Filters = {
  status?: Status | '';
  batch?: string;
  platform?: string;
  tag?: string;
  days?: string;
  startDay?: string;
  endDay?: string;
  search?: string;
};

export default Post;
