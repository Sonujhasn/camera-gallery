//open a database
//create objectstore
//make transition
let db;
let openrequest=indexedDB.open("myDataBase")
openrequest.addEventListener("success",(e)=>{
    console.log("db sucess")
    db=openrequest.result

})
openrequest.addEventListener("error",(e)=>{

})
openrequest.addEventListener("upgradeneeded",(e)=>{
    console.log("db upgraded and also for initial db creation")
    db =openrequest.result
    db.createObjectStore("video",{keyPath:"id"})
    db.createObjectStore("image",{keyPath:"id"})
})