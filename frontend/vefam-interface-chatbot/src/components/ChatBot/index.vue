<script setup lang="ts">
import { Client } from "colyseus.js";
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { IconifyIconOnline } from "../ReIcon";

// ...
const isCollapsible = ref(false);
const statusIcon = ref("fa:comments-o");
const unreadNotifications = ref(0);
const optIndexSelected = ref(0);
const isRotate = ref(false);
const loadingChat = ref(false);
const selectedChannel = ref("main-chat");
const channelViewOptions = ref([
  {
    label: "Main Chat",
    disabled: false,
    nameChannel: "main-chat",
    messageChat: [],
    messUnread: 0
  },
  {
    label: "development-diary",
    disabled: false,
    nameChannel: "test-chat",
    messageChat: [],
    messUnread: 0
  },
  {
    label: "vefam-vip-announcement",
    disabled: false,
    nameChannel: "test2-chat",
    messageChat: [],
    messUnread: 0
  }
]);
// method
const totalMessUnread = computed(() => {
  const getAllMessUnread = channelViewOptions.value.map(
    item => item.messUnread
  );
  return getAllMessUnread.reduce((total, current) => total + current);
});

function handleOptions(index: number, name: string) {
  const findArrayChat = channelViewOptions.value.find(
    item => item.nameChannel === name
  );
  if (findArrayChat) findArrayChat.messUnread = 0;
  unreadNotifications.value = totalMessUnread.value;
  selectedChannel.value = name;
  optIndexSelected.value = index;
  isRotate.value = false;
  scrollToBottom();
}

function handleVisibleChange(visible: boolean) {
  isRotate.value = visible;
}

function handleTriggerChat() {
  const getClassName = document.getElementById(
    "chat-bar-collapsible"
  ).className;
  const findArrayChat = channelViewOptions.value.find(
    item => item.nameChannel === selectedChannel.value
  );
  if (findArrayChat) findArrayChat.messUnread = 0;
  unreadNotifications.value = totalMessUnread.value;

  if (getClassName === "chat-bar-collapsible open") {
    isCollapsible.value = false;
    statusIcon.value = "fa:comments-o";
  } else {
    isCollapsible.value = true;
    statusIcon.value = "material-symbols:close-rounded";
  }
  scrollToBottom();
}

function handleOnMessage(message) {
  // console.log("Received message:", message);
  loadingChat.value = false;
  for (let msg in message) {
    channelViewOptions.value[msg].messageChat = message[msg];
  }
}
function handleReceived(received) {
  const findArrayChat = channelViewOptions.value.find(
    item => item.nameChannel === received.sender
  );
  findArrayChat.messageChat.push(received.mess);
  findArrayChat.messUnread++;
  unreadNotifications.value = totalMessUnread.value;
  if (isCollapsible.value) scrollToBottom();
  if (findArrayChat.messageChat.length >= 200) {
    findArrayChat.messageChat.splice(0, 1);
  }
}

async function handleConnectColyseus() {
  try {
    const client: Client = new Client("ws://localhost:2000");
    const room: Room<unknown> = await client.joinOrCreate("chat", {
      channel: "main-chat"
    });
    // console.log("joined successfully", room);
    loadingChat.value = true;
    room.onMessage("messages", handleOnMessage);
    room.onMessage("sendMessages", handleReceived);
  } catch (e) {
    console.error("join error", e);
  }
}

function handleFormatTime(time: number) {
  const convertTime = new Date(time);
  let getDay = convertTime.getDate();
  let getMonth = convertTime.getMonth() + 1;
  const getYear = convertTime.getFullYear();
  let getHours = convertTime.getHours();
  let getMinutes: any = convertTime.getMinutes();
  let resultNTN: string;
  let timeAfterFormat: string;
  let session = "AM";

  if (getHours == 0) {
    getHours = 12;
  } else if (getHours > 12) {
    getHours = getHours - 12;
    session = "PM";
  }

  getDay < 10 ? (getDay = "0" + getDay) : getDay;
  getMonth < 10 ? (getMonth = "0" + getMonth) : getMonth;
  getMinutes < 10 ? (getMinutes = "0" + getMinutes) : getMinutes;

  timeAfterFormat = `${getHours}:${getMinutes} ${session}`;

  if (getDay === new Date().getDate()) {
    resultNTN = "Today";
  } else {
    resultNTN = `${getDay}/${getMonth}/${getYear}`;
  }
  return `${resultNTN} ${timeAfterFormat}`;
}

