import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke("ping"),
  counterValue: (value) => ipcRenderer.send("counter-value", value),
  // 除函数之外，我们也可以暴露变量
});
