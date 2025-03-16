import { auth } from "@/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchPresenceLogs } from "@/lib/discord";
import { Suspense } from "react";
import { UserFilterForm } from "./UserFilter";

type Params = Promise<{ guildId: string }>
type SearchParams = Promise<{ startDate: string, endDate: string }>

export default async function PresencePage(props: {
  params: Params
  searchParams: SearchParams
}) {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return <p>You are not authorized to view this page!</p>;
  }

  const params = await props.params;
  const searchParams = await props.searchParams;

  const startDate = searchParams.startDate ? 
    new Date(searchParams.startDate) : 
    new Date(Date.now() - 24 * 60 * 60 * 1000);
    
  const endDate = searchParams.endDate ? 
    new Date(searchParams.endDate) : 
    new Date();

  const presenceLogs = await fetchPresenceLogs(params.guildId, startDate, endDate);

  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<LoadingSpinner />}>
        <h1 className="text-2xl font-bold mb-6">Presence History</h1>

        {presenceLogs.error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
            <p>{presenceLogs.error}</p>
          </div>
        ) : (
          <UserFilterForm 
            initialData={presenceLogs.data || []} 
          />
        )}
      </Suspense>
    </div>
  );
}