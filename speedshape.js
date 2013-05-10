function decisecond(){
    time=(time-.1).toFixed(1);
    if(time<=0){
        clearInterval(interval)
    }
    draw()
}
function draw(){
    if(settings[4]){/*Clear?*/
        buffer.clearRect(0,0,width,height)
    }

    i=reds.length-1;
    if(i>=0){
        buffer.fillStyle='#f00';
        do{
            buffer.fillRect(reds[i][0]-reds[i][2]/2,reds[i][1]-reds[i][3]/2,reds[i][2],reds[i][3])
        }while(i--)
    }

    buffer.fillStyle='#fff';
    buffer.fillRect(white[0]-white[2]/2,white[1]-white[3]/2,white[2],white[3]);
    buffer.font='23pt sans-serif';
    buffer.fillText('Score: '+score,5,25);
    buffer.fillText('Time: '+time+'/'+settings[2],5,50);

    if(settings[4]){/*Clear?*/
        canvas.clearRect(0,0,width,height)
    }
    canvas.drawImage(get('buffer'),0,0)
}
function get(i){
    return document.getElementById(i)
}
function play_audio(i){
    if(settings[0]>0){/*Audio Volume*/
        get(i).currentTime=0;
        get(i).play()
    }
}
function randomize_shapes(){
    if(settings[1]>0){/*Number of Reds*/
        reds=[];
        i=settings[1]-1;
        do{
            reds.push([random_number(width),random_number(height),random_number(200)+42,random_number(200)+42])
        }while(i--)
    }

    white=[random_number(width),random_number(height),random_number(99)+20,random_number(99)+20];

    if(time<=0){
        draw()
    }
}
function random_number(i){
    return Math.floor(Math.random()*i)
}
function resize(){
    if(mode>0){
        height=get('buffer').height=get('canvas').height=window.innerHeight;
        width=get('buffer').width=get('canvas').width=window.innerWidth;

        if(time>0){
            randomize_shapes()
        }else{
            draw()
        }
    }
}
function save(){
    if(get('restart-key').value=='H'){
        ls.removeItem('speedshape3');
        settings[3]='H'/*Restart Key?*/
    }else{
        settings[3]=get('restart-key').value;
        ls.setItem('speedshape3',settings[3])
    }

    i=2;
    do{
        j=['audio-volume','reds','time-limit'][i];
        if(isNaN(get(j).value)||get(j).value==[1,10,30][i]||get(j).value<[0,0,1][i]){
            ls.removeItem('speedshape'+i);
            settings[i]=[1,10,30][i];
            get(j).value=settings[i]
        }else{
            settings[i]=parseFloat(get(j).value);
            ls.setItem('speedshape'+i,settings[i])
        }
    }while(i--);

    settings[4]=get('clear').checked;/*Clear?*/
    if(settings[4]){
        ls.removeItem('speedshape4')
    }else{
        ls.setItem('speedshape4',0)
    }
}
function setmode(newmode,frommenu){
    clearInterval(interval);
    mode=newmode;
    if(mode>0){
        if(frommenu){
            save()
        }

        score=0;
        time=settings[2];

        if(frommenu){
            get('page').innerHTML='<canvas id=canvas oncontextmenu="return false"></canvas>';
            buffer=get('buffer').getContext('2d');
            canvas=get('canvas').getContext('2d');
            resize()
        }else{
            randomize_shapes()
        }

        interval=setInterval('decisecond()',100)
    }else{
        buffer=0;
        canvas=0;

        get('page').innerHTML='<div style="border-right:8px solid #222;display:inline-block;text-align:left;vertical-align:top"><div class=c><b>Speedshape</b></div><hr><div class=c><a onclick=setmode(1,1)>Start New Game</a></div><hr><div class=c><input id=reds size=1 type=text value='+settings[1]+'>Red<br><input id=time-limit size=1 type=text value='+settings[2]+'>Time Limit</div></div><div style=display:inline-block;text-align:left><div class=c><input disabled size=3 style=border:0 type=text value=ESC>Main Menu<br><input id=restart-key maxlength=1 size=3 type=text value='+settings[3]+'>Restart</div><hr><div class=c><input id=audio-volume max=1 min=0 step=.01 type=range value='+settings[0]+'>Audio<br><label><input '+(settings[4]?'checked ':'')+'id=clear type=checkbox>Clear</label><br><a onclick="if(confirm(\'Reset settings?\')){get(\'clear\').checked=get(\'audio-volume\').value=1;get(\'restart-key\').value=\'H\';get(\'reds\').value=10;get(\'time-limit\').value=30;save();setmode(0,1)}">Reset Settings</a></div></div>'
    }
}
var buffer=canvas=height=i=interval=j=mode=mouse_x=mouse_y=score=time=width=0,
ls=window.localStorage,
settings=[
    ls.getItem('speedshape0')===null?1:parseFloat(ls.getItem('speedshape0')),/*Audio Volume*/
    ls.getItem('speedshape1')===null?10:parseInt(ls.getItem('speedshape1')),/*Number of Reds*/
    ls.getItem('speedshape2')===null?30:parseInt(ls.getItem('speedshape2')),/*Time Limit*/
    ls.getItem('speedshape3')===null?'H':ls.getItem('speedshape3'),/*Reset Key*/
    ls.getItem('speedshape4')===null/*Clear?*/
],
reds=white=[];

setmode(0,0);

window.onkeydown=function(e){
    if(mode>0){
        i=window.event?event:e;
        i=i.charCode?i.charCode:i.keyCode;
        if(String.fromCharCode(i)===settings[3]){/*Reset Key?*/
            setmode(1,0)
        }else if(i==27){/*ESC*/
            setmode(0,0)
        }
    }
};
window.onmousedown=function(e){
    if(mode>0&&time>0){
        e.preventDefault();
        mouse_x=e.pageX;
        mouse_y=e.pageY;
        if(mouse_x>white[0]-white[2]/2&&mouse_x<white[0]+white[2]/2&&mouse_y>white[1]-white[3]/2&&mouse_y<white[1]+white[3]/2){
            score+=1;
            randomize_shapes()
        }else{
            i=reds.length-1;
            if(i>=0){
                do{
                    if(mouse_x>reds[i][0]-reds[i][2]/2&&mouse_x<reds[i][0]+reds[i][2]/2&&mouse_y>reds[i][1]-reds[i][3]/2&&mouse_y<reds[i][1]+reds[i][3]/2){
                        score-=1;
                        randomize_shapes();
                        break
                    }
                }while(i--)
            }
        }
    }
};

window.onresize=resize
