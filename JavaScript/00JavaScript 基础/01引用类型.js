// 复杂类型统称为Object：Object、Array、Function
// Object：对象
let person = {
    name: "John",
    email: "john@gmail.com",
    age: 30
}
// 输出对象 1、美化输出 2、对象输出 需要在浏览器中执行才能看到效果
console.log("person: %o", person)
console.log("person: %O", person)
// Array：数组，js数组是一组有序的数据，可以存储任何类型的数据
let colors = ["red", 2, {num: 999}]
colors.push("green")
Object.keys(colors).forEach(function (index) {
    console.log(colors[index]);
})
console.log("----------------------------------")
colors.pop()
Object.keys(colors).forEach(function (index) {
    console.log(colors[index]);
})
console.log("----------------------------------")
console.table(colors)
// Function：函数
// 1、函数声明
console.log("----------------函数声明------------------")
function tryDoSum(num1, num2) {
    return num1 + num2;
}
console.log(tryDoSum(10, 20));
console.log("----------------函数表达式-----------------")
// 2、函数表达式
let sum = function (num1, num2) {
    return num1 + num2;
}
console.log("函数表达式 => ",sum(10, 20));
// 3、箭头函数
console.log("----------------箭头函数------------------")
let sum2 = (num1, num2) => {
    return num1 + num2;
}
console.log("箭头函数 => ",sum2(10, 20));
// 4、匿名函数


