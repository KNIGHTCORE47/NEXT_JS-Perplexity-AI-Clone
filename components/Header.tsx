'use client';
{/* Search Result - child component [com 1] */ }

import React from 'react'
import { SearchResultType } from './SearchQueryComponent';
import { UserButton } from '@clerk/nextjs';
import {
    Clock,
    Link,
    Send
} from 'lucide-react';
import { formatRelativeTime } from '@/utils/TimeModule';
import { Button } from './ui/button';

export default function Header({ searchInputReacord }: { searchInputReacord: SearchResultType }) {

    // NOTE - Format Created At [Human Readable]
    let lastLogin;

    if (searchInputReacord?.created_at) {
        lastLogin = formatRelativeTime(searchInputReacord?.created_at);
    };


    return (
        <header
            className='px-4 py-2 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-shadow'
        >
            <div className='flex items-center justify-between'>
                <div
                    className='flex items-center gap-x-2'
                >
                    <UserButton />

                    <p
                        className='text-sm font-semibold text-gray-900 dark:text-white'
                    >
                        {searchInputReacord?.user_email.split('@')[0]}
                    </p>

                    <p
                        className='text-gray-800 dark:text-white text-sm flex items-center gap-x-1 ml-3'
                    >
                        <Clock
                            height={16}
                            width={16}
                        />

                        <span>
                            {lastLogin}
                        </span>
                    </p>
                </div>


                <p
                    className='line-clamp-1 max-w-md'
                >
                    {searchInputReacord?.search_input}
                </p>

                <div className='space-x-2'>
                    <Button
                        className='bg-[#2e757d] text-white'
                    >
                        <Link />
                    </Button>

                    <Button
                        className='bg-[#2e757d] text-white'
                    >
                        <Send />{" "}Share
                    </Button>
                </div>
            </div>
        </header>
    )
}

