const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const peerIdInput = document.getElementById("peer-id-input");
const myIdDisplay = document.getElementById("my-id");

let localStream;
let currentCall;

// Create a PeerJS connection (use secure PeerJS cloud server)
const peer = new Peer({
  host: 'peerjs.com',
  port: 443,
  secure: true
});

peer.on('open', id => {
  myIdDisplay.textContent = id;
  console.log("My Peer ID:", id);
});

peer.on('error', err => {
  console.error("PeerJS error:", err);
  alert("PeerJS Error: " + err.message);
});

peer.on('call', call => {
  console.log("Incoming call from", call.peer);
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      localStream = stream;
      localVideo.srcObject = stream;
      call.answer(stream);
      call.on('stream', remoteStream => {
        console.log("Receiving remote stream...");
        remoteVideo.srcObject = remoteStream;
      });
      currentCall = call;
    })
    .catch(err => {
      console.error("Media error:", err);
      alert("Failed to access webcam/mic.");
    });
});

function startCall() {
  const remoteId = peerIdInput.value.trim();
  if (!remoteId) return alert("Enter the partner's ID to call.");

  console.log("Calling:", remoteId);

  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      localStream = stream;
      localVideo.srcObject = stream;
      const call = peer.call(remoteId, stream);

      call.on('stream', remoteStream => {
        console.log("Connected to", remoteId);
        remoteVideo.srcObject = remoteStream;
      });

      call.on('error', err => {
        console.error("Call error:", err);
        alert("Call failed: " + err.message);
      });

      currentCall = call;
    })
    .catch(err => {
      console.error("Media error:", err);
      alert("Could not access camera/microphone.");
    });
}

function shareScreen() {
  if (!currentCall || !currentCall.peerConnection) {
    alert("Start a call before sharing screen.");
    return;
  }

  navigator.mediaDevices.getDisplayMedia({ video: true })
    .then(screenStream => {
      const screenTrack = screenStream.getVideoTracks()[0];
      const sender = currentCall.peerConnection.getSenders().find(s => s.track.kind === 'video');

      if (sender) {
        sender.replaceTrack(screenTrack);
        console.log("Screen sharing started.");

        screenTrack.onended = () => {
          // Restore webcam after screen share ends
          const camTrack = localStream.getVideoTracks()[0];
          if (camTrack) sender.replaceTrack(camTrack);
          console.log("Screen sharing ended. Webcam restored.");
        };
      } else {
        console.warn("No video sender found.");
      }
    })
    .catch(err => {
      console.error("Screen share error:", err);
      alert("Could not share screen.");
    });
}
