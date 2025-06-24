'use client';
{/* Search Result - Wrapper Page [parent 0] */ }

import React from 'react'
import { useParams } from 'next/navigation';
import SearchQueryComponent from '@/components/SearchQueryComponent';

export default function SearchResultPage() {
    const { libId } = useParams() as { libId: string };

    return (
        <main
            className='bg-base min-h-screen w-full'
        >
            <SearchQueryComponent libId={libId as string} />
        </main>
    )
}