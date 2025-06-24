"use client";

import React from 'react'
import { LlmApiResponseType } from './SearchQueryComponent';
import Image from 'next/image';
import { Play, ExternalLink, Clock, Eye } from 'lucide-react';

export default function VideoTab(
    { webSearchResult }: { webSearchResult: LlmApiResponseType }
) {
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

    const handleVideoClick = (url: string) => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, url: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleVideoClick(url);
        }
    };

    // Check if video_response_data exists and is an array
    const videos = Array.isArray(webSearchResult?.video_response_data)
        ? webSearchResult?.video_response_data
        : [];

    if (!videos.length) {
        return <div className="text-gray-800">No videos available</div>;
    }


    return (
        <div
            className='space-y-4'
        >
            <div
                className='w-full flex justify-end'
            >
                <p
                    className='text-sm text-gray-800'
                >{videos?.length} videos found</p>
            </div>
            {
                videos?.map((item, index) => (
                    <div
                        key={index}
                        className={`group flex bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-lg hover:border-gray-300 ${hoveredIndex === index ? 'scale-[1.02]' : ''
                            }`}
                        onClick={() => handleVideoClick(item.url)}
                        onKeyDown={(e) => handleKeyDown(e, item.url)}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Play video: ${item.title}`}
                    >
                        {/* Thumbnail Container */}
                        <div
                            className="relative w-80 h-48 flex-shrink-0 bg-gray-100"
                        >
                            <Image
                                src={item.thumbnail}
                                alt={item.title}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop&crop=center'
                                }}
                            />

                            {/* Play Button Overlay */}
                            <div
                                className="absolute inset-0 bg-black/50 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center"
                            >
                                <div
                                    className={`bg-white rounded-full p-3 shadow-lg transform transition-all duration-200 ${hoveredIndex === index ? 'scale-110 opacity-100' : 'scale-90 opacity-0'
                                        }`}
                                >
                                    <Play className="w-6 h-6 text-gray-900 fill-current" />
                                </div>
                            </div>

                            {/* Duration Badge */}
                            <div
                                className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded"
                            >
                                {item.video?.duration}
                            </div>


                        </div>
                        {/* Content */}
                        <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                                    {item.title}
                                </h3>
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-200 ml-3 flex-shrink-0" />
                            </div>

                            <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                                {item.description}
                            </p>

                            {/* Video Metadata */}
                            <div className="flex items-center text-xs text-gray-500 space-x-4">
                                <span className="font-medium text-gray-700">{item.video?.creator}</span>
                                <div className="flex items-center space-x-1">
                                    <Eye className="w-3 h-3" />
                                    <span>{item.video?.views} views</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{item.video?.publisher}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div >
    )
}

