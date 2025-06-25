import { FormattedResponseType, FormattedVideoResponseType } from '@/components/DisplayResultUI';
import { supabase } from './supabase'
import { ParamValue } from 'next/dist/server/request/params';


// Clerk user type
export interface User {
    id?: string;
    fullName?: string | null;
    primaryEmailAddress?: {
        emailAddress?: string;
    } | null;
    emailAddress?: Array<{
        emailAddress?: string;
    }>;
}

// Database user type
export interface DatabaseUser {
    id: string;
    name: string;
    email: string;
    created_at?: string;
    credit?: number;
    subscription_id?: string;
}

// User search input type
export interface SearchInputType {
    user: User;
    userSearchInput: string;
    userDetail: DatabaseUser | null;
    userSearchType: string;
    libId?: string | null;
}



// NOTE - Create New User [DB Query] [Users cretion]
export async function createNewUserToDB(user: User) {
    try {

        // NOTE - Check for Existing User Email
        const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddress?.[0]?.emailAddress;

        if (!email) {
            console.error("User email is required");

            throw new Error("User email is required");
        }

        // NOTE - Check for existing user [DB Query]
        const { data: existingUsers, error: existingUserError } = await supabase
            .from('Users')
            .select('*')
            .eq('email', user?.primaryEmailAddress?.emailAddress)

        //  NOTE - Check for existing user [Logic]
        if (existingUserError) {
            console.error("Error checking existing user:", existingUserError);

            throw new Error("Error checking existing user", existingUserError);
        }

        // NOTE - Return existing user [DB Query]
        if (existingUsers && existingUsers.length > 0) {
            return existingUsers[0] as DatabaseUser;
        }

        // NOTE - Create new User
        const name = user?.fullName || email.split('@')[0];

        const { data, error: insertError } = await supabase
            .from('Users')
            .insert({
                name,
                email
            })
            .select()
            .single()

        if (insertError) {
            console.error("Error creating user:", insertError);

            throw insertError;
        }

        return data as DatabaseUser;

    } catch (error) {
        console.error("Error creating user:", error);

        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error("Error creating user");
        }
    }
}


// NOTE - Save User Search [DB Query] [Library creation]
export async function saveUserSearchToDB({
    user,
    userSearchInput,
    userDetail,
    userSearchType,
    libId
}: SearchInputType) {
    try {

        const creteInputOptions = {
            search_input: userSearchInput,
            user_email: userDetail?.email || user?.primaryEmailAddress?.emailAddress,
            search_type: userSearchType,
            library_id: libId
        }

        const result = await supabase
            .from('Library')
            .insert([creteInputOptions])
            .select()

        if (result.error) {
            console.error("Error saving user search into DB:", result.error);

            throw result.error;
        }

        return result;

    } catch (error) {
        console.error("Error saving user search into DB:", error);

        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error("Error saving user search into DB");
        }
    }
}


// NOTE - Fetch User Search Data [DB Query] [Library fetch data along with Chats]
export async function getUserSearchDataFromDB(libId: string) {
    try {
        return await supabase
            .from('Library')
            .select('*, Chats(*)')
            .eq('library_id', libId)
            .order('id', {
                foreignTable: 'Chats',
                ascending: true
            });

    } catch (error) {
        console.error("Error fetching user search data:", error);

        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error("Error fetching user search data");
        }
    }
}


// NOTE - Save Fetched Web Response [DB Query] [Chats cretion]
export async function saveFetchedWebResponseToDB(
    libId: string | ParamValue | null,
    formattedData: FormattedResponseType[],
    user_input_data: string | null | undefined,
    video_response_data: FormattedVideoResponseType[]
) {
    try {

        const { data, error } = await supabase
            .from('Chats')
            .insert([
                {
                    lib_Id: libId,
                    search_response: formattedData,
                    user_input_data,
                    video_response_data
                },
            ])
            .select()

        if (error) {
            console.error("Error saving fetched web response to DB:", error);

            throw error;
        }

        return data;

    } catch (error) {
        console.error("Error saving fetched web response to DB:", error);

        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error("Error saving fetched web response to DB");
        }
    }
}


// NOTE - Update Web Search Respone with latest llm data [DB Query] [Chats updation with latest llm data]
export async function updatedUserSearchedWebResponseWithLLMDataToDB(
    AI_RESPONSE: string | null,
    recordId: string,
) {
    try {
        const { data, error } = await supabase
            .from('Chats')
            .update({ ai_response: AI_RESPONSE })
            .eq("id", recordId)
            .select()

        if (error) {
            console.error("Error updating fetched web response with latest llm data to DB:", error);

            throw error;
        }

        return data;

    } catch (error) {
        console.error("Error updating fetched web response with latest llm data to DB:", error);

        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error("Error updating fetched web response with latest llm data to DB");
        }
    }
};


// NOTE - Get All Library data(History) from the db [DB Query]
export async function getAllLibraryDataFromDB(email_id: string) {
    try {
        const { data: Library, error } = await supabase
            .from('Library')
            .select('*')
            .eq('user_email', email_id)
            .order('id', { ascending: false });
        if (error) {
            console.error("Error getting all library data from db:", error);

            throw error;
        }

        return Library;


    } catch (error) {
        console.error("Error getting all library data from db:", error);

        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error("Error getting all library data from db");
        }
    }
}


// NOTE - Delete Library data along with Chats Data [History] from the db [DB Query]
export async function removeExactLibraryAndChatsDataFromDB(
    libId: string,
    searchInput: string,
    userEmail: string
) {
    try {
        if (!libId || !searchInput || !userEmail) {
            console.error("Library id or search input or user email is missing, Please check");

            throw new Error("Library id or search input or user email is missing, Please check");
        }

        const { error: chatsDeleteError } = await supabase
            .from('Chats')
            .delete()
            .eq('lib_Id', libId)

        if (chatsDeleteError) {
            console.error("Error removing exact library and chats data from db:", chatsDeleteError);

            throw chatsDeleteError;
        }

        const { error: libraryDeleteError } = await supabase
            .from('Library')
            .delete()
            .eq('library_id', libId)
            .eq('search_input', searchInput)
            .eq('user_email', userEmail);

        if (libraryDeleteError) {
            console.error("Error removing exact library and chats data from db:", libraryDeleteError);

            throw libraryDeleteError;
        }

    } catch (error) {
        console.error("Error removing exact library and chats data from db:", error);

        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error("Error removing exact library and chats data from db");
        }
    }
}
