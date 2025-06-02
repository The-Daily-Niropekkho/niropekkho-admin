// app/dashboard/settings/page.tsx
import SettingsPage from "@/components/features/settings/settings";
import Loader from "@/components/shared/loader";
import { Suspense } from "react";

export default function Page() {
    return (
        <Suspense fallback={<Loader/>}>
            <SettingsPage />
        </Suspense>
    );
}
