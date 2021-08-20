window.onload = function () {
    let Url = window.location.href;
    //console.log(Url);
    let temp_para = receive_parameter(Url);
    switch (temp_para) {
        case '1': difficulty = 3;break;
        case '2': difficulty = 4;break;
        case '3': difficulty = 5;break;
        case '4': difficulty = 6;break;
        default: break;
    }
    let canvasTopBg = document.getElementById("canvasTopBg");
    let canvasBottomBg = document.getElementById("canvasBottomBg");
    initBackGround(canvasTopBg,20);
    initBackGround(canvasBottomBg,20);

    timer_cnt();

    let score_copy = scoreToString(score);
    document.getElementById('score').innerHTML = '当前分数： ' + score_copy;
    document.getElementById('timer').innerHTML = '当前用时： 00 : 00 : 00';
    let music = document.getElementById('music7');
    music.play();
    startGame();
};

function receive_parameter(Url) {
    let index = Url.indexOf("level");
    if (index !== -1) { //由A页面跳转而来
        Url = location.search; //获取url中"?"符后的字串
        let theRequest = [];
        if (Url.indexOf("?") !== -1) {
            let str = Url.substr(1);
            let parameter = str.split("=");
            return parameter[1];
        }
    }
}

function initBackGround(id_name,step){
    let width = id_name.width;
    let height = id_name.height;
    let ctx = id_name.getContext("2d");
    for(let i=0; i<=width/step; i++){
        for(let j=0; j<=height/step; j++){
            ctx.beginPath();//开始绘制
            ctx.arc(i * step,j * step,2,0,2*Math.PI);
            ctx.fillStyle="black";
            ctx.fill();
            ctx.closePath();
        }
    }
}
let level = 1;
let difficulty = 3;
let score = 0;
let timer;
let layer_bottom;
let stage_bottom;

function startGame() {
    document.getElementById('level_cnt').innerHTML = '第 ' + level + ' 关';
    let stage_top = new Konva.Stage({
        container: 'aim_pic_top',
        width: 400,
        height: 400,
    });
    let layer_top = new Konva.Layer();
    stage_top.add(layer_top);
    random_shape(layer_top, 'topShape', false);
    layer_top.draw();

    stage_bottom = new Konva.Stage({
        container: 'aim_pic_bottom',
        width: 400,
        height: 400,
    });
    layer_bottom = new Konva.Layer();
    stage_bottom.add(layer_bottom);
    random_shape(layer_bottom, 'bottomShape', true);
    layer_bottom.draw();

    layer_bottom.on('dragend',function (evt){
        let arg = evt.target;
        let x = evt.target.attrs.x;
        let y = evt.target.attrs.y;
        //console.log(id,x,y);
        playMusic4();
        revise_xy(layer_bottom, arg, x, y);
    })
}

let shapeData = {
    // 正方形
    '0': {
        points: [0,0,80,0,80,80,0,80]
    },
    // 左上三角形
    '1': {
        points: [0,0,80,0,0,80]
    },
    // 右上三角形
    '2': {
        points: [0,0,80,0,80,80]
    },
    // 左下三角形
    '3': {
        points: [0,0,80,80,0,80]
    },
    // 右下三角形
    '4': {
        points: [80,0,80,80,0,80]
    },
    // 长方形
    '5': {
        points: [0,0,80,0,80,40,0,40]
    },
    // 菱形
    '6': {
        points: [40,0,80,40,40,80,0,40]
    },
};

let init_topPosition = {
    '0':{
        x: Math.floor(Math.random() * 4) * 20 + 120,
        y: Math.floor(Math.random() * 4) * 20 + 120
    },
    '1':{
        x: Math.floor(Math.random() * 4) * 20 + 120,
        y: Math.floor(Math.random() * 4) * 20 + 120
    },
    '2':{
        x: Math.floor(Math.random() * 4) * 20 + 120,
        y: Math.floor(Math.random() * 4) * 20 + 120
    },
    '3':{
        x: Math.floor(Math.random() * 4) * 20 + 120,
        y: Math.floor(Math.random() * 4) * 20 + 120
    },
    '4':{
        x: Math.floor(Math.random() * 4) * 20 + 120,
        y: Math.floor(Math.random() * 4) * 20 + 120
    },
    '5':{
        x: Math.floor(Math.random() * 4) * 20 + 120,
        y: Math.floor(Math.random() * 4) * 20 + 120
    }
};

