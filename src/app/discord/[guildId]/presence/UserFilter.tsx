"use client";

import { PresenceLog } from "@/types/discord";
import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function UserFilterForm({ 
  initialUsername = "", 
  initialData 
}: { 
  initialUsername?: string, 
  initialData: PresenceLog[] 
}) {
  const [username, setUsername] = useState(initialUsername);
  const [filteredLogs, setFilteredLogs] = useState(initialData);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  // Filter logs when username changes
  useEffect(() => {
    if (username) {
      setFilteredLogs(
        initialData.filter(log => 
          log.username.toLowerCase().includes(username.toLowerCase())
        )
      );
    } else {
      setFilteredLogs(initialData);
    }
  }, [username, initialData]);

  // Handle date filter form submission (server-side filtering)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <>
      <div className="mb-6">
        <form className="flex gap-4 flex-wrap mb-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="startDate" className="block text-sm mb-1">Start Date</label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              required
              defaultValue={searchParams.get('startDate') || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
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
              defaultValue={searchParams.get('endDate') || new Date().toISOString().slice(0, 16)}
              className="border rounded p-2 text-black bg-white dark:text-white dark:bg-gray-800"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 self-end"
          >
            Update Date Range
          </button>
        </form>

        <div className="mb-4">
          <label htmlFor="usernameFilter" className="block text-sm mb-1">Filter by Username</label>
          <div className="flex gap-2">
            <input
              type="text"
              id="usernameFilter"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username to filter"
              className="border rounded p-2 flex-1 text-black bg-white dark:text-white dark:bg-gray-800"
            />
            {username && (
              <button 
                onClick={() => setUsername("")}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {!filteredLogs?.length ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-yellow-700 dark:text-yellow-400">
          <p>No presence logs found{username ? ` matching username "${username}"` : ' for this period'}.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {username && filteredLogs.length !== initialData.length && (
            <p className="mb-2 text-sm text-gray-500">
              Showing {filteredLogs.length} of {initialData.length} logs matching &quot;{username}&quot;
            </p>
          )}
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
              {filteredLogs.map((log: PresenceLog) => (
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
    </>
  );
}