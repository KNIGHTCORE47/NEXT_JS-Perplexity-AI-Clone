"use client";

import {
    SearchResponseType,
    WebResult
} from '@/services/constant';
import { fetchSearchAPIResponse } from '@/utils/ApiCalls';
import {
    Cpu,
    DollarSign,
    Globe,
    Palette,
    Star,
    Volleyball,
} from 'lucide-react';
import React from 'react'
import DiscoveryCard from './DiscoveryCard';


// NOTE - Define Header Discovery item object interface
interface DiscoveryOptionsType {
    title: string;
    icon: React.ComponentType<{
        size?: number;
        className?: string;
    }>;
}



// NOTE - Define top Discovery item object
const discoveryOptions: DiscoveryOptionsType[] = [
    {
        title: "Top",
        icon: Star
    },
    {
        title: "Tech & Science",
        icon: Cpu
    },
    {
        title: "Finance",
        icon: DollarSign
    },
    {
        title: "Art & Culture",
        icon: Palette
    },
    {
        title: "Sports",
        icon: Volleyball
    }
]



export default function DiscoverComponent() {
    const [selectedOption, setSelectedOption] = React.useState<string>("Top");
    const [latestDiscovery, setLatestDiscovery] = React.useState<WebResult[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    // NOTE - Get Discovery API Response [useCallBack for performance optimization and memoization of the function to avoid unnecessary re-renders]
    const GetDicoveryResponseFormAPI = React.useCallback(async function () {
        setLoading(true);

        try {
            const searchInput: string = `${selectedOption} + Latest News & Updates` || "Top + Latest News & Updates";

            const searchType: string = "Search";

            const response = await fetchSearchAPIResponse(searchInput, searchType);

            if (!response?.ok) {
                console.error("Error fetching search web response:", response);

                throw new Error("Error fetching search web response");
            }

            const data = await response.json();

            const CompleteWebResponse: SearchResponseType = data?.data;

            console.log("Discovery API Response:", CompleteWebResponse);

            setLatestDiscovery(CompleteWebResponse?.web?.results as WebResult[]);


        } catch (error: unknown) {
            console.error("Error Getting API Response:", error);

            // NOTE - Handle Error
            if (error instanceof Error) {
                console.error("Error Getting API Response [message]:", error.message);
                console.error("Error Getting API Response [stack]:", error.stack);
            } else {
                console.error("Unknown error Getting API Response:", error);
            }
        } finally {
            setLoading(false);
        }
    }, [selectedOption]);


    React.useEffect(() => {
        if (selectedOption) {
            GetDicoveryResponseFormAPI();
        }
    }, [selectedOption, GetDicoveryResponseFormAPI]);



    // NOTE - Render Loader [Skeleton]
    if (loading) {
        return (
            <div
                className='flex items-center justify-center h-[50vh]'
            >
                <p
                    className='text-2xl font-semibold'
                >
                    Loading...
                </p>
            </div>
        )
    }



    return (
        <div
            className='space-y-4 px-10 md:px-20 lg:px-36 xl:px-56'
        >
            <h2
                className='text-3xl font-bold leading-snug flex items-center gap-x-2 mb-8'
            >
                <Globe
                    size={27}
                />Discover
            </h2>

            <div
                className='flex items-center gap-x-4'
            >

                {/* NOTE - Render Discovery Options [Top Tabs] */}
                {
                    discoveryOptions.map((option) => (
                        <div
                            key={option.title}
                            className={`flex items-center gap-x-1 py-1 px-3 hover:text-[#42828a] hover:bg-accent/70 rounded-full cursor-pointer ${selectedOption === option.title ? "bg-accent/70 text-[#42828a]" : ""}`}
                            onClick={() => setSelectedOption(option.title)}
                        >
                            <option.icon
                                size={20}
                            />
                            <p
                                className='text-sm'
                            >
                                {option.title}
                            </p>
                        </div>
                    ))
                }
            </div>

            <hr
                className='my-4'
            />

            {/* NOTE - Render Discovery Content [API Response]  [TODO]*/}
            <div
                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            >
                {
                    latestDiscovery?.map((item) => (
                        <DiscoveryCard
                            key={item?.title}
                            discoverdItem={item}
                        />
                    ))
                }
            </div>
        </div>
    )
}

