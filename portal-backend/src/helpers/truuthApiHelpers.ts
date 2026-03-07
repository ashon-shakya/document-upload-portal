import config from "../config/config";
import { IClassifyImage, IVerifyDocumentPayload } from "../interfaces/ITruuthApi";
import { apiProcessor } from "./apiProcessor";



export const classifyApi = async (images: IClassifyImage[]) => {
    const token = Buffer.from(`${config.truuthOptions.apiKey}:${config.truuthOptions.apiSecret}`).toString('base64');

    try {
        return await apiProcessor({
            method: 'POST',
            url: config.truuthOptions.apiUrls.classify,
            data: { images },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${token}`,
                'Accept': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error in classifyApi:', error);
        throw error;
    }
}

export const verifyApi = async (payload: IVerifyDocumentPayload) => {
    const token = Buffer.from(`${config.truuthOptions.apiKey}:${config.truuthOptions.apiSecret}`).toString('base64');

    try {
        return await apiProcessor({
            method: 'POST',
            url: config.truuthOptions.apiUrls.verify,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${token}`,
                'Accept': 'application/json'
            },
            data: payload
        });
    } catch (error) {
        console.error('Error in verifyApi:', error);
        throw error;
    }
}
