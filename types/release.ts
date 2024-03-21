export interface Release {
  _id?: any;
  title: string;
  description: string;
  type: string;
  status: string;
  course: string;
  platform: string;
}

export interface ReleaseState {
  isModalOpen: boolean;
  fileList: File[];
  postForEdit: Release | null;
}
