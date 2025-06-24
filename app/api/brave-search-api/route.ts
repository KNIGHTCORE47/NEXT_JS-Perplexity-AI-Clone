import { catchAsync } from '@/services/asyncHandler';
import { NextRequest, NextResponse } from 'next/server';

const BRAVE_URI_ENDPOINT = process.env.NEXT_PUBLIC_BRAVE_ENDPOINT as string;
const BRAVE_API_KEY = process.env.NEXT_PUBLIC_BRAVE_SEARCH_API_KEY as string;

export const POST = catchAsync(async function (request: NextRequest) {
    // NOTE - Check for Empty Endpoint
    if (!BRAVE_URI_ENDPOINT) {
        console.error('BRAVE_URI_ENDPOINT in env is not defined');

        return NextResponse.json({
            success: false,
            message: 'BRAVE_URI_ENDPOINT is not defined',
        }, { status: 400 });
    }

    const { search_input, search_type } = await request.json();


    if (search_input && search_type) {
        const response = await fetch(`${BRAVE_URI_ENDPOINT}?q=${search_input}&search_type=${search_type}&count=5`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Access-Encoding': 'gzip, deflate, br',
                'X-Subscription-Token': BRAVE_API_KEY,
            },
        });

        // NOTE - Check for invalid response
        if (!response?.ok) {
            return NextResponse.json({
                success: false,
                message: 'Failed to fetch searched data, please try again',
            }, { status: 400 });
        }

        const data = await response.json();

        // NOTE - Check for invalid data
        if (!data) {
            return NextResponse.json({
                success: false,
                message: 'Failed to fetch searched data, please try again',
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: 'Fetch searched data successfully',
            data,
        }, { status: 200 });
    } else {
        return NextResponse.json({
            success: false,
            message: 'search_input and search_type are required',
        }, { status: 400 });
    }
})