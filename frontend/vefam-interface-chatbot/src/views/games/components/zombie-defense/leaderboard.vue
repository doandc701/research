<script setup lang="ts">
import { onMounted, ref, reactive, onUnmounted } from "vue";
import { ElMessageBox, ElLoading } from "element-plus";
import { game01Leaderboard } from "/@/api/game";

const leaderboardList = ref([]);
const openFullScreen2 = () => {
  const loading = ElLoading.service({
    lock: true,
    background: "rgba(0, 0, 0, 0.1)"
  });
  setTimeout(() => {
    loading.close();
  }, 500);
};
const deviceSize = ref("medium"); // medium / small / mini

// VPunk Games
const leaderboardBtnLoading = ref(false);

// Dialog Leaderboard

const dialogLeaderVisible = ref(false);
const dialogLeaderLoading = ref(false);
const dialogLeaderWidth = ref("90%");
const rewardText = ref("");
//
const listQuery = reactive({
  page: 1,
  limit: 20,
  importance: undefined,
  title: undefined,
  type: undefined,
  sort: "1"
});
const sortOptions = [
  { label: "Today", key: "1" },
  { label: "Other", key: "2" }
];
const dateinput1 = ref(null);
const dateinput2 = ref(null);
const day1 = ref(0);
const day2 = ref(0);

// date11111111
const size = ref<"large">("");

// ---------------------

onMounted(() => {
  handleWindowResize();
});
onUnmounted(() => {
  handleWindowResize();
});
function handleWindowResize() {
  const w = window.innerWidth;
  dialogLeaderWidth.value = w > 800 ? "90%" : w > 320 ? "100%" : "320px";
  deviceSize.value = w > 500 ? "small" : "mini";
}
function toDayNumber(dateString) {
  const d = new Date(dateString);
  const dUTC = new Date(
    Date.UTC(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds()
    )
  );
  return Math.floor(dUTC.getTime() / 86400000);
}
function handleLeaderboard() {
  console.log("handleLeaderboard-----------------------");
  if (listQuery.sort === "2") {
    dialogLeaderVisible.value = true;
    return;
  }
  leaderboardBtnLoading.value = true;
  getList();
}
function submitLeaderboard() {
  console.log("submitLeaderboard");
  day1.value = toDayNumber(dateinput1.value);
  day2.value = 0;
  if (dateinput2.value) day2.value = toDayNumber(dateinput2.value);
  console.log("day1.value", day1.value, "day2", day2.value);
  if (isNaN(day1.value)) {
    ElMessageBox.alert("The date (from) format is wrong", "Error!!", {
      type: "error"
    }).catch(() => {});
    return;
  }
  if (isNaN(day2.value)) {
    ElMessageBox.alert("The date (to) format is wrong", "Error!!", {
      type: "error"
    }).catch(() => {});
    return;
  }
  if (
    day1.value > 0 &&
    day2.value > 0 &&
    Math.abs(day2.value - day1.value) > 30
  ) {
    ElMessageBox.alert("Period of not more than 30 days", "Error!!", {
      type: "error"
    }).catch(() => {});
    return;
  }
  dialogLeaderLoading.value = true;
  openFullScreen2();
  getList();
}
function handleFilter() {
  if (listQuery.sort === "2") return;
  openFullScreen2();
  dialogLeaderLoading.value = true;
  listQuery.page = 1;
  getList();
}
function getList() {
  const { page, limit } = listQuery;
  let queryStr = `page=${page}&limit=${limit}`;
  if (listQuery.sort === "1") {
    queryStr = `${queryStr}&type=1`;
  } else {
    queryStr = `${queryStr}&type=2`;
    if (day1.value > 0) queryStr = `${queryStr}&day1=${day1.value}`;
    if (day2.value > 0) queryStr = `${queryStr}&day2=${day2.value}`;
  }
  console.log("queryStr--------------------------", queryStr);
  game01Leaderboard(queryStr)
    .then(result => {
      console.log("game01Leaderboard-result", result);
      dialogLeaderVisible.value = true;
      if (!result.data) return;
      if (result.data.errorMess.length > 0) {
        const htmlStr = result.data.errorMess.join("<br>");
        ElMessageBox.alert(htmlStr, "Error!!", {
          type: "error",
          dangerouslyUseHTMLString: true
        }).catch(() => {});
        return;
      }
      if (!result.data.winners) return;
      const data = result.data.winners;
      console.log("game01Leaderboard-result--data", data);
      let totalPower = 0;
      leaderboardList.value = [];
      console.log("Arry initial", leaderboardList);
      for (let i = 0; i < data.length; i++) {
        totalPower += data[i].winPower;
        const image = getVPunkImg(data[i].tokenId);
        const addressV = `${data[i].address.slice(0, 5)}...${data[
          i
        ].address.slice(data[i].address.length - 3)}`;
        leaderboardList.value.push({
          tokenId: data[i].tokenId,
          image: image,
          address: data[i].address,
          addressV: addressV,
          winPower: data[i].winPower
        });
        console.log(data[i]);
      }
      console.log("Arry push", leaderboardList);

      const reward = Math.floor((8000 / totalPower) * 100) / 100;
      rewardText.value = `<b>${data.length} Winners</b> and total <b>${totalPower} winning POWER</b><br>Reward ~${reward} VPU/POWER`;
      leaderboardBtnLoading.value = false;
      dialogLeaderLoading.value = false;
    })
    .catch(error => {
      console.log(error);
      leaderboardBtnLoading.value = false;
      dialogLeaderLoading.value = false;
    });
}
function getVPunkImg(id) {
  let imgId = "000" + id;
  imgId = imgId.slice(imgId.length - 4);
  // return "VPunks/punk"+imgId+".png";
  return `https://vpunks.com/images/vpunks/punk${imgId}.png`;
}
</script>

