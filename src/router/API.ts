export const APIRequest = async (url: string, method: string, data?: any) => {
    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    if (data) options.body = JSON.stringify(data);
    const response = await fetch(url, options);
    if (!response.ok) {
        console.log('API Request failed:', response);
        throw new Error('Network response was not ok');
    }
    return response.json();
};
