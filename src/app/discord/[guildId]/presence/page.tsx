import { auth } from "@/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchPresenceLogs } from "@/lib/discord";
import { PresenceLog } from "@/types/discord";
import { Suspense } from "react";

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

  const startDate = searchParams.startDate || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const endDate = searchParams.endDate || new Date().toISOString();

  const presenceLogs = await fetchPresenceLogs(params.guildId, startDate, endDate);

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<LoadingSpinner />}>
        <h1 className="text-2xl font-bold mb-6">Presence History</h1>

        <div className="mb-6">
          <form className="flex gap-4" action="" method="get">
            <div>
              <label htmlFor="startDate" className="block text-sm mb-1">Start Date</label>
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                required
                defaultValue={new Date(startDate).toISOString().slice(0, 16)}
                className="border rounded p-2 text-black bg-white dark:text-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm mb-1">End Date</label>
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                required
                defaultValue={new Date(endDate).toISOString().slice(0, 16)}
                className="border rounded p-2 text-black bg-white dark:text-white dark:bg-gray-800"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 self-end"
            >
              Filter
            </button>
          </form>
        </div>

        {presenceLogs.error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
            <p>{presenceLogs.error}</p>
          </div>
        ) : !presenceLogs.data?.length ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-yellow-700 dark:text-yellow-400">
            <p>No presence logs found for this period.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Time</th>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Status Change</th>
                  <th className="px-4 py-2 text-left">Activity Change</th>
                  <th className="px-4 py-2 text-left">Client</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {presenceLogs.data.map((log: PresenceLog) => (
                  <tr key={log.id}>
                    <td className="px-4 py-2">{formatDateTime(log.created_at)}</td>
                    <td className="px-4 py-2">{log.username}</td>
                    <td className="px-4 py-2">
                      <span className="text-gray-500">{log.old_status}</span>
                      {" → "}
                      <span>{log.new_status}</span>
                    </td>
                    <td className="px-4 py-2">
                      {log.old_activity !== log.new_activity && (
                        <>
                          <span className="text-gray-500">{log.old_activity || "none"}</span>
                          {" → "}
                          <span>{log.new_activity || "none"}</span>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-2">{log.client_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Suspense>
    </div>
  );
}