const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const apiKey = "e28bd1183e48e74da4fe1ed2d65baeab";

function convertToWav(mp3dest, audioName) {
  skleton()
	//create skleton
	function skleton() {
		const data = {
			conversion: [
				{
					category: "audio",
					target: "wav",
					options: {
						pcm_format: "pcm_u8",
						channels: "mono",
						frequency: 16000,
						audio_bitdepth: 8,
					},
				},
			],
		};

		const config = {
			method: "post",
			url: "https://api2.online-convert.com/jobs",
			headers: {
				"x-oc-api-key": apiKey,
				"Content-Type": "text/plain",
			},
			data: JSON.stringify(data),
		};

		axios(config)
			.then(function (response) {
				const id = response.data.id;
				const server = response.data.server;
        console.log({id, server})
				uploadFile(server, id);
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	//uploading file
	function uploadFile(server, id) {
		const url = server + "/upload-file/" + id;
		console.log({url});

		const data = new FormData();
		data.append("file", fs.createReadStream(mp3dest));

		const config = {
			method: "post",
			url: url,
			headers: {
				"x-oc-api-key": apiKey,
				...data.getHeaders(),
			},
			data: data,
		};

		axios(config)
			.then(function (response) {
				console.log(response.data.id);
				if (response.data.completed) {
					getJobInfo(id);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	//get job info
	function getJobInfo(id) {
		const config = {
			method: "get",
			url: "https://api2.online-convert.com/jobs/" + id ,
			headers: {
				"x-oc-api-key": apiKey,
			},
		};

		axios(config)
			.then(function (response) {
				console.log(response.data.status.code);
				if (response.data.status.code == "processing") {
					setTimeout(function () {
						getJobInfo(id);
					}, 1000);
				} else if (response.data.status.code == "completed") {
					console.log(response.data.output[0].uri);
					const url = response.data.output[0].uri;
					downLoadWav(url);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	//download converted wav
	function downLoadWav(url) {
		const uploadLocation = __dirname + "/public/uploads/wav/" + audioName + ".wav";

		axios({
			method: "get",
			url: url,
			responseType: "stream",
		}).then(function (response) {
			response.data.pipe(fs.createWriteStream(uploadLocation));
		})
    .catch(function (error) {
      console.log(error)
    })
	}

}

module.exports = {
  convertToWav: convertToWav
}