'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DateFilters({ matchId }: { matchId: string }) {
    const router = useRouter();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const searchParams = new URLSearchParams();
        if (startDate) searchParams.set('startDate', startDate);
        if (endDate) searchParams.set('endDate', endDate);
        
        const queryString = searchParams.toString();
        router.push(`/matches/${matchId}${queryString ? `?${queryString}` : ''}`);
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <div>
                <label htmlFor="startDate" className="block text-sm text-gray-500 mb-1">Start Date</label>
                <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
            </div>
            <div>
                <label htmlFor="endDate" className="block text-sm text-gray-500 mb-1">End Date</label>
                <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
            </div>
            <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
                Apply Filters
            </button>
        </form>
    );
}