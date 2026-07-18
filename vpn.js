import { sendMessage } from "./telegram.js";

export async function vpnCommands(env, message) {
  const chatId = message.chat.id;
  const text = message.text;

  if (text !== "📦 دریافت کانفیگ") {
    return false;
  }

  const config = await env.USERS_DB.get("vpn_config");

  if (!config) {
    await sendMessage(
      env,
      chatId,
      "❌ هنوز هیچ کانفیگی توسط مدیریت ثبت نشده است."
    );
    return true;
  }

  await sendMessage(
    env,
    chatId,
    `📦 کانفیگ شما:\n\n${config}`
  );

  return true;
}

export async function saveVpnConfig(env, configText) {
  await env.USERS_DB.put("vpn_config", configText);
}

export async function deleteVpnConfig(env) {
  await env.USERS_DB.delete("vpn_config");
}

export async function getVpnConfig(env) {
  return await env.USERS_DB.get("vpn_config");
}
