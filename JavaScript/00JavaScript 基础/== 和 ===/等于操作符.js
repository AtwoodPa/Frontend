// 等于操作符用两个等于号（==）表示，如果操作数相等，则返回true，否则返回false。
// 等于操作符（==）在比较中会先进行类型转换，再确定操作数是否相等。
// 1、如果任一操作数是布尔值，则先将其转换为数字再比较。
let result1 = (false == 1); // true
console.log("%c 9 --> Line: 5||等于操作符.js\n result1: ","color:#acf;", result1);
// 2、如果一个操作数是字符串，另一个操作数是数值，则尝试将字符串转换为数值再比较。
let result2 = ("66" == 66); // true
console.log("%c 8 --> Line: 8||等于操作符.js\n result2: ","color:#fca;", result2);
// 3、如果一个操作数是对象，另一个操作数不是，则调用对象的valueOf()方法，用得到的基本类型值再比较。
let obj = {valueOf: function() {return  2} };
// console.log(obj.valueOf());
let result3 = (obj == 2); // true
console.log("%c 7 --> Line: 13||等于操作符.js\n result3: ","color:#acf;", result3);
// 4、null和undefined是相等的。
let result4 = (null == undefined);
console.log("%c 6 --> Line: 16||等于操作符.js\n result4: ","color:#00f;", result4);
// 5、如果一个操作数是NaN，则相等运算符返回false。
let result5 = (NaN == NaN);
console.log("%c 5 --> Line: 19||等于操作符.js\n result5: ","color:#0ff;", result5);
// 6、如果两个操作数都是对象，则比较它们是不是同一个对象。
let obj1 = {name: "obj"};
let obj2 = {name: "obj"};
let obj3 = obj1;
let result6 = (obj1 == obj2);// false
let result7 = (obj1 == obj3);// true
console.log("%c 4 --> Line: 24||等于操作符.js\n result6: ","color:#f00;", result6);
console.log("%c 3 --> Line: 26||等于操作符.js\n result7: ","color:#ff0;", result7);

