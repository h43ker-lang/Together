const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const peerIdInput = document.getElementById('peer-id-input');
const myIdDisplay = document.getElementById('my-id');

let localStream;
let currentCall;

const peer = new Peer(); // Uses default public PeerJS signaling server

peer.on('open', id => {
  myIdDisplay.textContent = id;
});

peer.on('call', call => {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    localStream = stream;
    localVideo.srcObject = stream;
    call.answer(stream);
    call.on('stream', remoteStream => {
      remoteVideo.srcObject = remoteStream;
    });
    currentCall = call;
  });
});

function startCall() {
  const peerId = peerIdInput.value;
  if (!peerId) return alert('Enter a peer ID to call.');

  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    localStream = stream;
    localVideo.srcObject = stream;
    const call = peer.call(peerId, stream);
    call.on('stream', remoteStream => {
      remoteVideo.srcObject = remoteStream;
    });
    currentCall = call;
  });
}

function shareScreen() {
  navigator.mediaDevices.getDisplayMedia({ video: true }).then(screenStream => {
    const screenTrack = screenStream.getVideoTracks()[0];
    const sender = currentCall.peerConnection.getSenders().find(s => s.track.kind === 'video');
    if (sender) {
      sender.replaceTrack(screenTrack);
      screenTrack.onended = () => {
        // Restore webcam after screen share ends
        const webcamTrack = localStream.getVideoTracks()[0];
        if (webcamTrack) sender.replaceTrack(webcamTrack);
      };
    }
  });
}
