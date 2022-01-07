import * as dotenv from 'dotenv';

export const get = async (request) => {
    dotenv.config();
    const uuid = request.url.searchParams.get('uuid');
    const client_id = process.env['GITKRAKEN_CLIENT_ID'];
    const url = `https://app.gitkraken.com/oauth/authorize?response_type=code&client_id=${client_id}&scope=board:read%20user:read&state=${uuid}`
    return {
        headers: { Location: url },
        status: 302
    }
}