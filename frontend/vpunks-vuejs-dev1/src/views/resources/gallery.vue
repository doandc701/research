<template>
  <div class="gallery-resources-container">
    <h2 class="app-con-title">Gallery</h2>
    <p style="color: rgb(255, 255, 255, 0.8)">Community and official content on VPunks</p>

    <el-dialog
      title="Comment"
      :visible.sync="dialogVisible"
    >
      <div class="postDl">
        <el-row>
          <!-- <div class="left-box">
            <el-col :span="12">
              <el-carousel indicator-position="none">
                <el-carousel-item v-for="images in images" :key="images" :src="images">
                  <el-image
                    :src="images"
                    :fit="fit"
                  />
                </el-carousel-item>
              </el-carousel>
            </el-col>
          </div> -->
          <el-row>
            <el-col>
              <el-row class="list-items">
                <el-avatar :size="60" src="http://www.supercoloring.com/sites/default/files/fif/2018/08/ironman-mask-template-paper-craft.png" />
                <el-col :span="18" class="name-date">
                  <div>brownbear646</div>
                  <div class="online">Online</div>
                </el-col>
              </el-row>
              <el-row>
                <h3 class="captionDl">DJI Mavic Pro 2</h3>
              </el-row>
              <el-row>
                <div class="react">
                  <div class="like-dislike">
                    <i class="el-icon-lock" />
                    <i class="el-icon-unlock" />
                  </div>
                  <div class="comment">
                    <i class="el-icon-chat-line-square" />Comment
                  </div>
                </div>
              </el-row>
              <el-row class="list-cmt">
                <el-avatar :size="40" src="http://www.supercoloring.com/sites/default/files/fif/2018/08/ironman-mask-template-paper-craft.png" />
                <el-col :span="18">
                  <el-input v-model="input" placeholder="comment" />
                </el-col>
              </el-row>
              <el-scrollbar height="400px">
                <el-row class="list-cmt">
                  <el-avatar :size="40" src="http://www.supercoloring.com/sites/default/files/fif/2018/08/ironman-mask-template-paper-craft.png" />
                  <el-col :span="18">
                    <el-row>brownbear646</el-row>
                    <el-row>The study was repeated with three brands of hand sanitizers containing 55%, 85%, and 95% ethanol. Their blood alcohol level was measured by gas chromatography 30 minutes after the last application. </el-row>
                  </el-col>
                </el-row>
                <el-row class="list-cmt">
                  <el-avatar :size="40" src="http://www.supercoloring.com/sites/default/files/fif/2018/08/ironman-mask-template-paper-craft.png" />
                  <el-col :span="18">
                    <el-row>brownbear646</el-row>
                    <el-row>So yes, the alcohol (ethanol) in hand sanitizers can be absorbed through the skin, but no, it would not cause intoxication.</el-row>
                  </el-col>
                </el-row>
                <el-row class="list-cmt">
                  <el-avatar :size="40" src="http://www.supercoloring.com/sites/default/files/fif/2018/08/ironman-mask-template-paper-craft.png" />
                  <el-col :span="18">
                    <el-row>brownbear646</el-row>
                    <el-row>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti modi cupiditate soluta rem eius voluptates. Quisquam aliquid consequuntur, soluta doloremque obcaecati dicta animi voluptates repellendus quos nemo ullam, repudiandae totam?</el-row>
                  </el-col>
                </el-row>
              </el-scrollbar>
            </el-col>
          </el-row>
        </el-row>
      </div>
    </el-dialog>

    <div class="blogs-list">
      <el-row :span="12">
        <el-row class="list-items">
          <el-avatar :size="60" src="http://www.supercoloring.com/sites/default/files/fif/2018/08/ironman-mask-template-paper-craft.png" />
          <el-col :span="18" class="name-date">
            <div>Submitted by: Satoshi</div>
            <div style="color: rgb(255, 255, 255, 0.8)">Date: 2022-07-22</div>
          </el-col>
        </el-row>
      </el-row>
      <el-row>
        <template>
          <vue-show-more-text
            :text="captionLine"
            :lines="2"
            additional-container-css="margin:14px;"
            additional-content-css="font-size:16px;"
            additional-content-expanded-css="font-size:16px;"
            additional-anchor-css="font-size: 16px;"
          />
        </template>
      </el-row>
      <lightbox class="lightbox-tool" :cells="3" :items="images" />
      <el-row style="padding: 20px; text-align: right;">
        <el-button class="cmt-button" @click="dialogVisible = true"><i class="el-icon-chat-line-square" />Comment</el-button>
      </el-row>
    </div>
    <hr>
    <div class="blogs-list">
      <el-row :span="12">
        <el-row class="list-items">
          <el-avatar :size="60" src="http://www.supercoloring.com/sites/default/files/fif/2018/08/ironman-mask-template-paper-craft.png" />
          <el-col :span="18" class="name-date">
            <div>Submitted by: Satoshi</div>
            <div style="color: rgb(255, 255, 255, 0.8)">Date: 2022-07-22</div>
          </el-col>
        </el-row>
      </el-row>
      <el-row class="caption">
        <template>
          <vue-show-more-text
            :text="captionLine"
            :lines="3"
            additional-container-css="margin:14px;"
            additional-content-css="font-size:16px;"
            additional-content-expanded-css="font-size:16px;"
            additional-anchor-css="font-size: 16px;"
          />
        </template>
      </el-row>
      <lightbox class="lightbox-tool" :cells="3" :items="images2" />
      <el-row style="padding: 20px; text-align: right;">
        <el-button class="cmt-button" @click="dialogVisible = true"><i class="el-icon-chat-line-square" />Comment</el-button>
      </el-row>
    </div>
    <hr>
  </div>
