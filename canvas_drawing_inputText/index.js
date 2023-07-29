;((dom) => {
    const oCan = dom.getElementById('can'),
        ctx = oCan.getContext('2d'),
        documentElement = dom.documentElement;

    oCan.width = documentElement.clientWidth;
    oCan.height = documentElement.clientHeight;

    let arrText = [], // 每一行的字符集合 [[1,2,4]]
        arrWidth = [], // 每一行的宽度集合 [234,567]
        index = 0; // 当前行数
    init();
    function init(){
        drawInput(200, 200, 400, 50)
        dom.addEventListener('keydown',handleKeydown, false)
    }

    function handleKeydown(e){
        const key = e.key
        switch (key){
            case 'CapsLock':
            case 'Alt':
            case 'Control':
            case 'Mate':
            case 'Tab':
            case 'Shift':
                break;
            case 'Backspace':
                removeKeys()
                break;
            case 'Enter':
                index ++
                break;
            default:
                addChar(key)
                break;
        }
    }

    function drawInput(x, y, w, h){
        ctx.strokeRect(x, y, w, h)
    }

    function addChar (key){
        const keyWidth = ctx.measureText(key).width;
        if(arrText[index]){
            arrText[index].push(key)
            arrWidth[index] += keyWidth
        } else {
            arrText[index] = [key];
            arrWidth[index] = keyWidth;
        }
        if(arrWidth[index] >= 360){
            index ++
        }
        drawText()
    }

    function drawText(){
        ctx.clearRect(0, 0, oCan.width, oCan.height)
        drawInput(200, 200, 400, 50 + 30 * index)
        arrText.forEach((keys, index) => {
            ctx.font = '30px 微软雅黑'
            ctx.textBaseline = 'top'
            ctx.fillText(keys.join(''), 210, 210 + 30 * index)
        })
    }

    function removeKeys(){

     if(arrText[index]){
         const key = arrText[index].pop(),
            keyWidth = ctx.measureText(key).width;
         arrWidth[index] -= keyWidth;
         if(arrWidth[index] <= 0 && index > 0){
             index --;
         }
         drawText()
     }
    }


})(document)