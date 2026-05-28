const NTFY_TOPIC = 'vapeshop33';

function sendTelegram(message) {
  var url = 'https://ntfy.sh/' + NTFY_TOPIC;
  var data = message.replace(/<[^>]*>/g, '');

  try {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'text/plain');
    xhr.send(data);
  } catch(e) {}
}
