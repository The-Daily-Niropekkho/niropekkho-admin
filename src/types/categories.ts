import { TFileDocument } from "./global"
import { News } from "./news"

export interface Category {
  id: string
  title: string
  slug: string
  position: number
  description: string
  meta_title: string
  meta_description: string
  created_by_id: string
  image: TFileDocument
  status: string
  is_deleted: boolean
  createdAt: string
  updatedAt: string
  news: News
}
