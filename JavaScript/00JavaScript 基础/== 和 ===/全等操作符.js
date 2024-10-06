// 全等操作符由3个等于好（===）表示，只有两个操作数在不转换的前提下相等才返回true，否则返回false
// 即类型相同，值也相同
let result1 = ("66" === 66)// false, 类型不同
let result2 = (66 === 66)// true，类型相同，值相同
// 空对象和undefined，null都是全等
let result3 = (null === null) //true
let result4 = (undefined === undefined) //true
let result5 = (null === undefined)
console.log("%c 9 --> Line: 9||全等操作符.js\n result5: ","color:#acf;", result5);
let result6 = (null == undefined)
console.log("%c 8 --> Line: 11||全等操作符.js\n result6: ","color:#fca;", result6);
