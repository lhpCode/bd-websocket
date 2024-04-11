const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("versions", {
  serverWs: (value) => ipcRenderer.send("server-ws", value),
  sendMessage: (value) => ipcRenderer.send("send-message", value),
  receive: (channel, func) => {
    // 消息接收
    let validChannels = ["ws-message"];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
