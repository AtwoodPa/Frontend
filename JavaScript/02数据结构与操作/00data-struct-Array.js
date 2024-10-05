// 数组是最最基本的数据结构，数组是使用一块连续的内存空间保存数据，保存的数据的个数载分配内存的时候就是确定的
let arr = [1, 2, 3, 4, 5, 6];
console.table(arr)
// 数据常见操作
// 1.获取数组的长度
console.log(arr.length) // 6
// 2.添加数据
arr.push(7)
// 3.删除数据
delete arr[2];
console.log(arr) // [1, 2, empty, 4, 5]
// 4.修改数据
