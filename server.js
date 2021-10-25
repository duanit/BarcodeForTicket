//ทำการ import express เข้ามาใช้งาน โดยสร้างตัวแปร express ขึ้นมาเพื่อรับค่า
const express = require('express')
//ทำการสร้าง Instance ของ express และสร้างตัวแปร app ขึ้นมาเพื่อรับค่า
const app = express()
const cors = require('cors');
//var moment = require('moment'); // require
const fs = require('fs')
const router = express.Router();
const JsBarcode =  require('jsbarcode');
const Canvas =  require('canvas');
const path = require('path');
var multer = require('multer');
var bodyParser = require('body-parser');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 8080
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  
  res.render('creatbarcode');
  //res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/barcode/:taxId', (req, res) => {
    const taxId = req.params.taxId;

  //  for (let i = 0; i < 5; i++) {
        var canvas = new Canvas.createCanvas();
        JsBarcode(canvas, taxId);
        res.contentType('image/png');
        //console.log(canvas.toDataURL())
        res.end(canvas.toBuffer());
      //}
 
});
app.get('/genbarcode/:taxId', (req, res) => {
  var data = JSON.parse(req.params.taxId);
  
  console.log(data)
  res.render('genbarcode');

});

//run web server ที่เราสร้างไว้ โดยใช้ PORT ที่เรากำหนดไว้ในตัวแปร PORT
app.listen(PORT, () => {
    //หากทำการ run server สำเร็จ ให้แสดงข้อความนี้ใน cmd หรือ terminal
    console.log(`Server is running on port : ${PORT}`)
})
//ทำการ export app ที่เราสร้างขึ้น เพื่อให้สามารถนำไปใช้งานใน project อื่นๆ 
//เปรียบเสมือนเป็น module ตัวนึง

var Storage = multer.diskStorage({
  destination: function(req, file, callback) {

   
      callback(null,path.join(__dirname, './public/img'));
  },
  filename: function(req, file, callback) {
    let exploded_name = file.originalname.split(".");
    let ext = exploded_name[exploded_name.length - 1];
    console.log(exploded_name);
    console.log(ext);
      callback(null,  "bg."+ext);
  }
});

var upload = multer({
  storage: Storage
}).array("imgUploader", 3); //Field name and max count

// app.get("/", function(req, res) {
//   res.sendFile(__dirname + "/index.html");
// });
app.post("/api/Upload", function(req, res) {
 
  upload(req, res, function(err) {
      if (err) {
          return res.end("Something went wrong!");
      }
      return res.end("File uploaded sucessfully!.");
  });
});
module.exports = app