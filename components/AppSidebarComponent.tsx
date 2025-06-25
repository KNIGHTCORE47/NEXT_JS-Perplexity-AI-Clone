'use client';

import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
    Search,
    Compass,
    GalleryHorizontalEnd,
    LogOut,
    MoveUpRight
} from 'lucide-react';
import { Button } from './ui/button';
import { UserButton } from '@clerk/nextjs';
import { useAuth } from '@clerk/clerk-react';

// NOTE - Define interface for Sidebar Menu Items
export interface MunuItems {
    title: string,
    icon: React.ReactNode,
    path: string,
    onClick?: () => void
}

export default function AppSidebar() {
    const path = usePathname();
    const { signOut, isLoaded } = useAuth();

    async function handleSignOut() {
        if (!isLoaded) return;

        try {
            signOut({
                redirectUrl: '/sign-in',
            });
        } catch (error: unknown) {
            console.error("Error signing out:", error);

            // NOTE - Handle error
            if (error instanceof Error) {
                console.error("Error signing out [message]:", error.message);
                console.error("Error signing out [stack]:", error.stack);
            } else {
                console.error("Unknown error signing out:", error);
            }
        }
    }


    const MenuOptions: MunuItems[] = [
        {
            title: 'Home',
            icon: <Search />,
            path: '/'
        },
        {
            title: 'Discover',
            icon: <Compass />,
            path: '/discover'
        },
        {
            title: 'Library',
            icon: <GalleryHorizontalEnd />,
            path: '/library'
        },
        {
            title: 'Sign Out',
            icon: <LogOut />,
            path: '#',
            onClick: handleSignOut
        }
    ]


    return (
        <Sidebar>

            <SidebarHeader
                className='bg-[#eff0eb] flex items-center py-4'
            >
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={180}
                    height={140}
                />
            </SidebarHeader>

            <SidebarContent
                className='bg-[#eff0eb]'
            >
                <SidebarGroup>
                    <SidebarContent>
                        <SidebarMenu>
                            {MenuOptions.map((item, index) => (
                                <SidebarMenuItem
                                    key={index}
                                >
                                    <SidebarMenuButton
                                        asChild={!item.onClick} // NOTE - Only use asChild when there's no onClick
                                        className={`px-5 py-7 hover:bg-transparent hover:font-bold ${path.includes(item.path) && 'font-bold'}`}
                                        onClick={item.onClick}
                                    >
                                        {
                                            item.onClick ? (
                                                // NOTE - For items with onClick (like Sign Out)
                                                <div
                                                    className='flex items-center cursor-pointer'
                                                >
                                                    {item.icon && <span className='mr-2'>{item.icon}</span>}
                                                    <span
                                                        className='text-lg'
                                                    >
                                                        {item.title}
                                                    </span>
                                                </div>
                                            ) : (
                                                // NOTE - For items without onClick [Regular Menu Items]
                                                <a
                                                    href={item.path}
                                                    className=''
                                                >
                                                    {item.icon && <span className='mr-2'>{item.icon}</span>}
                                                    <span
                                                        className='text-lg'
                                                    >
                                                        {item.title}
                                                    </span>
                                                </a>
                                            )
                                        }
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>

                        <Button
                            className={`rounded-full bg-[#2e757d] mx-4 mt-2`}
                        >
                            <span
                                className='text-white'
                            >
                                Upgrade
                            </span>
                        </Button>
                    </SidebarContent>
                </SidebarGroup>

                <SidebarGroup />
            </SidebarContent>

            <SidebarFooter className='bg-[#eff0eb] p-6'>
                <div
                    className='text-gray-600'
                >
                    <h1
                        className='text-gray-800 font-bold'
                    >
                        Try Now
                    </h1>
                    <p>Upgrade for image upload,
                        smarter AI & more copilot
                    </p>
                    <div
                        className='flex flex-col items-center gap-2 mt-2'
                    >
                        <Button
                            variant={'outline'}
                            className='w-full'
                        >
                            <MoveUpRight />{" "}Learn More
                        </Button>

                        <UserButton />
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar >
    )
}

