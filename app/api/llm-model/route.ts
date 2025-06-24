import { NextResponse, NextRequest } from "next/server";
import { catchAsync } from "@/services/asyncHandler";
import { inngest } from "../../../inngest/client";

// Create a simple async Next.js API route handler
export const POST = catchAsync(async function (request: NextRequest) {
    // Send your event payload to Inngest
    const {
        search_input,
        search_response,
        recordId
    } = await request.json();

    const inngestRunId = await inngest.send({
        name: "llm-model",
        data: {
            search_input,
            search_response,
            recordId
        },
    });

    if (inngestRunId) {
        return NextResponse.json({
            success: true,
            message: "Event sent successfully",
            data: inngestRunId
        }, { status: 200 });

    } else {
        return NextResponse.json({
            success: false,
            message: "Error sending event"
        }, { status: 500 });
    }
});
