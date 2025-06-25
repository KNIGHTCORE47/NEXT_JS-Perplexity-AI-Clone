"use client";

import React from 'react';
import { formatRelativeTime } from '@/utils/TimeModule';
import { getAllLibraryDataFromDB } from '@/db/db_Instance';
import { SearchResultType } from './SearchQueryComponent';
import { useUserDetail } from '@/app/provider';
import { useUser } from '@clerk/nextjs';
import { SquareArrowOutUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DeleteHistoryBtnComponent from './DeleteHistoryBtnComponent';

export default function LibraryListsComponent() {
    const [libraryData, setLibraryData] = React.useState<SearchResultType[]>([]);
    const [loading, setLoading] = React.useState(true);

    const { userDetail } = useUserDetail();
    const { user, isLoaded } = useUser();
    const router = useRouter();


    // NOTE - Handle item click with event delegation
    function handleItemClick(
        event: React.MouseEvent,
        libraryId: string
    ) {
        // NOTE - Check if the clicked element or its parent is the delete button
        const target = event.target as HTMLElement;
        const isDeleteButton = target.closest('[data-delete-button]');

        // NOTE - Only navigate if delete button wasn't clicked
        if (!isDeleteButton) {
            router.push(`/search-result/${libraryId}`);
        }
    }

    // NOTE - Get History Data From DB [useCallBack for performance optimization and memoization of the function to avoid unnecessary re-renders]
    const getLibraryData = React.useCallback(async function () {
        const email_id = user?.primaryEmailAddress?.emailAddress || userDetail?.email;

        // Early return if no email available
        if (!email_id) {
            console.warn("No email available for fetching library data");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const result = await getAllLibraryDataFromDB(email_id as string);

            setLibraryData(result);
        } catch (error: unknown) {
            console.error("Error getting all library data from db:", error);

            // NOTE - Handle error
            if (error instanceof Error) {
                console.error("Error getting all library data from db [message]:", error.message);
                console.error("Error getting all library data from db [stack]:", error.stack);
            } else {
                console.error("Unknown error getting all library data from db:", error);
            }
        } finally {
            setLoading(false);
        }
    }, [user?.primaryEmailAddress?.emailAddress, userDetail?.email]);


    // NOTE - Fetch User Search Data When User Data is Available
    React.useEffect(() => {
        // Only fetch data when Clerk has loaded and we have user data
        if (
            isLoaded && (
                user?.primaryEmailAddress?.emailAddress || userDetail?.email
            )) {
            getLibraryData();
        } else if (
            isLoaded &&
            !user?.primaryEmailAddress?.emailAddress &&
            !userDetail?.email
        ) {
            // User is loaded but no email available
            setLoading(false);
        }
    }, [isLoaded, user?.primaryEmailAddress?.emailAddress, userDetail?.email, getLibraryData]);


    // NOTE - Method to upadate ui upon successful delete history
    function handleDleteSuccess(deletedLibraryId: string) {
        // NOTE - Immidiate remove the item from UI [state]
        setLibraryData((prev) => prev.filter((item) => item.library_id !== deletedLibraryId));
    }

    // Show loading state
    if (loading) {
        return (
            <div
                className='space-y-4 px-10 md:px-20 lg:px-36 xl:px-56'
            >
                <h2
                    className='mt-20 text-3xl font-bold mb-10'
                >
                    Library
                </h2>

                <div
                    className='space-y-3'
                >
                    <div
                        className='w-1/2 h-7 bg-accent rounded-md animate-pulse'
                    ></div>
                    <div
                        className='w-[70%] h-7 bg-accent rounded-md animate-pulse'
                    ></div>
                </div>
            </div>
        );
    }

    // Show empty state if no email available
    if (!user?.primaryEmailAddress?.emailAddress && !userDetail?.email) {
        return (
            <div
                className='space-y-4 px-10 md:px-20 lg:px-36 xl:px-56'
            >
                <h2
                    className='mt-20 text-3xl font-bold mb-10'
                >
                    Library
                </h2>

                <p>Unable to load library data. Please make sure you&apos;re logged in.</p>
            </div>
        );
    }

    return (
        <div
            className='space-y-4 px-10 md:px-20 lg:px-36 xl:px-56'
        >
            <h2
                className='mt-20 text-3xl font-bold mb-10'
            >
                Library
            </h2>

            {
                libraryData?.map((item, index) => (
                    // NOTE - Render Library Each Items
                    <div
                        key={item.library_id! + index}
                        className='cursor-pointer'
                        onClick={event => handleItemClick(event, item.library_id!)}
                    >
                        <div
                            className='flex justify-between'
                        >
                            <div>
                                <h3
                                    className='text-2xl font-semibold text-gray-600 mt-4 mb-2 leading-tight'
                                >
                                    {item.search_input}
                                </h3>
                                <p
                                    className='text-muted-foreground text-sm'
                                >
                                    {formatRelativeTime(item.created_at!)}
                                </p>
                            </div>

                            <div
                                className='space-y-7'
                            >
                                <SquareArrowOutUpRight
                                    size={20}
                                    className='text-muted-foreground hover:text-foreground'
                                />

                                <div
                                    data-delete-button
                                >
                                    <DeleteHistoryBtnComponent
                                        libraryId={item.library_id!}
                                        webSearchInput={item.search_input!}
                                        userEmail={user?.primaryEmailAddress?.emailAddress || userDetail?.email || ''}
                                        onDelete={() => handleDleteSuccess(item.library_id!)}
                                    />
                                </div>
                            </div>
                        </div>

                        <hr
                            className='my-4'
                        />
                    </div>
                ))
            }
        </div>
    )
}

