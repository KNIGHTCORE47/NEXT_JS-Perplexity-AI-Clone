import { fetchInstance } from './FetchInstance';
import { FormattedResponseType } from '@/components/DisplayResultUI';

// NOTE - Fetch Search API Response
export function fetchSearchAPIResponse(
    searchInput: string,
    searchType: string,
) {
    return fetchInstance('brave-search-api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            search_input: searchInput,
            search_type: searchType,
        }),
    });
}


// NOTE - Fetch LLM API Response
export function fetchLLMAPIResponse(
    search_input: string,
    search_response: FormattedResponseType[],
    recordId: string | number
) {
    return fetchInstance('llm-model', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            search_input,
            search_response,
            recordId
        }),
    });
}


// NOTE - Fetch LLM API Status
export function fetchLLMAPIStatus(llmId: string) {
    return fetchInstance('get-inngest-status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ llmId }),
    });
}