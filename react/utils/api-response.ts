function handleResponse(response: any) {
    return response.text().then((text: any) => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}
function handleErrors(response: any) {
    let message= response.messages ? response.messages.join("<br>") : "";
    if (response.status !== "ok") return Promise.reject(message);
    return response;
}
export { handleResponse , handleErrors }