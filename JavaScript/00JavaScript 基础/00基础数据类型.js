let intNum = 666 // 十进制
console.log("%c 9 --> Line: 2||00基础数据类型.js\n intNum: ","color:#acf;", intNum);
console.log("%c 8 --> Line: 2||00基础数据类型.js\n intNum: ","color:#fca;", intNum);
console.log("%c 7 --> Line: 2||00基础数据类型.js\n intNum: ","color:#abc;", intNum);
console.log("%c 6 --> Line: 2||00基础数据类型.js\n intNum: ","color:#00f;", intNum);
console.log("%c 5 --> Line: 2||00基础数据类型.js\n u: ","color:#0ff;", intNum);
console.log("%c 4 --> Line: 2||00基础数据类型.js\n intNum: ","color:#f00;", intNum);
console.log("%c 3 --> Line: 2||00基础数据类型.js\n intNum: ","color:#ff0;", intNum);
console.log("%c 2 --> Line: 2||00基础数据类型.js\n intNum: ","color:#0f0;", intNum);
console.log("%c 1 --> Line: 2||00基础数据类型.js\n intNum: ","color:#f0f;", intNum);
let num_8 = 0o12 // 八进制
console.log("%c 8 --> Line: 4||00基础数据类型.js\n num_8: ","color:#fca;", num_8);
let num_16 = 0xA // 十六进制
console.log("%c 9 --> Line: 4||00基础数据类型.js\n num_16: ","color:#acf;", num_16);

// Undefined
let undefinedVar;
console.log("%c 1 --> Line: 7||00基础数据类型.js\n undefinedVar: ","color:#fca;", undefinedVar);

// 字符串：不可变的，一旦定义就不能修改
let firstName = "John";
console.log("%c 1 --> Line: 22||00基础数据类型.js\n firstName: ","color:#f0f;", firstName);
let lastName = "Doe";
console.log("%c 1 --> Line: 24||00基础数据类型.js\n lastName: ","color:#f0f;", lastName);
let name = `这是谁的名字`;
console.log("%c 3 --> Line: 26||00基础数据类型.js\n name: ","color:#ff0;", name);
// 字符串是不可变的，一旦创建，它们的值就不能变了
let lang = "Java";
lang = lang + "Script";// 拼接，先销毁再创建
let nullCar = null;
console.log("nullCar is => ",typeof nullCar)// typeOf 获取数据类型
// 布尔值, true or false
// String转换成布尔
let isLoading = "true"; // 字符串
console.log("%c 1 --> Line: 38||00基础数据类型.js\n isLoading: ","color:#fca;", isLoading);
isLoading = Boolean(isLoading);// 转换成布尔值
console.log("%c 2 --> Line: 40||00基础数据类型.js\n isLoading: ","color:#fca;", isLoading);
isLoading = '';
console.log("空字符串转boolean =>",Boolean(isLoading))
// Number转换成布尔
let num = 6;
console.log("%c 1 --> Line: 45||00基础数据类型.js\n num: ","color:#fca;", num);
num = Boolean(num);
console.log("%c 2 --> Line: 47||00基础数据类型.js\n num: ","color:#fca;", num);
num = Boolean(num = 0);
console.log("0转boolean =>",Boolean(num));

// Symbol：符号，是原始值，且符号实例是唯一、不可变的
let genericSymbol = Symbol();
let otherGenericSymbol = Symbol();
console.log(genericSymbol === otherGenericSymbol ? "相同":"不同");

let foo = Symbol("foo");
let otherFoo = Symbol("foo");
console.log(foo === otherFoo ? "相同":"不同");
