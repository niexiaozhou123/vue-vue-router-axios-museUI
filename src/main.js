import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui-message/dist/muse-ui-message.css';
import Message from 'muse-ui-message';
import VuePreview from 'vue-preview'
import theme from 'muse-ui/lib/theme'
import {agentThemes} from 'config/agent-theme.js'
// import fastclick from 'fastclick'
import 'common/sass/index.scss'
import {currentAgent} from 'common/js/config.js'
import axios from 'api/axios/index.js'
import httpUrl from 'api/http_url.js'
import VueClipboard from 'vue-clipboard2'
import spreadFormat from 'common/js/util.js'
import formatDate from 'common/js/util2.js'
import apps  from 'common/js/app.js'
import router from './router'
 

Vue.use(MuseUI)
Vue.use(VueClipboard)  //copy组件
Vue.use(Message)       //消息组件
Vue.use(VuePreview)    //图片查看组件
Vue.prototype.$axios = axios;  //axios请求

Vue.prototype.$spreadFormat = spreadFormat;  //double转换
Vue.prototype.$formatDate = formatDate;    //时间格式转换
Vue.prototype.$apps = apps;



/** 根据当前工作室自定义主题颜色 start **/
console.log('当前代理是:'+currentAgent);
theme.add('agent', {
  primary: agentThemes[currentAgent].color,
  secondary: '#ff4081',
  success: '#4caf50',
  warning: '#ffeb3b',
  'no-fill': '#fff'
}, 'light')
theme.use('agent')
/** 根据当前工作室自定义主题颜色 end **/
window.localStorage.setItem('agentTheme', agentThemes[currentAgent].color)

Vue.config.productionTip = false

// fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
