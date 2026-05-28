const TELEGRAM_BOT_TOKEN = '8990430263:AAGQmAlhFR5JGNaQwlu9lJkRAOpPVH4UQi4';
const TELEGRAM_CHAT_ID = '2114826236';

function sendTelegram(message) {
  var url = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage?chat_id=' + TELEGRAM_CHAT_ID + '&text=' + encodeURIComponent(message) + '&parse_mode=HTML&disable_web_page_preview=true';
  try {
    var img = new Image();
    img.src = url;
  } catch(e) {}
}
