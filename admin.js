import { sendMessage } from "./telegram.js";

export async function adminPanel(env, chatId) {
  await sendMessage(env, chatId, "👑 پنل مدیریت", {
    keyboard: [
      [{ text: "👥 تعداد کاربران" }, { text: "📋 لیست کاربران" }],
      [{ text: "📢 ارسال همگانی" }, { text: "➕ افزودن کانفیگ" }],
      [{ text: "🗑 حذف کانفیگ" }, { text: "📊 آمار ربات" }],
      [{ text: "🔙 بازگشت" }]
    ],
    resize_keyboard: true
  });
}

export async function adminCommands(env, message) {
  const chatId = message.chat.id;
  const text = message.text;

  if (message.from.id != 6057024269) return false;

  if (text === "/admin") {
    await adminPanel(env, chatId);
    return true;
  }

  if (text === "👥 تعداد کاربران") {
    const users = await env.USERS_DB.list({
      prefix: "user_"
    });

    await sendMessage(
      env,
      chatId,
      `👥 تعداد کاربران: ${users.keys.length}`
    );

    return true;
  }

  if (text === "📋 لیست کاربران") {
    const users = await env.USERS_DB.list({
      prefix: "user_"
    });

    let msg = "📋 لیست کاربران:\n\n";

    for (const key of users.keys) {
      const user = await env.USERS_DB.get(key.name, "json");

      msg += `👤 ${user.name}
🆔 ${user.id}
🔹 @${user.username || "-"}

`;
    }

    if (msg.length < 20) msg = "کاربری وجود ندارد.";

    await sendMessage(env, chatId, msg);

    return true;
  }

  if (text === "📊 آمار ربات") {
    const users = await env.USERS_DB.list({
      prefix: "user_"
    });

    await sendMessage(
      env,
      chatId,
`📊 آمار ربات

👥 کاربران:
${users.keys.length}

🤖 وضعیت:
فعال ✅`
    );

    return true;
  }

  return false;
}
