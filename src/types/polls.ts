export interface Poll {
  title: string;
  description: string;
  slug: string;
  status: PollStatus;
  options: PollOption[];
  banner_image: BannerImage;
}

export type PollStatus = 'publish' | 'draft' | 'archived';

export interface PollOption {
  label: string;
}

export interface BannerImage {
  url: string;
  originalUrl: string;
  filename: string;
  modifyFileName: string;
  mimetype: string;
  platform: string;
  path: string;
  cdn: string;
  size: number;
}
