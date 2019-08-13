var canvas = document.getElementById('game-canvas'),
    context = canvas.getContext('2d'),
    //创建FPS节点
    fpsElement = document.getElementById('fps'),
   // Constants.........................................................

   LEFT = 1,
   RIGHT = 2,
   //背景速率
   BACKGROUND_VELOCITY = 25,
   PLATFORM_HEIGHT = 8,  
   PLATFORM_STROKE_WIDTH = 2,
   PLATFORM_STROKE_STYLE = 'rgb(0,0,0)',
   RUNNER_LEFT = 50,
   STARTING_RUNNER_TRACK = 1,

   // Track baselines...................................................

   TRACK_1_BASELINE = 323,
   TRACK_2_BASELINE = 223,
   TRACK_3_BASELINE = 123,
   
   // Platform scrolling offset (and therefore speed) is
   // PLATFORM_VELOCITY_MULTIPLIER * backgroundOffset: The
   // platforms move PLATFORM_VELOCITY_MULTIPLIER times as
   // fast as the background.
    //平台线速率4.35
   PLATFORM_VELOCITY_MULTIPLIER = 4.35,
   //开始背景速率0
   STARTING_BACKGROUND_VELOCITY =0,
   //开始平台偏移0
   STARTING_PLATFORM_OFFSET = 0,
    //开始背景偏移0
   STARTING_BACKGROUND_OFFSET = 0,

   // Images............................................................
   
   background  = new Image(),
   runnerImage = new Image(),

   // Time..............................................................
    //上次动画帧时间
   lastAnimationFrameTime = 0,
    //上次FPS更新时间
   lastFpsUpdateTime = 0,
    //默认FPS
   fps = 60,

   // Fps indicator.....................................................
   //获取FPS节点
   fpsElement = document.getElementById('fps'),


   // Runner track......................................................
   //当前所在平台线 设置为初始的第一个
   runnerTrack = STARTING_RUNNER_TRACK,
   
   // Translation offsets...............................................
   //当前背景偏移设置初始化
   backgroundOffset = STARTING_BACKGROUND_OFFSET,
    //当前平台偏移设置初始化
   platformOffset = STARTING_PLATFORM_OFFSET,

   // Velocities........................................................
   //当前背景速率设置初始化
   bgVelocity = STARTING_BACKGROUND_VELOCITY,
    //当前平台速率
   platformVelocity,

   // Platforms.........................................................
   //平台数据
   platformData = [
      // Screen 1.......................................................
      {
         left:      10,
         width:     230,
         height:    PLATFORM_HEIGHT,
         fillStyle: 'rgb(150,190,255)',
         opacity:   1.0,
         track:     1,
         pulsate:   false,
      },

      {  left:      250,
         width:     100,
         height:    PLATFORM_HEIGHT,
         fillStyle: 'rgb(150,190,255)',
         opacity:   1.0,
         track:     2,
         pulsate:   false,
      },

      {  left:      400,
         width:     125,
         height:    PLATFORM_HEIGHT,
         fillStyle: 'rgb(250,0,0)',
         opacity:   1.0,
         track:     3,
         pulsate:   false
      },

      {  left:      633,
         width:     100,
         height:    PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     1,
         pulsate:   false,
      },

      // Screen 2.......................................................
               
      {  left:      810,
         width:     100,
         height:    PLATFORM_HEIGHT,
         fillStyle: 'rgb(200,200,0)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1025,
         width:     100,
         height:    PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1200,
         width:     125,
         height:    PLATFORM_HEIGHT,
         fillStyle: 'aqua',
         opacity:   1.0,
         track:     3,
         pulsate:   false
      },

      {  left:      1400,
         width:     180,
         height:    PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     1,
         pulsate:   false,
      },

      // Screen 3.......................................................
               
      {  left:      1625,
         width:     100,
         height:    PLATFORM_HEIGHT,
         fillStyle: 'rgb(200,200,0)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1800,
         width:     250,
         height:    PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     1,
         pulsate:   false
      },

      {  left:      2000,
         width:     100,
         height:    PLATFORM_HEIGHT,
         fillStyle: 'rgb(200,200,80)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      2100,
         width:     100,
         height:    PLATFORM_HEIGHT,
         fillStyle: 'aqua',
         opacity:   1.0,
         track:     3,
      },


      // Screen 4.......................................................

      {  left:      2269,
         width:     200,
         height:    PLATFORM_HEIGHT,
         fillStyle: 'gold',
         opacity:   1.0,
         track:     1,
      },

      {  left:      2500,
         width:     200,
         height:    PLATFORM_HEIGHT,
         fillStyle: '#2b950a',
         opacity:   1.0,
         track:     2,
         snail:     true
      },
   ];

