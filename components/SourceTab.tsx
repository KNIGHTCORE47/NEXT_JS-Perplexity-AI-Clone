"use client";

import React from 'react'
import { LlmApiResponseType } from './SearchQueryComponent';
import Image from 'next/image';



export default function SourceTab(
    { webSearchResult }: { webSearchResult: LlmApiResponseType }
) {
    return (
        <div
            className=' space-y-4'
        >
            {
                webSearchResult?.search_response?.map((items, index) => (
                    <div
                        key={index}
                        className='p-3 bg-accent rounded-lg cursor-pointer hover:bg-accent/80'
                    >
                        <div
                            className='flex gap-2 items-center'
                        >
                            <h2>{index + 1}</h2>
                            <Image
                                src={items?.img}
                                alt={items?.title}
                                width={20}
                                height={20}
                                className='rounded-full'
                            />
                            <h2>{items?.long_name}</h2>
                        </div>
                        <h2
                            className='text-xl font-semibold text-[#1d4ed8] mb-3 line-clamp-1'
                        >
                            {items?.title}
                        </h2>
                        <p
                            className='line-clamp-2 text-gray-800 dark:text-white text-sm'
                        >
                            {items?.description}
                        </p>
                    </div>
                ))
            }
        </div>
    )
}

