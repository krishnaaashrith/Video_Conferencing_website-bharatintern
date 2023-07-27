const localVideo = document.getElementById('localVideo');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const startCallButton = document.getElementById('startCallButton');
const endCallButton = document.getElementById('endCallButton');

let localStream;
let peerConnection;
const socket = new WebSocket('ws://your-websocket-server-url'); // Replace with your WebSocket server URL

// Function to start the video call
async function startCall() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        // Add your WebRTC code here to establish a peer connection with the other user
        // You'll need to exchange signaling information with the other user via the WebSocket server

        // WebSocket code to handle chat messages
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'chat') {
                const chatMessage = document.createElement('div');
                chatMessage.textContent = message.text;
                chatMessages.appendChild(chatMessage);
            }
        };

        // Event listener to send chat messages
        chatInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const message = chatInput.value;
                if (message.trim() !== '') {
                    const chatMessage = { type: 'chat', text: message };
                    socket.send(JSON.stringify(chatMessage));
                    chatInput.value = '';
                }
            }
        });
    } catch (error) {
        console.error('Error accessing media devices:', error);
    }
}

// Function to end the video call
function endCall() {
    localStream.getTracks().forEach(track => track.stop());
    localVideo.srcObject = null;
    // Add your WebRTC code here to close the peer connection
}

// Function to toggle audio
function toggleAudio() {
    isAudioMuted = !isAudioMuted;
    localStream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioMuted;
    });
}

// Function to toggle video
function toggleVideo() {
    isVideoMuted = !isVideoMuted;
    localStream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoMuted;
    });
}

// ... Your previous code as before ...

let isScreenSharing = false;
let screenStream;
let originalStream;

// Function to handle screen sharing
async function shareScreen() {
    try {
        if (!isScreenSharing) {
            screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const videoTracks = screenStream.getVideoTracks();
            if (videoTracks.length > 0) {
                // Store the original stream
                originalStream = localStream;
                // Replace the local stream with the screen sharing stream
                localStream = screenStream;
                localVideo.srcObject = localStream;
                isScreenSharing = true;
            }
        } else {
            // Stop screen sharing and revert to the original stream
            const tracks = localStream.getTracks();
            tracks.forEach(track => track.stop());
            localStream = originalStream;
            localVideo.srcObject = localStream;
            isScreenSharing = false;
        }
    } catch (error) {
        console.error('Error accessing screen sharing:', error);
    }
}

// ... The rest of your code as before ...




// Event listeners for call buttons
startCallButton.addEventListener('click', startCall);
endCallButton.addEventListener('click', endCall);

// Event listeners for toggle buttons
const toggleAudioButton = document.getElementById('toggleAudioButton');
toggleAudioButton.addEventListener('click', toggleAudio);

const toggleVideoButton = document.getElementById('toggleVideoButton');
toggleVideoButton.addEventListener('click', toggleVideo);

const shareScreenButton = document.getElementById('shareScreenButton');
shareScreenButton.addEventListener('click', shareScreen);
