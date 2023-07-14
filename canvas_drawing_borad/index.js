;(function (dom){
    // 获取canvas元素
    const oCan = dom.getElementById('myCanvas'),
    // 获取canvas上下文实例
        ctx = oCan.getContext('2d');

    const oColor = dom.getElementById('J_color'),
        oLineWidth = dom.getElementById('J_line_width'),
        oEraser = dom.getElementById('J_eraser'),
        oEraserSize = dom.getElementById('J_eraser_size'),
        oReset = dom.getElementById('J_reset'),
        oLastStep = dom.getElementById('J_last_step'),
        oNextStep = dom.getElementById('J_next_step'),
        oSaveBtn = dom.getElementById('J_save_btn'),
        oEraserBlock = dom.getElementById('J_eraser_block');

    // 获取浏览器窗口大小
    const { width, height } = getViewportSize();

    // canvas默认参数
    const CANVAS_DEFAULT = {
        LINE_WIDTH: 1, // 线条宽度
        LINE_STYLE: 'round', // 线头椭圆形
        COLOR: '#000000', // 画笔颜色
        ERASER_COLOR: '#FFFFFF',
    }

    const state = {
        initPos: [],
        eraserStatus: false,
        lineWidth: null,
        color: null,
        eraserWidth: 5,
        drawData: [],  // {moveTo: [x, y], lineTo: [x, y], color: xxx, width: xxx}
        revokedData: [], // {moveTo: [x, y], lineTo: [x, y]}
    }

    function init(){
        //设置画板大小
        oCan.width = width;
        oCan.height = height;
        // 设置线头样式、相交样式
        ctx.setLineStyle(CANVAS_DEFAULT.LINE_STYLE);
        ctx.setLineWidth(CANVAS_DEFAULT.LINE_WIDTH);
        ctx.setColor(CANVAS_DEFAULT.COLOR);
        // 设置画笔的线条宽度颜色
        bindEvent();
    }

    function bindEvent(){
        oCan.addEventListener('mousedown', handleMouseDown, false);
        oColor.addEventListener('click', handleColorInput, false);
        oColor.addEventListener('input', handleColorInput, false);
        oLineWidth.addEventListener('input', handleWidthInput, false);
        oEraser.addEventListener('click', handleEraserBtn, false);
        oEraserSize.addEventListener('input', handleEraserSize, false);
        oReset.addEventListener('click', handleReset, false);
        oLastStep.addEventListener('click', handleLastStep, false);
        oNextStep.addEventListener('click', handleNextStep, false);
        oSaveBtn.addEventListener('click', handleSaveImg, false);
    }

    // 保存图片
    function handleSaveImg(){
        canvasToImg(oCan)
    }

    // 点击颜色改变事件
    function handleColorInput(){
        state.eraserStatus = false;
        state.color = this.value;
        ctx.setColor(this.value);
        ctx.setLineWidth(state.lineWidth);
        oEraser.className = 'btn'
    }

    function handleWidthInput(){
        state.lineWidth = this.value
        !state.eraserStatus && ctx.setLineWidth(this.value)
    }

    function handleEraserBtn(){
        state.eraserStatus = !state.eraserStatus
        if(state.eraserStatus){
            this.className += ' btnActive';
            ctx.setColor(CANVAS_DEFAULT.ERASER_COLOR);
            ctx.setLineWidth(state.eraserWidth);
        } else {
            this.className = 'btn';
            ctx.setLineWidth(state.lineWidth);
            ctx.setColor(state.color || CANVAS_DEFAULT.COLOR);
        }
    }
    function setEraserBlockProps(x, y){
        const width = ctx.getLineWidth();
        oEraserBlock.style.width = width + "px";
        oEraserBlock.style.height = width + 'px';
        oEraserBlock.style.top = y - width / 2 + 'px'
        oEraserBlock.style.left = x - width / 2 + 'px'
        oEraserBlock.style.display = 'block'
    }

    function handleEraserSize(){
        state.eraserWidth = this.value;
        state.eraserStatus && ctx.setLineWidth(this.value)
    }

    function handleReset(){
        state.drawData = [];
        state.revokedData = [];
        ctx.clearRect(0, 0, width, height);
    }

    function handleLastStep(){
        if(state.drawData.length > 0){
            state.revokedData.push(state.drawData.pop())
            redraw()
        }
    }

    function handleNextStep(){
        if (state.revokedData.length > 0){
            state.drawData.push(state.revokedData.pop())
            redraw();
        }
    }

    function redraw(){
        ctx.clearRect(0, 0, width, height);
        state.drawData.map(move => {
            ctx.setLineWidth(move.width);
            ctx.setColor(move.color);
            drawPoint(move.moveTo[0], move.moveTo[1]);
            move.lineTo.map((line, index) => {
                let x1 = index ? move.lineTo[index - 1][0] : move.moveTo[0],
                    y1 = index ? move.lineTo[index - 1][1] : move.moveTo[1];
                drawLine(x1, y1, line[0], line[1]);
            })
        })
    }

    function handleMouseDown(e) {
        const ev = e || width.event;
        oCan.addEventListener('mousemove', handleMousemove, false)
        oCan.addEventListener('mouseup', handleMouseup, false)
        oEraserBlock.addEventListener('mouseup', handleEraserBlockMouseup, false)
        state.initPos = [e.clientX, e.clientY];
        drawPoint(state.initPos[0], state.initPos[1]);
        // 记录开始画的动作
        state.drawData.push({ moveTo: state.initPos, lineTo: [], color: ctx.getColor(), width: ctx.getLineWidth() })
        state.eraserStatus && setEraserBlockProps(state.initPos[0], state.initPos[1])
    }

    // 鼠标按下圆画一个点
    function drawPoint(x, y){
        ctx.beginPath();
        let r = ctx.getLineWidth() / 2; // 圆的半径，是线条宽度的一半
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        // 填充
        ctx.fill();
    }

    function handleMousemove(e) {
        const ev = e || width.event;
        // 画线
        drawLine(state.initPos[0], state.initPos[1], ev.clientX, ev.clientY)
        state.initPos = [e.clientX, e.clientY];
        // 记录移动动作
        state.drawData[state.drawData.length - 1].lineTo.push(state.initPos)
        state.eraserStatus && setEraserBlockProps(ev.clientX, ev.clientY)
    }

    function drawLine(x1, y1, x2, y2){
        // 需重新开启绘画路径，开始坐标和移动坐标坐标
        // 不能在上一个动作中直接定义lingTo(x, y)直接画，样会出现锯齿的样式
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke()
    }

    ctx.getColor = function (){
        return this.fillStyle
    }

    ctx.getLineWidth = function (){
        return this.lineWidth
    }

    ctx.setLineStyle = function (style){
        this.lineCap = style;
        this.lineJoin = style
    }
    ctx.setColor = function (color){
        this.fillStyle = color;
        this.strokeStyle = color;
    }
    ctx.setLineWidth = function (width){
        this.lineWidth = width;
    }

    function handleMouseup(e) {
        oCan.removeEventListener('mousemove', handleMousemove, false)
        oCan.removeEventListener('mouseup', handleMouseup, false)
    }
    function handleEraserBlockMouseup(){
        oEraserBlock.style.display = 'none';
        handleMouseup();
    }
    init()
})(document)