</template>

<script>
import { nativeToken } from '@/settings'

import Vue from 'vue'
import Lightbox from '@morioh/v-lightbox'
import '@morioh/v-lightbox/dist/lightbox.css'
import vueShowMoreText from 'vue-show-more-text'

// global register
Vue.use(Lightbox)

export default {
  name: 'Gallery',
  components: {
    vueShowMoreText
  },
  // props: {
  //   cells: {
  //     type: Number
  //   }
  // },
  data() {
    return {
      dialogVisible: false,
      input: '',
      // general
      debug: false,
      address: null,
      nativeToken: nativeToken,
      //
      VPUAddress: null,
      VPULink: null,
      images: [
        'https://cdna.artstation.com/p/assets/images/images/051/650/606/large/angelo-martin-final-westside-render-portrait.jpg?1657816466',
        'https://cdna.artstation.com/p/assets/images/images/051/797/634/large/xiaosong-wang-4-exposure1.jpg?1658202142',
        'https://cdna.artstation.com/p/assets/images/images/048/178/814/large/nilian-animation-studio-legendary-pose.jpg?1649381218',
        'https://cdnb.artstation.com/p/assets/images/images/043/120/123/large/wizix-nakamoto-master-full.jpg?1636383169',
        'https://cdnb.artstation.com/p/assets/images/images/042/230/107/large/massimo-righi-14b5edb4-a838-41d6-87e9-1b87ad64c53a.jpg?1633952489',
        'https://cdnb.artstation.com/p/assets/images/images/044/645/373/large/ali-chenari-raper-gofy.jpg?1640712112'
      ],
      images2: [
        'https://cdnb.artstation.com/p/assets/images/images/042/230/107/large/massimo-righi-14b5edb4-a838-41d6-87e9-1b87ad64c53a.jpg?1633952489',
        'https://cdnb.artstation.com/p/assets/images/images/044/645/373/large/ali-chenari-raper-gofy.jpg?1640712112'
      ],
      captionLine: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, quidem. Aspernatur perspiciatis excepturi quisquam voluptatibus atque nesciunt, pariatur possimus et? Alias fuga perferendis voluptate facilis dolores quos, nemo labore explicabo.Lorem ipsum dolor sit amet, consectetur. Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio aperiam laborum neque voluptatibus est officia nesciunt, illo quae architecto nisi dolore blanditiis fugit tempore numquam voluptates, mollitia reiciendis itaque reprehenderit?`
    }
  },
  methods: {
    change(showAll) {
      console.log(showAll)
    }
  }
}
</script>
<style lang="scss">
.lb-grid {
    width: 100%;
    height: 327px;
    border-radius: 16px;
    position: relative;
    display: block;
}
.lb-item {
    position: absolute;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    border-top: none;
    border-right: 0;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
}
.lb-more {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    color: #fff;
    font-size: 3rem;
    background-color: rgba(0, 0, 0, 0);
}
.lb-tool {
    display: flex;
    justify-content: center;
}
.lb-grid-1 .lb-item {
    width: 100%;
    height: 100%;
}
.lb-item:hover, .lb-item:focus {
    opacity: 0.6;
}
.lightbox-tool {
  display: flex;
  justify-content: center;
}
.lb-modal-close {
  position: absolute;
  display: flex;
  right: 20px;
  top: 20px;
  width: 36px;
  height: 37px;
  opacity: 0.5;
  &::hover {
  opacity: 10px;
  }
  &::before, &::after {
    position: absolute;
    left: 15px;
    content: ' ';
    height: 33px;
    width: 2px;
    background-color: #333;
  }
  &::before {
    transform: rotate(45deg);
  }
  &::after {
    transform: rotate(-45deg);
  }
}
.lb-modal-next {
	box-sizing: border-box;
	position: absolute;
	top: 50%;
	transform: rotate(45deg);
	&::before {
		content: '';
    width: 33px;
    height: 33px;
		border-width: .2vmin .2vmin 0 0;
		border-style: solid;
		border-color: #fafafa;
		display: block;
		transform-origin: 100% 0;
	}
}
.lb-modal-prev {
	box-sizing: border-box;
	position: absolute;
	top: 50%;
	transform: rotate(225deg);
	&::before {
		content: '';
    width: 33px;
    height: 33px;
		border-width: .2vmin .2vmin 0 0;
		border-style: solid;
		border-color: #fafafa;
		display: block;
		transform-origin: 100% 0;
  }
}
.gallery-resources-container {
  .el-dialog {
    border-radius: 10px;
    outline: none;
    max-width: 490px;
    min-height: 650px;
    margin-top: 50px !important;
    .el-dialog__footer {
      display: none
    }
    .el-dialog__body {
      padding: 18px 20px;
    }
    .el-image {
      width: 468px;
      height: 500px;
    }
    .el-carousel__container {
      height: 500px;
    }
    .el-carousel--horizontal {
      border-radius: 16px
    }
    .react {
      display: flex;
      justify-content: space-around;
      .like-dislike {
        display: contents;
      }
    }
    .el-input__inner {
      background-color: #B3B3B3;
      color: #000;
      border-radius: 16px;
    }
    .list-cmt {
    display: flex;
    align-content: center;
    align-items: center;
    margin-top: 10px;
    justify-content: space-between
    }
    .postDl {
      background-color: rgba(0, 0, 0, 0.2);
      padding: 10px;
      border-radius: 16px;
    }
    .online {
      color: #6CE23E;
    }
    .captionDl {
      color: #00D4FF;
    }
  }
  .el-link.el-link--default {
    color: #1890ff !important;
  }
  .anchor {
    text-align: left;
  }
  .container {
    margin: 0;
    padding: 0;
  }
  @media screen and (max-width: 1600px) {
    .el-dialog {
      width: 90%;
    }
  }
}
</style>

<style lang="scss" scoped>
.gallery-resources-container {
  padding: 30px 30px 150px 30px;
  padding-left: min(max(10px, 4vw), 30px);
  padding-right: min(max(10px, 4vw), 30px);
  min-height: calc(100vh - 50px);
  // background: #fffbff;
  color: rgb(255, 255, 255, 0.95);
  .viewing-button-group {
    text-align: right;
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
  }
  .blogs-list {
    max-width: 1024px;
    margin: 0 auto;
  }
  .name-date {
    position: absolute;
    left: 70px;
  }
  .list-items {
    display: flex;
    align-content: center;
    align-items: center;
    // margin: 10px;
  }
  .image-list {
    display: flex;
    justify-content: center;
  }
  .cmt-button {
    padding: 10px;
    background-color: transparent;
    border: none;
    color: white;
  }
  hr {
  border: none;
  height: 1px;
  background: #898989;
  max-width: 900px;
  }
}
</style>
