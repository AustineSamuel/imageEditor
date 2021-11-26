let canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight

const PI2 = Math.PI * 2
const random = (min, max) => Math.random() * (max - min + 1) + min | 0

const timestamp = _ => new Date().getTime()
let ctx = canvas.getContext("2d");
let imageDetected = false;
const memory = []

const addMemory = () =>{
  return false;//is not working
  memory.push(canvas);
  let prev=canvas;
  canvas.remove();
  //delete the current canvas create new one and draw the prev canvas in  the new one
  canvas=document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.width = innerWidth;
  canvas.height = innerHeight

  ctx = canvas.getContext("2d");
  const img=new Image();
  img.src=prev.toDataURL("png");
  img.onload=()=>{
  ctx.drawImage(img,0,0,canvas.width,canvas.height);
  img.remove();
  }
  if(memory.length>=6){
    memory.shift();
  }
  redoIndex=memory.length;
}

let redoIndex=0;

const undo= () =>{
  redoIndex--;
  if(memory[redoIndex]===undefined) return message ("undo memory end");
 const img=new Image();
 img.src=memory[redoIndex].toDataURL("png");
 img.onload=()=>{
   ctx.clearRect(0,0,canvas.width, canvas.height)
 ctx.drawImage(img,0,0,canvas.width,canvas.height);
 setTimeout(()=>{
   img.remove();
   console.log(redoIndex)
 })
 }
}
ctx.font="15px arial";
ctx.fillText("EDITOR V 1 , please Choose jpg, png, jpeg image of answer papper ",canvas.width/8,canvas.height/3);

$("input").on("change", function() {
  imageReader($(this), $(this), done);

  function done(e) {
imageDetected=true;

    const img = new Image();
    img.src = e;
    img.onload = () => {
      ctx.beginPath();
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.closePath();
      img.remove();
    }

  }
});
let myColor="#00FF46"

const drawLine = (x, y, radius = 10, color = "black") => {
 ctx.lineTo(Math.floor(x), Math.floor(y))
  ctx.strokeStyle = color
  ctx.lineWidth = radius/4;
  ctx.lineCap = "round"
  ctx.lineJoin = "round"
  ctx.strokeStyle = myColor;
  ctx.fillStyle = myColor,
  ctx.shadowColor=myColor;
  ctx.shadowBlur=radius
    ctx.stroke();
    
}

const handleTouch=(e)=>{
 if(!imageDetected) return message ('choose image first');
  const x=e.touches[0].clientX
  
  const y=e.touches[0].clientY;
  drawLine(x,y,2)
  
}

const handleMouse = (e) =>{
 
  if(!onDraw)return
  if(!imageDetected) return message ('choose image first');
const X = e.clientX;
const Y = e.clientY;
drawLine(X,Y,2);
 }

 let onDraw=false;
 canvas.addEventListener("mousedown",(e)=>{
onDraw=true;
console.log(onDraw)
 });
 
 canvas.addEventListener("mouseup",()=>{
onDraw=false;
ctx.beginPath();
addMemory();
});

canvas.addEventListener("mousemove",handleMouse);

//mobile
canvas.addEventListener("touchmove",handleTouch)
canvas.addEventListener("touchstart",handleTouch)
canvas.addEventListener("touchend", function (){
 ctx.beginPath()
 addMemory()
});


function changeColor(color){
  myColor=color;
}


const optionalColors=["#00FCFF","#00FF46","#FF2300","#FF8C00","#D100FF","#000000","#ffffff","#E6FF00","#45463C"]

optionalColors.forEach((e)=>{
  $("#colorCtn").append(`<div color="${e}"" style="background:${e}">
  
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
  if(confirm("are you sure you want to clear canvas ?")){
    imageDetected=false;
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  else{
    message ("back again");
  }
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
