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
