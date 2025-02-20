'use server';

import { fetchFilteredMatches } from '@/lib/pubg';
import { revalidatePath } from 'next/cache';

export async function searchMatches(formData: FormData) {
    const playerName = formData.get('playerName') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    
    if (!playerName) {
        throw new Error('Please enter a player name');
    }

    // Use provided dates or default to last 7 days
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end);
    if (!startDate) start.setDate(start.getDate() - 7);

    const result = await fetchFilteredMatches(playerName, start, end);
    
    if (result.error) {
        throw new Error(result.error);
    }
    
    revalidatePath('/matches');
    return result.data;
}