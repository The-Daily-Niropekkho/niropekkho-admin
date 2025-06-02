import Loader from "@/components/shared/loader";
import { Suspense } from "react";
import AllReportsPage from "./report-page";

export default function ReportsPage() {
    return (
        <Suspense fallback={<Loader/>}>
            <AllReportsPage />
        </Suspense>
    );
}
