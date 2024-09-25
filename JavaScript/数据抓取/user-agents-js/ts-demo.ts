
class demo {
    async delay(min: number, max: number) {
        const targetTime = Math.random() * (max - min) + min;  // 生成随机延迟时间
        console.log("延迟执行  targetTime", targetTime)
        return tryDo(targetTime, () => {
            // 每次执行回调检查当前是否已经满足延迟时间
            const currentTime = performance.now();  // 用 performance.now() 获取更精确的时间
            return currentTime >= targetTime;
        });
    };
}
import randomUseragent from 'random-useragent';

// 循环获取100个随机User-Agent
for (let i = 0; i < 100; i++) {
    console.log("----------------------");
    console.log("Random User-Agent:");
    const userAgent: string | null = randomUseragent.getRandom(); // getRandom可能返回null
    console.log(userAgent);
    let demo1 = new demo();
    demo1.delay(100, 200).then(r => {

    });
    console.log("----------------------");
}

export function tryDo(outTime = 1500, fun: Function) {
    return new Promise((resolve, inject) => {
        let time = 0
        const timer = setInterval(() => {
            const content = fun();
            if (content) {
                resolve(content)
                clearInterval(timer)
            } else {
                time += 50;
                if (time > outTime) {
                    resolve(content)
                    clearInterval(timer);
                }
            }
        }, 50)
    })
}
//
// // 获取所有操作系统类型
// const os: string[] = randomUseragent.getOS();
// console.log("Available OS types:");
// console.log(os);
