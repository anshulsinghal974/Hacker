// Set up the WebRTC peer connection and signaling
let peer = null;
let conn = null;
let userVideoStream = null;
let doctorVideoStream = null;

const consultationForm = document.getElementById('consultationForm');
const responseMessage = document.getElementById('responseMessage');
const videoCallSection = document.getElementById('video-call-section');
const userVideo = document.getElementById('user-video');
const doctorVideo = document.getElementById('doctor-video');
const endCallBtn = document.getElementById('endCallBtn');

consultationForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('userName').value;
    const specialty = document.getElementById('doctorSpecialty').value;

    if (!name || !specialty) {
        alert("Please provide all details.");
        return;
    }

    // Send a request to the server to schedule a consultation
    fetch('/request_consultation', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `name=${name}&specialty=${specialty}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            responseMessage.innerHTML = `You are connected with Dr. ${data.doctor}. Consultation ID: ${data.consultation_id}`;
            initVideoCall();
        } else {
            responseMessage.innerHTML = data.message;
        }
    });
});

function initVideoCall() {
    peer = new Peer();

    peer.on('open', (id) => {
        console.log('Your peer ID is: ' + id);
    });

    // Set up video stream for user
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            userVideoStream = stream;
            userVideo.srcObject = stream;

            peer.on('call', (call) => {
                call.answer(userVideoStream);
                call.on('stream', (remoteStream) => {
                    doctorVideoStream = remoteStream;
                    doctorVideo.srcObject = remoteStream;
                });
            });
        })
        .catch(err => console.log('Error accessing media devices: ' + err));
}

// This could be triggered by another event (e.g., a doctor joining)
function startCall(doctorPeerId) {
    const call = peer.call(doctorPeerId, userVideoStream);

// Set up WebRTC peer connection
let peer = null;
let userStream = null;
let doctorStream = null;

const consultationForm = document.getElementById('consultationForm');
const responseMessage = document.getElementById('responseMessage');
const videoCallSection = document.getElementById('video-call-section');
const userVideo = document.getElementById('user-video');
const doctorVideo = document.getElementById('doctor-video');
const endCallBtn = document.getElementById('endCallBtn');

// On consultation form submit
consultationForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('userName').value;
    const specialty = document.getElementById('doctorSpecialty').value;

    if (!name || !specialty) {
        alert("Please provide all details.");
        return;
    }

    // Send consultation request to the server
    fetch('/request_consultation', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `name=${name}&specialty=${specialty}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            responseMessage.innerHTML = `You are connected with Dr. ${data.doctor}. Consultation ID: ${data.consultation_id}`;
            initVideoCall();
        } else {
            responseMessage.innerHTML = data.message;
        }
    });
});

function initVideoCall() {
    // Initialize WebRTC PeerJS
    peer = new Peer();

    peer.on('open', (id) => {
        console.log('Your peer ID is: ' + id);
    });

    // Get user's video and audio stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            userStream = stream;
            userVideo.srcObject = stream;

            // When the doctor calls
            peer.on('call', (call) => {
                call.answer(userStream);  // Answer the call and send the user's stream
                call.on('stream', (remoteStream) => {
                    doctorStream = remoteStream;
                    doctorVideo.srcObject = remoteStream;
                });
            });
        })
        .catch(err => console.log('Error accessing media devices: ' + err));
}

// This function could be triggered when a doctor joins or when a call is initiated
function startCall(doctorPeerId) {
    const call = peer.call(doctorPeerId, userStream);

    call.on('stream', (remoteStream) => {
        doctorStream = remoteStream;
        doctorVideo.srcObject = remoteStream;
    });
}

// End the video call
endCallBtn.addEventListener('click', function() {
    if (userStream) {
        userStream.getTracks().forEach(track => track.stop());
    }
    if (doctorStream) {
        doctorStream.getTracks().forEach(track => track.stop());
    }
    alert('Call ended');
    doctorVideo.srcObject = null;
    userVideo.srcObject = null;
    videoCallSection.style.display = 'none';
    responseMessage.innerHTML = 'Consultation ended.';
});
