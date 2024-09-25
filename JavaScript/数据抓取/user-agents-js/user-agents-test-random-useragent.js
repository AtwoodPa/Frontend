const randomUseragent = require('random-useragent');

// // 获取一个随机的User-Agent
// const userAgent1 = randomUseragent.getRandom();
// console.log(userAgent1);
//
//
// const userAgent2 = randomUseragent.getRandom();
// console.log(userAgent2);

// 循环获取10个随机User-Agent
for (let i = 0; i < 100; i++) {
    console.log("----------------------");
    console.log("Random User-Agent:");
    console.log(randomUseragent.getRandom());
    console.log("----------------------");
}
//

//
// // 获取所有操作系统类型
// const os = randomUseragent.getOS();
