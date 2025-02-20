import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import MatchesSearch from "@/components/MatchesSearch";
import { auth } from "@/auth";

export default async function MatchesPage() {

    const session = await auth();

    if (!session) return <div>Not authenticated</div>

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">PUBG Matches</h1>

            <Suspense fallback={<LoadingSpinner />}>
                <MatchesSearch />
            </Suspense>
        </div>
    );
}