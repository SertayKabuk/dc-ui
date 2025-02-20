'use client';

import { searchMatches } from '@/app/actions/matches';
import { useState } from 'react';
import Link from 'next/link';
import { PubgMatchResponse } from '@/types/pubg';


export default function MatchesSearch() {
    const [matches, setMatches] = useState<PubgMatchResponse[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError('');
        try {
            const result = await searchMatches(formData);
            setMatches(result || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch matches');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <form action={handleSubmit} className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div>
                    <label htmlFor="playerName" className="block text-sm text-gray-500 mb-1">
                        Player Name
                    </label>
                    <input
                        type="text"
                        id="playerName"
                        name="playerName"
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="startDate" className="block text-sm text-gray-500 mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm text-gray-500 mb-1">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                >
                    {loading ? 'Searching...' : 'Search Matches'}
                </button>
            </form>

            {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {matches.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="p-4 border-b dark:border-gray-700">
                        <h2 className="text-xl font-semibold">Match Results</h2>
                    </div>
                    <div className="divide-y dark:divide-gray-700">
                        {matches.map((match) => (
                            <Link
                                href={`/matches/${match.data.id}`}
                                key={match.data.id}
                                className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-semibold">{match.data.attributes.gameMode}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {match.data.attributes.mapName}
                                        </div>
                                    </div>
                                    <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(match.data.attributes.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}