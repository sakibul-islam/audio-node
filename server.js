const express = require('express');
const app = express();
const multer  = require('multer') 
const upload = multer(); 
const fs = require('fs');

app.post('/upload', upload.single('soundBlob'), function (req, res, next) {
  console.log(req.file); // see what got uploaded

  let uploadLocation = __dirname + '/public/uploads/' + req.file.originalname + '.mp3' // where to save the file to. make sure the incoming name has a .wav extension

  fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer))); // write the blob to the server as a file
  res.sendStatus(200); //send back that everything went ok

})

//serve out any static files in our public HTML folder
app.use(express.static('public'))

app.get('/test', (req, res) => {
  console.log('listing')
  res.send('test')
})
//makes the app listen for requests on port 3000
app.listen(process.env.PORT, function(){
  console.log("app listening on port " + process.env.PORT)
})
