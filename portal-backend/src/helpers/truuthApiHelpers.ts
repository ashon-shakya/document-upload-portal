import config from "../config/config";
import { IClassifyImage, IVerifyDocumentPayload } from "../interfaces/ITruuthApi";
import { apiProcessor } from "./apiProcessor";

const generateToken = (apiKey: string, apiSecret: string) => {
    return Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
}

export const classifyApi = async (images: IClassifyImage[]) => {
    const token = generateToken(config.truuthOptions.apiKey, config.truuthOptions.apiSecret);

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

export const submitFraudCheck = async (payload: IVerifyDocumentPayload) => {
    const token = generateToken(config.truuthOptions.apiKey, config.truuthOptions.apiSecret);

    try {
        return await apiProcessor({
            method: 'POST',
            url: config.truuthOptions.apiUrls.submitFraud,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${token}`,
                'Accept': 'application/json'
            },
            data: payload
        });
    } catch (error) {
        console.error('Error in submitFraudCheck:', error);
        throw error;
    }
}

export const getFraudCheck = async (documentVerifyId: string) => {
    const token = generateToken(config.truuthOptions.apiKey, config.truuthOptions.apiSecret);
    try {
        return await apiProcessor({
            method: 'GET',
            url: `${config.truuthOptions.apiUrls.getFraud}/${documentVerifyId}`,
            headers: {
                'Authorization': `Basic ${token}`,
                'Accept': 'application/json'
            },
        });
    } catch (error) {
        console.error('Error in Get Fraud Check:', error);
        throw error;
    }

}