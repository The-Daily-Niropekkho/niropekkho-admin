import PerformanceCharts from "@/components/dashboard/performance-charts";
import PopularPosts from "@/components/dashboard/popular-posts";
import RecentPosts from "@/components/dashboard/recent-posts";
import StatsSection from "@/components/dashboard/stats-section";
import TodayStats from "@/components/dashboard/today-stats";
import { Col, Row } from "antd";

export default function DashboardPage() {
    return (
        <div>
            {/* Stats Cards */}
            <StatsSection />

            {/* Today's Stats */}
            <TodayStats />

            {/* Performance Charts */}
            <PerformanceCharts />

            {/* Recent and Popular Posts Table */}
            <Row gutter={[16, 16]} style={{ margin: "16px 0px" }}>
                <Col xs={24} md={12}>
                    <RecentPosts />
                </Col>
                <Col xs={24} md={12}>
                    <PopularPosts />
                </Col>
            </Row>
        </div>
    );
}
