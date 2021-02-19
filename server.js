const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer();
const fs = require("fs");
const wav = require('./wav')

app.post("/upload", upload.single("audioFile"), function (req, res, next) {
	console.log(req.file);
	const fileName = req.file.originalname
	const mp3dest =
		__dirname + "/public/uploads/mp3/" + fileName + ".mp3";

	fs.writeFileSync(
		mp3dest,
		Buffer.from(new Uint8Array(req.file.buffer))
	); // write the blob to the server as a file
	wav.convertToWav(mp3dest, fileName);
	res.sendStatus(200);
});


app.use(express.static("public"));

const port = process.env.PORT || 3000;

app.listen(port, function () {
	console.log("app listening on port " + port);
});
