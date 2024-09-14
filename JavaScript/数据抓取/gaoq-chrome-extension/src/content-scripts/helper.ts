export function appMousedown(e: any) {
    const odiv: any = document.querySelector("#crx-app");
    //算出鼠标相对元素的位置
    let disX = e.clientX - odiv.offsetLeft;
    let disY = e.clientY - odiv.offsetTop;
    function mousemove(e: any) {
        //鼠标按下并移动的事件
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        //移动当前元素
        odiv.style.left = left + "px";
        odiv.style.top = top + "px";
    }
    function mouseup(e: any) {
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
    }
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
}

export function makeSureLoad(fn: Function) {
    let count = 1;
    window.addEventListener('load', function () {
        if (count < 2) {
            clearTimeout(it);
            console.log('init from load count', count)
            count++;
            fn();
        }
    })
    let it = setTimeout(function () {
        console.log('init from setTimout count', count)
        count++;
        fn();
    }, 2000)
}
