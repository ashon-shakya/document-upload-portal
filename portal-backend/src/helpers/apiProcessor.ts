import { IApiProcessorParams } from "../interfaces/IApiProcessor";

export const apiProcessor = async ({ method, url, data, headers }: IApiProcessorParams) => {
    try {
        const response = await fetch(url, {
            method,
            headers,
            body: data ? JSON.stringify(data) : undefined
        });

        if (!response.ok) {
            const errorData = await response.text();
            return {
                error: errorData
            }
        }

        const responseData = await response.json();
        return responseData;

    } catch (error) {
        console.error('Error in apiProcessor:', error);
        throw error;
    }
}   