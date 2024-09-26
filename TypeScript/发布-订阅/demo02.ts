// 实例化事件总线
const bus = new EventBus();

// 主线程发布事件的代码 (已实现)
const collectOtherData = async (capability: any) => {
    vm.resourceXt.push(capability);

    const publishMediaIdAnduid = {
        url: "publishMediaIdAnduid",
        data: {
            mediaId: capability.mediaId,
            bloggerId: capability.uid,
            ...capability.cepAndCpmMap,
            ...capability.authorContent
        }
    };

    // 发布事件
    bus.publish("dataProcessed", publishMediaIdAnduid);
    console.log("done publish", publishMediaIdAnduid);
};

// 次线程订阅事件并处理
const secondaryThread = () => {
    const handleDataFromMainThread = (data: any) => {
        console.log("Secondary thread received data:", data);

        // 假设次线程要对收到的数据进行处理
        // 然后同步处理结果或执行额外逻辑
    };

    // 次线程订阅主线程发布的 "dataProcessed" 事件
    bus.subscribe("dataProcessed", handleDataFromMainThread);
};

// 启动次线程
secondaryThread();

// 模拟主线程处理并发布事件
const capabilityData = {
    mediaId: '12345',
    uid: 'user1',
    cepAndCpmMap: { key: 'value' },
    authorContent: { text: 'Sample content' }
};

collectOtherData(capabilityData);
