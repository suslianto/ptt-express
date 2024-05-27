const microphoneButton = document.getElementById("microphoneButton");
const ws = new WebSocket("wss://ptt-express.vercel.app:3000");

ws.onopen = () => {
console.log("Connected to server");
};

ws.onmessage = (event) => {
// Handle received message (e.g., play received audio)
const audioBlob = new Blob([event.data], { type: "audio/webm" });
const audioUrl = URL.createObjectURL(audioBlob);
const audio = new Audio(audioUrl);
audio.play();
};

ws.onclose = () => {
console.log("Disconnected from server");
};

let mediaRecorder;
let audioChunks = [];

microphoneButton.addEventListener("mousedown", async () => {
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
mediaRecorder = new MediaRecorder(stream);
mediaRecorder.ondataavailable = (event) => {
audioChunks.push(event.data);
};
mediaRecorder.start();
microphoneButton.innerHTML = '<i class="material-icons">mic</i>';
});

microphoneButton.addEventListener("mouseup", () => {
mediaRecorder.stop();
mediaRecorder.onstop = () => {
const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
audioChunks = [];
ws.send(audioBlob);
microphoneButton.innerHTML =
    '<i class="material-icons ">mic_off</i>';
};
});
