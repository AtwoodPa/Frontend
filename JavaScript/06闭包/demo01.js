let str = 'outer str'
function func(){
    // 函数内部可以获取到外部的全局对象str
    let str2 = str
    console.log(str2)
}
func()
// 在函数外部无法访问函数内的局部变量
// console.log(str2)//  str2 is not defined

// JavaScript中的闭包可以让函数度渠道其他函数内部的变量
function func2(){
    let str = 'func2 str'
    return function(){
        let str2 = str + " inner str"
        console.log(str2)
    }
}
func2()()// func2 str inner str

