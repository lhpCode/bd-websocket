import { generateRandomId, getTime } from "@/utils/index.js";

export class Ws {
  constructor(url, update) {
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
      console.log("连接已经建立", evnt);
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
      console.log("发生错误", evnt);
      vm.start();
    };
    this.websocket.onclose = function (evnt, code) {
      console.log("连接断开", evnt);
      console.log("code", code);
      vm.status = false;
    };
  }
  send(data) {
    this.message.push({
      type: 0,
      time: getTime(),
      message: data,
    });
    this.websocket.send(data);
    this.updateView(this.id);
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
