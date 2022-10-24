let video=document.querySelector("video");
let recordbtncont=document.querySelector(".record-btn-cont")
let recordbtn=document.querySelector(".record-btn")
let capturebtncont=document.querySelector(".capture-btn-cont")
let capturebtn=document.querySelector(".capture-btn")
let recordFlag=false
let transparentColor="transparent";
let recoder;
let chunks=[] //media data in chunks
let constraints={
    video:true,
    Audio:true
}
//navigator ->global ,browser info
navigator.mediaDevices.getUserMedia(constraints)  //screen pe excess 
.then((stream)=> {
     video.srcObject=stream //ye stream chalu kr dega
     //recorder api isse rrecor hoga
   recoder=new MediaRecorder(stream);  
   recoder.addEventListener("start",(e)=>{
     chunks=[];
   })
   recoder.addEventListener("dataavailable",(e)=>{
     chunks.push(e.data)
   })
   recoder.addEventListener("stop",(e)=>{
        //conversion of media chunks data to video
        let blob=new Blob(chunks,{type:"video/mp4"})
        if(db){
          let videoid=shortid()
          let dbtransaction=db.transaction("video","readwrite")
          let videostore=dbtransaction.objectStore("video")
          let videoentry={
               blobData:blob,
                id:`vid-${videoid}`
          }
          videostore.add(videoentry)
        }
       // let videourl=URL.createObjectURL(blob)
      //  let a=document.createElement("a")
       // a.href=videourl
       // a.download="stream.mp4";
       // a.click()
   })
   
})
recordbtncont.addEventListener("click",(e)=>{
    if(!recoder) return;
     recordFlag=!recordFlag
     if(recordFlag){ //start
        recoder.start()
        recordbtn.classList.add(("scale-record"))
        startTimer()
     }else{ //stop
          recoder.stop()
          recordbtn.classList.remove("scale-record")
          stopTimer()
     }
})

capturebtncont.addEventListener("click",(e)=>{
     capturebtn.classList.add("scale-capture")
     let canvas=document.createElement("canvas")
     canvas.width=video.videoWidth
     canvas.height=video.videoHeight
     let tool=canvas.getContext("2d")

     tool.drawImage(video,0,0,canvas.width,canvas.height)
     //filtering
     tool.fillStyle=transparentColor
     tool.fillRect(0,0,canvas.width,canvas.height)
     let imageurl=canvas.toDataURL();
     if(db){
          let imageid=shortid()
          let dbtransaction=db.transaction("image","readwrite")
          let imagestore=dbtransaction.objectStore("image")
          let imageentry={
               url:imageurl,
                id:`img-${imageid}`
          }
          imagestore.add(imageentry)
        }
        setTimeout(()=>{
          capturebtn.classList.remove("scale-capture")
        },500)
     //let a=document.createElement("a")
    // a.href=imageurl
    // a.download="image.jpg";
    // a.click()
})
let timerID;
let counter=0;
let timer=document.querySelector(".timer")
function startTimer(){
     timer.style.display="block"
     function displayTimer(){
          let totalsec=counter
          let hours=Number.parseInt(totalsec/3600)
          totalsec=totalsec%3600
          let minutes=Number.parseInt(totalsec/60)
          totalsec=totalsec%60
          let second=totalsec;
          hours=(hours<10)?`0${hours}`:hours
          minutes=(minutes<10)?`0${minutes}`:minutes
          second=(second<10)?`0${second}`:second

          timer.innerText=`${hours}:${minutes}:${second}`
        counter++;
     }
   timerID= setInterval(displayTimer,1000)
}
function stopTimer(){
     timer.style.display="none"
   clearInterval(timerID)
   timer.innerText="00:00:00"
}

//filtering logic
let filterlayer=document.querySelector(".filter-layer")
let allfilters=document.querySelectorAll(".filter")
allfilters.forEach((filterele)=>{
     filterele.addEventListener("click",(e)=>{
          //get
          transparentColor=getComputedStyle(filterele).getPropertyValue("background-color")
          filterlayer.style.backgroundColor=transparentColor
     })
})

