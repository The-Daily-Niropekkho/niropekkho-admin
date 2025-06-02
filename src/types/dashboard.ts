export interface DashboardSatistics {
  userGroup: UserGroup[]
  todayPost: number
  totalPost: number
  totalCategory: number
}

export interface UserGroup {
  userType: string
  count: number
}
