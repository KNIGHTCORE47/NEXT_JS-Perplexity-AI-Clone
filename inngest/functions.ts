import { updatedUserSearchedWebResponseWithLLMDataToDB } from "@/db/db_Instance";
import { inngest } from "./client";

const Gemini_API_KEY = process.env.GEMINI_API_KEY as string;

// NOTE - check for invalid api key
if (!Gemini_API_KEY) {
    throw new Error('GEMINI_API_KEY in env is not defined');
}


export const llmModel = inngest.createFunction(
    { id: "llm-model" },
    { event: "llm-model" },
    async ({ event, step }) => {
        const AI_RESPONSE = await step.ai.infer('generate-ai-llm-model-call', {
            model: step.ai.models.gemini({
                model: "gemini-1.5-flash",
                apiKey: Gemini_API_KEY,
            }),
            body: {
                contents: [{
                    role: "user",
                    parts: [{
                        text: `You are an AI assistant. Based on the input below, summarize and format the information using markdown.\n\n` +
                            `User Input: ${event?.data?.search_input}\n\n` +
                            `Search Results: ${JSON.stringify(event?.data?.search_response)}`
                    }]
                }],
            }
        })

        // NOTE - Update Web Search Respone with latest llm data [DB Query]
        await step.run('saveLLMResponseToDB', async function () {

            console.log("AI_RESPONSE in save-llm-response-to-db: ", AI_RESPONSE);


            const response = AI_RESPONSE?.candidates?.[0].content?.parts?.[0];
            const aiResponse = response && 'text' in response ? response.text : '';

            const recordId = event.data?.recordId;

            await updatedUserSearchedWebResponseWithLLMDataToDB(aiResponse, recordId);

            return AI_RESPONSE;
        })
    },
)