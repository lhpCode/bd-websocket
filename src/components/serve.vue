<script setup>
import { ref, onMounted } from "vue";
import { getTime } from "../utils/index";
import { ElMessage } from "element-plus";
const props = defineProps(["userList", "messageList"]);
const emit = defineEmits(["addMessageList", "cleanMessageList"]);

const input = ref("9969");
const sendInput = ref("");
const disabled = ref(false);
const key = ref("");
const start = () => {
  disabled.value = true;
  window.versions.serverWs(input.value);
};
const stop = () => {
  disabled.value = false;
  window.versions.serverWs("");
};
const handKey = (v) => {
  key.value = v;
};

const sendMessage = (flag) => {
  const message = {
    key: flag ? key.value : "",
    message: sendInput.value,
  };
  if (flag && !key.value) {
    ElMessage.error("请选择用户");
    return;
  }
  emit("addMessageList", {
    type: 0,
    time: getTime(),
    message: sendInput.value,
  });
  window.versions.sendMessage(message);
};

const closeMessage = () => {
  emit("cleanMessageList");
};

const height = ref(0);

const getHeight = () => {
  const node = document.querySelector("#receive");
  height.value = node.clientHeight;
};
onMounted(() => {
  window.addEventListener("resize", getHeight);
});
</script>
<template>
  <div class="server">
    <div class="server-head">
      <span
        :style="{
          marginRight: '10px',
        }"
        >服务器地址：ws://127.0.0.1:{{ input }}</span
      ><el-input
        type="number"
        :disabled="disabled"
        v-model="input"
        style="width: 240px"
        placeholder="请输入地址"
      />
      <el-button :disabled="disabled" type="success" @click="start">
        创建服务
      </el-button>
      <el-button :disabled="!disabled" type="danger" @click="stop">
        停止服务
      </el-button>
    </div>
    <div class="content">
      <div class="user-list card">
        <div>连接列表</div>
        <ul class="infinite-list" style="overflow: auto">
          <li
            @click="handKey(i.key)"
            v-for="i in userList"
            :key="i.key"
            class="infinite-list-item"
            :class="{ 'change-key': i.key === key }"
          >
            {{ i.host }}
          </li>
        </ul>
      </div>
      <div class="message">
        <div class="send card message-content">
          <div>
            <span>发送区：</span>
            <el-button @click="sendMessage(true)"> 发送 </el-button>
            <el-button @click="sendMessage(false)"> 发送给全部 </el-button>
          </div>
          <div class="message-content">
            <el-input
              clearable
              type="textarea"
              v-model="sendInput"
              style="width: 240px"
              placeholder="Please input"
            />
          </div>
        </div>
        <div
          id="receive"
          class="receive card"
          :style="{
            marginTop: '10px',
          }"
        >
          <div>
            <span> 显示区：</span>
            <el-button @click="closeMessage"> 清空 </el-button>
          </div>
          <div
            class="message-box"
            :style="{
              height: `${height - 32}px`,
            }"
          >
            <ul class="message">
              <li
                class="message-item"
                v-for="(item, i) in messageList"
                :key="i"
              >
                <div>
                  <el-tag :type="item.type ? 'primary' : 'success'">{{
                    item.type ? "接收" : "发送"
                  }}</el-tag>
                  {{ item.time }}
                </div>
                <div>
                  {{ item.message }}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.server {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.card {
  padding: 5px;
  box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  box-sizing: border-box;
}

.server .server-head {
  display: flex;
  align-items: center;
}
.server .server-head span {
  width: 300px;
  color: #606266;
}
.server .server-head .el-input {
  margin-right: 10px;
}
.server .content {
  padding: 10px;
  margin-top: 10px;
  flex: 1;
  display: flex;
}
.server .content .user-list {
  text-align: center;
}
.server .content .user-list .infinite-list {
  min-width: 200px;
  height: 80vh;
  padding: 0;
  margin: 0;
  list-style: none;
  text-align: center;
}
.server .content .user-list .infinite-list .infinite-list-item {
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
  border-radius: 5px;
}
.server .content .user-list .infinite-list .change-key {
  background-color: #67c23a;
  color: #fff;
}
.content .message {
  margin-left: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.content .message .send,
.content .message .receive {
  height: 100%;
  /* flex: 1; */
  display: flex;
  flex-direction: column;
}
.content .message .message-content {
  flex: 1;
}
.content .message .el-textarea {
  width: 100% !important;
  height: 100%;
}
:deep(.el-textarea__inner) {
  height: 100%;
}
.content .message .receive .message-box {
  height: 200px;
  overflow-y: auto;
}
.content .message .receive .message-box .message .message-item {
  margin: 5px 0;
  word-break: break-all;
  word-wrap: break-word;
}
</style>
