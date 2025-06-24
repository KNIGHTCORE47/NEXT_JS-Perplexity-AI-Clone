"use client";
{/* Search Result - child component [com 2] */ }

import { CompleteResponseType } from './SearchQueryComponent';
import React from 'react'
import {
    LucideSparkles,
    LucideImage,
    LucideVideo,
    LucideList,
    Send
} from 'lucide-react';
import AnswerDisplay from './AnswerDisplay';
import {
    SearchResponseType,
    VideoInfo,
    VideoResult,
    WebResult
} from '@/services/constant';
import { getUserSearchDataFromDB, saveFetchedWebResponseToDB } from '@/db/db_Instance';
import { useParams } from 'next/navigation';
import {
    fetchLLMAPIResponse,
    fetchLLMAPIStatus
} from '@/utils/ApiCalls';
import { fetchSearchAPIResponse } from '@/utils/ApiCalls';
import ImagesTab from './ImagesTab';
import SourceTab from './SourceTab';
import VideoTab from './VideoTab';
import { Button } from './ui/button';


// NOTE - Define interface Save Search Response type [Formatted]
export interface FormattedResponseType {
    title: string;
    description: string;
    long_name: string;
    img: string;
    url: string;
    thumbnail: string;
}

// NOTE - Define interface Save Search Video Response type [Formatted]
export interface FormattedVideoResponseType {
    title: string;
    description: string;
    url: string;
    thumbnail: string;
    video: VideoInfo
}


// NOTE - Define Search Result Tab interface
interface SerchResultTab {
    label: string;
    icon: React.ComponentType<{
        size?: number;
        className?: string;
    }>;
    badge?: string | number
}


// NOTE - Define Tabs
const tabs: SerchResultTab[] = [
    {
        label: "Answer",
        icon: LucideSparkles
    },
    {
        label: "Images",
        icon: LucideImage
    },
    {
        label: "Videos",
        icon: LucideVideo
    },
    {
        label: "Sources",
        icon: LucideList,
        badge: 10
    },
]


