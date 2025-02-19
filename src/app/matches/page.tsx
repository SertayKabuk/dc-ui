'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchFilteredMatches } from '@/lib/pubg';
import { PubgMatchResponse } from '@/types/pubg';

export default function MatchesPage() {
    const [playerName, setPlayerName] = useState('');
    const [matches, setMatches] = useState<PubgMatchResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSearch = async () => {
        if (!playerName) {
            setError('Please enter a player name');
            return;
        }

        setLoading(true);
        setError(null);

        // Set date range to last 7 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        const result = await fetchFilteredMatches(playerName, startDate, endDate);
        
        setLoading(false);
        if (result.error) {
            setError(result.error);
        } else {
            setMatches(result.data);
        }
    };

    const handleMatchClick = (matchId: string) => {
        router.push(`/matches/${matchId}`);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">PUBG Matches</h1>
            
            <div className="mb-6 flex gap-2">
                <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter player name"
                    className="p-2 border rounded flex-grow dark:bg-gray-800 dark:border-gray-700"
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {error && (
                <div className="text-red-500 mb-4">
                    {error}
                </div>
            )}

            {matches && matches.data && (
                <div className="grid gap-4">
                    <div className="text-sm text-gray-500 mb-2">
                        Found {matches.included?.length || 0} matches
                    </div>
                    {matches.included?.map((item) => {
                        if (item.type === 'participant') {
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => handleMatchClick(matches.data.id)}
                                    className="p-4 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700"
                                >
                                    <div className="flex justify-between">
                                        <div>
                                            <div className="font-semibold">{item.attributes.stats.name}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                Kills: {item.attributes.stats.kills} | 
                                                Place: #{item.attributes.stats.winPlace}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                Damage: {Math.round(item.attributes.stats.damageDealt)}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                Survived: {Math.round(item.attributes.stats.timeSurvived / 60)}min
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            )}
        </div>
    );
}