import { fetchMatchDetail } from '@/lib/pubg';
import { Participant, Roster } from '@/types/pubg';
import Link from 'next/link';
import { headers } from 'next/headers';
import {
    UserGroupIcon,
    TrophyIcon,
    UserIcon,
    FireIcon,
    ShieldCheckIcon,
    ArrowTrendingUpIcon,
    TruckIcon,
    MapIcon
} from '@heroicons/react/24/solid';

type Params = Promise<{ matchId: string }>;

interface TeamData {
    roster: Roster;
    participants: Participant[];
}

export default async function MatchDetail(props: { params: Params }) {
    const params = await props.params;

    const result = await fetchMatchDetail(params.matchId);

    // Get search parameters from the referer URL
    const headersList = await headers();
    const referer = headersList.get('referer') || '';
    const searchParams = referer.includes('?') ? referer.split('?')[1] : '';

    const playerNameFilter = searchParams.split('&').find(param => param.startsWith('playerName='))?.split('=')[1];

    if (result.error) {
        return <div className="text-red-500 p-4">{result.error}</div>;
    }

    if (!result.data) {
        return <div className="p-4">No match data found</div>;
    }

    const matchData = result.data;

    // Get all rosters and participants
    const rosters = matchData.included.filter((item): item is Roster => item.type === 'roster')
        .sort((a, b) => a.attributes.stats.rank - b.attributes.stats.rank);
    const participants = matchData.included.filter((item): item is Participant => item.type === 'participant');

    // Group participants by their teams
    const teams: TeamData[] = rosters.map(roster => {
        const teamParticipants = roster.relationships.participants.data
            .map(p => participants.find(participant => participant.id === p.id))
            .filter((p): p is Participant => p !== undefined)
            .sort((a, b) => a.attributes.stats.kills - b.attributes.stats.kills);

        return {
            roster,
            participants: teamParticipants
        };
    });

    // If there's a playerNameFilter, sort the teams to put the filtered player's team first
    if (playerNameFilter) {
        teams.sort((a, b) => {
            const aHasPlayer = a.participants.some(p => 
                p.attributes.stats.name.toLowerCase() === decodeURIComponent(playerNameFilter).toLowerCase()
            );
            const bHasPlayer = b.participants.some(p => 
                p.attributes.stats.name.toLowerCase() === decodeURIComponent(playerNameFilter).toLowerCase()
            );
            
            if (aHasPlayer && !bHasPlayer) return -1;
            if (!aHasPlayer && bHasPlayer) return 1;
            return a.roster.attributes.stats.rank - b.roster.attributes.stats.rank;
        });
    } else {
        // Default sorting by team rank
        teams.sort((a, b) => a.roster.attributes.stats.rank - b.roster.attributes.stats.rank);
    }

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="mb-6">
                <Link
                    href={`/matches${searchParams ? `?${searchParams}` : ''}`}
                    className="text-blue-500 hover:text-blue-600 inline-flex items-center transition-colors"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Search
                </Link>
            </div>

            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                <MapIcon className="w-8 h-8 text-blue-500" />
                Match Details
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg shadow-md">
                        <div className="text-sm text-blue-600 dark:text-blue-300">Map</div>
                        <div className="font-semibold text-lg">{matchData.data.attributes.mapName}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-4 rounded-lg shadow-md">
                        <div className="text-sm text-purple-600 dark:text-purple-300">Game Mode</div>
                        <div className="font-semibold text-lg">{matchData.data.attributes.gameMode}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-lg shadow-md">
                        <div className="text-sm text-green-600 dark:text-green-300">Duration</div>
                        <div className="font-semibold text-lg">{Math.round(matchData.data.attributes.duration / 60)} minutes</div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 p-4 rounded-lg shadow-md">
                        <div className="text-sm text-red-600 dark:text-red-300">Date</div>
                        <div className="font-semibold text-lg">
                            {new Date(matchData.data.attributes.createdAt).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {teams.map((team) => (
                    <div key={team.roster.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-500 text-white">
                            <div className="flex justify-between items-center">
                                <div className="font-bold text-xl flex items-center gap-2">
                                    <UserGroupIcon className="w-6 h-6" />
                                    Team Rank #{team.roster.attributes.stats.rank}
                                </div>
                                {team.roster.attributes.won === "true" && (
                                    <div className="flex items-center bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold shadow-lg">
                                        <TrophyIcon className="w-5 h-5 mr-1" />
                                        WINNERS
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {team.participants.map((participant) => (
                                <div key={participant.id} className="p-6">
                                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                                                <UserIcon className="w-7 h-7 text-blue-500" />
                                                {participant.attributes.stats.name}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                                                {/* Combat Stats */}
                                                <div className="bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-900 dark:to-orange-900 p-4 rounded-lg shadow-md">
                                                    <h3 className="font-semibold mb-3 text-red-800 dark:text-red-200 flex items-center gap-2">
                                                        <FireIcon className="w-5 h-5" />
                                                        Combat
                                                    </h3>
                                                    <div className="space-y-2">
                                                        <StatItem label="Kills" value={participant.attributes.stats.kills} />
                                                        <StatItem label="Assists" value={participant.attributes.stats.assists} />
                                                        <StatItem label="Damage Dealt" value={Math.round(participant.attributes.stats.damageDealt)} />
                                                        <StatItem label="Headshot Kills" value={participant.attributes.stats.headshotKills} />
                                                        <StatItem label="Longest Kill" value={`${Math.round(participant.attributes.stats.longestKill)}m`} />
                                                        <StatItem label="DBNOs" value={participant.attributes.stats.DBNOs} />
                                                        <StatItem label="Road Kills" value={participant.attributes.stats.roadKills} />
                                                        <StatItem label="Team Kills" value={participant.attributes.stats.teamKills} />
                                                    </div>
                                                </div>

                                                {/* Survival Stats */}
                                                <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-900 p-4 rounded-lg shadow-md">
                                                    <h3 className="font-semibold mb-3 text-green-800 dark:text-green-200 flex items-center gap-2">
                                                        <ShieldCheckIcon className="w-5 h-5" />
                                                        Survival
                                                    </h3>
                                                    <div className="space-y-2">
                                                        <StatItem label="Time Survived" value={`${Math.round(participant.attributes.stats.timeSurvived / 60)} min`} />
                                                        <StatItem label="Heals Used" value={participant.attributes.stats.heals} />
                                                        <StatItem label="Boosts Used" value={participant.attributes.stats.boosts} />
                                                        <StatItem label="Revives" value={participant.attributes.stats.revives} />
                                                        <StatItem label="Death Type" value={participant.attributes.stats.deathType} />
                                                    </div>
                                                </div>

                                                {/* Movement Stats */}
                                                <div className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 p-4 rounded-lg shadow-md">
                                                    <h3 className="font-semibold mb-3 text-blue-800 dark:text-blue-200 flex items-center gap-2">
                                                        <TruckIcon className="w-5 h-5" />
                                                        Movement
                                                    </h3>
                                                    <div className="space-y-2">
                                                        <StatItem label="Walk Distance" value={`${Math.round(participant.attributes.stats.walkDistance)}m`} />
                                                        <StatItem label="Ride Distance" value={`${Math.round(participant.attributes.stats.rideDistance)}m`} />
                                                        <StatItem label="Swim Distance" value={`${Math.round(participant.attributes.stats.swimDistance)}m`} />
                                                        <StatItem label="Vehicles Destroyed" value={participant.attributes.stats.vehicleDestroys} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Additional Stats */}
                                            <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900 dark:to-violet-900 p-4 rounded-lg shadow-md">
                                                <h3 className="font-semibold mb-3 text-purple-800 dark:text-purple-200 flex items-center gap-2">
                                                    <ArrowTrendingUpIcon className="w-5 h-5" />
                                                    Match Performance
                                                </h3>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    <StatItem label="Kill Place" value={participant.attributes.stats.killPlace} />
                                                    <StatItem label="Win Place" value={participant.attributes.stats.winPlace} />
                                                    <StatItem label="Kill Streaks" value={participant.attributes.stats.killStreaks} />
                                                    <StatItem label="Weapons Acquired" value={participant.attributes.stats.weaponsAcquired} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Helper component for consistent stat display
function StatItem({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">{label}</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
        </div>
    );
}