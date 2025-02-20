import { fetchMatchDetail } from '@/lib/pubg';
import { Participant } from '@/types/pubg';
import DateFilters from './DateFilters';
import Link from 'next/link';

type Params = Promise<{ matchId: string }>;

export default async function MatchDetail(props: { params: Params }) {
    const params = await props.params;
    const result = await fetchMatchDetail(params.matchId);

    if (result.error) {
        return <div className="text-red-500 p-4">{result.error}</div>;
    }

    if (!result.data) {
        return <div className="p-4">No match data found</div>;
    }

    const matchData = result.data;
    const participants = matchData.included
        .filter((item): item is Participant => item.type === 'participant')
        .sort((a, b) => a.attributes.stats.winPlace - b.attributes.stats.winPlace);

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <Link href="/matches" className="text-blue-500 hover:text-blue-600 inline-flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Search
                </Link>
            </div>

            <h1 className="text-2xl font-bold mb-6">Match Details</h1>

            <div className="mb-6">
                <DateFilters matchId={params.matchId} />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                        <div className="text-sm text-gray-500">Map</div>
                        <div className="font-semibold">{matchData.data.attributes.mapName}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Game Mode</div>
                        <div className="font-semibold">{matchData.data.attributes.gameMode}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Duration</div>
                        <div className="font-semibold">{Math.round(matchData.data.attributes.duration / 60)} minutes</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Custom Match</div>
                        <div className="font-semibold">{matchData.data.attributes.isCustomMatch ? 'Yes' : 'No'}</div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-semibold">Players</h2>
                </div>
                <div className="divide-y dark:divide-gray-700">
                    {participants.map((participant) => (
                        <div key={participant.id} className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-semibold">{participant.attributes.stats.name}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Rank: #{participant.attributes.stats.winPlace}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium">
                                        Kills: {participant.attributes.stats.kills}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Damage: {Math.round(participant.attributes.stats.damageDealt)}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <div>Headshot Kills: {participant.attributes.stats.headshotKills}</div>
                                <div>Distance: {Math.round(participant.attributes.stats.walkDistance)}m</div>
                                <div>Heals Used: {participant.attributes.stats.heals}</div>
                                <div>Boosts Used: {participant.attributes.stats.boosts}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}