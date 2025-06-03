export interface DashboardSatistics {
    userGroup: UserGroup[];
    todayPost: number;
    totalPost: number;
    totalCategory: number;
}

export interface UserGroup {
    userType: string;
    count: number;
}

export interface DashboardChart {
    lastWeek: LastWeek;
    monthlyViewer: MonthlyViewer[];
}

export interface LastWeek {
    view: number;
    share: number;
}

export interface MonthlyViewer {
    month_num: number;
    view_count: number;
}
