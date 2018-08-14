<template>
  <div id="app">
    <router-view></router-view>
    <!-- 提示信息框，全局可用 -->
    <mu-snackbar position="top" color="#fff" :open.sync="showNotification">
      {{notificatioMsg}}
    </mu-snackbar>
  </div>
</template>

<script>
import eventBus from 'common/js/event-bus.js'

export default {
  name: 'App',
  data () {
    return {
      showNotification: false,
      notificatioMsg: ''
    }
  },
  created () {
    eventBus.$on('showNotification', (msg) => {
      this.notificatioMsg = msg
      this.showNotification = true
      setTimeout(() => {
        this.hideNotification()
      }, 1300)
    })
    eventBus.$on('hideNotification', () => {
      this.showNotification = false
    })
  },
  methods: {
    hideNotification () {
      this.showNotification = false
    },
    showModal(msg,time){
    	 this.showNotification = true;
    	 this.notificatioMsg = msg;
    	 setTimeout(() => {
        this.hideNotification()
      }, time)

    }
  }
}

</script>
<style>
.mu-snackbar-message {
  color: #333 !important;
}
</style>
