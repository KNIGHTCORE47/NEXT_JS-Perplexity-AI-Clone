'use client';

import { WebResult } from '@/services/constant';
import Image from 'next/image';
import React from 'react'

export default function DiscoveryCard(
    { discoverdItem }: { discoverdItem: WebResult }
) {
    return (
        <div
            className='border rounded-2xl mt-7 hover:bg-accent/75 cursor-pointer'
            onClick={() => window.open(discoverdItem?.url, '_blank')}
        >
            {/* NOTE - Check for thumbnail [non-null assertion issue] */}
            {
                discoverdItem?.thumbnail?.src && <Image
                    src={discoverdItem.thumbnail.src}
                    alt={discoverdItem?.title}
                    width={700}
                    height={400}
                    className='rounded-2xl mb-3'
                />
            }


            <div
                className='py-3 px-2'
            >
                <h2
                    className='text-xl font-semibold mb-3 line-clamp-1'
                >
                    {discoverdItem?.title}
                </h2>
                <p
                    className='text-sm line-clamp-2 text-gray-500'
                >
                    {
                        (discoverdItem?.description).replace(/<[^>]+>/g, '')
                    }
                </p>
            </div>
        </div>
    )
}

