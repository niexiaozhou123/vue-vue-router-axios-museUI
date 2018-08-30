<template>
	<div class="home">
		<!-- 头部导航 start -->
		<mu-appbar color="primary" class='start'>
			<mu-button flat small slot="left" class="user-text" @click="togglePanel('openLeft')">
				<mu-icon value="menu"></mu-icon>&nbsp; 菜单
			</mu-button>
			代理系统
			<mu-button flat small slot="right" class="user-text" color="primary" @click="togglePanel('openRight')">
				<mu-icon value="person"></mu-icon>&nbsp; 个人信息
			</mu-button>
		</mu-appbar>
		
		<!--蒙层-->
		<mu-scale-transition>
			<div class="mengceng" v-if="ismengceng" @click="closePanel"></div>
		</mu-scale-transition>
		
		
		
		<!-- 账户信息简介 -->
		<mu-scale-transition>
			<mu-button fab small color="teal" v-if='topUp' class='top_style' @click='onTop'>
				<mu-ripple color="yellow" :opacity="0.5">
					<mu-icon value="arrow_upward"></mu-icon>
				</mu-ripple>			
			</mu-button>
		</mu-scale-transition>
		
		
		<mu-container @click='delInfo' ref='homeContext'>
			<mu-load-more @refresh="refresh" :refreshing="refreshing" ref="container">
				<mu-paper :z-depth="3" class="brief-info">
					<mu-list>
						<mu-list-item button :ripple="false">
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center">
										<!--	<img :src="getIconUrl('icon-accounts')" class="brief-user-icon mar-right-5">-->
										<mu-icon value='person' color='green' size='15' class='mar-right-5'></mu-icon>
									</mu-flex>
									<mu-flex justify-content="center">{{user.nickName}}</mu-flex>
								</mu-flex>
							</mu-list-item-title>
							<mu-list-item-action>
								<mu-flex align-items="center" @click='goPage("/user/info/")'>
									<mu-flex justify-content="center">更多</mu-flex>
									<mu-flex justify-content="center">
										<mu-icon value="keyboard_arrow_right" class="icon-right"></mu-icon>
									</mu-flex>
								</mu-flex>
							</mu-list-item-action>
						</mu-list-item>
					</mu-list>
				</mu-paper>

				<!-- 收益信息 -->
				<mu-paper :z-depth="3" class="income-info">

					<mu-list v-model='homeInfo.myTaxIncome'>
						<mu-list-item :ripple="false">
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" class="mar-right-5">
										<img :src="getIconUrl('icon-title')" style="width: 50%;">
									</mu-flex>
									<mu-flex justify-content="center" class="mar-right-5 info-title">收益信息</mu-flex>
									<mu-flex justify-content="center">
										<mu-switch v-model="showAllInfo" label="" color="primary" @change="showOrHideInfo"></mu-switch>
									</mu-flex>
								</mu-flex>
							</mu-list-item-title>
							<mu-list-item-action @click='goPage("/detail/")'>
								<mu-flex>
									<mu-flex justify-content="center" class="text-color-gray">详情</mu-flex>
									<mu-flex justify-content="center">
										<mu-icon value="keyboard_arrow_right" class="icon-right"></mu-icon>
									</mu-flex>
								</mu-flex>
							</mu-list-item-action>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item :ripple="false">
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" class="mar-right-5 text-color-gray">团队总流水</mu-flex>
									<mu-flex justify-content="center">
										<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="1"></mu-icon>
									</mu-flex>
									<mu-slide-top-transition>
										<span v-if='tuandui' class='helpInfo'>团队总流水：团队所有玩家提供的流水总额（直属玩家流水+下级团队玩家流水）</span>
										<span v-if='tuanduizheng' class='helpInfo'> 团队正流水：旗下玩家从系统赢走的流水总数</span>
										<span v-if='tuanduifu' class='helpInfo'>团队负流水：旗下玩家输给系统的流水总数</span>
									</mu-slide-top-transition>
								</mu-flex>
							</mu-list-item-title>
							<mu-list-item-action class="show-info-value" type='password' v-if='showAllInfo'> {{flow}}</mu-list-item-action>
							<mu-list-item-action class="show-info-value" type='password' v-else> {{flow2}}</mu-list-item-action>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item :ripple="false">
							<mu-list-item-title>
								<mu-flex direction="column">
									<mu-flex align-items="center">
										<mu-flex justify-content="center" class="mar-right-5">团队正流水</mu-flex>
										<mu-flex justify-content="center">
											<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="2"></mu-icon>
										</mu-flex>

									</mu-flex>
									<mu-flex class="text-color-gray" v-if='showAllInfo'>{{pflow}}</mu-flex>
									<mu-flex class="text-color-gray" v-else>{{pflow2}}</mu-flex>
								</mu-flex>
							</mu-list-item-title>
							<mu-list-item-action>
								<mu-flex direction="column">
									<mu-flex align-items="center">
										<mu-flex justify-content="center" class="mar-right-5 text-color-black">团队负流水</mu-flex>
										<mu-flex justify-content="center">
											<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="3"></mu-icon>
										</mu-flex>

									</mu-flex>
									<mu-flex class="text-color-gray" v-if='nflow&&showAllInfo'>-{{nflow}}</mu-flex>
									<mu-flex class="text-color-gray" v-if='!nflow'>0</mu-flex>
									<mu-flex class="text-color-gray" v-if='!showAllInfo'>{{nflow2}}</mu-flex>
								</mu-flex>
							</mu-list-item-action>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item :ripple="false">
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" class="mar-right-5">今日团队总流水</mu-flex>
									<mu-flex justify-content="center">
										<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="4"></mu-icon>
									</mu-flex>
									<mu-slide-top-transition>
										<span v-if='tuanduitodaycount' class='helpInfo'> 今日团队总流水：今天团队所有玩家提供的流水总额（直属玩家流水+下级团队玩家流水）</span>
										<span v-if='tuanduitodayzheng' class='helpInfo'>今日团队正流水：旗下玩家从系统赢走的流水总数</span>
										<span v-if='tuanduitodayfu' class='helpInfo'>今天团队负流水：旗下玩家输给系统的流水总数</span>
									</mu-slide-top-transition>
								</mu-flex>
							</mu-list-item-title>
							<mu-list-item-action class="show-info-value" v-if='showAllInfo'>{{flowToday}}</mu-list-item-action>
							<mu-list-item-action class="show-info-value" v-else>{{flowToday2}}</mu-list-item-action>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item :ripple="false">
							<mu-list-item-title>
								<mu-flex direction="column">
									<mu-flex align-items="center">
										<mu-flex justify-content="center" class="mar-right-5">今日团队正流水</mu-flex>
										<mu-flex justify-content="center">
											<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="5"></mu-icon>
										</mu-flex>
									</mu-flex>
									<mu-flex class="text-color-gray" v-if='showAllInfo'>{{pflowToday}}</mu-flex>
									<mu-flex class="text-color-gray" v-else>{{pflowToday2}}</mu-flex>
								</mu-flex>
							</mu-list-item-title>
							<mu-list-item-action>
								<mu-flex direction="column">
									<mu-flex align-items="center">
										<mu-flex justify-content="center" class="mar-right-5 text-color-black">今日团队负流水</mu-flex>
										<mu-flex justify-content="center">
											<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="6"></mu-icon>
										</mu-flex>

									</mu-flex>
									<mu-flex class="text-color-gray" v-if='nflowToday&&showAllInfo'>-{{nflowToday}}</mu-flex>
									<mu-flex class="text-color-gray" v-if='!nflowToday'>0</mu-flex>
									<mu-flex class="text-color-gray" v-if='!showAllInfo'>{{nflowToday2}}</mu-flex>
								</mu-flex>
							</mu-list-item-action>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item :ripple="false">
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" class="mar-right-5">今日个人税收收益</mu-flex>
									<mu-flex justify-content="center">
										<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="7"></mu-icon>
									</mu-flex>
									<mu-slide-top-transition>
										<span v-if='geren' class='helpInfo'>今天个人税收收益：今天团队税收收益总额-所有直属代理团队税收收益总额</span>
									</mu-slide-top-transition>
								</mu-flex>
							</mu-list-item-title>
							<mu-list-item-action class="show-info-value" v-if='showAllInfo'>{{taxIncomeToday}}</mu-list-item-action>
							<mu-list-item-action class="show-info-value" v-else>{{taxIncomeToday2}}</mu-list-item-action>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item :ripple="false">
							<mu-list-item-title>
								<span class="text-color-gray">提现额度：</span><span style="color: red;" v-if='showAllInfo'>{{taxIncome}}</span><span style="color: red;" v-if='!showAllInfo'>{{taxIncome2}}</span>
							</mu-list-item-title>
							<mu-list-item-action>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" class="mar-right-5">
										<mu-button small color="primary" class="withdraw-btn" @click="goPage('/manage/transfer/')">银行卡提现</mu-button>
									</mu-flex>
									<mu-flex justify-content="center">
										<mu-button small color="primary" class="withdraw-btn" @click='goPage("/manage/alipay/transfer/")'>支付宝提现</mu-button>
									</mu-flex>
								</mu-flex>
							</mu-list-item-action>
						</mu-list-item>
					</mu-list>

				</mu-paper>

				<!-- 我的代理 -->
				<mu-paper :z-depth="3" class="my-agent">

					<mu-list>
						<mu-list-item>
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" class="mar-right-5">
										<img :src="getIconUrl('icon-title')" style="width: 50%;">
									</mu-flex>
									<mu-flex justify-content="center" class="mar-right-5 agent-title">我的代理</mu-flex>
								</mu-flex>
							</mu-list-item-title>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item :ripple="false">
							<mu-row fill>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center" justify-content="center">
										<mu-flex color="primary" :style="getPrimaryColor">总计</mu-flex>
										<mu-flex class="text-color-gray">{{grouptotal}}人</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">今日新增</mu-flex>
										<mu-flex class="text-color-gray">{{groupnumtoday}}人</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">昨日新增</mu-flex>
										<mu-flex class="text-color-gray">{{groupnumyesterday}}人</mu-flex>
									</mu-flex>
								</mu-col>
							</mu-row>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item :ripple="false">
							<mu-row fill>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center" justify-content="center">
										<mu-flex color="primary" :style="getPrimaryColor">直属</mu-flex>
										<mu-flex class="text-color-gray">{{undernum}}人</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">今日新增</mu-flex>
										<mu-flex class="text-color-gray">{{undernumtoday}}人</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">昨日新增</mu-flex>
										<mu-flex class="text-color-gray">{{undernumyesterday}}人</mu-flex>
									</mu-flex>
								</mu-col>
							</mu-row>
						</mu-list-item>
					</mu-list>

				</mu-paper>

				<!-- 我的玩家 -->
				<mu-paper :z-depth="3" class="my-agent">

					<mu-list>
						<mu-list-item>
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" class="mar-right-5">
										<img :src="getIconUrl('icon-title')" style="width: 50%;">
									</mu-flex>
									<mu-flex justify-content="center" class="mar-right-5 agent-title">我的玩家</mu-flex>
								</mu-flex>
							</mu-list-item-title>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item :ripple="false">
							<mu-row fill>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center" justify-content="center">
										<mu-flex color="primary" :style="getPrimaryColor">总计</mu-flex>
										<mu-flex class="text-color-gray">{{tuanUserNum}}人</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">今日新增</mu-flex>
										<mu-flex class="text-color-gray">{{today_tuandui_registers}}人</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">昨日新增</mu-flex>
										<mu-flex class="text-color-gray">{{yesterday_tuandui_registers}}人</mu-flex>
									</mu-flex>
								</mu-col>
							</mu-row>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item :ripple="false">
							<mu-row fill>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center" justify-content="center">
										<mu-flex color="primary" :style="getPrimaryColor">直属</mu-flex>
										<mu-flex class="text-color-gray">{{underUserNum}}人</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">今日新增</mu-flex>
										<mu-flex class="text-color-gray">{{today_registers}}人</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">昨日新增</mu-flex>
										<mu-flex class="text-color-gray">{{yesterday_registers}}人</mu-flex>
									</mu-flex>
								</mu-col>
							</mu-row>
						</mu-list-item>
					</mu-list>

				</mu-paper>

				<!-- 推广链接 -->
				<mu-paper :z-depth="3" class="extend-link">

					<mu-list>
						<mu-list-item>
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" class="mar-right-5">
										<img :src="getIconUrl('icon-title')" style="width: 50%;">
									</mu-flex>
									<mu-flex justify-content="center" class="mar-right-5 info-title">推广链接</mu-flex>
								</mu-flex>
							</mu-list-item-title>
							<mu-list-item-action @click='goExtend'>
								<mu-flex>
									<mu-flex justify-content="center" class="text-color-gray">更多</mu-flex>
									<mu-flex justify-content="center">
										<mu-icon value="keyboard_arrow_right" class="icon-right"></mu-icon>
									</mu-flex>
								</mu-flex>
							</mu-list-item-action>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item class="show-link">
							<mu-list-item-title>{{extend.jumpUrl}}</mu-list-item-title>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item>
							<mu-row fill>
								<mu-col span="3.5" class="button-item">
									<mu-button color="primary" style="width: 100%;" v-clipboard:copy="imgcopy" v-clipboard:success="onCopy" v-clipboard:error="onError">复制链接</mu-button>
								</mu-col>
								<mu-col span="3.5" class="button-item">
									<mu-button color="no-fill" textColor="primary" :style="getPrimaryBorder" @click='extend_qr'>查看二维码</mu-button>
								</mu-col>
								<mu-col span="3.5">
									<mu-button color="no-fill" textColor="primary" :style="getPrimaryBorder" @click='extecd_look'>预览链接</mu-button>
								</mu-col>
							</mu-row>
						</mu-list-item>
					</mu-list>

				</mu-paper>
			</mu-load-more>
		</mu-container>

		<!-- 左侧菜单 start -->
		<mu-drawer class="panel" :open.sync="openLeft" :docked="docked" scrollable style='z-index: 20141250 !important;' >
			<mu-appbar color="primary" >
				代理系统
				<mu-button flat slot="right" class="user-text" color="primary" @click="closePanel">
					<mu-icon value="highlight_off" size="30"></mu-icon>
				</mu-button>
			</mu-appbar>
			<mu-container style='margin-top:0 !important;'>
				<mu-list v-for="menuPart in leftMenus" :key="menuPart[0].link" v-if="menuPart.length">
					<mu-list-item button :ripple="false" v-for="menuItem in menuPart" :key="menuItem.link" @click="goPage(menuItem.link)">
						<mu-list-item-action>
							<img class="menu-icon" :src="getIconUrl(menuItem.icon)">
						</mu-list-item-action>
						<mu-list-item-title>{{menuItem.name}}</mu-list-item-title>
						<mu-list-item-action>
							<mu-icon value="keyboard_arrow_right" class="icon-right"></mu-icon>
						</mu-list-item-action>
					</mu-list-item>
				</mu-list>
			</mu-container>
		</mu-drawer>

		<!-- 右侧菜单 start -->
		<mu-drawer class="panel" :open.sync="openRight" :docked="docked" :right="true" style='z-index: 20141250 !important;'>
			<mu-appbar color="primary">
				用户
				<mu-button flat slot="right" class="user-text" color="primary" @click="closePanel">
					<mu-icon value="highlight_off" size="30"></mu-icon>
				</mu-button>
			</mu-appbar>
			<mu-container style='margin-top:0 !important;'>
				<mu-list v-for="menuPart in rightMenus" :key="menuPart[0].link">
					<mu-list-item button :ripple="false" v-for="menuItem in menuPart" :key="menuItem.link" @click='goPage(menuItem.link)'>
						<mu-list-item-action>
							<img class="menu-icon" :src="getIconUrl(menuItem.icon)">
						</mu-list-item-action>
						<mu-list-item-title>{{menuItem.name}}</mu-list-item-title>
						<mu-list-item-action>
							<mu-icon value="keyboard_arrow_right" class="icon-right"></mu-icon>
						</mu-list-item-action>
					</mu-list-item>
				</mu-list>

			</mu-container>
		</mu-drawer>
		<!--二维码查看-->
		<mu-scale-transition>
		<mu-dialog class='img_dialog' :open.sync="openSimple">
			<img :src="imgsrc" />
		</mu-dialog>
		</mu-scale-transition>

		<mu-snackbar position="top" color="#fff" :open.sync="isShow">
			{{message}}
		</mu-snackbar>
	</div>

