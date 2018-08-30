<template>
  <div class="link-card-list">
    <!-- <mu-container class="whole-screen-wrapper"> -->
      <mu-paper :z-depth="3" v-for="linkItem in linkList" :key="linkItem.name">
        <mu-list>
          <mu-list-item class="title">
            <mu-list-item-title>
              <mu-flex align-items="center">
                <mu-flex justify-content="center" class="mar-right-5">
                  <img :src="getIconUrl('icon-title')" style="width: 50%;">
                </mu-flex>
                <mu-flex justify-content="center" class="mar-right-5 info-title">{{linkItem.name}}</mu-flex>
              </mu-flex>
            </mu-list-item-title>
          </mu-list-item>
          <mu-divider></mu-divider>
          <mu-list-item class="link">
            <mu-list-item-title>{{linkItem.link}}</mu-list-item-title>
          </mu-list-item>
          <mu-divider></mu-divider>
          <mu-list-item class="options">
            <mu-list-item-title>
              <mu-flex align-items="center">
                <mu-flex fill justify-content="center" v-for="(optionItem, index) in options" :key="optionItem">
                  <mu-button v-if="index===0" fill color="primary" class="option-btn">{{optionItem}}</mu-button>
                  <mu-button v-if="index!==0" fill color="no-fill" class="option-btn" :style="getBlankBtnStyle">{{optionItem}}</mu-button>
                </mu-flex>
              </mu-flex>
            </mu-list-item-title>
          </mu-list-item>
          <mu-divider></mu-divider>
          <mu-list-item class="qrcode">
            <mu-list-item-title>
              <img :src="linkItem.qrcode">
            </mu-list-item-title>
          </mu-list-item>
          <mu-divider></mu-divider>
          <mu-list-item>
            <mu-list-item-title>
              <mu-flex align-items="center" class="register-count">可注册人数：<mu-badge :content="linkItem.num" color="#8e8e93"></mu-badge></mu-flex>
            </mu-list-item-title>
            <mu-list-item-action>
              <mu-flex align-items="center" class="register-count">已注册人数：<mu-badge :content="linkItem.usedNum" color="#8e8e93"></mu-badge></mu-flex>
            </mu-list-item-action>
          </mu-list-item>
        </mu-list>
      </mu-paper>
    <!-- </mu-container> -->
  </div>
</template>
<script type="text/javascript">
import {primaryColor} from 'common/js/config.js'
import {getIconUrl} from 'common/js/tools.js'

export default {
  props: {
    linkList: {
      type: Array,
      default () {
        return []
      }
    },
    options: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    getBlankBtnStyle () {
      return `color:${primaryColor};border: 1px solid ${primaryColor}`
    }
  },
  created () {
    this.getIconUrl = getIconUrl
  }
}
</script>
<style lang="scss" rel="stylesheet/sass" scoped>
.link-card-list {
  .mu-list {
    .link {
      background-color: #f5f5f5;
      .mu-item-title {
        color: #757575;
      }
    }
    .option-btn {
      width: 100%;
    }
    .qrcode {
      padding: 16px 0;
      img {
        display: block;
        margin: 0 auto;
      }
    }
    .register-count {
      color: #757575;
    }
    &:first-child {
      margin-top: 10px;
    }
  }
}
</style>
