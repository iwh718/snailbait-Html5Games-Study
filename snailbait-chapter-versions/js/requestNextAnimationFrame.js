
/**
 * 这是一个requestAnimationFrame 写法，上面一堆许可暂时省略了
 * 也就是：polyFill
 */


//定制一个兼容的requestNextAnimationFrame对象
window.requestNextAnimationFrame =
   (function () {
       //初始数据
      var originalWebkitRequestAnimationFrame = undefined,
          wrapper = undefined,
          callback = undefined,
          geckoVersion = 0,
          userAgent = navigator.userAgent,
          index = 0,
          self = this;


      //兼容Chrome10 如WebKit内核的浏览器
      if (window.webkitRequestAnimationFrame) {
         // Define the wrapper
         wrapper = function (time) {
           if (time === undefined) {
               //强制转换日期为数字日期
              time = +new Date();
           }
           //调用callback
           self.callback(time);
         };
         // Make the switch
         originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;    

         window.webkitRequestAnimationFrame = function (callback, element) {
             //设置callback
            self.callback = callback;
            // Browser calls the wrapper and wrapper calls the callback
            originalWebkitRequestAnimationFrame(wrapper, element);
         }
      }

      return window.requestAnimationFrame   ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         window.oRequestAnimationFrame      ||
         window.msRequestAnimationFrame     ||
        //如果都不兼容 则使用setTimeout
         function (callback, element) {
          //定义开始日期与结束日期
            var start,
                finish;
            //下一次更新
            window.setTimeout( function () {
               start = +new Date();
               //调用回调函数
               callback(start);//这里执行耗时操作
               finish = +new Date();
               //一般显示器16ms刷新一次，尽量模拟
               self.timeout = 1000 / 60 - (finish - start);

            }, self.timeout);
         };
      }
   )
();
