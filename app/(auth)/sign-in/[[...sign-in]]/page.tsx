'use client';

import React from 'react'
import SignInForm from '@/components/SignInForm'

function page() {
    return (
        <div
            className="min-h-screen w-full flex flex-col"
        >
            <main
                className='flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8'
            >
                <SignInForm />
            </main>

        </div>
    )
}

export default page
