<script setup>
import { ref, onMounted, watch } from "vue";
import { toRaw } from "@vue/reactivity";
import { Ws } from "@/utils/ws.js";
import { ElMessage } from "element-plus";
import { getCurrentInstance } from "vue";

const instance = getCurrentInstance();
const key = ref("");
const updateView = (id) => {
  if (id !== key.value) return;
  instance.proxy.$forceUpdate();
};
const input = ref("ws://127.0.0.1:9969");
const height = ref(0);
const disabled = ref(false);
const getHeight = () => {
  const node = document.querySelector("#receive");
  height.value = node.clientHeight;
};
onMounted(() => {
  window.addEventListener("resize", getHeight);
});
const userList = ref([]);
const userListMap = new Map();
let wsNow;
const message = ref([]);

const start = () => {
  const ws = new Ws(input.value, updateView, userList.value);
  wsNow = ws;
  userListMap.set(ws.id, ws);
  userList.value.push({
    id: ws.id,
    url: ws.url,
    status: false,
  });
  key.value = ws.id;
  message.value = ws.message;
};
const deleteWs = (id) => {
  const ws = userListMap.get(id);
  if (!ws) return;
  ws.close();
  userListMap.delete(id);
  userList.value = userList.value.filter((item) => item.id !== id);
  key.value = "";
};
const sendInput = ref("");
const sendMessage = () => {
  if (!key.value) {
    ElMessage.error("请选择用户");
    return;
  }
  const ws = userListMap.get(key.value);
  if (!ws) return;
  ws.send(sendInput.value);
};
const closeMessage = () => {
  if (!wsNow) return;
  wsNow.closeMessage();
  message.value = wsNow.message;
};

const clickUser = (id) => {
  const ws = userListMap.get(id);
  key.value = id;
  if (!ws) return;
  wsNow = ws;
  message.value = ws.message;
};
</script>
<template>
  <div class="server">
    <div class="server-head">
      <el-input
        :disabled="disabled"
        v-model="input"
        style="width: 240px"
        placeholder="请输入地址:ws://xxx.xxx.xxx:xxx"
      />
      <el-button :disabled="disabled" type="success" @click="start">
        添加连接
      </el-button>
    </div>
    <div class="content">
      <div class="user-list card">
        <div>用户列表</div>
        <ul class="infinite-list" style="overflow: auto">
          <li
            @click="clickUser(i.id)"
            v-for="i in userList"
            :key="i.id"
            class="infinite-list-item"
            :class="{ 'change-key': i.id === key, error: !i.status }"
          >
            {{ i.url }}
            <div class="close" @click="deleteWs(i.id)">x</div>
          </li>
        </ul>
      </div>
      <div class="message">
        <div class="send card message-content">
          <div>
            <span>发送区：</span>
            <el-button @click="sendMessage"> 发送 </el-button>
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
          id="userReceive"
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
                v-for="(item, i) in message"
                :key="item.time"
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
@import url("./style.css");
.error {
  color: rgb(221, 41, 41) !important;
}
</style>