export default function DisplayResultUI(
    { searchInputReacord }: { searchInputReacord: CompleteResponseType }
) {

    const { libId } = useParams() as { libId: string };

    const [activeTab, setActiveTab] = React.useState<string>('Answer');

    const [searchResult, setSearchResult] = React.useState<CompleteResponseType | null>(searchInputReacord);

    const [loading, setLoading] = React.useState<boolean>(false);

    const [userNewInput, setUserNewInput] = React.useState<string>('');

    const hasFetchedRef = React.useRef(false);


    React.useEffect(() => {

        if (!searchInputReacord?.search_input) {
            console.log("No search input found, waiting for data...");
            return;
        }

        {/*
            ********* NOTE - LOGIC ********

            logic is the user after type search_input data from homepage redirect to the Result page where upon refresh the page dom will not refresh cause i will restrict the function for it (getSearchAPIWithLLMDataResponse) which save my search api token multiple db calls for saving same data and LLM Api token along with thet after getting the complete data from the search api i will save the data to the db and then i will fetch the data from the db and render the data and if the data is not in the db then i will make the api calls call the function (getFinalRenderedResponseFromDB)

        */}

        if (
            !hasFetchedRef.current &&
            searchInputReacord?.Chats?.length === 0
        ) {
            getSearchAPIWithLLMDataResponse();
            hasFetchedRef.current = true;
        } else if (Array.isArray(searchInputReacord?.Chats) && searchInputReacord.Chats.length > 0) {
            getFinalRenderedResponseFromDB();
            hasFetchedRef.current = true;
        }

        setSearchResult(searchInputReacord);
    }, [searchInputReacord]);




    // NOTE - Fetch Search API Response
    async function getSearchAPIWithLLMDataResponse(event: React.FormEvent<HTMLFormElement> | null = null) {
        event?.preventDefault();

        setLoading(true);

        try {
            // NOTE - Get Response from Search API
            const searchInput: string = userNewInput.trim() ? userNewInput.trim() : searchInputReacord?.search_input;
            const searchType: string = searchInputReacord?.search_type ?? "search";

            const response = await fetchSearchAPIResponse(searchInput, searchType);

            console.log("Search API Response:", response);

            if (!response?.ok) {
                console.error("Error fetching user search web response:", response);

                throw new Error("Error fetching user search web response");
            }

            const data = await response.json();

            console.log("Search API Response Data:", data?.data);

            const finalWebResponse: SearchResponseType = data?.data;

            // const finalWebResponse: SearchResponseType = SEARCH_RESPONSE;

            // NOTE - Check for invalid data
            if (!finalWebResponse) {
                throw new Error("Error fetching user search web response");
            }

            // NOTE - Set Active Tab
            setActiveTab("Answer");


            // NOTE - Save Fetched Web Response as Formatted Response [DB Query]
            const formattedData: FormattedResponseType[] = finalWebResponse?.web?.results?.map((item: WebResult) => ({
                title: item?.title ?? "",
                description: item?.description ?? "",
                long_name: item?.profile?.long_name ?? "",
                img: item?.profile?.img ?? "",
                url: item?.url ?? "",
                thumbnail: item?.thumbnail?.src ?? "",
            }));

            // NOTE - Save Fetched Web Response as Formatted Video Data Response [DB Query]
            const formattedVideoData: FormattedVideoResponseType[] = finalWebResponse?.videos?.results?.map((video: VideoResult) => ({
                title: video?.title ?? "",
                description: video?.description ?? "",
                url: video?.url ?? "",
                thumbnail: video?.thumbnail?.src ?? "",
                video: video?.video ?? {}
            }))

            console.log("Curret searchInputReacord (From DB):", searchInputReacord);

            // NOTE - Add validation at the start
            if (!searchInputReacord?.search_input) {
                console.error("No search input available");
                return;
            }

            // NOTE - Save Fetched Web Response to DB [Chats cretion]
            const userSearchData = userNewInput.trim() ? userNewInput.trim() : searchInputReacord?.search_input;

            const savedWebResponse = await saveFetchedWebResponseToDB(libId, formattedData, userSearchData, formattedVideoData);

            if (!savedWebResponse) {
                throw new Error("Error saving fetched web response to DB");
            }

            // NOTE - Update Fetched Web Search Respone to LLM [AI Query] call genarateLLMAPIResponse
            const dbRecordId = savedWebResponse?.[0]?.id ?? "";

            await genarateLLMAPIResponse(formattedData, dbRecordId);

            await getFinalRenderedResponseFromDB();


        } catch (error: any) {
            console.error("Error fetching user search web response:", error);

            throw error;
        } finally {
            setLoading(false);
            setUserNewInput('');
        }
    }


    // NOTE - Generate LLM API Response
    async function genarateLLMAPIResponse(
        formattedData: FormattedResponseType[],
        recordId: string
    ) {
        try {
            // Use the current userNewInput or the original search input
            const searchQuery = userNewInput.trim() || searchInputReacord?.search_input || "";

            // NOTE - Generate LLM API Response ID [AI Api Call]
            const response = await fetchLLMAPIResponse(
                searchQuery,
                formattedData ?? [],
                recordId ?? ""
            )

            // console.log("LLM API Response:", response);

            if (!response?.ok) {
                console.error("Error generating LLM API Response:", response);

                throw new Error("Error generating LLM API Response");
            }

            const data = await response.json();

            const llmId = data?.data?.ids?.[0];

            // console.log("LLM API Response Data:", llmId);

            // NOTE - Get Status of LLM API Response [AI Api Call] (Interval Call for Polling)
            const interval = setInterval(async () => {
                try {
                    const statusResponse = await fetchLLMAPIStatus(llmId ?? "");

                    if (!statusResponse?.ok) {
                        console.error("Error generating LLM API Response:", statusResponse);

                        clearInterval(interval);
                        return;
                    }

                    const statusData = await statusResponse.json();

                    // console.log("LLM API Status Data:", statusData.data);

                    const statusText = statusData.data?.data?.[0]?.status;

                    // NOTE - Check for LLM API Response Status [AI Api Call]
                    if (statusText === "Completed") {
                        console.log("LLM API Response Completed");

                        await getFinalRenderedResponseFromDB();

                        clearInterval(interval);
                    } else if (statusText === "Failed") {
                        console.error("LLM API Response Failed");
                        clearInterval(interval);
                    }

                } catch (error) {
                    console.error("Error in polling:", error);
                    clearInterval(interval);
                }
            }, 1000);

            // Add timeout to prevent infinite polling
            setTimeout(() => {
                clearInterval(interval);
                console.warn("LLM API polling timeout");
            }, 60000); // 1 minute timeout


        } catch (error: any) {
            console.error("Error generating LLM API Response:", error);

            throw error;
        }
    }

    // NOTE - Get Final Rendered Response From DB
    async function getFinalRenderedResponseFromDB() {
        try {
            let { data: CompeteData, error } = await getUserSearchDataFromDB(libId as string);

            if (error) {
                console.error("Error Getting complete db response data:", error);

                throw error;
            }

            setSearchResult(CompeteData?.[0] as CompleteResponseType);

        } catch (error: any) {
            console.error("Error Getting complete db response data:", error);

            throw error;
        }
    }


    return (
        <>

            {/* NOTE - Loading State [Skeleton Component Mount] */}
            {
                loading && (<div
                    className='space-y-3'
                >
                    <div
                        className='w-full h-7 bg-accent rounded-md animate-pulse'
                    ></div>
                    <div
                        className='w-1/2 h-7 bg-accent rounded-md animate-pulse'
                    ></div>
                    <div
                        className='w-[70%] h-7 bg-accent rounded-md animate-pulse'
                    ></div>
                </div>)
            }

            <section>
                {
                    searchResult?.Chats?.map((chat, index) => (
                        <div
                            key={index}
                        >
                            <h2
                                className='font-medium text-3xl mt-9'
                            >
                                {chat?.user_input_data}
                            </h2>

                            {/* Web Response Article Tabs */}
                            <div
                                className='flex items-center gap-x-6 mt-6 border-b border-gray-200 dark:border-gray-700 pb-2'
                            >
                                {
                                    tabs.map(({ label, icon: Icon, badge }) => (
                                        <button
                                            key={label}
                                            onClick={() => setActiveTab(label)}
                                            className={`flex items-center gap-x-1 relative text-sm font-medium text-gray-700 hover:text-black ${activeTab === label ? 'text-black' : ''}`}
                                        >
                                            <p
                                                className='text-sm flex items-center gap-x-1'
                                            >
                                                <Icon size={16} />{" "}{label}
                                            </p>
                                            {badge && <span
                                                className='ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded dark:bg-gray-800 dark:text-gray-400'
                                            >
                                                {badge}
                                            </span>}
                                            {activeTab === label && (
                                                <span
                                                    className='absolute -bottom-2 left-0 w-full right-0 h-0.5 bg-black rounded'
                                                ></span>
                                            )}
                                        </button>
                                    ))
                                }


                                <div
                                    className='ml-auto text-sm text-gray-500 flex items-center'
                                >
                                    1 task <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className='ml-1'
                                    >
                                        <path d="M6 6h7.586L3.293 15.293l1.414 1.414L15 6.414V15h1V5H6v1z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Web Response Article section */}
                            <div>
                                {
                                    activeTab === "Answer" ? (
                                        <div
                                            className='mt-4'
                                        >
                                            <AnswerDisplay
                                                webSearchResult={chat}
                                                loadingState={loading}
                                            />
                                        </div>
                                    ) : activeTab === "Images" ? (
                                        <div
                                            className='mt-4'
                                        >
                                            <ImagesTab
                                                webSearchResult={chat}
                                            />
                                        </div>
                                    ) : activeTab === "Sources" ? (
                                        <div
                                            className='mt-4'
                                        >
                                            <SourceTab
                                                webSearchResult={chat}
                                            />
                                        </div>
                                    ) : activeTab === "Videos" ? (
                                        <div
                                            className='ax-w-4xl mx-auto p-6 mt-4'
                                        >
                                            <VideoTab
                                                webSearchResult={chat}
                                            />
                                        </div>
                                    ) : null
                                }
                            </div>

                            <hr className='my-12' />
                        </div>
                    ))
                }

                {/* User Input Form [Search Box] */}
                <div
                    className='max-w-md w-full fixed bottom-5 z-50 lg:max-w-2xl xl:max-w-6xl'
                >
                    <form
                        onSubmit={getSearchAPIWithLLMDataResponse}
                        className='bg-white w-full border rounded-xl shadow-md py-3 px-5 grid grid-cols-[1fr_auto] gap-x-2 items-center'
                    >
                        <input
                            type="text"
                            value={userNewInput}
                            className='outline-none'
                            onChange={event => setUserNewInput(event.target.value)}
                            placeholder='Type Anything...'
                            disabled={loading}
                        />
                        <Button
                            type='submit'
                            className='bg-[#2e757d] hover:bg-[#2e757d]/90 text-white'
                            disabled={loading || !userNewInput.trim()}
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white">
                                </div>
                            ) : (
                                <Send size={16} />
                            )}
                        </Button>
                    </form>
                </div>
            </section>
        </>
    )
}

