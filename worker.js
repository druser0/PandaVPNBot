const BOT_TOKEN = "8817562619:AAEAlqE7jmKkjO5uqmaW0bkzDpiNBR0G7OQ";
const ADMIN_ID = 6057024269;
const CHANNEL = "@poryvpn";


export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    if (url.pathname !== "/webhook") {
      return new Response("Bot Running");
    }

    const update = await request.json();

    if (!update.message) {
      return new Response("OK");
    }


    const chatId = update.message.chat.id;
    const user = update.message.from;
    const text = update.message.text || "";


    await saveUser(env, user);



    if (text === "/start") {

      await sendMessage(
        chatId,
`سلام ${user.first_name} 👋

به ربات Pory VPN خوش آمدید.

📢 کانال:
${CHANNEL}`,
{
 keyboard:[
  [
   {text:"👤 حساب من"},
   {text:"📦 دریافت کانفیگ"}
  ],
  [
   {text:"📢 کانال"},
   {text:"☎️ پشتیبانی"}
  ]
 ],
 resize_keyboard:true
}
);

    }



    else if (text === "👤 حساب من") {

      const data = await env.USERS_DB.get(
        "user_"+user.id,
        "json"
      );


      if(data){

        await sendMessage(
          chatId,
`👤 حساب شما:

🆔 آیدی:
${data.id}

👤 نام:
${data.name}

🔰 یوزرنیم:
${data.username}

📅 تاریخ عضویت:
${data.date}

وضعیت:
${data.status}`
        );

      }

    }




    else if (text === "/admin" && user.id == ADMIN_ID) {

      await sendMessage(
        chatId,
        "👑 پنل مدیریت Pory VPN",
        {
          keyboard:[
            [
              {text:"👥 تعداد کاربران"},
              {text:"📋 لیست کاربران"}
            ],
            [
              {text:"🔙 بازگشت"}
            ]
          ],
          resize_keyboard:true
        }
      );

    }



    else if (text === "👥 تعداد کاربران" && user.id == ADMIN_ID){

      const users = await env.USERS_DB.list({
        prefix:"user_"
      });


      await sendMessage(
        chatId,
        `👥 تعداد کاربران:
${users.keys.length}`
      );

    }



    else if (text === "📋 لیست کاربران" && user.id == ADMIN_ID){

      const users = await env.USERS_DB.list({
        prefix:"user_"
      });


      let msg="📋 کاربران:\n\n";


      for(const item of users.keys){

        const u = await env.USERS_DB.get(
          item.name,
          "json"
        );

        msg +=
`🆔 ${u.id}
👤 ${u.name}
🔰 ${u.username}

`;

      }


      await sendMessage(
        chatId,
        msg || "کاربری وجود ندارد."
      );

    }



    return new Response("OK");

  }
};



async function saveUser(env,user){

  const key="user_"+user.id;


  const old = await env.USERS_DB.get(key);


  if(!old){

    await env.USERS_DB.put(
      key,
      JSON.stringify({
        id:user.id,
        name:user.first_name,
        username:user.username || "ندارد",
        date:new Date().toISOString(),
        status:"فعال"
      })
    );

  }

}



async function sendMessage(chatId,text,keyboard){

  const body={
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
