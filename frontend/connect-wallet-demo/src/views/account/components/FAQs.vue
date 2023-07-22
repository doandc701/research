<template>
  <el-card>
    <div class="collapse">
      <h3 style="border-bottom: 1px solid #5d7eff; padding-bottom: 10px">
        FAQs
      </h3>
      <el-collapse>
        <el-collapse-item title="What is C-Account?" name="1">
          <div>
            C-Account is a service account to uniquely identify a user. This is
            the account used to log in and join all online games published by
            VeFam.
          </div>
          <div>
            C-Account needs to be linked to your blockchain wallet to use the
            funding wallet (token deposit/withdrawal feature).
          </div>
        </el-collapse-item>

        <el-collapse-item title="How to create C-Account?" name="2">
          <div>
            If you don’t have a C-Account, please click Register then enter the
            required information and submit.
          </div>
          <div>By continuing, you agree to our Terms of Use.</div>
          <div>You have successfully created C-Account.</div>
        </el-collapse-item>

        <el-collapse-item title="What is D-Account?" name="3">
          <div>
            D-Account is your account on VeFam D-Account smart contract.
          </div>
          <div>
            Your D-Account is created when you do one of the following: register
            a VIP name or link your C-Account to your D-Account.
          </div>
          <div>D-Account tied to your blockchain wallet address</div>
        </el-collapse-item>

        <el-collapse-item
          title="What does it mean to link C-Account with D-Account?"
          name="4"
        >
          <div>
            Link C-Account with D-Account to confirm the wallet address you own.
          </div>
          <div>
            After linking you can deposit tokens through VeFam D-Account smart
            contract, balance will be added to funding wallet on your C-Account,
            you can use balance in online games published by VeFam.
          </div>
        </el-collapse-item>

        <el-collapse-item title="What is VeFam VIP Member?" name="5">
          <div>
            VeFam VIP Member also known as: VeFam VIP Name or VeFam VIP Card
          </div>
          <div>
            VIP members can invite friends to participate in VeFam's programs
            such as: VeFam VIP, Launchpad, Open sale mystery box, Games,... and
            receive commissions through two levels.
          </div>
        </el-collapse-item>

        <el-collapse-item
          title="How to register as a Vefam VIP member?"
          name="6"
        >
          <div>
            To register as a VIP member please click "Connect Wallet" then click
            "Register VIP now", and:
          </div>
          <div>
            Enter your VeFam VIP friend (referral code) in the Friend input.
          </div>
          <div>
            Enter the name you want to register in the Name input then press
            register.
          </div>
          <div>
            Note:
            <ul>
              <li>The VeFam VIP name must be between 2 and 32 characters</li>
              <li>Characters must be a-z, 0-9</li>
              <li>Can’t be only numbers</li>
              <li>
                One wallet address can register multiple VeFam VIP Names, a
                registration fee is required to prevent spam.
              </li>
            </ul>
          </div>
        </el-collapse-item>

        <el-collapse-item title="What is the offer for VIP members?" name="7">
          <div>
            VIP membership registration fee:
            <ul>
              <li>30% of the membership fee used as a rebate reward</li>
              <li>
                80% to first-level inviter (equivalent to 24% of the total), 20%
                to second-level inviter (equivalent to 6% of the total)
              </li>
            </ul>
          </div>
          <div>
            Launchpad:
            <ul>
              <li>X% of purchased amount used as rebate reward</li>
              <li>
                Y% for first-level inviter and Z% for second-level inviter
              </li>
              <li>
                X, Y, Z will be announced in detail in each program in the
                future.
              </li>
            </ul>
          </div>
        </el-collapse-item>

        <el-collapse-item title="Do you need help?" name="8">
          <div>
            If you're having difficulty, please join our Discord server and post
            in the #help channel and our community will be happy to help!
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
ul {
  padding-left: 30px;
  margin: 10px 0 20px 0;
  list-style: circle;
}
</style>
