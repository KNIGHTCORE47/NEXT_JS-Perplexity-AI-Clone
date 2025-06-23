'use client';

import Image from 'next/image';
import React from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import {
    ArrowRight,
    Atom,
    AudioLines,
    Cpu,
    Globe,
    Mic,
    Paperclip,
    Search
} from 'lucide-react';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AI_MODELS } from '@/services/constant';
import { useUserDetail } from '@/app/provider';
import { useUser } from '@clerk/nextjs';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseUser, saveUserSearchToDB, User } from '@/db/db_Instance';
import { useRouter } from 'next/navigation';

export default function ChatBoxComponent() {

    const [userSearchInput, setUserSearchInput] = React.useState<string>('');
    const [userSearchType, setUserSearchType] = React.useState<string>('search');

    const { userDetail } = useUserDetail() as { userDetail: DatabaseUser | null };
    const { user } = useUser() as { user: User | null };
    const router = useRouter() as { push: (url: string) => void };

    // NOTE - Save Input Search [db upload]
    async function onSearchQuery(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const libId = uuidv4()

        // Validate input
        if (!userSearchInput.trim()) {
            console.error("Search input is empty");
            return;
        }

        // NOTE - Check for invalid user
        if (!user) {
            console.error("Invalid user");
            return;
        }

        try {

            // NOTE - Save User Search [DB Query]
            const result = await saveUserSearchToDB({
                user,
                userSearchInput,
                userDetail,
                userSearchType,
                libId
            });

            // console.log("userSearchInput result", result.data?.[0]);
            // console.log("userSearchInput result library id:", result.data?.[0].library_id);

            // NOTE - Redirect to
            router.push(`/search-result/${result.data?.[0].library_id as string}`);

        } catch (error) {
            console.error("Error saving user search:", error);

            // NOTE - Handle error
            throw error as Error;
        } finally {
            setUserSearchInput('');
        }
    }

    return (
        <div
            className='flex flex-col items-center justify-center gap-y-8'
        >
            <Image
                src="/logo.png"
                alt="Logo"
                width={260}
                height={250}
            />

            <div
                className='p-2 w-full max-w-2xl border rounded-2xl'
            >

                <form
                    onSubmit={onSearchQuery}
                    className='flex items-end justify-between'
                >
                    <Tabs
                        defaultValue="search" className="w-[400px]"
                    >

                        <TabsContent
                            value="search"
                        >
                            <input
                                type="text"
                                value={userSearchInput}
                                onChange={event => setUserSearchInput(event?.target.value)}
                                className='w-full p-4 outline-none'
                                placeholder='Ask anything'
                            />
                        </TabsContent>

                        <TabsContent
                            value="research"
                        >
                            <input
                                type="text"
                                value={userSearchInput}
                                onChange={event => setUserSearchInput(event?.target.value)}
                                className='w-full p-4 outline-none'
                                placeholder='Research anything'
                            />
                        </TabsContent>

                        <TabsList>
                            <TabsTrigger
                                value="search"
                                onClick={() => setUserSearchType('search')}
                                className='text-[#2e757d]'
                            >
                                <Search />{" "}Search
                            </TabsTrigger>

                            <TabsTrigger
                                value="research"
                                onClick={() => setUserSearchType('research')}
                                className='text-[#2e757d]'
                            >
                                <Atom />{" "}Research
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div
                        className='flex items-center gap-x-2.5 text-gray-500'
                    >

                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    asChild
                                >
                                    <Button
                                        variant='ghost'
                                    >
                                        <Cpu />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent>

                                    <DropdownMenuLabel
                                        className='text-gray-500'
                                    >
                                        <p
                                            className='text-[#2e757d] font-bold text-lg'
                                        >
                                            Best
                                        </p>
                                        <p>Select the best model for each query</p>
                                    </DropdownMenuLabel>

                                    <DropdownMenuSeparator />

                                    {AI_MODELS.map((model, index) => (
                                        <DropdownMenuItem
                                            key={index}
                                        >
                                            <div>
                                                <h2>{model.name}</h2>
                                                <p>{model.desc}</p>
                                            </div>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <Button
                            variant='ghost'
                        >
                            <Globe />
                        </Button>

                        <Button
                            variant='ghost'
                        >
                            <Paperclip />
                        </Button>

                        <Button
                            variant='ghost'
                        >
                            <Mic />
                        </Button>

                        <Button
                            type='submit'
                            className='bg-[#2e757d] text-white p-2 rounded-md'
                            disabled={!userSearchInput.trim()}
                        >
                            {
                                userSearchInput ?
                                    <ArrowRight /> :
                                    <AudioLines />
                            }
                        </Button>
                    </div>
                </form>

            </div>
        </div>
    )
}

