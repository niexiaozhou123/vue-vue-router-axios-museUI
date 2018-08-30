<template>
  <div id="app">
  	<!-- 使用动态的 transition name -->
		<transition :name="transitionName">
		  <router-view></router-view>
		</transition>
    <!--<router-view></router-view>-->
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
      notificatioMsg: '',
      transitionName:'slide-left'
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
  },
  watch:{
  	$route(to,from){
  		if(to.meta.index>from.meta.index){
  			this.transitionName = 'slide-left';
  		}else{
  			this.transitionName = 'slide-right';
  		}
  	}
  }
}

</script>
<style type="text/css">
.mu-snackbar-message {
  color: #333 !important;
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 0.4s;
  position: absolute;
}
.slide-right-enter {
  opacity: 0.5;
  transform: translate3d(-100%, 0, 0);
  -webkit-transform:translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0.5;
  transform: translate3d(100%, 0, 0);
   -webkit-transform:translate3d(-100%, 0, 0);
}
.slide-left-enter {
  opacity: 0.5;
  transform: translate3d(100%, 0, 0);
  -webkit-transform:translate3d(-100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0.5;
  transform: translate3d(-100%, 0, 0);
  -webkit-transform:translate3d(-100%, 0, 0);
}
</style>
