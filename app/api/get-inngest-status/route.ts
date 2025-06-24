import { catchAsync } from "@/services/asyncHandler";
import { NextRequest, NextResponse } from "next/server";

export const POST = catchAsync(async function (request: NextRequest) {
    const { llmId: eventId } = await request.json();

    if (!eventId) {
        return NextResponse.json({
            success: false,
            message: "Missing eventId",
        }, { status: 400 });
    }

    const INNGEST_STATUS_ENDPOINT = `${process.env.INNGEST_SERVER_HOST! as string}/v1/events/${eventId}/runs`;

    const response = await fetch(INNGEST_STATUS_ENDPOINT, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY! as string}`,
        },
    });

    if (!response) {
        return NextResponse.json({
            success: false,
            message: "Failed to fetch LLM response data, please try again",
        }, { status: 400 });
    }

    const data = await response.json();

    if (data) {
        return NextResponse.json({
            success: true,
            message: "Inngest Status",
            data
        }, { status: 200 });

    } else {
        return NextResponse.json({
            success: false,
            message: "Something went wrong, please try again",
        }, { status: 400 });
    }
});