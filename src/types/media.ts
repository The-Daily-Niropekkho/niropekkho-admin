export interface MediaItem {
  id: number
  name: string
  type: string
  url: string
  size: number
  dimensions?: string
  uploadedBy: string
  uploadedAt: string
  tags: string[]
  favorite: boolean
  folder: string
  s3Key: string
}

export interface MediaFilter {
  searchText: string
  type: string
  folder: string
  sortBy: string
  sortOrder: "asc" | "desc"
}

export interface UploadMediaRequest {
  files: File[]
  folder?: string
}

export interface UpdateMediaRequest {
  id: number
  updates: Partial<MediaItem>
}
