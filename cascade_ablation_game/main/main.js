window.onload = function(){
    let music = document.getElementById('music7');
    music.play();
};

let level = 1;
function isHidden(id){
    let div = document.getElementById(id);
    div.style.display = (div.style.display === 'none'? 'block': 'none');
    //console.log(window.innerHeight);
}
function level_choose(level_cnt){
    let txt = '';
    switch(level_cnt){
        case 1: level = 1;txt = '简单';break;
        case 2: level = 2;txt = '中等';break;
        case 3: level = 3;txt = '困难';break;
        case 4: level = 4;txt = '困难plus';break;
        default: break;
    }
    isHidden('box_level');
    document.getElementById('box2_content').innerHTML = '你选择的难度是：' + txt;
    //alert('你选择的难度为：' + txt);
}
function navigateToGame(){
    window.location.href="../c_a/cascade_ablation.html?level=" + level;
}

function playMusic1() {
    let music = document.getElementById('music1');
    music.play();
}

function playMusic2() {
    let music = document.getElementById('music2');
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

