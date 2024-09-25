/**
 * 发送消息到后台脚本，并返回一个Promise以等待后台脚本的响应。
 * @param {Object} params - 要发送到后台脚本的参数对象，默认为空对象。
 * @returns {Promise<any>} - 返回一个Promise，该Promise在接收到后台脚本的响应时解析。
 */
export function content2Background(params = {}) {
    return new Promise(function (resolve) {
        // 在控制台中打印发送的参数，以便调试
        console.log('content2Background', params);

        // 使用chrome.runtime.sendMessage发送消息到后台脚本
        // 第一个参数是要发送的消息（在这里是params）
        // 第二个参数是一个回调函数，当收到后台脚本的响应时会被调用
        chrome.runtime.sendMessage(
            params,
            function (data) {
                // 在控制台中打印从后台脚本接收到的数据
                console.log("content2Background receive background ", data);

                // 解析Promise，将接收到的数据作为结果
                resolve(data);
            }
        );
    });
}

/**
 * 向params对象添加一个_from属性，用于标识消息的来源。
 * @param {any} params - 要添加_from属性的参数对象。
 * @param {string} from - 表示消息来源的字符串。
 * @returns {any} - 返回修改后的params对象。
 */
export function patchFrom(params: any, from: string) {
    // 在params对象上添加一个_from属性，其值为'gaoqu extension '加上from参数的值
    params._from = 'gaoqu extension ' + from;

    // 返回修改后的params对象
    return params;
}