</template>
<script type="text/javascript">
	import {currentAgent} from 'common/js/config.js'
	import { getLeftMenus, rightMenus } from 'config/agent-menus.js'
	import { primaryColor } from 'common/js/config.js'
	import { getIconUrl } from 'common/js/tools.js'
	import eventBus from 'common/js/event-bus.js'

	export default {
		data() {
			return {
				openLeft: false,
				openRight: false,
				docked: true,
				position: 'left',
				ismengceng:false,
				leftMenus: [],
				rightMenus: [],
				teamTotalAccount: '11,321,913.41',
				recordTeamTotalAccount: '',
				withdrawLimit: '56,177.05',
				recordWithdrawLimit: '',
				showAllInfo: true,
				isShow: false,
				message: '',
				refreshing: false, //下拉刷新属性
				topwd: '********************',

				homeInfo: [],
				//流水
				flow: 0,
				flowToday: 0,
				nflow: null,
				nflowToday: null,
				pflow: 0,
				pflowToday: 0,
				taxIncome: 0,
				taxIncomeToday: 0,
				//加密流水
				flow2: '',
				flowToday2: '',
				nflow2: '',
				nflowToday2: '',
				pflow2: '',
				pflowToday2: '',
				taxIncome2: '',
				taxIncomeToday2: '',
				//代理
				grouptotal: 0,
				groupnumtoday: 0,
				groupnumyesterday: 0,
				undernum: 0,
				undernumtoday: 0,
				undernumyesterday: 0,
				//玩家
				tuanUserNum: 0,
				today_tuandui_registers: 0,
				yesterday_tuandui_registers: 0,
				underUserNum: 0,
				today_registers: 0,
				yesterday_registers: 0,

				//二维码
				extend: [],
				openSimple: false, // 查看二维码的弹框属性
				imgsrc: '',
				imgcopy: '',

				//提示信息
				tuandui: false,
				tuanduizheng: false,
				tuanduifu: false,
				tuanduitodaycount: false,
				tuanduitodayzheng: false,
				tuanduitodayfu: false,
				geren: false,

				user: null,
				topUp: false, //置顶按钮
			}
		},
		computed: {
			getPrimaryColor() {				
				return `color:${primaryColor};`
			},
			getPrimaryBorder() {
				return `border: 1px solid ${primaryColor};width: 100%;`
			}
		},
		created() {				
			this.$apps.spreadLogined(); //是否有登录状态  没有返回至login   开发环境下无效
			this.user = this.$apps.spreadUser(); //获取基本登录缓存数据
			this.baseAuth();			//获取菜单权限列表
			this.getIconUrl = getIconUrl;
			this.leftMenus = this._normalizeMenus(getLeftMenus());
			this.rightMenus = this._normalizeMenus(rightMenus);			
			this.load();
			
			
			
			//			console.log(this.$router.history.current.fullPath);

			//写定时器 监听滚动事件
			setInterval(this.checkingXY, 1000)
			document.documentElement.scrollTop = 0;
		},
		methods: {
			_normalizeMenus(menus) {
				if(menus.length <= 0) {
					return
				}

				let newMenus = [
					[],
					[],
					[]
				]
				for(let item in menus) {
					let menu = menus[item]
					switch(menu.part) {
						case 'one':
							if(newMenus[0]) {
								newMenus[0].push(menu)
							}
							break
						case 'two':
							if(newMenus[1]) {
								newMenus[1].push(menu)
							}
							break
						case 'three':
							if(newMenus[2]) {
								newMenus[2].push(menu)
							}
							break
						default:
					}

				}
				return newMenus
			},
			refresh() {
				//下拉刷新 并重载数据
				this.refreshing = true;
				this.$refs.container.scrollTop = 0;
				setTimeout(() => {
					this.refreshing = false;
				}, 1200)
				this.load();
			},			
			togglePanel(position) {
				if(position=='openLeft'){
					this.openRight = false;
				}else{
					this.openLeft = false;
				}
				this[position] = !this[position];
				this.ismengceng = true;
				
			},
			closePanel() {
				this.openLeft = false
				this.openRight = false
				this.ismengceng = false;
				
			},
			chnageTextToStar(str) {
				let starStr = ''
				for(let i = 0; i < str.length; i++) {
					starStr += '*'
				}
				return starStr
			},
			showOrHideInfo() {
				if(!this.showAllInfo) {

				}
			},
			goPage(url) {
				if(url == '/'){					
					location.pathname = '/dist/login/'+currentAgent+'/login.html';
//					console.log(location);
					return;
				}
				this.$router.push({
					path: url
				})
			},
			showModal(msg, time) {
				this.isShow = true;
				this.message = msg;
				time = time || 1500;
				setTimeout(() => {
					this.isHide()
				}, time)
			},
			isHide() {
				this.isShow = false;
				this.message = '';
			},
			baseAuth() {
//				window.location.replace('/');
				//角色菜单权限拿取
				this.$axios.post('api/user/userAuth', {
						token: this.user.token
					})
					.then((res) => {
//						console.log(res.data);
						if(res.data && res.data.status == 0 && res.data.data) {
							var mens = {};
							if(res.data.data.length > 0) {	
								var list = [];
								list = JSON.stringify(res.data.data);									
								mens.list = list;				
								localStorage.setItem('agent',mens)									
							} else {
								eventBus.$emit('showNotification','权限列表返回异常')
							}
						} else if(!res.data.status) {
							eventBus.$emit('showNotification','登录已过期')
						} else {
							eventBus.$emit('showNotification',res.data.msg)
						}
					})
					.catch(function(err) {
						eventBus.$emit('showNotification',err)
					})
			},
			load() {
				var self = this;
				self.showModal('正在加载数据..');
				self.$axios.post('api/main/index', {
						token: this.user.token
					})
					.then((response) => {
//						console.log(response)
						if(response.data && response.data.status == 0 && response.data.data) {
							//							console.log(response.data.data);
							self.homeInfo = response.data.data;
							//流水
							self.flow = parseFloat(response.data.data.myTaxIncome.flow);
							self.flowToday = parseFloat(response.data.data.myTaxIncome.flowToday);
							self.nflow = parseFloat(response.data.data.myTaxIncome.nflow);
							self.nflowToday = parseFloat(response.data.data.myTaxIncome.nflowToday);
							self.pflow = parseFloat(response.data.data.myTaxIncome.pflow);
							self.pflowToday = parseFloat(response.data.data.myTaxIncome.pflowToday);
							self.taxIncome = parseFloat(response.data.data.myTaxIncome.taxIncome);
							self.taxIncomeToday = parseFloat(response.data.data.myTaxIncome.taxIncomeToday);

							self.flow2 = this.topwd.substr(0, self.flow.toString());
							self.flowToday2 = this.topwd.substr(0, self.flowToday.toString());
							self.nflow2 = this.topwd.substr(0, self.nflow.toString());
							self.nflowToday2 = this.topwd.substr(0, self.nflowToday.toString());
							self.pflow2 = this.topwd.substr(0, self.pflow.toString());
							self.pflowToday2 = this.topwd.substr(0, self.pflowToday.toString());
							self.taxIncome2 = this.topwd.substr(0, self.taxIncome.toString());
							self.taxIncomeToday2 = this.topwd.substr(0, self.taxIncomeToday.toString());

							//代理 
							self.grouptotal = response.data.data.grouptotal;
							self.groupnumtoday = response.data.data.groupnumtoday;
							self.groupnumyesterday = response.data.data.groupnumyesterday;
							self.undernum = response.data.data.undernum;
							self.undernumtoday = response.data.data.undernumtoday;
							self.undernumyesterday = response.data.data.undernumyesterday;
							//玩家
							self.tuanUserNum = response.data.data.tuanUserNum;
							self.today_tuandui_registers = response.data.data.today_tuandui_registers;
							self.yesterday_tuandui_registers = response.data.data.yesterday_tuandui_registers;
							self.underUserNum = response.data.data.underUserNum;
							self.today_registers = response.data.data.today_registers;
							self.yesterday_registers = response.data.data.yesterday_registers;

							//二维码数据
							self.extend = response.data.data.userTemplate;
							self.imgcopy = response.data.data.userTemplate.jumpUrl;

						} else if(!response.data.status) {
							self.showModal('登录已过期')
						} else {
							self.showModal(response.data.msg);
						}

					})
					.catch(function(err) {
						console.log(err)
					})
			},
			extecd_look() {
				window.open(this.extend.jumpUrl);
			},
			extend_qr() {
				var url = this.extend.jumpUrl;
				let image = 'http://qr.liantu.com/api.php?bg=ffffff&amp;fg=000000&amp;el=l&amp;w=300&amp;m=4&amp;text=' + encodeURIComponent(url);
				//二维码有问题！！！
				this.openSimple = true;
				this.imgsrc = image;
			},
			onCopy(e) {
				this.showModal('已复制到剪切板!');
			},
			onError(e) {
				this.showModal('复制出问题了..请点击重试哦!!');
			},
			info(e) {
				let num = Number(e.target.attributes["data-num"].value);
				switch(num) {
					case 1:
						this.tuandui = !this.tuandui;
						break;
					case 2:
						this.tuanduizheng = !this.tuanduizheng;
						break;
					case 3:
						this.tuanduifu = !this.tuanduifu;
						break;
					case 4:
						this.tuanduitodaycount = !this.tuanduitodaycount;
						break;
					case 5:
						this.tuanduitodayzheng = !this.tuanduitodayzheng;
						break;
					case 6:
						this.tuanduitodayfu = !this.tuanduitodayfu;
						break;
					case 7:
						this.geren = !this.geren;
						break;
					default:
						return;
						break;
				}
			},
			delInfo() {
				if(this.tuandui) {
					this.tuandui = false;
				}
				if(this.tuanduizheng) {
					this.tuanduizheng = false;
				}
				if(this.tuanduifu) {
					this.tuanduifu = false;
				}
				if(this.tuanduitodaycount) {
					this.tuanduitodaycount = false;
				}
				if(this.tuanduitodayzheng) {
					this.tuanduitodayzheng = false;
				}
				if(this.tuanduitodayfu) {
					this.tuanduitodayfu = false;
				}
				if(this.geren) {
					this.geren = false;
				}if(this.openLeft){
					this.openLeft =false;
					this.ismengceng = false;
				}if(this.openRight){
					this.openRight = false;
					this.ismengceng = false;
				}

			},
			checkingXY() { // 屏幕滚动监听/置顶事件				
				var currentScroll = document.documentElement.scrollTop;
				if(currentScroll > 100) {
					this.topUp = true;
				}
			},
			onTop() {
				
				document.documentElement.scrollTop  = 0;
				document.body.scrollTop =0;
				clearInterval(0);
			},
			goExtend() {
				this.$router.push('/extend/');
			}

		}
	}
