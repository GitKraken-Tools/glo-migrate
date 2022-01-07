export const post = async (request) => {
    console.log(request.body);
    return {
        body: request.body
    }
}