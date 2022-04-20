const socket = io();
$(() => {
  $("#send").click(() => {
    const message = { name: $("#name").val(), message: $("#message").val() };
    postMessage(message);
  });
  getMessages();
});

socket.on("message", addMessage);

function addMessage(message) {
  if (message.name !== undefined && message.message !== undefined) {
    $("#messages").append(`<h4>${message.name}</h4><p>${message.message}</p>`);
  }
}
function getMessages() {
  $.get("http://localhost:3000/messages", (data) => {
    data.forEach(addMessage);
  });
}
function postMessage(message) {
  $.post("http://localhost:3000/messages", message);
}
