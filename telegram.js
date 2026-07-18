const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function sendMessage(chatId, text, keyboard = null) {
  const body = {
    chat_id: chatId,
    text,
    parse_mode: "HTML"
  };

  if (keyboard) {
    body.reply_markup = keyboard;
  }

  return fetch(`${API}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}

export async function getChatMember(channel, userId) {
  const res = await fetch(
    `${API}/getChatMember?chat_id=${channel}&user_id=${userId}`
  );

  return await res.json();
}
