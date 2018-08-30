<template>
	<div class="report-team">
		<!-- 头部导航 -->
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			团队报表
			<mu-button flat small slot="right" class="user-text" color="primary" @click="openSearchDialog">
				<mu-icon value="search" size="24"></mu-icon>搜索
			</mu-button>
		</mu-appbar>

		<!-- 内容主体 -->
		<mu-scale-transition>
			<mu-button fab small color="teal" v-if='topUp' class='top_style' @click='onTop'>
				<mu-ripple color="yellow" :opacity="0.5">
					<mu-icon value="arrow_upward"></mu-icon>
				</mu-ripple>
			</mu-button>
		</mu-scale-transition>
		

		<mu-container class="whole-screen-wrapper" @click='delInfo' @scroll='woListScroll($event)' style='margin-top: 10px !important; overflow: auto !important;'>
			<!-- 用户信息 -->
			<mu-load-more @refresh="refresh" :refreshing="refreshing" ref="container">
				<mu-flex class="user-info">
					<mu-flex align-items="center">
						<mu-icon value="person" class="user-icon"></mu-icon>
						<mu-flex>{{user.nickName}}</mu-flex>
					</mu-flex>
				</mu-flex>
				<!-- 团队总计 -->
				<mu-paper :z-depth="3" class="team-total" >
					<mu-list>
						<mu-list-item :ripple="false">
							<mu-list-item-title @click='team_count'>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" class="mar-right-5">
										<img :src="getIconUrl('icon-title')" style="width: 50%;">
									</mu-flex>
									<mu-flex justify-content="center" class="mar-right-5 info-title">团队总计</mu-flex>
									<mu-slide-top-transition>
										<span v-if='info1' class='helpInfo'>团队总流水：团队所有玩家提供的流水总额（直属玩家流水+下级团队玩家流水）</span>
									</mu-slide-top-transition>
								</mu-flex>
							</mu-list-item-title>
							<mu-list-item-action @click='team_count'>
								<mu-flex>
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
										<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num='1'></mu-icon>
									</mu-flex>
								</mu-flex>
							</mu-list-item-title>
							<mu-list-item-action class="show-info-value" :style="getPrimaryColor">{{total_flowing}}</mu-list-item-action>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item :ripple="false">
							<mu-list-item-title>
								<mu-flex direction="column">
									<mu-slide-top-transition>
										<span v-if='info3' class='helpInfo'>团队负流水：旗下玩家输给系统的流水总数	</span>
									</mu-slide-top-transition>
									<mu-flex align-items="center">
										<mu-flex justify-content="center" class="mar-right-5">团队正流水</mu-flex>
										<mu-flex justify-content="center">
											<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num='2'></mu-icon>
										</mu-flex>
									</mu-flex>
									<mu-flex class="text-color-gray">{{pflow}}</mu-flex>
								</mu-flex>
							</mu-list-item-title>
							<mu-list-item-action>
								<mu-flex direction="column">
									<mu-slide-top-transition>
										<span v-if='info2' class='helpInfo'>团队正流水：旗下玩家从系统赢走的流水总数</span>
									</mu-slide-top-transition>
									<mu-flex align-items="center">
										<mu-flex justify-content="center" class="mar-right-5 text-color-black">团队负流水</mu-flex>
										<mu-flex justify-content="center">
											<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num='3'></mu-icon>
										</mu-flex>
									</mu-flex>
									<mu-flex class="text-color-gray" v-if='nflow!=0&&nflow!=""'>-{{nflow}}</mu-flex>
									<mu-flex class="text-color-gray" v-else>0</mu-flex>
								</mu-flex>
							</mu-list-item-action>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item :ripple="false">
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" class="mar-right-5">今日个人税收收益</mu-flex>
									<mu-flex justify-content="center">
										<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num='4'></mu-icon>
									</mu-flex>
								</mu-flex>
							</mu-list-item-title>
							<mu-slide-top-transition>
								<span v-if='info4' class='helpInfo'>个人税收收益：团队税收收益总额-所有直属代理团队税收收益总额	</span>
							</mu-slide-top-transition>
							<mu-list-item-action class="show-info-value tax-profit">{{total_tax}}</mu-list-item-action>
						</mu-list-item>
					</mu-list>
				</mu-paper>
			</mu-load-more>

			<span class='tip_text' ref='tip_text' :style='{color:tip_textColor,background:tip_textbgc}'>{{tip_text}}</span>

			<!-- 团队报告列表 -->
			<report-list :reportListDatas="detailInfo" detailPageUrl="/report/team/detail/"></report-list>
			<!-- 搜索对话框 -->
			<mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="openSearch">
				<mu-appbar color="primary" title="团队报表">
					<mu-button slot="left" icon @click="openSearch=false">
						<mu-icon value="keyboard_backspace"></mu-icon>
					</mu-button>
				</mu-appbar>
				<mu-container style="padding: 16px;margin-top: 0 !important;">
					<mu-form :model="search" class="mu-demo-form" label-width="100">
						<mu-form-item>
							<mu-form-item class='search_title'>高级搜索</mu-form-item>
							<mu-divider></mu-divider>
						</mu-form-item>
						<mu-form-item label="代理搜索">
							<mu-text-field v-model="search.agentName" placeholder="请输入代理名称"></mu-text-field>
						</mu-form-item>
						<mu-form-item label="日期选择">
							<mu-row gutter align-items="center">
								<mu-col span="5">
									<mu-date-input v-model="search.startDate" help-text='开始日期' container="bottomSheet" :max-date="maxDate" :min-date="minDate" type='date'></mu-date-input>
								</mu-col>
								<mu-col span="2" style="color: #000;">至</mu-col>
								<mu-col span="5">
									<mu-date-input v-model="search.endDate" help-text='结束日期' container="bottomSheet" :max-date="maxDate" :min-date="minDate" type='date'></mu-date-input>
								</mu-col>
							</mu-row>
						</mu-form-item>
					</mu-form>
					<mu-button large color="primary" class="search-btn" @click="closeSearchDialog">提交</mu-button>
				</mu-container>
			</mu-dialog>
		</mu-container>

	</div>
