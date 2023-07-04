console.log('Main JS!');

const videoGrid = document.getElementById('video-grid');
const messagesEl = document.querySelector('.messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('message-button');
const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');

const logMessage = (message) => {
  const newMessage = document.createElement('div');
  newMessage.innerText = message;
  messagesEl.appendChild(newMessage);
};

// caméra pour audio/video
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    // Afficher ma vidéo
    videoGrid.style.display = 'grid';
    localVideo.srcObject = stream;
    initConnection(stream);
  })
  .catch(error => console.log(error));

const initConnection = (stream) => {
  const socket = io('/');
  let localConnection;
  let remoteConnection;
  let localChannel;
  let remoteChannel;

  socket.on('other-users', (otherUsers) => {
    if (!otherUsers || !otherUsers.length) return;

    const socketId = otherUsers[0];
    localConnection = new RTCPeerConnection();

    stream.getTracks().forEach(track => localConnection.addTrack(track, stream));

    // Ice candidate
    localConnection.onicecandidate = ({ candidate }) => {
      candidate && socket.emit('candidate', socketId, candidate);
    };
  
    localConnection.ontrack = ({ streams: [ stream ] }) => {
      remoteVideo.srcObject = stream;
    };

    // Le chat
    localChannel = localConnection.createDataChannel('chat_channel');

    // Function Called When Receive Message in Channel
    localChannel.onmessage = (event) => logMessage(`Reçu: ${event.data}`);

    localChannel.onopen = (event) => logMessage(`Channel Changed: ${event.type}`);

    localChannel.onclose = (event) => logMessage(`Channel Changed: ${event.type}`);

    // offer
    localConnection
      .createOffer()
      .then(offer => localConnection.setLocalDescription(offer))
      .then(() => {
        socket.emit('offer', socketId, localConnection.localDescription);
      });
  });

  socket.on('offer', (socketId, description) => {
    remoteConnection = new RTCPeerConnection();

    stream.getTracks().forEach(track => remoteConnection.addTrack(track, stream));

    remoteConnection.onicecandidate = ({ candidate }) => {
      candidate && socket.emit('candidate', socketId, candidate);
    };
  
    remoteConnection.ontrack = ({ streams: [ stream ] }) => {
      remoteVideo.srcObject = stream;
    };

    remoteConnection.ondatachannel = ({ channel }) => {
      remoteChannel = channel;

      remoteChannel.onmessage = (event) => logMessage(`Receive: ${event.data}`);
      remoteChannel.onopen = (event) => logMessage(`Channel Changed: ${event.type}`);
      remoteChannel.onclose = (event) => logMessage(`Channel Changed: ${event.type}`);
    }

    // créer réponse
    remoteConnection
      .setRemoteDescription(description)
      .then(() => remoteConnection.createAnswer())
      .then(answer => remoteConnection.setLocalDescription(answer))
      .then(() => {
        socket.emit('answer', socketId, remoteConnection.localDescription);
      });
  });

  // réception réponse
  socket.on('answer', (description) => {
    localConnection.setRemoteDescription(description);
  });

  socket.on('candidate', (candidate) => {
    const conn = localConnection || remoteConnection;
    conn.addIceCandidate(new RTCIceCandidate(candidate));
  });

  sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    messageInput.value = '';
    logMessage(`Envoyé: ${message}`);

    const channel = localChannel || remoteChannel;
    // envoyer message youpi
    channel.send(message);
  });
}
