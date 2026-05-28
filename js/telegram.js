const NTFY_TOPIC = 'vapeshop33';

function sendTelegram(message) {
  var data = message.replace(/<[^>]*>/g, '');
  var url = 'https://ntfy.sh/' + NTFY_TOPIC;
  var blob = new Blob([data], { type: 'text/plain' });
  navigator.sendBeacon(url, blob);
}
