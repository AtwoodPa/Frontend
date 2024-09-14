export function content2Background(params = {}) {
    return new Promise(function (resolve) {
        console.log('content2Background', params);
        chrome.runtime.sendMessage(
            params,
            function (data) {
                console.log("content2Background receive background ", data);
                resolve(data);
            }
        );
    });
}
export function patchFrom(params: any, from: string) {
    params._from = 'gaoqu extension ' + from;
    return params;
}