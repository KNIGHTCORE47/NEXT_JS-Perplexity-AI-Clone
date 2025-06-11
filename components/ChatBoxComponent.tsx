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

export default function ChatBoxComponent() {
    return (
        <div
            className='flex flex-col items-center justify-center gap-y-8'
        >
            <Image src="/logo.png" alt="Logo" width={260} height={250} />

            <div
                className='p-2 w-full max-w-2xl border rounded-2xl'
            >

                <div
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
                                className='w-full p-4 outline-none'
                                placeholder='Ask anything'
                            />
                        </TabsContent>

                        <TabsContent
                            value="research"
                        >
                            <input
                                type="text"
                                className='w-full p-4 outline-none'
                                placeholder='Research anything'
                            />
                        </TabsContent>

                        <TabsList>
                            <TabsTrigger
                                value="search"
                                className='text-[#2e757d]'
                            >
                                <Search />{" "}Search
                            </TabsTrigger>

                            <TabsTrigger
                                value="research"
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
                                        <p>Select the bst model for each query</p>
                                    </DropdownMenuLabel>

                                    <DropdownMenuSeparator />

                                    {AI_MODELS.map((model, index) => (
                                        <DropdownMenuItem>
                                            <div
                                                key={index}
                                            >
                                                <h2>{model.name}</h2>
                                                <p>{model.desc}</p>
                                            </div>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <Globe />
                        <Paperclip />
                        <Mic />
                        <Button
                            className='bg-[#2e757d] text-white p-2 rounded-md'
                        >
                            <AudioLines />
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}

