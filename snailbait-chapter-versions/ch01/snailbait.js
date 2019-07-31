//获取画布对象与上下文
var canvas = document.getElementById('game-canvas'),
    context = canvas.getContext('2d'),

// Constants............................................................
    //舞台中线的厚度
    PLATFORM_HEIGHT = 8,
    //线的边框宽度
    PLATFORM_STROKE_WIDTH = 2,
    //线的边框颜色
    PLATFORM_STROKE_STYLE = 'rgb(0,0,0)',  // black
    //小人初始的时候左侧距离
    RUNNER_LEFT = 50,
    //初始化小人在的线条
    STARTING_RUNNER_TRACK = 1,

// Track baselines...................................................
    //线1的基础定位
    TRACK_1_BASELINE = 200,
    //线2
    TRACK_2_BASELINE = 223,
    //线3
    TRACK_3_BASELINE = 310,

// Images............................................................
    //创建图片对象
    background = new Image(),
    runnerImage = new Image(),

    // Platforms.........................................................
    //单个屏幕内部的线条数据
    platformData = [  // One screen for now
        // Screen 1.......................................................
        {
            //线条距离左侧宽度
            left: 10,
            //线条宽度
            width: 230,
            //线条厚度
            height: PLATFORM_HEIGHT,
            //线条颜色
            fillStyle: 'blue',
            //线条透明度
            opacity: 0.5,
            //线条编号
            track: 1,
            //是否跳动
            pulsate: false,
        },

        {
            left: 250,
            width: 100,
            height: PLATFORM_HEIGHT,
            fillStyle: 'rgb(150,190,255)',
            opacity: 1.0,
            track: 2,
            pulsate: false,
        },

        {
            left: 400,
            width: 125,
            height: PLATFORM_HEIGHT,
            fillStyle: 'rgb(250,0,0)',
            opacity: 1.0,
            track: 3,
            pulsate: false
        },

        {
            left: 633,
            width: 100,
            height: PLATFORM_HEIGHT,
            fillStyle: 'rgb(250,250,0)',
            opacity: 1.0,
            track: 1,
            pulsate: false,
        },
    ];

// Launch game.........................................................
initializeImages();
//初始化背景图资源
function initializeImages() {
    background.src = 'images/background.png';
    runnerImage.src = 'images/runner.png';
    background.onload = function (e) {
        //图片资源加载后开始游戏加载
        startGame();
    };
}
//开始游戏
function startGame() {

    draw();
}
//游戏绘制函数
function draw() {
    //绘制背景
    drawBackground();
    //绘制平台
    drawPlatforms();
    //绘制小人
    drawRunner();
}
//绘制背景图片
function drawBackground() {
    context.drawImage(background, 0, 0);
}
//绘制平台
function drawPlatform(data) {
    //计算顶部距离
    var platformTop = calculatePlatformTop(data.track);
    //线宽
    context.lineWidth = PLATFORM_STROKE_WIDTH;
    //线风格
    context.strokeStyle = PLATFORM_STROKE_STYLE;
    //线天聪颜色
    context.fillStyle = data.fillStyle;
    //全局透明度
    context.globalAlpha = data.opacity;
    //绘制无填充矩形 左侧距离 顶部距离 宽度 高度
    context.strokeRect(data.left, platformTop, data.width, data.height);
    //绘制填充矩形
    context.fillRect(data.left, platformTop, data.width, data.height);
}
//循环遍历绘制平台对象
function drawPlatforms() {
    var index;
    for (index = 0; index < platformData.length; ++index) {
        console.log(index);
        drawPlatform(platformData[index]);
    }
}
//计算距离顶部高度
function calculatePlatformTop(track) {
    if (track === 1) {
        return TRACK_1_BASELINE;
    } // 323 pixels
    else if (track === 2) {
        return TRACK_2_BASELINE;
    } // 223 pixels
    else if (track === 3) {
        return TRACK_3_BASELINE;
    } // 123 pixels
}
//绘制小人
function drawRunner() {
    context.drawImage(runnerImage,
        RUNNER_LEFT,
        calculatePlatformTop(STARTING_RUNNER_TRACK) - runnerImage.height);
}
