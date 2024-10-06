// 两个参数列表
function operator(a, b) {
    return a + b;
}

console.log(operator(1, 2));

// 多参数列表
function multiOperator(...args) {
    let result = 0;
    for (const arg of args) {
        result += arg;
    }
    return result;
}

console.log(multiOperator(1, 2, 3));
function operators1() {
    let sum = 0;
    // 这里i不可以用const，const不能在声明后被重新赋值
    for(let i = 0, max = arguments.length; i < max; i++) {
        sum += arguments[i];
    }
    return sum;
}
console.log(operators1(1,2,3));
console.log(operators1(4,5,6));

// 升级版本
function operators2() {
    if (arguments.length === 2) {
        return arguments[0] + arguments[1];
    } else {
        let sum = 0;
        for (const arg of arguments) {
            sum += arg;
        }
        return sum;
    }
}

console.log(operators2(1, 2))
console.log(operators2(1, 2, 3))
console.log(operators2(1, 2, 3, 4))
// arguments对象 是一个类数组对象
function operators3() {
    // 使用数组的slice()函数可以把arguments对象转换为真正的数组对象
    const argument = Array.prototype.slice.call(arguments);
    for (const item of argument){
        console.log(item);
    }
    argument.push(10);
    console.log(argument);
}
operators3(1, 2)
