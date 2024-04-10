import { app, BrowserWindow, globalShortcut, ipcMain } from "electron";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import {
  initWebsocket,
  closeWebsocket,
  emit,
  userList,
} from "./utils/webSocket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // preload: join(__dirname, "preload.js"),
      // 启用上下文隔离，这是推荐的安全实践
      contextIsolation: true,
      // 禁用远程模块，也是出于安全考虑
      enableRemoteModule: false,
      // 加载 ESM 格式的 preload 脚本
      preload: join(__dirname, "preload.cjs"),
      // 允许在 preload 脚本中使用 nodeIntegration
      nodeIntegration: false,
      // 允许在 preload 脚本中访问 contextBridge API
      contextIsolation: true, // 注意：这取决于您是否需要 contextIsolation
    },
  });
  win.loadFile("./dist/index.html");
};

// app.whenReady() ready 事件的专用监听
app.whenReady().then(() => {
  // 如果没有窗口打开则打开一个窗口(macOS)
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  ipcMain.on("server-ws", (_event, value) => {
    if (value) {
      console.log("initWebsocket");
      initWebsocket(value);
    } else {
      console.log("closeWebsocket");
      closeWebsocket();
    }
  });

  ipcMain.on("send-message", (_event, value) => {
    const { key, message } = value;
    const user = userList.get(key);
    if (user) {
      user.connection.send(message);
    }
    if (!key && !user) {
      userList.forEach((value, key) => {
        value.connection.send(message);
      });
    }
  });

  globalShortcut.register("CommandOrControl+k", () => {
    // 获取当前窗口
    BrowserWindow.getFocusedWindow().webContents.openDevTools();
  });

  createWindow();
  const window = BrowserWindow.getFocusedWindow();

  emit.on("message", (v) => {
    sendView(v, window);
  });

  emit.on("addServerList", (v) => {
    addServerList(v, window);
  });
});

// 关闭所有窗口时退出应用
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

const sendView = (request, window) => {
  if (window) {
    window.webContents.send("ws-message", {
      message: JSON.stringify(request),
    });
  }
};

const addServerList = (request, window) => {
  if (window) {
    window.webContents.send("ws-message", {
      addServerList: JSON.stringify(request),
    });
  }
};
