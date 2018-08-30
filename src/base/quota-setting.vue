<template>
  <div class="quota-setting">
    <mu-paper :z-depth="3">
      <mu-list>
        <mu-list-item>
          <mu-list-item-title>
            <mu-flex align-items="center">
              <mu-flex justify-content="center" class="mar-right-5">
                <img :src="getIconUrl('icon-title')" style="width: 50%;">
              </mu-flex>
              <mu-flex justify-content="center" class="mar-right-5 info-title">分成比例：<span class="current-quto">{{currentQutoa}}</span></mu-flex>
            </mu-flex>
          </mu-list-item-title>
          <mu-list-item-action>
            <mu-flex>
              <mu-flex justify-content="center" class="text-color-gray" @click="openSelectQuota">请选择</mu-flex>
            </mu-flex>
          </mu-list-item-action>
        </mu-list-item>
      </mu-list>
    </mu-paper>
    <!-- 配额设定 -->
    <mu-paper :z-depth="3">
      <mu-list>
        <mu-list-item>
          <mu-list-item-title>
            <mu-flex align-items="center">
              <mu-flex justify-content="center" class="mar-right-5">
                <img :src="getIconUrl('icon-title')" style="width: 50%;">
              </mu-flex>
              <mu-flex justify-content="center" class="mar-right-5 info-title">配额设定</mu-flex>
            </mu-flex>
          </mu-list-item-title>
        </mu-list-item>
        <mu-divider></mu-divider>
        <mu-list-item>
          <mu-data-table :columns="quotaColumns" :data="quotaList">
            <template slot-scope="scope">
              <td>{{scope.row.gear}}</td>
              <td>{{scope.row.setQuota}}</td>
              <td v-if="scope.row.residualQuota!==-1">{{scope.row.residualQuota}}</td>
              <td v-if="scope.row.residualQuota===-1">无限</td>
            </template>
          </mu-data-table>
        </mu-list-item>
      </mu-list>
    </mu-paper>

    <!-- 底部选择分成比例sheet -->
    <mu-bottom-sheet :open.sync="openSelectSheet">
      <mu-appbar color="primary" class="select-quota-title">
        <mu-flex slot="right" @click="closeSelectQuota">确认</mu-flex>
      </mu-appbar>
      <mu-slide-picker :slots="qutoSlots" :visible-item-count="5" @change="quotaChange" :values="qutoDatas"></mu-slide-picker>
    </mu-bottom-sheet>
  </div>
</template>
<script type="text/javascript">
import {getIconUrl} from 'common/js/tools.js'

const qutoDatas = ['1% 无限', '3% 无限', '4% 无限', '5% 无限']

export default {
  data () {
    return {
      qutoDatas: ['1% 无限'],
      qutoSlots: [
        {
          width: '100%',
          textAlign: 'center',
          values: qutoDatas
        }
      ],
      openSelectSheet: false,
      currentQutoa: '1%',
      quotaColumns: [
        {
          title: '分成档位'
        },
        {
          title: '配额设定'
        },
        {
          title: '剩余配额'
        }
      ],
      quotaList: [
        {
          gear: '1%',
          setQuota: 'MAX',
          residualQuota: -1
        },
        {
          gear: '3%',
          setQuota: 'MAX',
          residualQuota: 100
        },
        {
          gear: '5%',
          setQuota: 'MAX',
          residualQuota: -1
        }
      ]
    }
  },
  created () {
    this.getIconUrl = getIconUrl
    this.recordQuotaList = this.quotaList
  },
  methods: {
    openSelectQuota () {
      this.openSelectSheet = true
    },
    closeSelectQuota () {
      this.openSelectSheet = false
    },
    normalizeQuotaList (quota) {
      this.quotaList = []
      for (var i = 0; i < this.recordQuotaList.length; i++) {
        let item = this.recordQuotaList[i]
        if (item.gear.substr(0, 1) < quota) {
          this.quotaList.push(item)
        }
      }
    },
    quotaChange (value, index) {
      this.currentQutoa = value.substr(0, 2)
      this.qutoDatas[0] = value
      this.normalizeQuotaList(value.substr(0, 1))
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/sass" scoped>
.quota-setting {
  .current-quto {
    color: red;
  }
}
.select-quota-title {
  padding: 0 16px;
}
</style>
