/**
 * 通过鼠标按下移动绘制一个矩形。
 * 实现步骤,
 * 1. 监听画布鼠标按下动作。
 * 2. 当鼠标按下时，记录鼠标按下的位置，同时添加鼠标移动和鼠标抬起事件
 * 3. 鼠标按下移动，移动事件触发，根据移动的坐标与鼠标按下时记录的坐标计算矩形的宽度和高度。
 * 4. 等出矩形的宽高后，先清清空画布，重新绘制之前完成绘制的矩形，最后才绘制鼠标移动的矩形
 * 5. 鼠标抬起时，变成矩形绘制完成，将绘制这个矩形的数据记录起来。移除鼠标移动、抬起事件。
 */
;((dom)=>{
    const oCan = dom.getElementById('can'),
            ctx = oCan.getContext('2d');
    // 设置画板大小
    const documentElement = dom.documentElement;
    oCan.width = documentElement.clientWidth;
    oCan.height = documentElement.clientHeight;

    let coord = [], //记录鼠标移动的开始坐标
        rectangles = []; //记录绘制的每个矩形 [[x, y, w, h]]

    init()
    function init(){
        bindEvent()
    }

    function bindEvent(){
        oCan.addEventListener('mousedown', handleMousedown, false);
    }

    function handleMousedown(e){
        oCan.addEventListener('mouseup', handleMouseup, false)
        oCan.addEventListener('mousemove', handleMousemove, false)
        coord = [e.clientX, e.clientY]
    }

    // 鼠标移动时绘制矩形
    function handleMousemove(e){
        // 获取绘画的矩形参数，x, y，w, h
        const [ x, y, w, h ] = getDrawRectParams(e)

        // 绘画前清除之前移动绘制的矩形
        clareRect(0, 0, oCan.width, oCan.height)
        // 恢复之前已绘制的矩形
        strokeRects();
        // 开始话描边矩形
        strokeRect(x, y, w, h)
    }

    // 鼠标松开时收集绘画的矩形数据 rectangles
    function handleMouseup(e){
        oCan.removeEventListener('mouseup', handleMouseup, false)
        oCan.removeEventListener('mousemove', handleMousemove, false)
        // 获取绘画的矩形参数，x, y，w, h
        const params = getDrawRectParams(e)
        rectangles.push(params)
    }
    // 获取绘画的矩形参数，x, y，w, h
    function getDrawRectParams(e){
        let [x, y] = coord,
            w = Math.abs(e.clientX - x),
            h = Math.abs(e.clientY - y);
        return [x, y, w, h]
    }

    // 绘制描边矩形
    function strokeRect(x, y, w, h){
        ctx.strokeRect(x, y, w, h)
    }

    function strokeRects(){
        rectangles.forEach(item => strokeRect(...item))
    }

    // 清除区域画布
    function clareRect(x, y, w, h){
        ctx.clearRect(x, y, w, h)
    }

})(document)
