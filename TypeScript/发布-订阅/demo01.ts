class EventBus {
    private listeners: { [key: string]: Function[] } = {};

    // 订阅事件
    public subscribe(event: string, callback: Function): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    // 发布事件
    public publish(event: string, data?: any): void {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }

    // 取消订阅
    public unsubscribe(event: string, callback: Function): void {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(listener => listener !== callback);
        }
    }
}

// 使用示例
const bus = new EventBus();

const onUserAdded = (user: any) => {
    console.log(`User added: ${user.name}`);
};

bus.subscribe('userAdded', onUserAdded);
bus.publish('userAdded', { name: 'Alice' }); // 输出: User added: Alice
