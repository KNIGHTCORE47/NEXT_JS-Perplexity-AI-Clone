"use client";

import React from 'react'
import { LlmApiResponseType } from './SearchQueryComponent';
import Image from 'next/image';

export default function ImagesTab(
    { webSearchResult }: { webSearchResult: LlmApiResponseType }
) {
    return (
        <div
            className='flex gap-2 flex-wrap mt-5'
        >

            {webSearchResult?.search_response?.map((items, index) => (
                <div
                    key={index}
                    className='bg-accent rounded-xl max-w-[200px] cursor-pointer hover:bg-accent/80 overflow-auto'
                >
                    <Image
                        src={items?.thumbnail ?? 'https://via.placeholder.com/150'}
                        alt={items?.title}
                        width={200}
                        height={200}
                    />
                </div>
            ))}
        </div>
    )
}