<template>
  <div class="btn-leaderboard">
    <el-button
      class="my-button01-medium"
      :loading="leaderboardBtnLoading"
      @click="handleLeaderboard"
      ><IconifyIconOnline icon="bxs:bar-chart-alt-2" /><span
        class="hide-text"
        style="margin-left: 5px"
      >
        Leaderboard</span
      ></el-button
    >
    <!-- Dialog Leaderboard -->
    <el-dialog
      v-loading="dialogLeaderLoading"
      v-model="dialogLeaderVisible"
      :width="dialogLeaderWidth"
      :class="{ deviceMini: deviceSize !== 'medium' }"
      append-to-body
    >
      <template #header>
        <span style="padding-right: 10px">Leaderboard</span>
        <el-select
          v-model="listQuery.sort"
          class="m-2"
          style="width: 140px"
          @change="handleFilter"
          popper-class="select-leaderboard-arrow"
        >
          <el-option
            v-for="item in sortOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
      </template>
      <div v-if="listQuery.sort === '2'">
        From:
        <!-- <el-input v-model="dateinput1" placeholder="YYYY-MM-DD" /> -->
        <div class="demo-date-picker">
          <div class="block">
            <el-date-picker
              v-model="dateinput1"
              type="date"
              placeholder="YYYY-MM-DD"
              :size="size"
            />
          </div>
        </div>
        To:
        <!-- <el-input v-model="dateinput2" placeholder="YYYY-MM-DD" /> -->
        <div class="demo-date-picker">
          <div class="block">
            <el-date-picker
              v-model="dateinput2"
              type="date"
              placeholder="YYYY-MM-DD"
              :size="size"
            />
          </div>
        </div>
        <p class="text-center" style="margin: 16px 0px">
          <el-button type="primary" @click="submitLeaderboard"
            >Submit</el-button
          >
        </p>
      </div>
      <p style="margin-bottom: 15px; line-height: 150%" v-html="rewardText" />
      <el-table
        :size="deviceSize"
        :data="leaderboardList"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="TokenId" min-width="70">
          <template v-slot="{ row }">
            {{ row.tokenId }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="VPunk" min-width="70">
          <template v-slot="{ row }"> <img :src="row.image" /> </template>
        </el-table-column>

        <el-table-column
          label="Winner"
          align="center"
          min-width="70"
          class-name="small-padding"
        >
          <template v-slot="{ row }">
            {{ row.addressV }}
          </template>
        </el-table-column>

        <el-table-column
          label="WinPower"
          align="center"
          min-width="70"
          class-name="small-padding"
        >
          <template v-slot="{ row }">
            {{ row.winPower }}
          </template>
        </el-table-column>
      </el-table>
      <!-- table setup -->
      <template #footer>
        <el-button :size="deviceSize" @click="dialogLeaderVisible = false"
          >Close</el-button
        >
      </template>
    </el-dialog>
    <!-- end: Dialog Leaderboard -->
  </div>
</template>
<style lang="scss">
.el-popper.is-light {
  background: rgb(24, 30, 61) !important;
}
// el-dialog
.el-dialog {
  background-color: #293366;
  border-radius: 10px;
  .el-dialog__header {
    color: #ffff;
    padding-bottom: 0px;
  }
}
.el-dialog__body {
  color: #ffff;
  .el-table {
    --el-table-tr-bg-color: #293366;
  }
}
// end: el-dialog

// el-table
.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  background-color: #f5f7fa12;
}
.el-table--border .el-table__cell {
  border-right: 1px solid rgba(0, 0, 0, 0.3137254901960784);
}
.el-table--border::after,
.el-table__border-left-patch,
.el-table__inner-wrapper::before {
  background-color: #1c2346;
}
.el-table td.el-table__cell {
  border-bottom: 1px solid rgba(0, 0, 0, 0.3137254901960784);
}
.el-table th.el-table__cell.is-leaf {
  border-bottom: 1px solid rgba(0, 0, 0, 0.3137254901960784);
}
.el-table--border .el-table__inner-wrapper::after {
  width: 0%;
}
// end: el-table
.el-select-dropdown__wrap {
  border-radius: 10px;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #21274f !important;
}
.select-leaderboard-arrow {
  .el-popper__arrow::before {
    background: #181e3d !important;
    border-color: #181e3d !important;
  }
}
</style>
<style lang="scss" scoped>
.my-button01-medium {
  background: linear-gradient(
    94.9deg,
    #00f6ff 0%,
    #5d7eff 48.44%,
    #5429a0 100%
  );
  border: none;
  color: white;
  border-radius: 10px;
  height: 35px;
  max-width: 100%;
  font-weight: 500;
  transition: all 0.25s ease-out;
}
.btn-leaderboard {
  text-align: right;
  margin-right: 5px;
  .el-button:focus,
  .el-button:hover {
    color: #ffff;
    background: linear-gradient(
      94.9deg,
      #00f6ff 0%,
      #7a94fa 48.44%,
      #573690 100%
    );
  }
}
// el-dialog
.el-dialog__body {
  .el-table--small {
    font-size: 16px;
    color: #ffff;
  }
}
:deep(.el-dialog) {
  background-color: #293366;
  border-radius: 10px;
}
// end: el-dialog

