const { contextBridge, ipcRenderer } = require("electron");
// console.log("当前路径", __dirname);
// const ws = require("./utils/webSocket.cjs");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,

  counterValue: (value) => ipcRenderer.send("counter-value", value),

  serverWs: (value) => ipcRenderer.send("server-ws", value), // wsq
  sendMessage: (value) => ipcRenderer.send("send-message", value),
  receive: (channel, func) => {
    // 消息接收
    let validChannels = ["ws-message"];
    if (validChannels.includes(channel)) {
      // 剥离 event 对象，因为它包含 sender
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