function scrollToBottom() {
  const getChatContent = document.getElementById("chat-container");
  getChatContent.scrollTop = getChatContent.scrollHeight;
}

function handleDebouncedScroll(event) {
  const getChatBox = document.getElementById("chatbox");
  const findUnread = channelViewOptions.value.find(
    item => item.nameChannel === selectedChannel.value
  );
  if (
    event.target.clientHeight + event.target.scrollTop >=
    getChatBox.offsetHeight
  ) {
    findUnread.messUnread = 0;
    unreadNotifications.value = totalMessUnread.value;
  }
}
onMounted(async () => {
  const getChatContent = document.getElementById("chat-container");
  getChatContent.addEventListener("scroll", handleDebouncedScroll);
  handleConnectColyseus();
});
onBeforeUnmount(() => {
  const getChatContent = document.getElementById("chat-container");
  getChatContent.removeEventListener("scroll", handleDebouncedScroll);
});
</script>

<template>
  <div class="plugin-chat">
    <button
      id="chat-button"
      type="button"
      class="btn-collapsible"
      @click="handleTriggerChat"
    >
      <!-- Chat with us! -->
      <IconifyIconOnline class="chat-icon" :icon="statusIcon" />
      <span
        class="number-chats"
        :style="
          unreadNotifications > 0
            ? 'background-color:#de1f1f;'
            : 'background-color:unset'
        "
      >
        {{
          unreadNotifications <= 0
            ? ""
            : unreadNotifications >= 99
            ? "99+"
            : unreadNotifications
        }}</span
      >
    </button>
    <div
      id="chat-bar-collapsible"
      class="chat-bar-collapsible"
      :class="{ open: isCollapsible }"
    >
      <div class="chat-table">
        <div class="full-chat-block">
          <!-- Message Container -->
          <div class="outer-container">
            <div class="chat-header">
              <div class="header-message">
                <img
                  src="
                https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png"
                  alt=""
                  class="sc-header--img"
                />
                <div class="sc-header--title">
                  <!-- select channel -->
                  <el-dropdown
                    trigger="click"
                    popper-class="dropdown-channel"
                    @visible-change="handleVisibleChange"
                  >
                    <div class="select-channel">
                      {{ channelViewOptions[optIndexSelected].label }}
                      <IconifyIconOnline
                        style="margin-left: 5px"
                        icon="akar-icons:chevron-down"
                        class="icon-down"
                        :class="{ open: isRotate }"
                      />
                    </div>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item
                          class="dropdown-content"
                          v-for="(item, index) in channelViewOptions"
                          :key="index + item.label"
                          :disabled="item.disabled"
                          :class="optIndexSelected == index ? 'active' : ''"
                          @click="handleOptions(index, item.nameChannel)"
                        >
                          <div class="name-channel">
                            {{ item.label }}
                            <span
                              style="user-select: none"
                              :style="
                                item.messUnread > 0
                                  ? 'background-color:#de1f1f;'
                                  : 'background-color:unset'
                              "
                              class="number-chats"
                            >
                              {{
                                item.messUnread <= 0
                                  ? ""
                                  : item.messUnread >= 99
                                  ? "99+"
                                  : item.messUnread
                              }}
                            </span>
                          </div>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
                <div class="sc-header--close-button">
                  <IconifyIconOnline
                    icon="ic:round-close"
                    @click="handleTriggerChat"
                  />
                </div>
              </div>
            </div>
            <div id="chat-container" class="chat-container">
              <!-- Messages -->
              <div id="chatbox" class="chatbox">
                <div id="show-message" class="show-message">
                  <el-skeleton :loading="loadingChat" :rows="10" animated>
                    <div
                      v-for="message in channelViewOptions[optIndexSelected]
                        .messageChat"
                      :key="message._id"
                      id="botText"
                      class="botText"
                    >
                      <div class="infor-user-chat">
                        <img
                          src="https://picsum.photos/200/300"
                          alt=""
                          class="avt-chat"
                        />
                        <p class="name-chat">
                          {{ message.author }}
                        </p>
                        <p class="time-chat">
                          {{ handleFormatTime(message.time) }}
                        </p>
                      </div>
                      <div class="message-contents">
                        <span>{{ message.content }}</span>
                        <div v-if="message.attachments.length > 0">
                          <div v-for="att in message.attachments" :key="att.id">
                            <img
                              v-if="att.width"
                              :src="att.url"
                              :alt="att.name"
                              style="width: 200px"
                            />
                            <div v-else class="flex items-center">
                              <IconifyIconOnline
                                icon="material-symbols:file-present-outline"
                                style="font-size: 20px"
                              />
                              <span> {{ att.name }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-skeleton>
                </div>
              </div>
            </div>

            <div class="chat-footer">
              <a href="https://discord.gg/KXF7rbFc" target="_blank">
                <el-button type="primary" class="go-discord"
                  ><IconifyIconOnline icon="ic:baseline-discord" />
                  <span class="pl-1">Go to Discord</span></el-button
                >
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.plugin-chat {
  position: fixed;
  z-index: 99;
  .btn-collapsible {
    border-radius: 50%;
    background-color: rgb(82, 151, 255);
    width: 58px;
    height: 58px;
    cursor: pointer;
    padding: 20px;
    border-bottom: none;
    right: 30px;
    position: fixed;
    z-index: 99;
    bottom: 90px;
    outline: none;
    color: #ffff;
    transition: all 0.25s ease-in-out;
    .number-chats {
      position: absolute;
      top: -5px;
      right: -10px;
      width: 30px;
      height: 30px;
      line-height: 30px;
      border-radius: 50%;
      font-size: 14px;
    }
    .chat-icon {
      color: white;
      animation: 1s linear 1s infinite alternate scaleChat;
    }
    &:hover {
      box-shadow: 0px 0px 20px 5px #5297ff85;
      transform: scale(1.1);
    }
  }
  .chat-bar-collapsible {
    position: fixed;
    bottom: 165px;
    right: 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease-in-out;
    visibility: hidden;
    opacity: 0;

    &::before {
      content: "";
      position: absolute;
      width: 40px;
      height: 40px;
      background-color: #ffffff;
      bottom: -20px;
      right: 10px;
      transform: rotate(45deg);
      border-radius: 2px;
    }
    &.open {
      visibility: visible;
      opacity: 1;
      transform-origin: bottom right 60px;
      transform: translate(-10px, -10px);
    }

    .chat-table {
      max-height: 500px;
      .full-chat-block {
        width: 350px;
        background: white;
        text-align: center;
        overflow: auto;
        scrollbar-width: none;
        height: max-content;
        border-radius: 10px;

        .outer-container {
          min-height: 500px;
          bottom: 0%;
          position: relative;
          .chat-header {
            width: 100%;
            background-color: #1b85ff;
            & h1 {
              text-align: center;
              line-height: 30px;
              font-weight: 600;
            }
            .header-message {
              min-height: 50px;
              border-top-left-radius: 9px;
              border-top-right-radius: 9px;
              padding: 10px;
              box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
              position: relative;
              box-sizing: border-box;
              display: flex;
              color: #ffff;
              .sc-header--img {
                border-radius: 50%;
                align-self: center;
              }
              .sc-header--title {
                align-self: center;
                padding-left: 10px;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                font-size: 15px;
                font-weight: 600;
                flex: 1;
                .el-dropdown {
                  color: #ffff;
                  line-height: initial;
                  .select-channel {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .icon-down {
                      transition: all 0.25s;
                      &.open {
                        transform: rotate(-180deg);
                        transition: all 0.25s;
                      }
                    }
                  }
                }
              }
              .sc-header--close-button {
                align-self: center;

                margin-right: 10px;
                box-sizing: border-box;
                cursor: pointer;
                border-radius: 5px;
                margin-left: auto;
                font-size: 20px;
              }
            }
          }
          .chat-container {
            height: calc(100% - 54px - 52px);
            overflow: auto;
            min-height: 406px;
            max-height: 406px;
            width: 100%;
            bottom: 0;
            left: 0;
            scroll-behavior: smooth;

            &::-webkit-scrollbar {
              width: 8px;
              background-color: #f5f5f5;
            }
            &::-webkit-scrollbar-track {
              -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
              border-radius: 10px;
              background-color: #f5f5f5;
            }
            &::-webkit-scrollbar-thumb {
              border-radius: 10px;
              -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
              background-color: #d7cece;
            }
            .chatbox {
              .botText {
                color: #000;
                font-family: Helvetica;
                font-weight: normal;
                font-size: 16px;
                text-align: left;
                .infor-user-chat {
                  border-top-left-radius: 9px;
                  border-top-right-radius: 9px;
                  padding: 10px;
                  box-sizing: border-box;
                  display: flex;
                  .avt-chat {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    align-self: center;
                  }
                  .name-chat,
                  .time-chat {
                    align-self: center;
                    padding-left: 10px;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    font-size: 14px;
                    font-weight: 600;
                  }
                  .time-chat {
                    font-size: 12px;
                    font-weight: normal;
                  }
                }
                .message-contents {
                  padding: 0px 10px 0px 10px;
                  margin-left: 10px;
                  animation: floatup 0.5s forwards;
                  & span {
                    line-height: 1.5em;
                    display: inline-block;
                    padding: 10px;
                    border-radius: 8px;
                    border-bottom-left-radius: 2px;
                    max-width: 80%;
                    margin-left: 10px;
                    word-wrap: break-word;
                  }
                }
              }
            }
          }
          .chat-footer {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .chat-bar-input-block {
            display: flex;
            float: left;
            box-sizing: border-box;
            justify-content: space-between;
            width: 100%;
            align-items: center;
            background-color: rgb(235, 235, 235);
            border-radius: 10px 10px 0px 0px;
            padding: 10px 0px 10px 10px;
            .userInput {
              .input-box {
                float: left;
                border: none;
                box-sizing: border-box;
                width: 100%;
                border-radius: 10px;
                padding: 10px;
                font-size: 16px;
                color: #000;
                background-color: white;
                outline: none;
              }
            }
            .chat-bar-icons {
              display: flex;
              justify-content: space-evenly;
              box-sizing: border-box;
              width: 25%;
              float: right;
              font-size: 20px;
              cursor: pointer;
            }
          }
          .go-discord {
            font-weight: 500;
            font-size: 16px;
            margin: 10px;
            background-color: #5865f2;
            display: flex;
            align-items: center;
          }
        }
      }
      &.open {
        visibility: visible;
        opacity: 1;
      }
    }
  }
  @media screen and (max-width: 450px) {
    .chat-bar-collapsible {
      .chat-table {
        .full-chat-block {
          width: 300px;
        }
      }
    }
  }
  @media screen and (max-width: 400px) {
    .chat-bar-collapsible {
      bottom: 168px;
      .chat-table {
        .full-chat-block {
          width: 270px;
        }
      }
      &::before {
        bottom: -23px;
      }
    }
  }
}

@keyframes scaleChat {
  0% {
    transform: scaleX(1.4) scaleY(1.4);
    opacity: 0.5;
  }
  50% {
    transform: scaleX(1.2) scaleY(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scaleX(1) scaleY(1);
    opacity: 1;
  }
}
@keyframes floatup {
  from {
    transform: translateY(14px);
    opacity: 0;
  }
  to {
    transform: translateY(0px);
    opacity: 1;
  }
}
</style>
<style lang="scss">
.dropdown-channel {
  .el-dropdown-menu {
    background-color: #f2f2f2;
    overflow: hidden;
  }
  .el-dropdown-menu__item {
    color: #000000;
  }
  .el-dropdown-menu__item:not(.is-disabled):focus {
    background-color: rgb(225, 224, 224);
    color: #000000;
  }
  .dropdown-content {
    .name-channel {
      display: flex;
    }
    .number-chats {
      text-align: center;
      position: relative;
      top: -2px;
      right: -5px;
      width: 20px;
      height: 20px;
      color: #ffffff;
      border-radius: 50%;
    }
    &.active {
      color: #000000 !important;
      font-weight: 600;
    }
  }
  .el-popper__arrow::before {
    border-bottom-color: #e9e8e8fc;
    border-right-color: #e9e8e8fc;
    background: #e9e8e8fc !important;
    border-color: #e9e8e8fc !important;
  }
}
</style>
