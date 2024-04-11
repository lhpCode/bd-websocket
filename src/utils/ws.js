import { generateRandomId, getTime } from "@/utils/index.js";
import { ElMessage } from "element-plus";
import { ElNotification } from "element-plus";
export class Ws {
  constructor(url, update, userList) {
    if (!url) return;
    this.time = 5000;
    this.timeLink = 0;
    this.websocket = null;
    this.url = url;
    this.id = generateRandomId();
    this.status = false;
    console.log("随机id", this.id);
    this.message = [];
    this.init();
    this.updateView = update;
    this.userList = userList;
  }
  init() {
    if ("WebSocket" in window) {
      this.websocket = new WebSocket(this.url);
      this.setSocket();
    }
  }
  setSocket() {
    const vm = this;
    this.websocket.onopen = function (evnt) {
      vm.status = true;
      vm.setStatus();
      ElNotification({
        title: "连接成功",
        message: "连接已经建立：" + this.url,
        type: "success",
      });
    };
    this.websocket.onmessage = function (evnt) {
      const { data } = evnt;
      vm.message.push({
        type: 1,
        time: getTime(),
        message: data,
      });
      vm.updateView(vm.id);
      console.log("接收", vm.message);
    };
    this.websocket.onerror = function (evnt) {
      ElNotification({
        title: "发生错误",
        message: "连接断开，正在尝试重新建立连接：" + this.url,
        type: "error",
      });
      vm.start();
    };
    this.websocket.onclose = function (evnt, code) {
      console.log(evnt);
      vm.status = false;
      vm.setStatus();
    };
  }
  setStatus() {
    this.userList.forEach((item) => {
      if (item.id === this.id) {
        item.status = this.status;
      }
    });
    this.updateView();
  }
  send(data) {
    if (this.status) {
      this.websocket.send(data);
      this.message.push({
        type: 0,
        time: getTime(),
        message: data,
      });
      this.updateView(this.id);
    } else {
      ElMessage.error("未连接,正在尝试重新连接");
    }
  }
  closeMessage() {
    this.message = [];
    this.updateView(this.id);
  }
  close() {
    this.websocket.close();
  }

  start() {
    const vm = this;
    this.timeLink = window.setTimeout(function () {
      console.log("尝试重新建立连接");
      vm.init();
    }, this.time);
  }
}