// 绘制游戏场景内容
function draw(now) {
   //设置初始化的速率
   setPlatformVelocity();
   //设置初始化偏移
   setOffsets(now);
   //绘制背景
   drawBackground();
   //绘制小人
  drawRunner();
  //绘制平台线
  drawPlatforms();
}
//速率设置函数
function setPlatformVelocity() {
   platformVelocity = bgVelocity * PLATFORM_VELOCITY_MULTIPLIER; 
}
//偏移设置函数
function setOffsets(now) {
   setBackgroundOffset(now);
   setPlatformOffset(now);
}
//背景偏移函数
function setBackgroundOffset(now) {
   backgroundOffset +=
      bgVelocity * (now - lastAnimationFrameTime) / 1000;

   if (backgroundOffset < 0 || backgroundOffset > background.width) {
      backgroundOffset = 0;
   }
}
//平台偏移函数
function setPlatformOffset(now) {
   platformOffset += 
      platformVelocity * (now - lastAnimationFrameTime) / 1000;

   if (platformOffset > 2*background.width) {
      turnLeft();
   }
   else if (platformOffset < 0) {
      turnRight();
   }
}
//绘制背景
function drawBackground() {
   context.translate(-backgroundOffset, 0);

   // Initially onscreen:
   context.drawImage(background, 0, 0);

   // Initially offscreen:
   context.drawImage(background, background.width, 0);

   context.translate(backgroundOffset, 0);
}
//绘制小人
function drawRunner() {
   context.drawImage(runnerImage,
                     RUNNER_LEFT,
                     calculatePlatformTop(runnerTrack) - runnerImage.height);
}
//绘制平台
function drawPlatform(data) {
   var platformTop = calculatePlatformTop(data.track);

   context.lineWidth = PLATFORM_STROKE_WIDTH;
   context.strokeStyle = PLATFORM_STROKE_STYLE;
   context.fillStyle = data.fillStyle;
   context.globalAlpha = data.opacity;
   context.strokeRect(data.left, platformTop, data.width, data.height);
   context.fillRect  (data.left, platformTop, data.width, data.height);
}
//绘制全部平台线
function drawPlatforms() {
   var index;

   context.translate(-platformOffset, 0);

   for (index = 0; index < platformData.length; ++index) {
      drawPlatform(platformData[index]);
   }

   context.translate(platformOffset, 0);
}
//计算FPS
function calculateFps(now) {
   var fps = 1 / (now - lastAnimationFrameTime) * 1000;
   //正常 帧计算方式为 一帧除以前一帧与当前帧之间的时间间隔 单位s
    //每隔一秒刷新一次FPS显示
   if (now - lastFpsUpdateTime > 1000) {
      lastFpsUpdateTime = now;
      //四舍五入去除小数
      fpsElement.innerHTML = fps.toFixed(0) + ' fps';
   }
   return fps; 
}
//计算平台线距离顶部距离
function calculatePlatformTop(track) {
   if      (track === 1) { return TRACK_1_BASELINE; } // 323 pixels
   else if (track === 2) { return TRACK_2_BASELINE; } // 223 pixels
   else if (track === 3) { return TRACK_3_BASELINE; } // 123 pixels
}
//设置向左移动速率
function turnLeft() {
   bgVelocity = -BACKGROUND_VELOCITY;
}
//设置向右移动速率
function turnRight() {
   bgVelocity = BACKGROUND_VELOCITY;
}
   
// Animation............................................................
//动画帧回调函数
function animate(now) {
   //更新FPS
   fps = calculateFps(now);
   //更新页面
   draw(now);
   //上一次动画帧时间
   lastAnimationFrameTime = now;
   //递归调用
   requestNextAnimationFrame(animate);
}

// ------------------------- INITIALIZATION ----------------------------
//初始化图片 开始游戏
function initializeImages() {
   background.src = 'images/background.png';
   runnerImage.src = 'images/runner.png';

   background.onload = function (e) {
      startGame();
   };
}
//开始游戏
function startGame() {
   //开始执行动画操作
   window.requestNextAnimationFrame(animate);
}

// Launch game.........................................................
//开始初始化游戏
initializeImages();
//设置平移方向 默认
setTimeout( function (e) {
   turnRight();
}, 1000);
context.draw
/**
 * 运行逻辑小结
 * time 19/08/04
 */
/**首先初始化全局量：
 * 从initializeImages()函数开始运行，依次加载背景与小人图片节点，背景加载完成后开始游戏逻辑。
 * 进入startGame()函数 调用RAF方法来通知浏览器即将执行动画操作，加入动画回调 animate()函数引用,animate有一个时间参数是由RAF提供的
 * 进入animate()函数 更新FPS 绘制页面 设置上一次的时间戳 递归调用RAF函数
 * 进入draw()函数 设置平台速率 设置偏移（背景 平台） 绘制背景 绘制小人 绘制平台
 */


