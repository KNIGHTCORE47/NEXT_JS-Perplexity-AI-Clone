"use client";
{/* Search Result - Wrapper Page [parent 1] */ }

import { getUserSearchDataFromDB } from '@/db/db_Instance';
import React from 'react'
import Header from './Header';
import DisplayResultUI, {
    FormattedResponseType,
    FormattedVideoResponseType
} from './DisplayResultUI';



// NOTE - Define User search result type [Search API Response] [DB Response]
export interface SearchResultType {
    id?: number | string;
    search_input: string;
    user_email: string;
    search_type: string;
    library_id: string | null;
    created_at?: string;
}

// NOTE - Define LLM API Response type [LLM API Response] [DB Response]
export interface LlmApiResponseType {
    id: number | string;
    created_at?: string;
    lib_Id: string | null;
    search_response: FormattedResponseType[];
    ai_response: string | null;
    user_input_data: string;
    video_response_data: FormattedVideoResponseType[]
}


// NOTE - Define Complete Response type [Search API + LLM API Response] [DB Response]
export interface CompleteResponseType {
    Chats?: LlmApiResponseType[];
    id?: number | string;
    search_input: string;
    user_email: string;
    search_type: string;
    library_id: string | null;
    created_at?: string;
}



export default function SearchQueryComponent(
    { libId }: { libId: string }
) {


    const [searchInputReacord, setSearchInputReacord] = React.useState<CompleteResponseType>({
        Chats: [],
        id: '',
        search_input: '',
        user_email: '',
        search_type: '',
        library_id: null,
        created_at: ''
    });


    // NOTE - Fetch User Search Data Upon Component Mount
    React.useEffect(() => {
        getSearchInputReacord();
    }, []);

    async function getSearchInputReacord() {
        try {
            let { data, error } = await getUserSearchDataFromDB(libId as string);

            if (error) {
                console.error("Error fetching user search data:", error);

                throw error;
            }

            // NOTE - Check for valid data
            if (data && data.length > 0) {
                // console.log("User Search Complete Response Data Zeroth element:", data?.[0]);

                setSearchInputReacord(data?.[0] as CompleteResponseType);
            };

        } catch (error: any) {
            console.error("Error fetching user search data:", error);

            throw error;
        }
    }


    return (
        <div>
            <div>
                <Header
                    searchInputReacord={searchInputReacord}
                />
                <div
                    className='px-10 md:px-20 lg:px-32 xl:px-56'
                >
                    <DisplayResultUI
                        searchInputReacord={searchInputReacord}
                    />
                </div>
            </div>
        </div>
    )
}

