'use client';

import { searchMatches } from '@/app/actions/matches';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PubgMatchResponse } from '@/types/pubg';
import { useSearchParams } from 'next/navigation';

export default function MatchesSearch() {
    const searchParams = useSearchParams();
    const [matches, setMatches] = useState<PubgMatchResponse[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Initial search if URL params exist
    useEffect(() => {
        if (searchParams && (searchParams.get('playerName') || searchParams.get('startDate') || searchParams.get('endDate'))) {
            const formData = new FormData();
            if (searchParams.get('playerName')) formData.append('playerName', searchParams.get('playerName')!);
            if (searchParams.get('startDate')) formData.append('startDate', searchParams.get('startDate')!);
            if (searchParams.get('endDate')) formData.append('endDate', searchParams.get('endDate')!);
            handleSubmit(formData);
        }
    }, [searchParams]);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError('');
        try {
            const result = await searchMatches(formData);
            setMatches(result || []);
            
            // Update URL with search params
            const params = new URLSearchParams(window.location.search);
            const playerName = formData.get('playerName');
            const startDate = formData.get('startDate');
            const endDate = formData.get('endDate');
            
            if (playerName) params.set('playerName', playerName.toString());
            if (startDate) params.set('startDate', startDate.toString());
            if (endDate) params.set('endDate', endDate.toString());
            
            const newUrl = `${window.location.pathname}?${params.toString()}`;
            window.history.pushState({}, '', newUrl);
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
                        defaultValue={searchParams?.get('playerName') || ''}
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
                            defaultValue={searchParams?.get('startDate') || ''}
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
                            defaultValue={searchParams?.get('endDate') || ''}
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