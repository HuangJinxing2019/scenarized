// 获取浏览器窗口大小
function getViewportSize(){
    if(window.innerWidth){
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    } else {
      //   是否为怪异模式
      if(document.compatMode === 'BackCompat'){
          return {
              width: document.body.clientWidth,
              height: document.body.clientHeight
          }
      } else {
          return {
              width: document.documentElement.clientWidth,
              height: document.documentElement.clientHeight
          }
      }
    }
}

function canvasToImg(canvas){
    // 检查浏览器是否为 IE
    if(window.navigator.msSaveBlob){
        // 将canvas转为Blob对象
        const blob = canvas.msToBlob();
        // 使用msSaveBlob方法保存图像
        window.navigator.msSaveBlob(blob, 'canImg.png')
    } else {
        // 创建一个新的图像对象
        const img = new Image();
        img.src = canvas.toDataURL('image/png');
        // 创建一个链接
        const link = document.createElement('a');
        // 设置链接的href属性为图像数据的URL
        link.href = img.src;
        // 设置链接的下载属性，指定文件名
        link.download = 'canImg.png';
        // 将链接添加到文档中
        document.body.appendChild(link);
        // 模拟点击链接，开始现在图像
        link.click();
        // 移除链接元素
        document.body.removeChild(link);
    }


}
