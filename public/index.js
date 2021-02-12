const record = document.getElementById('record');
const upload = document.getElementById('upload');
const stop = document.getElementById('stop');
const player = document.getElementById('player');
const send = document.getElementById('send');
const state = document.getElementById('state');
let audioChunks = [];

upload.addEventListener('change', function(e) {
  const file = e.target.files[0];
  console.log(file);

  setPreview(file);
  audioChunks = [];
  audioChunks.push(file)
});

if (navigator.mediaDevices || navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  navigator.mediaDevices.getUserMedia ({ audio: true })

      // Success callback
      .then(function(stream) {
        const mediaRecorder = new MediaRecorder(stream)
        console.log({stream, mediaRecorder, audioChunks})

        record.onclick = () => {
          upload.value = '';
          player.pause();
          mediaRecorder.start();
          state.style.display = 'block';
          state.innerHTML = 'Recording...';
          record.style.background = "red";
          record.style.color = "black";
        }
        
        stop.onclick = () => {
          mediaRecorder.stop();
          console.log("recorder stopped");
          state.style.display = 'none';
          state.innerHTML = '';
          record.style.background = "";
          record.style.color = "";
        }
        
        mediaRecorder.ondataavailable = function(e) {
          audioChunks = [];
          audioChunks.push(e.data);
          setPreview(e.data)
        }
      })

      // Error callback
      .catch(function(err) {
        console.log('The following getUserMedia error occurred: ' + err);
      }
  );
} else {
  alert('getUserMedia not supported on your browser!');
}

function setPreview(data) {
  player.src = URL.createObjectURL(data);
  document.querySelector('.preview').style.display = 'inline-block';
}

send.onclick = function() {
  if(audioChunks.length) {
    const audioBlob = new Blob(audioChunks, {type: 'audio/mp3'});
    console.log(audioBlob);
    sendAudio(audioBlob);
    audioChunks =  [];
  } else {
    alert('Already Sent')
  }
}

function sendAudio(audioBlob) {
  const fd = new FormData();
  fd.append('audioFile', audioBlob, URL.createObjectURL(audioBlob));

  fetch('/upload', {
    method: 'post',
    body: fd
  })
    .then(function(response) {
      console.log(response);
      return response;
    })
    .catch(function(err){ 
      console.log(err);
    });
}