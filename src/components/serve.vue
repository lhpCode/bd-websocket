<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
const props = defineProps(["userList", "messageList"]);
const emit = defineEmits(["cleanMessageList"]);

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
  if (!flag) key.value = "";
  const user = props.userList.find((item) => item.key === key.value);
  const message = {
    key: key.value,
    message: sendInput.value,
    host: user ? user.host : "全部",
  };
  if (flag && !key.value) {
    ElMessage.error("请选择用户");
    return;
  }

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
                  <el-link type="primary">
                    {{ item.host ? item.host : item.message?.host }}</el-link
                  >
                  :{{ item.message }}
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
</style>
