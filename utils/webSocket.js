import { server } from "websocket";
import http from "http";
import events from "events";
const emit = new events();
// 通信线池
const userList = new Map();
let httpServer;
let websocketServer;
const initWebsocket = (path = 8080) => {
  // 启动 http
  httpServer = http.createServer().listen(path, () => {
    console.log("websocket: ", path);
  });
  // 创建 websocket 服务
  websocketServer = new server({
    httpServer: httpServer,
    autoAcceptConnections: false,
  });

  websocketServer.on("request", function (request) {
    const { host, key, resourceURL, resource } = request;
    const connection = request.accept();
    userList.set(key, {
      host: host + resource,
      resourceURL,
      connection,
    });
    sendViewUser();
    // 监听客户端发送的消息
    connection.on("message", function (message) {
      emit.emit("message", {
        ...message,
        host: host + resource,
      });
      // 发送消息给客户端（广播到各个客户端）
    });
    // 断开
    /**code
   * 1000：正常关闭；由客户端或服务器发起，表示连接已成功关闭。
     1001 到 1015：保留供将来使用。
     1006：异常关闭；连接异常中断，例如由于网络问题或浏览器关闭。
     4000 到 4999：由应用程序使用，表示特定的关闭原因。
   */
    connection.on("close", function close() {
      userList.delete(key);
      sendViewUser();
    });
  });
};
// 关闭服务
const closeWebsocket = () => {
  try {
    websocketServer.shutDown();
    httpServer.close(() => {
      httpServer = null;
      websocketServer = null;
      userList.clear();
      sendViewUser();
      console.log("Server closed");
    });
  } catch (err) {
    console.log(err);
  }
};

const sendViewUser = () => {
  emit.emit(
    "addServerList",
    [...userList].map((e) => ({
      key: e[0],
      host: e[1].host,
      resourceURL: e[1].resourceURL,
    }))
  );
};

export { initWebsocket, emit, userList, closeWebsocket };
