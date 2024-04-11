<script setup>
import { ref } from "vue";
import Serve from "@/components/serve.vue";
import User from "@/components/user.vue";
import About from "@/components/about.vue";
import { getTime } from "./utils/index";

const userList = ref([]);
const messageList = ref([]);

try {
  window.versions.receive("ws-message", (data) => {
    const { message, addServerList, serverSendCallBack } = data;
    if (message) {
      const JSONmessage = JSON.parse(message);
      const host = JSONmessage.host;
      delete JSONmessage.host;
      const messageObj = {
        type: 1,
        time: getTime(),
        message: JSONmessage,
        host: host,
      };
      addMessageList(messageObj);
    }
    if (addServerList) {
      userList.value = JSON.parse(addServerList);
    }
    if (serverSendCallBack) {
      addMessageList(JSON.parse(serverSendCallBack));
    }
  });
} catch (err) {}

const activeName = ref("serve");

const handleClick = (tab, event) => {
  console.log(tab, event);
};
const addMessageList = (v) => {
  messageList.value.push(v);
};
const cleanMessageList = (v) => {
  messageList.value = [];
};
</script>

<template>
  <div class="ws">
    <el-tabs
      v-model="activeName"
      type="card"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane label="服务端" name="serve">
        <Serve
          :messageList="messageList"
          :userList="userList"
          @cleanMessageList="cleanMessageList"
        />
      </el-tab-pane>
      <el-tab-pane label="用户端" name="user">
        <User />
      </el-tab-pane>
      <el-tab-pane label="关于" name="about">
        <About />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.ws {
  padding: 10px;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
}
.el-tabs {
  display: flex;
  flex-direction: column;
  height: 100%;
}
:deep(.el-tabs__content) {
  flex: 1;
  overflow-y: auto;
}
:deep(.el-tabs__header) {
  padding: 0;
  margin: 0;
}
.el-tab-pane {
  height: 100%;
}
</style>
