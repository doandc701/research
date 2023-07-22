<script setup lang="ts">
import { ref } from "vue";
import { sendTransaction, prepareSendTransaction } from "@wagmi/core";
import { BigNumber } from "@ethersproject/bignumber";
const to = ref("");
const amount = ref("");

async function handleSubmit(e: any) {
  console.log(BigNumber.from(amount.value));
  e.preventDefault();
  try {
    // chuẩn bị gửi đi một giao dịch, thực hiện request
    // to: địa chỉ ví
    // value: số tiền cần gửi
    const config = await prepareSendTransaction({
      request: {
        to: to.value,
        value: BigNumber.from(amount.value)
      }
    });
    // const result = await sendTransaction(config);
    // sendTransaction : sau khi gửi đi một giao dịch thì sever sẽ trả về địa chỉ giao dịch đó
    const { hash } = await sendTransaction(config);
    if (hash) {
      to.value = "";
      amount.value = "";
    }
    console.log("hash", hash);
  } catch (error) {
    console.log(error);
  }
}
</script>
<template>
  <div style="margin: 20px 0px; width: 300px">
    <form class="custom">
      <el-input aria-label="Recipient" placeholder="0xA0Cf…251e" v-model="to" />
      <el-input
        aria-label="Amount (ether)"
        placeholder="0.05"
        v-model="amount"
      />
      <el-button @click="handleSubmit">Send</el-button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.custom {
  & input {
    color: black;
  }
}
</style>
