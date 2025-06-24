"use client";

import { useUser } from '@clerk/nextjs';
import * as React from 'react'
import { createContext, useContext } from 'react';
import {
    User,
    DatabaseUser,
    createNewUserToDB
} from '@/db/db_Instance';

// NOTE - Craete Interface defination for Context
interface UserDetailContextProps {
    userDetail: DatabaseUser | null;
    setUserDetail: React.Dispatch<React.SetStateAction<DatabaseUser | null>>;
    isLoaded: boolean;
    error: string | null;
}


const UserDetailContext = createContext<UserDetailContextProps | null>(null);

export default function Provider(
    { children }: { children: React.ReactNode }
) {
    const [userDetail, setUserDetail] = React.useState<DatabaseUser | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const { user, isLoaded } = useUser();

    React.useEffect(() => {
        // NOTE - Check for component state [mounting]
        if (isLoaded && user) {
            async function fetchUserDetail() {
                setError(null);

                try {
                    const response = await createNewUserToDB(user as User);

                    // console.log("Fetched user detail:", response);

                    setUserDetail(response || null);

                } catch (error) {
                    console.error("Error fetching user detail:", error);

                    // NOTE - Handle error
                    setError(error instanceof Error ? error.message : "Unknown error");
                }
            }

            fetchUserDetail();
        } else if (isLoaded && !user) {
            // NOTE - Clear user detail when user not authenticated
            setUserDetail(null);
            setError(null);
        }
    }, [user, isLoaded]);

    return (
        <UserDetailContext.Provider
            value={{
                userDetail,
                setUserDetail,
                isLoaded,
                error
            }}
        >
            {children}
        </UserDetailContext.Provider>
    )
}

// Custom hook for using the context
export function useUserDetail() {
    const context = useContext(UserDetailContext);
    if (!context) {
        throw new Error('useUserDetail must be used within a UserDetailProvider');
    }
    return context;
}