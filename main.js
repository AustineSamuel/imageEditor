let canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight

const PI2 = Math.PI * 2
const random = (min, max) => Math.random() * (max - min + 1) + min | 0

const timestamp = _ => new Date().getTime()
let ctx = canvas.getContext("2d");
let imageDetected = false;
let memoryLine=[];
let memory = []
let thick=2;
let redoIndex=0;
let imageSrc='';
const undo= () =>{
  if(memory.length < 1) return message ("undo memory end");
  drawImage(imageSrc);
memory.pop();
setTimeout(()=>{
memory.forEach((e)=>{//redraw canvas
  ctx.beginPath();
  e.forEach((el)=>{
 ///   console.log(el.x,el.y,el.radius,el.color);
  drawLine(el.x,el.y,el.radius,el.color);
});
//ctx.closePath();
})
},0);

 }
let done=false;
ctx.font="15px arial";
ctx.fillText("EDITOR V 1 , please Choose jpg, png, jpeg image of answer papper ",canvas.width/8,canvas.height/3);
function drawImage(src){
  const img = new Image();
  img.src = src;
  img.onload = () => {
    imgW=img.width;
    imgH=img.height;
    
    




    ctx.clearRect(0,0,canvas.width,canvas.height);
   
    ctx.beginPath();
   

    if(imgW>canvas.height){
      if( !done){
        done=true;
      swal({title:"this image require a bigger screen",
      text:"text on this image might not be visible , becouse the image sizes are bigger than your device screen please  view this file next time using a bigger screen",
    buttons:["continue","Noted !"]});
      }
    ctx.drawImage(img, 0, 0,canvas.width, canvas.height);
    }
    else{
    
      drawImage(img,0,0,canvas.width,canvas.height);
    }



    ctx.closePath();
  img.remove();
  }
}

$("#image").on("change", function() {
  imageReader($(this), $(this), done);

  function done(e) {
imageDetected=true;
imageSrc=e;
drawImage(e);
  }
});
let myColor="rgb(255, 0, 0)"

const drawLine = (x, y, radius = 10, color = "black") => {
  memoryLine.push({
    x:x,
    y:y,
    radius:radius,
    color:color
  });
 

 ctx.lineTo(Math.floor(x), Math.floor(y))
  ctx.strokeStyle = color
  ctx.lineWidth = radius/4;
  ctx.lineCap = "round"
  ctx.lineJoin = "round"
  ctx.strokeStyle = color;
  ctx.fillStyle = color,
  ctx.shadowColor=color;
  ctx.shadowBlur=radius> 3 ? radius / 3 : radius >4 ? 1 : radius;
    ctx.stroke();
    
}

const handleTouch=(e)=>{
 if(!imageDetected) return message ('choose image first');
  const x=e.touches[0].clientX
  
  const y=e.touches[0].clientY;
  drawLine(x,y,thick,myColor)
  
}

const handleMouse = (e) =>{
 
  if(!onDraw)return
  if(!imageDetected) return message ('choose image first');
const X = e.clientX;
const Y = e.clientY;
drawLine(X,Y,thick,myColor);
 }

 let onDraw=false;
 canvas.addEventListener("mousedown",(e)=>{
onDraw=true;

 });
 
 canvas.addEventListener("mouseup",()=>{
onDraw=false;
ctx.beginPath();
memory.push(memoryLine);
 
setTimeout(() => {
  memoryLine=[];  
  console.log(memory);
}, 0);
});

canvas.addEventListener("mousemove",handleMouse);

//mobile
canvas.addEventListener("touchmove",handleTouch)
canvas.addEventListener("touchstart",handleTouch)
canvas.addEventListener("touchend", function (){
 ctx.beginPath()
 onDraw=false;
ctx.beginPath();
memory.push(memoryLine);
 
setTimeout(() => {
  memoryLine=[];  
  console.log(memory);
}, 0);
});


function changeColor(color){
  myColor=color;
}


const optionalColors= ["rgb(255, 0, 0)","rgb(0, 60, 255)","rgb(0, 255, 40)"]

optionalColors.forEach((e)=>{
  $("#colorCtn").prepend(`<div color="${e}"" style="background:${e}">
  
  </div>`)
})

$("#colorCtn div").click(function (){
 myColor=$(this).attr("color");
 message ("color set to"+myColor);
});

$("#text").click(function (){
  takeInput("enter text ",done)
  function done(txt){
    showText(txt)
  }
});

function erase(){
  swal({
    title:"are you want to erase this canvas ? this action will clear all your work !!",
    text:"restart work gain",
    buttons:["cancel","Clear"]
  }).then((e)=>{
   if(e){
      imageDetected=false;
    ctx.clearRect(0,0,canvas.width,canvas.height);
   }
   else{
    message ("back again");
   }
  })
}


//save
function expt() {
  const download = (data, type) => {
    let a = document.createElement("a")
    a.href = data;
    a.target = "_blank";
    a.download =location.origin+random(0,10)+ "" + type;
    a.click();
    message("downloading file")
  }
  download(getQr("canvas").toDataURL("image/jpeg"), "jpg")
  message ("preparing download");
}



onbeforeunload=()=>{
  $(window).scrollTop(0);
  return "are you sure you want to leave this page ?";
}
history.scrollRestoration="manual"
$(window).on('unload', function() {
  $(window).scrollTop(0);
});
$("html").css({
  "touch-action": "pan-down"
});


$("#range").on("change",function(){
  thick=Number($(this).val());

  $("#show").css("width",thick).css("height",thick).css("border-radius",thick/2);

})