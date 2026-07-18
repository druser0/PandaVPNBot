export default {
  async fetch(request, env) {
    return new Response("Panda VPN Bot v0.1", {
      headers: {
        "content-type": "text/plain; charset=utf-8"
      }
    });
  }
}
