let { href } = window.location;
var usePgySend = href.indexOf('pgy.xiaohongshu.com') > -1;
var XHR = XMLHttpRequest.prototype;
var open = XHR.open;
var setRequestHeader = XHR.setRequestHeader;
var rewrited = false;
function rewriteSend(send) {
    if (!rewrited) {
        rewrited = true;
        console.log('rewriteSend', send)
        XHR.send = function (postData) {
            this.addEventListener('load', function () {
                var myUrl = this._url ? this._url.toLowerCase() : this._url;
                if (myUrl) {
                    // here you get the RESPONSE HEADERS
                    var responseHeaders = this.getAllResponseHeaders();
                    // console.log('responseHeaders', responseHeaders, postData)
                    if (['', 'text'].includes(this.responseType) && this.responseText) {
                        // responseText is string or null
                        try {
                            window.postMessage({ "ajax_rewrite": JSON.stringify({ url: this._url, postData, requestHeaders: this._requestHeaders, responseHeaders, responseText: this.responseText }) }, '*');//userik就从GLOBALS中取得
                        } catch (err) {
                            console.log(err, "Error in responseType try catch");
                        }
                    }
                }
            });
            return send.apply(this, arguments);
        };
    }
}
if (usePgySend) {

} else {
    rewriteSend(XHR.send)
}

XHR.open = function (method, url) {
    this._method = method;
    this._url = url;
    this._requestHeaders = {};
    this._startTime = (new Date()).toISOString();
    if (usePgySend) {
        rewriteSend(XHR.send)
    }
    return open.apply(this, arguments);
};

XHR.setRequestHeader = function (header, value) {
    this._requestHeaders[header] = value;
    return setRequestHeader.apply(this, arguments);
};


console.log('ajax-rewrite done')