"use client";
{/* Search Result - child component [com 3] */ }

import Image from 'next/image';
import React from 'react'
import { LlmApiResponseType } from './SearchQueryComponent';
import { FormattedResponseType } from './DisplayResultUI';
import DisplaySummery from './DisplaySummery';




export default function AnswerDisplay({
    webSearchResult,
    loadingState,
}: {
    webSearchResult: LlmApiResponseType,
    loadingState: boolean,
}) {

    // NOTE - Get Web Reasults
    const WEB_RESULTS: FormattedResponseType[] = webSearchResult?.search_response;

    // NOTE - Check if web results exist
    if (!WEB_RESULTS?.length) {
        console.error("No web results found in search result:", WEB_RESULTS);

        return null;
    }

    // console.log("WEB_RESULTS data:", WEB_RESULTS);

    return (
        <>
            {/* NOTE - Web Reponse Tabs [Redirect Links] */}
            <div
                className='webResponseTabs flex gap-2 flex-wrap mt-5'
            >
                {/* NOTE - Loading State [Skeleton Component Mount] */}
                {
                    loadingState && (
                        <div
                            className='flex gap-2 flex-wrap mt-5'
                        >
                            {
                                [1, 2, 3, 4].map(index => (
                                    <div
                                        key={index}
                                        className='w-[200px] h-24 bg-accent animate-pulse rounded-lg cursor-pointer hover:bg-accent/80'
                                    ></div>
                                ))
                            }
                        </div>
                    )
                }

                {/* NOTE - Web Reponse Tabs [Web Results Component] [Redirect Links] */}
                {
                    WEB_RESULTS?.map((items, index) => (
                        <div
                            key={index}
                            onClick={() => window.open(items?.url, "_blank")}
                            className='p-3 bg-accent rounded-lg max-w-[200px] cursor-pointer hover:bg-accent/80'
                        >

                            <div
                                className='flex gap-x-2 items-center'
                            >
                                <Image
                                    alt={items?.long_name}
                                    src={items?.img ?? '/default-favicon.png'}
                                    width={20}
                                    height={20}
                                    onError={(e) => {
                                        e.currentTarget.src = '/default-favicon.png'; // fallback
                                    }}
                                />

                                <h2
                                    className='text-xs'
                                >
                                    {items?.long_name}
                                </h2>
                            </div>

                            <p
                                className='mt-2 text-xs line-clamp-2 text-black'
                            >
                                {(items?.description).replace(/<[^>]+>/g, '')}
                            </p>
                        </div>
                    ))
                }
            </div>

            <DisplaySummery
                ai_response={webSearchResult?.ai_response as string}
            />
        </>
    )
}

