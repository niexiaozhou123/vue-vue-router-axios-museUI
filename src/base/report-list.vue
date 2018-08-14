<template>
  <div class="report-list">
    <mu-paper :z-depth="3" class="list-item" v-for="reportItem in reportListDatas" :key="reportItem.promoters_name" style='background-color: #FFFFFF !important;'>
      <mu-flex align-items="center" data-id = "reportItem.promoters_id" @click="toDetailPage(reportItem.promoters_id,reportItem.promoters_name)">
        <mu-flex class="item-image">
          <span class="text">{{reportItem.promoters_name}}</span>
          <img :src="getImgUrl(reportItem.children_count)">
        </mu-flex>
        <mu-flex fill class="list-content" direction="column" align-items="center">
          <mu-flex justify-content="center" class="content-info">团队总流水：{{reportItem.total_flowing}}</mu-flex>
          <mu-flex justify-content="center" class="content-info">个人税收收益：{{reportItem.total_tax}}</mu-flex>
        </mu-flex>
        <mu-flex fill justify-content="center">
          <mu-icon value="keyboard_arrow_right" class="icon-right"></mu-icon>
        </mu-flex>
      </mu-flex>
    </mu-paper>
  </div>
</template>
<script type="text/javascript">
import {prefix, currentAgent} from 'common/js/config.js'
export default {
  props: {
    reportListDatas: {
      type: Array,
      default () {
        return []
      }
    },
    detailPageUrl: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  methods: {
    getImgUrl (hasData) {
      let url = `${prefix}${currentAgent}-icon/`
      if (hasData) {
        url += 'icon-item-have.png'
      } else {
        url += 'icon-item-none.png'
      }
      return url
    },
    toDetailPage (id,name) {
      this.$router.push({ path: this.detailPageUrl,query:{Id:id,Name:name}})
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/sass" scoped>
  .list-item {
    margin-bottom: 10px;
    .item-image {
      position: relative;
      flex: 0 0 120px;
      line-height: 63px;
      height: 63px;
      color: #fff;
      img {
        display: block;
        width: 100%;
      }
      .text {
        position: absolute;
        top: 0;
        left: 5px;
      }
    }
    .list-content {
      .content-info {
        margin: 0 auto;
      }
    }
  }
</style>
