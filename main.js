const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("./view/index.html");
};

// app.whenReady() ready 事件的专用监听

let message = "pong-";

app.whenReady().then(() => {
  console.log("==11111===");
  ipcMain.handle("ping", () => message);

  // 如果没有窗口打开则打开一个窗口(macOS)
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  ipcMain.on("counter-value", (_event, value) => {
    message = value;
    console.log("获取", value);
    ipcMain.handle("ping", () => message);
  });
  createWindow();
});
// app.on("ready",()=>{
//     createWindow()
// })

// 关闭所有窗口时退出应用
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