</template>
<script type="text/javascript">
	import back from 'base/back'
	import reportList from 'base/report-list'
	import { primaryColor } from 'common/js/config.js'
	import { getIconUrl } from 'common/js/tools.js'
	import eventBus from 'common/js/event-bus.js'

	export default {
		data() {
			var maxDate = new Date();
			var minDate = new Date();
			minDate.setMonth(maxDate.getMonth() - 1);
			//			maxDate.setDate(0);
			//			minDate.setDate(31);
			return {
				user: null,
				refreshing: false,
				detailInfo: {},
				total_flowing: null,
				pflow: null,
				nflow: null,
				total_tax: null,
				openSearch: false,
				search: {
					agentName: '',
					startDate: '',
					endDate: ''
				},
				info1: false,
				info2: false,
				info3: false,
				info4: false,
				topUp: false,
				temp: null,
				maxDate,
				minDate,

				tip_text: '*仅展示近一个月内的报表数据',
				tip_textColor: '#f44336',
				tip_textbgc: 'none'
			}
		},
		computed: {
			getPrimaryColor() {
				return `color:${primaryColor};`
			}
		},
		created() {
			this.getIconUrl = getIconUrl;
			this.user = this.$apps.spreadUser();
			this.load();

		},
		methods: {
			openSearchDialog() {
				this.openSearch = true
			},
			closeSearchDialog() {
				let d1 = this.search.startDate;
				let d2 = this.search.endDate;
				if(!d1 || !d2) {
					eventBus.$emit('showNotification', '查询时间不能为空!')
					return;
				}
				if(this.search.startDate && this.search.endDate && d1 > d2) {
					eventBus.$emit('showNotification', '开始时间不能大于结束时间!')
					return;
				}
				this.search.startDate = this.$formatDate(this.search.startDate); //数据格式转换成string
				this.search.endDate = this.$formatDate(this.search.endDate);
				this.$axios.post('api/group/search', {
						token: this.user.token,
						begDate: this.search.startDate,
						endDate: this.search.endDate,
						agentName: this.search.agentName
					})
					.then((res) => {
						if(res.data && res.data.status == 0 && res.data.data) {
							var list = [];
							var count = res.data.data.data.length;
							for(var i = 0; i < count; i++) {
								res.data.data.data[i].total_flowing = this.$spreadFormat(res.data.data.data[i].total_flowing);
								res.data.data.data[i].total_tax = this.$spreadFormat(res.data.data.data[i].total_tax);
								list.push(res.data.data.data[i]);
							}
							this.detailInfo = list;
						} else if(!res.data.status) {
							eventBus.$emit('showNotification', '登录已过期')
						} else {
							eventBus.$emit('showNotification', res.data.msg)
						}
					})
					.catch(function(err) {
						eventBus.$emit('showNotification', err)
					})

				this.tip_text = '筛选条件:' + this.search.startDate + '--' + this.search.endDate + ' ' + this.search.agentName;
				this.tip_textColor = 'rgb(51,54,63)';
				this.tip_textbgc = 'rgb(255,255,255)';

				this.search.agentName = ''
				this.search.startDate = ''
				this.search.endDate = ''
				this.openSearch = false
			},
			load() {
				eventBus.$emit('showNotification', '正在加载数据..')
				this.$axios.post('api/group/index', {
						token: this.user.token
					})
					.then((response) => {
						if(response.data && response.data.status == 0 && response.data.data) {
							if(!response.data.data || response.data.data == '') {
								eventBus.$emit('showNotification', '暂无数据返回..')
								return;
							}
							var list = [];
							var count = response.data.data.data.length;
							for(var i = 0; i < count; i++) {
								response.data.data.data[i].total_flowing = this.$spreadFormat(response.data.data.data[i].total_flowing);
								response.data.data.data[i].total_tax = this.$spreadFormat(response.data.data.data[i].total_tax);
								list.push(response.data.data.data[i]);
							}
							this.detailInfo = list;
							this.total_flowing = this.$spreadFormat(response.data.data.total_flowing);
							this.pflow = this.$spreadFormat(response.data.data.pflow);
							this.nflow = this.$spreadFormat(response.data.data.nflow);
							this.total_tax = this.$spreadFormat(response.data.data.total_tax);
						} else if(!response.data.status) {
							eventBus.$emit('showNotification', '登录已过期')
						} else {
							eventBus.$emit('showNotification', response.data.msg)
						}
					})
					.catch(function(err) {
						eventBus.$emit('showNotification', err)
					})
			},
			info(e) {
				let num = Number(e.target.attributes["data-num"].value);
				switch(num) {
					case 1:
						this.info1 = !this.info1;
						break;
					case 2:
						this.info2 = !this.info2;
						break;
					case 3:
						this.info3 = !this.info3;
						break;
					case 4:
						this.info4 = !this.info4;
						break;
					default:
						return;
						break;
				}
			},
			delInfo() {
				if(this.info1) {
					this.info1 = false;
				} else if(this.info2) {
					this.info2 = false;
				} else if(this.info3) {
					this.info3 = false;
				} else if(this.info4) {
					this.info4 = false;
				}
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
			woListScroll(event) {
				var scrollTop = event.target.scrollTop;
				if(scrollTop > 1) {
					this.topUp = true;
				} else {
					window.clearInterval(this.temp);
					this.topUp = false;
				}
			},
			onTop() {
				var that = this;
				var num = setInterval(function() {
					that.$el.childNodes[4].scrollTop = that.$el.childNodes[4].scrollTop - 150 || 0;
				}, 50)
				that.temp = num;
				//				this.$el.childNodes[4].scrollTop= 0 ;
			},
			team_count() {
				var countInfo = this.detailInfo[0];
				this.$router.push({
					path: '/report/team/detail/',
					query: {
						Type: 'total',
						Id: countInfo.promoters_id,
						Name: countInfo.promoters_name,
					}
				})
			}
		},
		components: {
			'back': back,
			'report-list': reportList
		},

	}
</script>
<style lang="scss" rel="stylesheet/sass" scoped>
	.report-team {
		.user-info {
			margin-top: 5px;
			.user-icon {
				margin-right: 5px;
				color: #9F9F9F;
			}
		}
		.team-total {
			margin: 5px 0 10px;
			.tax-profit {
				color: #f44336;
			}
		}
	}
	.start {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
	}
	
	.mu-form-item {
		margin-bottom: 5px;
	}
	
	.search-btn {
		width: 100%;
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
	
	.search_title {
		font-size: 15px !important;
		color: rgb(33, 150, 243) !important;
	}
	
	.tip_text {
		padding-top: 5px !important;
		padding-left: 23% !important;
		width: max-content !important;
		margin: 0 auto !important;
		font-size: 12px !important;
	}
</style>