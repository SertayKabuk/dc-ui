import { fetchFilteredMatches } from '@/lib/pubg';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function searchMatches(formData: FormData) {
    'use server';
    
    const playerName = formData.get('playerName') as string;
    if (!playerName) {
        throw new Error('Please enter a player name');
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const result = await fetchFilteredMatches(playerName, startDate, endDate);
    
    if (result.data?.data?.id) {
        revalidatePath('/matches');
        redirect(`/matches/${result.data.data.id}`);
    }
    
    throw new Error('No matches found');
}

export default function MatchesSearch() {
    return (
        <form action={searchMatches}>
            <div className="mb-6 flex gap-2">
                <input
                    type="text"
                    name="playerName"
                    placeholder="Enter player name"
                    className="p-2 border rounded flex-grow dark:bg-gray-800 dark:border-gray-700"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                    Search
                </button>
            </div>
        </form>
    );
}