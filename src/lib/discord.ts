import { DiscordGuildsResponse, normalizeChannelType, DiscordGuild, DiscordChannel, PresenceLog } from "@/types/discord";

export type FetchStatus = {
    isLoading: boolean;
    error: string | null;
    data: DiscordGuildsResponse | null;
};

export async function fetchDiscordGuilds(): Promise<FetchStatus> {
    try {
        const apiKey = process.env.DISCORD_BOT_API_KEY;
        if (!apiKey) {
            return {
                isLoading: false,
                error: 'DISCORD_BOT_API_KEY is not configured',
                data: null
            };
        }

        const response = await fetch(`${process.env.DISCORD_BOT_API_URL}/api/v1/discord/guilds`, {
            headers: {
                'X-API-Key': apiKey
            },
            next: {
                revalidate: 60
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch Discord data: ${response.statusText}`);
        }

        const rawData = await response.json();
        
        // Normalize channel types in the response
        const data: DiscordGuildsResponse = {
            guilds: rawData.guilds.map((guild: DiscordGuild) => ({
                ...guild,
                channels: guild.channels.map((channel: DiscordChannel) => ({
                    ...channel,
                    type: normalizeChannelType(channel.type)
                }))
            }))
        };
        
        return {
            isLoading: false,
            error: null,
            data
        };
    } catch (error) {
        console.error('Error fetching Discord data:', error);
        return {
            isLoading: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            data: null
        };
    }
}

export async function fetchPresenceLogs(guildId: string, startDate: string, endDate: string): Promise<{ data?: PresenceLog[], error?: string }> {
  try {
    const response = await fetch(
      `${process.env.DISCORD_BOT_API_URL}/api/v1/discord/presence-history/filter/guildId/${guildId}/startDate/${encodeURIComponent(startDate)}/endDate/${encodeURIComponent(endDate)}`,
      {
        headers: {
          'X-API-Key': process.env.DISCORD_BOT_API_KEY || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching presence logs:', error);
    return { error: 'Failed to fetch presence logs' };
  }
}