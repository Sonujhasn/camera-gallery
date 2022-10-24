setTimeout(()=>{
    if(db){
        //video retieval
        //image retieval
        let dbtransaction=db.transaction("video","readonly")
        let videostore=dbtransaction.objectStore("video")
        let videorequest=videostore.getAll()//event driven
        videorequest.onsuccess=(e)=>{
            let videoresult=videorequest.result;
            let gallerycont=document.querySelector(".gallery-cont")
            videoresult.forEach((videoObj) => {
                let mediaEle=document.createElement("div")
                mediaEle.setAttribute("class","media-cont")
                mediaEle.setAttribute("id",videoObj.id);
                let url=URL.createObjectURL(videoObj.blobData);

                mediaEle.innerHTML=`
                
                <div class="media">
                   <video autoplay loop src="${url}"></video>
                </div>
                <div class="download action">DOWNLOAD</div>
               <div class="delete action">DELETE</div>
                `;
                gallerycont.appendChild(mediaEle)
                let deletebtn=mediaEle.querySelector(".delete")
                deletebtn.addEventListener("click",deletelistner);

                let downloadbtn=mediaEle.querySelector("download");
                 downloadbtn.addEventListener("click",downloadlistner)
                 
            });
        }
    //image retieval
    let imgdbtransaction=db.transaction("image","readonly")
    let imagestore=imgdbtransaction.objectStore("image")
    let imagerequest=imagestore.getAll()//event driven
    imagerequest.onsuccess=(e)=>{
        let imageresult=imagerequest.result;
        let gallerycont=document.querySelector(".gallery-cont")
        imageresult.forEach((imageObj) => {
            let mediaEle=document.createElement("div")
            mediaEle.setAttribute("class","media-cont")
            mediaEle.setAttribute("id",imageObj.id);
            let url=imageObj.url;

            mediaEle.innerHTML=`
            
            <div class="media">
               <img src="${url}"/>
            </div>
            <div class="download action">DOWNLOAD</div>
           <div class="delete action">DELETE</div>
            `;
            gallerycont.appendChild(mediaEle)
            let deletebtn=mediaEle.querySelector(".delete")
            deletebtn.addEventListener("click",deletelistner);

            let downloadbtn=mediaEle.querySelector(".download");
             downloadbtn.addEventListener("click",downloadlistner)
             
        });
    }

    }
},100)
//ui remove ,db remove
function deletelistner(e){
    //Db remove
  let id=e.target.parentElement.getAttribute("id") 
  if(id.slice(0,3)==="vid"){
    let dbtransaction=db.transaction("video","readwrite")
    let videostore=dbtransaction.objectStore("video")
    videostore.delete(id)
  }else if(id.slice(0,3)==="img"){
    let imgdbtransaction=db.transaction("image","readwrite")
    let imagestore=imgdbtransaction.objectStore("image")
    imagestore.delete(id)   
  }  
  //ui
  e.target.parentElement.remove();
}
function downloadlistner(e){
    let id=e.target.parentElement.getAttribute("id")
    let type=id.slice(0,3)
    if(type==="vid"){
        let dbtransaction=db.transaction("video","readwrite")
        let videostore=dbtransaction.objectStore("video")
        let videorequest=videostore.get(id)
        videorequest.onsuccess=(e)=>{
            let videoresult=videorequest.result
            let videourl=URL.createObjectURL(videoresult.blobData)
        
           let a=document.createElement("a")
            a.href=videourl
            a.download="stream.mp4";
             a.click()
        }
    }else if(type==="img"){
        let imgdbtransaction=db.transaction("image","readwrite")
        let imagestore=imgdbtransaction.objectStore("image")
        let imagerequest=imagestore.get(id)
        imagerequest.onsuccess=(e)=>{
            let imageresult=imagerequest.result
            
        
           let a=document.createElement("a")
            a.href=imageresult.url
            a.download="image.jpg";
             a.click()
        }
    }
}
