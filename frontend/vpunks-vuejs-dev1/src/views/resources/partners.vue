<template>
  <div class="smart-app-container">
    <img alt="inheriti" title="inheriti" class="inheriti" src="images/inheriti.png">
    <h3 class="app-con-title">Digital Inheritance, Secured</h3>
    <div class="intro-box">
      <p>Providing the management, protection,</p>
      <p>and distribution of digital assets</p>
      <p>to designated shareholders.</p>
      <p style="color:#fff;font-size: 15px;">* No subscription fees on Inheriti - Community Edition.</p>
      <p style="color:#000;font-size: 17px;">* Service provided by an affiliated partner.</p>
      <div style="margin: 40px 0;">
        <a href="https://app.inheriti.com/?refid=VP" target="_blank" rel="noopener">
          <el-button type="primary" class="inheriti-btn"><i class="el-icon-key" /> Create a Protection Plan</el-button> <!--🛠 Mint VPunks-->
        </a>
      </div>
    </div>
    <div class="partnership">
      <img alt="Safe Haven and VPunks" title="Safe Haven and VPunks" src="images/SafeHaven-and-VPunks.jpeg">
    </div>
  </div>
</template>

<script>

export default {
  name: 'Roadmap'
}
</script>

<style lang="scss" scoped>
  .app-con-title {
    font-size: 30px;
  }
  .inheriti {
    width: 30%;
    max-width: 200px;
    min-width: 120px;
  }
  .partnership {
    text-align:center;
  }
  .inheriti-btn {
    background-color: #83e;
    border-color: #83e;
  }
  .partnership img {
    width: 100%;
    max-width: 600px;
  }
  .intro-box {
    margin: 50px auto;
    padding: 1vw;
    font-size: min(max(15px, 1.6vw), 26px);
    line-height: 1.5;
  }
</style>
