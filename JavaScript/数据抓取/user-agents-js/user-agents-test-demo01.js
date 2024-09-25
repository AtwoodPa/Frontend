const UserAgent = require('user-agents');
const userAgent1 = new UserAgent();
console.log("=======User Agent========")
console.log(userAgent1.toString());
console.log(userAgent1.toString());
console.log(userAgent1.toString());

// 自定义生成规则
console.log("=======自定义生成规则========")
const userAgent = new UserAgent({ deviceCategory: 'desktop', platform: 'Win32' });
console.log(userAgent.toString());