</script>

<style lang="scss" rel="stylesheet/sass" scoped>
	@import 'common/sass/variable.scss';
	.container {
		margin-top: 55px !important;
		padding-bottom: 30px;
		background-color: $bg-color-gray;
		.info-title {
			font-size: $font-size-medium-x;
		}
		.brief-info {
			margin: 8px 0;
			.mu-list {
				.brief-user-icon {
					width: 24px;
					height: 20px;
				}
			}
		}
		.income-info {
			.mu-list {
				.withdraw-btn {
					font-size: 13px;
				}
			}
		}
		.my-agent {
			margin-top: 10px;
			text-align: center;
			.agent-title {
				font-size: $font-size-medium-x;
			}
			.agent-info-item {
				position: relative;
				&:after {
					content: " ";
					position: absolute;
					top: 0;
					bottom: 0;
					right: 0;
					display: inline-block;
					width: 1px;
					background-color: #ccc;
				}
			}
		}
		.extend-link {
			margin-top: 10px;
			.show-link {
				background-color: #f5f5f5;
			}
			.button-item {
				margin-right: 5px;
			}
		}
	}
	
	.panel {
		position: fixed;
		
		overflow: scroll;
		background-color: #eee;
		.container {
			padding: 0;
			overflow-y: auto;
			overflow-x: hidden;
			height: calc(100vh - 50px);
			.mu-list {
				margin-top: 32px;
				background-color: #fff;
				.mu-item {
					.mu-item-action {
						&:last-child {
							position: relative;
							top: 7px;
							border-bottom: 1px solid #bbb;
						}
						.menu-icon {
							width: 24px;
							height: 24px;
						}
					}
					.mu-item-title {
						line-height: normal;
						height: auto;
						padding: 10px 0;
						border-bottom: 1px solid #bbb;
						font-size: $font-size-medium;
					}
				}
				&:last-child {
					margin-bottom: 32px;
				}
			}
		}
	}
	.mengceng{
		position: absolute;
		width: 100%;
		height: 110%;
		background-color:rgba(153,153,153,0.6);
		/*opacity: 0.6;*/
		z-index: 99999 !important;
		
	}
	
	.mu-drawer {
		bottom: -10px;
	}
	
	.img_dialog {
		background-color: rgb(153, 153, 153) !important;
		max-width: none !important;
		z-index: 20141272 !important;
		img {
			width: 100%;
			height: 100%;
		}
	}
	
	.mu-dialog-body {
		padding: 0 !important;
		z-index: 0 !important;
	}
	
	.start {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
	}
	
	.helpInfo {		
		overflow:initial;
		white-space: normal ;
		display: block;
		background-color: rgb(33,150,243);
		padding: 5px 10px !important;
		position: absolute;
		top: 30px;	
		color: #FFFFFF;
		text-align: center;
		font-size: 12px;
		line-height: 16px;
		z-index: 1000;
	}
	
	.top_style {
		position: fixed !important;
		bottom: 20px;
		right: 30px;
		z-index: 9999;
	}
</style>