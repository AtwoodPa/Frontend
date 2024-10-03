// 打印调试信息
console.debug('this is debug')
// 打印信息
console.log('this is log')
// 打印警告信息
console.warn('this is warn')
// 打印错误信息
console.error('this is error')
// ${}
let name = 'zhangsan'
console.log(`zhangsan name is ${name}`)
let name2 = 'panpan'
let age = 18
console.log("name: %s, age: %d", name2, age)
// 打印对象
let obj = {
    name: 'zhangsan',
    age: 18,
}
console.log("obj: %o", obj)// %o 美化输出
console.log("obj: %O", obj)// %O 原始输出

// 打印数组
let arr = [1, 2, 3]
console.table(arr)

