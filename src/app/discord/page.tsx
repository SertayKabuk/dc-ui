import { fetchDiscordGuilds } from "@/lib/discord";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Suspense } from "react";
import { DiscordHeader } from "@/components/DiscordHeader";
import { GuildSection } from "@/components/GuildSection";

export default async function DiscordPage() {
  const result = await fetchDiscordGuilds();

  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<LoadingSpinner />}>
        <DiscordHeader />
        
        {result.error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
            <h2 className="text-lg font-semibold mb-2">Error Loading Discord Data</h2>
            <p>{result.error}</p>
          </div>
        ) : !result.data?.guilds.length ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-yellow-700 dark:text-yellow-400">
            <h2 className="text-lg font-semibold mb-2">No Discord Servers Found</h2>
            <p>You don't have access to any Discord servers or the bot isn't connected to any servers.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {result.data.guilds.map((guild) => (
              <GuildSection key={guild.id} guild={guild} />
            ))}
          </div>
        )}
      </Suspense>
    </div>
  );
}