// el-input
:deep(.el-input__wrapper) {
  background-color: #1b2149;
  border: 1px solid #1b2149;
  box-shadow: unset;
}
:deep(.el-input__inner) {
  color: #ffff;
}
// el-input

// .el-table
:deep(.el-table) {
  --el-table-tr-bg-color: #293366;
}

:deep(th.el-table__cell) {
  background-color: #1b2149;
}
:deep(.el-table--small) {
  font-size: 16px;
  color: #ffff;
}
:deep(.el-table__cell) {
  padding: 10px 0px;
}
:deep(.el-table--border .el-table__inner-wrapper::after) {
  background-color: unset;
}

:deep(td.el-table_2_column_7.is-center.el-table__cell img) {
  display: inline;
}
:deep(.el-table__body tr.current-row > td.el-table__cell) {
  background-color: rgba(0, 0, 0, 0.10980392156862745);
}
// .el-table

// el-date
:deep(.el-date-editor.el-input) {
  width: 100%;
}

.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
  .block {
    padding: 5px 0;
    text-align: center;
    border-right: solid 1px var(--el-border-color);
    flex: 1;
  }
  .block:last-child {
    border-right: none;
  }
  .demonstration {
    display: block;
    color: var(--el-text-color-secondary);
    font-size: 14px;
    margin-bottom: 20px;
  }
  //
}
</style>
