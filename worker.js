import { db } from "./database.js";

const BOT_TOKEN = "8817562619:AAEAlqE7jmKkjO5uqmaW0bkzDpiNBR0G7OQ";
const ADMIN_ID = 6057024269;
const CHANNEL = "@poryvpn";

export default {
  async fetch(request) {

    const url = new URL(request.url);

    if (url.pathname === "/webhook") {

      const update = await request.json();

      if (update.message) {

        const chatId = update.message.chat.id;
        const user = update.message.from;

        db.addUser({
          id: user.id,
          first_name: user.first_name,
          username: user.username || "ندارد"
        });


        if (update.message.text === "/start") {

          const keyboard = {
            keyboard: [
              [
                { text: "📦 خرید کانفیگ" },
                { text: "👤 حساب من" }
              ],
              [
                { text: "📢 کانال ما" },
                { text: "☎️ پشتیبانی" }
              ]
            ],
            resize_keyboard: true
          };


          await sendMessage(
            chatId,
            `سلام ${user.first_name} 👋

به ربات فروش کانفیگ خوش آمدید.

لطفاً ابتدا عضو کانال شوید:
${CHANNEL}`,
            keyboard
          );
        }


        if (update.message.text === "👤 حساب من") {

          const info = db.getUser(user.id);

          await sendMessage(
            chatId,
            `👤 اطلاعات شما:

🆔 آیدی:
${info.id}

نام:
${info.first_name}

تعداد کاربران ثبت شده:
${db.totalUsers()}`
          );
        }


        if (update.message.text === "📊 آمار") {

          if(user.id == ADMIN_ID){

            await sendMessage(
              chatId,
              `📊 آمار ربات:

👥 تعداد کاربران:
${db.totalUsers()}`
            );

          }
        }

      }

      return new Response("OK");
    }

    return new Response("Bot is running");
  }
};


async function sendMessage(chatId,text,keyboard){

  let body={
    chat_id:chatId,
    text:text
  };

  if(keyboard){
    body.reply_markup=keyboard;
  }


  await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(body)
    }
  );
}
