import { StreamChat } from 'stream-chat';
import 'dotenv/config.js';

const apiStreamKey = process.env.STREAM_API_KEY;
const apiStreamSecret = process.env.STREAM_API_SECRET;

if (!apiStreamKey || !apiStreamSecret) {
    console.log('Missing Stream API key or secret');
}

const streamClient = StreamChat.getInstance(apiStreamKey, apiStreamSecret);


export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.log('Error creating user stream:', error);
    }
}