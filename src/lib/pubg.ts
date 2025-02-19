import { PubgMatchResponse } from "@/types/pubg";

export type FetchStatus = {
    isLoading: boolean;
    error: string | null;
    data: PubgMatchResponse | null;
};

export async function fetchFilteredMatches(playerName: string, startDate: Date, endDate: Date): Promise<FetchStatus> {
    try {
        const apiKey = process.env.DISCORD_BOT_API_KEY;
        if (!apiKey) {
            return {
                isLoading: false,
                error: 'DISCORD_BOT_API_KEY is not configured',
                data: null
            };
        }

        const startDateStr = startDate.toISOString();
        const endDateStr = endDate.toISOString();
        
        const response = await fetch(
            `${process.env.DISCORD_BOT_API_URL}/api/v1/pubg/matches/filter/playerName/${encodeURIComponent(playerName)}/startDate/${encodeURIComponent(startDateStr)}/endDate/${encodeURIComponent(endDateStr)}`,
            {
                headers: {
                    'X-API-Key': apiKey
                },
                next: {
                    revalidate: 60
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch filtered matches: ${response.statusText}`);
        }

        const data = await response.json();
        
        return {
            isLoading: false,
            error: null,
            data
        };
    } catch (error) {
        console.error('Error fetching filtered matches:', error);
        return {
            isLoading: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            data: null
        };
    }
}

export async function fetchMatchDetail(matchId: string): Promise<FetchStatus> {
    try {
        const apiKey = process.env.DISCORD_BOT_API_KEY;
        if (!apiKey) {
            return {
                isLoading: false,
                error: 'DISCORD_BOT_API_KEY is not configured',
                data: null
            };
        }
 
        const response = await fetch(
            `${process.env.DISCORD_BOT_API_URL}/api/v1/pubg/match-detail/filter/matchId/${matchId}`,
            {
                headers: {
                    'X-API-Key': apiKey
                },
                next: {
                    revalidate: 60
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch match details: ${response.statusText}`);
        }

        const data = await response.json();
        
        return {
            isLoading: false,
            error: null,
            data
        };
    } catch (error) {
        console.error('Error fetching match details:', error);
        return {
            isLoading: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            data: null
        };
    }
}