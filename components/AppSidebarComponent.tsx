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
    LogIn,
    MoveUpRight
} from 'lucide-react';
import { Button } from './ui/button';


export interface MunuItems {
    title: string,
    icon: React.ReactNode,
    path: string
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
        title: 'Sign In',
        icon: <LogIn />,
        path: '#'
    }
]



export default function AppSidebar() {
    const path = usePathname();


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
                                        asChild
                                        className={`px-5 py-7 hover:bg-transparent hover:font-bold ${path.includes(item.path) && 'font-bold'}`}
                                    >
                                        <a
                                            href={item.path}
                                            className=''
                                        >
                                            {item.icon && <span className='mr-2'>{item.icon}</span>}
                                            <span className='text-lg'>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>

                        <Button
                            className={`rounded-full bg-[#2e757d] mx-4 mt-2`}
                        >
                            Sign Up
                        </Button>
                    </SidebarContent>
                </SidebarGroup>

                <SidebarGroup />
            </SidebarContent>

            <SidebarFooter className='bg-[#eff0eb] p-6'>
                <div className='text-gray-600'>
                    <h1 className='text-gray-800 font-bold'>Try Now</h1>
                    <p>Upgrade for image upload,
                        smarter AI & more copilot
                    </p>
                    <Button
                        variant={'outline'}
                        className=''
                    >
                        <MoveUpRight />{" "}Learn More
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar >
    )
}

