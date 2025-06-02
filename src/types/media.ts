import { TFileDocument } from "./global"

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
  updates: Partial<TFileDocument>
}