let init_bottomPosition ={
    '0':{x: 80, y: 40},
    '1':{x: 240, y: 40},
    '2':{x: 80, y: 180},
    '3':{x: 240, y: 180},
    '4':{x: 80, y: 280},
    '5':{x: 240, y: 280},
};

let judge_index = [];
let current_index = [];
let index_random = [];

function random_shape(layer, shapeName, draggable){

    let init_seed = [];
    let standardX = 120;
    let standardY = 120;
    switch (shapeName) {
        case 'topShape': init_seed = init_topPosition;break;
        case 'bottomShape': init_seed = init_bottomPosition;break;
        default:break;
    }
    if(shapeName === 'topShape') {
        for (let i = 0; i < difficulty; i++) {
            let index = Math.floor(Math.random() * 7);
            index_random.push(index);
            let x = init_seed[i].x;
            let y = init_seed[i].y;
            if (i === 0) {
                standardX = x;
                standardY = y;
            } else
                judge_index.push((x - standardX) / 20, (y - standardY) / 20);
            let points = shapeData[index].points;
            let shape = new Konva.Line({
                id: i,
                name: shapeName,
                points: points,
                x: x,
                y: y,
                closed: true,
                fill: 'black',
                draggable: draggable,
                globalCompositeOperation: 'xor'
            });
            layer.add(shape);
        }
    }
    else if(shapeName === 'bottomShape') {
        for (let j = 0; j < difficulty; j++) {
            let x = init_seed[j].x;
            let y = init_seed[j].y;
            if (j === 0) {
                standardX = x;
                standardY = y;
            } else
                current_index.push((x - standardX) / 20, (y - standardY) / 20);

            let shape = new Konva.Line({
                id: j,
                name: shapeName,
                points: shapeData[index_random[j + difficulty * (level-1)]].points,
                x: x,
                y: y,
                closed: true,
                fill: 'black',
                draggable: draggable,
                globalCompositeOperation: 'xor'
            });
            layer.add(shape);
        }
    }
}

function limit(x, y){
    let standardX = Math.floor(x / 20) * 20 + 10;
    let standardY = Math.floor(y / 20) * 20 + 10;
    let newX, newY;

    if(x - standardX >= 0)
        newX = standardX + 10;
    else
        newX = standardX - 10;
    if(y - standardY >= 0)
        newY = standardY + 10;
    else
        newY = standardY - 10;

    if(newX <= 0)
        newX = 0;
    else if(newX >= 320)
        newX = 320;
    if(newY <= 0)
        newY = 0;
    else if(newY >= 320)
        newY = 320;
    return [newX, newY];
}

function revise_xy(layer, arg, x, y){
    let temp = limit(x, y);
    console.log(temp);
    let newX = temp[0], newY = temp[1];

    arg.x(newX);
    arg.y(newY);
    layer.draw();

    let shape0_x, shape0_y;
    layer.find('.bottomShape').forEach(function (item) {
        if(item.attrs.id === 0){
            shape0_x = item.attrs.x;
            shape0_y = item.attrs.y;
            calculate_bias(layer, shape0_x, shape0_y);
        }
    });
    judge(layer);
}

function calculate_bias(layer, shape0_x, shape0_y){
    layer.find('.bottomShape').forEach(function (item) {
        let X = item.attrs.x;
        let Y = item.attrs.y;
        let id = item.attrs.id;
        if(id !== 0 ){
            current_index[(id - 1) * 2 + (level-1) * (difficulty-1) * 2] = (X - shape0_x) / 20;
            current_index[(id - 1) * 2 + 1 + (level-1) * (difficulty-1) * 2] = (Y - shape0_y) / 20;
        }
    });
}

let solved_cnt = 0;

function judge(layer){
    let cnt = 0;
    let init_num = (difficulty + 1) * (level-1);
    for(let i=init_num;i<current_index.length;i++){
        if(current_index[i] === judge_index[i])
            cnt ++;
        else
            break;
    }
    //console.log(cnt);
    if(cnt === (difficulty - 1) * 2 ){
        playMusic5();
        showTab();
    }
}

function numToString(num){
    if(num < 10)
        num ='0' + num;
    else
        num = '' + num;
    return num;
}

function scoreToString(score){
    if(score < 10)
        score = '000' + score;
    else if(score < 100)
        score = '00' + score;
    else if(score < 1000)
        score = '' + score;
    return score;
}

let time_str = ' 00 : 00 : 00';

function timer_cnt(){
    let count = 0;
    timer = setInterval(function() {
        count++;
        //console.log(count);
        let second = numToString(count % 60);
        let minute = numToString(Math.floor(count / 60 % 60));
        let hour = numToString(Math.floor(count / 60 / 60));
        time_str = hour + ' : ' + minute + ' : ' + second;
        document.getElementById('timer').innerHTML = '当前用时： ' + time_str;
    }, 1000);
}

function exitToMain(){
    let div = document.getElementById("alert");
    div.style.display = (div.style.display === 'none'? 'block': 'none');

}

let tip_cnt = 0;
let cnt = 0;

function tip(){
    if(score - 30 < 0)
        alert('你的分数不够！');
    else{
        score -= 30;
        cnt++;
        tip_cnt = cnt % (difficulty - 1);
        if(tip_cnt === 0){
            alert('还有最后一步了，自己动手吧！');
            cnt = difficulty - 2;
        }
        else{
            layer_bottom.remove();
            layer_bottom = new Konva.Layer();
            stage_bottom.add(layer_bottom);
            for(let i=0;i<difficulty;i++){
                if(i === 0){
                    let tip0 = new Konva.Line({
                        id: i,
                        name: 'bottomShape',
                        points: shapeData[index_random[difficulty * (level-1)]].points,
                        x: 120,
                        y: 120,
                        closed: true,
                        fill: 'black',
                        draggable: true,
                        globalCompositeOperation: 'xor'
                    });
                    layer_bottom.add(tip0);
                }
                else if(i <= tip_cnt){
                    let tip1 = new Konva.Line({
                        id: i,
                        name: 'bottomShape',
                        points: shapeData[index_random[i + difficulty * (level-1)]].points,
                        x: 120 + judge_index[(i-1) * 2 + (difficulty + 1) * (level-1)] * 20,
                        y: 120 + judge_index[(i-1) * 2 + (difficulty + 1) * (level-1) + 1] * 20,
                        closed: true,
                        fill: 'black',
                        draggable: true,
                        globalCompositeOperation: 'xor'
                    });
                    //console.log(120 + judge_index[i * 2 + (difficulty + 1) * (level-1)],120 + judge_index[i * 2 + (difficulty + 1) * (level-1) + 1])
                    layer_bottom.add(tip1);
                }
                else{
                    let tip2 = new Konva.Line({
                        id: i,
                        name: 'bottomShape',
                        points: shapeData[index_random[i + difficulty * (level-1)]].points,
                        x: init_bottomPosition[i].x,
                        y: init_bottomPosition[i].y,
                        closed: true,
                        fill: 'black',
                        draggable: true,
                        globalCompositeOperation: 'xor'
                    });
                    layer_bottom.add(tip2);
                }
            }
            layer_bottom.draw();
        }

        console.log(tip_cnt);
        layer_bottom.on('dragend',function (evt){
            let arg = evt.target;
            let x = evt.target.attrs.x;
            let y = evt.target.attrs.y;
            //console.log(id,x,y);
            revise_xy(layer_bottom, arg, x, y);
        })
    }

}

function your_score(flag){
    if(flag){
        solved_cnt++;
        score += 10;
        let div = document.getElementById('passTab');
        div.style.display = (div.style.display === 'none'? 'block': 'none');
    }
    playMusic('music6');
    let score_copy = scoreToString(score);
    let over_str = '用时' + time_str + '共获得' + score_copy + '分，完成' + solved_cnt + '题！';
    document.getElementById('over_content').innerHTML = over_str;
    let div = document.getElementById('overTab');
    div.style.display = (div.style.display === 'none'? 'block': 'none');
}

function showTab() {
    let div = document.getElementById("passTab");
    div.style.display = (div.style.display === 'none'? 'block': 'none');
}

function next(){
    level++;
    solved_cnt++;
    score += 10;
    let score_copy = scoreToString(score);
    document.getElementById('score').innerHTML = '当前分数： ' + score_copy;
    showTab();
    startGame();
}

function back(){
    window.location.href="../main/main.html";
}

function playMusic(filename) {
    let music = document.getElementById(filename);
    music.play();
}

function playMusic2() {
    let music = document.getElementById('music2');
    music.play();
}

function playMusic3() {
    let music = document.getElementById('music3');
    music.play();
}

function playMusic4() {
    let music = document.getElementById('music4');
    music.play();
}

function playMusic5() {
    let music = document.getElementById('music5');
    music.play();
}

function playMusic6() {
    let music = document.getElementById('music6');
    music.play();
}
