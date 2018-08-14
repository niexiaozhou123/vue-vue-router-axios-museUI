<template>
	<div class="report-play">
		<!-- 头部导航 -->
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			玩家报表
			<mu-button flat small slot="right" class="user-text" color="primary" @click="openSearchDialog">
				<mu-icon value="search" size="24"></mu-icon>搜索
			</mu-button>
		</mu-appbar>

		<!-- 内容主体 -->
		<mu-button fab small color="teal" v-if='topUp' class='top_style' @click='onTop'>
			<mu-icon value="arrow_upward"></mu-icon>
		</mu-button>

		<mu-container class="whole-screen-wrapper" @scroll='woListScroll($event)' style='margin-top: 0 !important; overflow: auto !important;'>
			<!-- 用户信息 -->
			<mu-load-more @refresh="refresh" :refreshing="refreshing" ref="container">
				<mu-flex class="user-info">
					<mu-flex align-items="center">
						<mu-icon value="person" class="user-icon"></mu-icon>
						<mu-flex>{{user.nickName}}</mu-flex>
					</mu-flex>
				</mu-flex>
				<!-- 团队总计 -->
				<mu-paper :z-depth="3" class="team-total">
					<mu-list>
						<mu-list-item :ripple="false">
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" class="mar-right-5">
										<img :src="getIconUrl('icon-title')" style="width: 50%;">
									</mu-flex>
									<mu-flex justify-content="center" class="mar-right-5 info-title">团队总计</mu-flex>
								</mu-flex>
							</mu-list-item-title>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item :ripple="false">
							<mu-list-item-title class='context'>
								<mu-flex align-items="center" style='display: flex !important; flex-direction:column  !important; padding: 20px !important;' class='left_text'>
									<mu-flex justify-content="center" class="mar-right-5 text-color-gray">团队玩家</mu-flex>
									<mu-flex style='padding-top: 15px !important;color:rgb(33,150,243) ;'>{{player_count}}</mu-flex>
								</mu-flex>
								<mu-flex align-items="center" style='display: flex !important; flex-direction:column  !important; padding: 20px !important;' class='right_text'>
									<mu-flex justify-content="center" class="mar-right-5 text-color-gray">团队流水</mu-flex>
									<mu-flex style='padding-top: 15px !important; color:rgb(33,150,243) ;'>{{cash_flow}}</mu-flex>
								</mu-flex>
							</mu-list-item-title>
						</mu-list-item>
						<mu-divider></mu-divider>
					</mu-list>
				</mu-paper>

				<span class='tip_text' ref='tip_text' :style='{color:tip_textColor,background:tip_textbgc}'>{{tip_text}}</span>

				<!-- 团队报告列表 -->
				<mu-paper :z-depth="3" class="list-item" v-for="item in reportListDatas" :key="item.agent_name" v-if='reportListDatas' style='background-color: #FFFFFF !important;'>
					<mu-flex align-items="center" data-id="item.agent_id" @click="toDetailPage(item.agent_id,item.agent_name)">
						<mu-flex class="item-image">
							<span class="text">{{item.agent_name}}</span>
							<img :src="getImgUrl(item.child_count)">
						</mu-flex>
						<mu-flex fill class="list-content" direction="column" align-items="center">
							<mu-flex justify-content="center" class="content-info">{{Type}}：{{item.player_count}}</mu-flex>
							<mu-flex justify-content="center" class="content-info">{{Type2}}：{{item.flow}}</mu-flex>
						</mu-flex>
						<mu-flex fill justify-content="center">
							<mu-icon value="keyboard_arrow_right" class="icon-right"></mu-icon>
						</mu-flex>
					</mu-flex>
				</mu-paper>

				<mu-paper :z-depth="3" class="list-item" v-model='agntInfo' v-if='agntInfo'>
					<mu-flex align-items="center" data-id="agntInfo.agent_id" @click="toDetailPage2(agntInfo.agent_id,agntInfo.agent_name)">
						<mu-flex class="item-image">
							<span class="text">{{agntInfo.agent_name}}</span>
							<img :src="getImgUrl(agntInfo.child_count)">
						</mu-flex>
						<mu-flex fill class="list-content" direction="column" align-items="center">
							<mu-flex justify-content="center" class="content-info">{{Type}}：{{agntInfo.player_count}}</mu-flex>
							<mu-flex justify-content="center" class="content-info">{{Type2}}：{{agntInfo.flow}}</mu-flex>
						</mu-flex>
						<mu-flex fill justify-content="center">
							<mu-icon value="keyboard_arrow_right" class="icon-right"></mu-icon>
						</mu-flex>
					</mu-flex>
				</mu-paper>

			</mu-load-more>
			<!-- 搜索对话框 -->
			<mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="openSearch">
				<mu-appbar color="primary" title="玩家搜索">
					<mu-button slot="left" icon @click="openSearch=false">
						<mu-icon value="keyboard_backspace"></mu-icon>
					</mu-button>

				</mu-appbar>
				<mu-container style="padding:0 16px;margin-top: 0 !important;">
					<mu-form :model="search" class="mu-demo-form">
						<mu-form-item class='choseType'>
							<span :style="{borderBottom:teamborder}" @click='chose'>团队玩家</span>
							<span :style="{borderBottom:agentborder}" @click='chose'>直属玩家</span>
						</mu-form-item>
						<mu-form-item>
							<mu-form-item class='search_title'>高级搜索</mu-form-item>
							<mu-divider></mu-divider>
						</mu-form-item>
						<mu-form-item label="玩家昵称">
							<mu-text-field v-model="search.agentName" placeholder="请输入玩家昵称"></mu-text-field>
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
	import { prefix, currentAgent } from 'common/js/config.js'

	export default {
		data() {
			var maxDate = new Date();
			var minDate = new Date();
			minDate.setMonth(maxDate.getMonth() - 1);
			return {
				user: null,
				refreshing: false,
				detailInfo: {},
				reportListDatas: {},
				agntInfo: {},

				player_count: null,
				cash_flow: 0,

				openSearch: false,
				search: {
					agentName: '',
					startDate: '',
					endDate: ''
				},

				topUp: false,
				temp: null,
				maxDate,
				minDate,

				tip_text: '*仅展示近一个月内的报表数据',
				tip_textColor: '#f44336',
				tip_textbgc: 'none',
				Type: '',
				Type2: '',
				includeGroup: 1,
				teamborder: '#2196F3 2px  solid',
				agentborder: '#ffffff 2px  solid'
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
			getImgUrl(hasData) {
				let url = `${prefix}${currentAgent}-icon/`
				if(hasData) {
					url += 'icon-item-have.png'
				} else {
					url += 'icon-item-none.png'
				}
				return url
			},
			toDetailPage(id, name) {
				this.$router.push({
					path: '/report/player/list/',
					query: {
						Id: id,
						Name: name
					}
				})
			},
			toDetailPage2(id, name) {
				this.$router.push({
					path: '/report/player/list/',
					query: {
						Id: id,
						Name: name
					}
				})
			},
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

				this.$router.push({
					path: '/report/player/searchlist/',
					query: {
						agentName: this.search.agentName,
						startDate: this.search.startDate,
						endDate: this.search.endDate,
						includeGroup: this.includeGroup
					}
				})
				this.search.agentName = ''
				this.search.startDate = ''
				this.search.endDate = ''
				this.openSearch = false
			},
			load() {
				eventBus.$emit('showNotification', '正在加载数据..')
				this.$axios.post('api/player/getAgent', {
						token: this.user.token
					})
					.then((response) => {
						if(response.data && response.data.status == 0 && response.data.data) {
							if(!response.data.data || response.data.data == '') {
								eventBus.$emit('showNotification', '暂无数据返回..')
								return;
							}
							var dataType;
							this.detailInfo = response.data.data;
							this.player_count = this.detailInfo.group.player_count;
							this.cash_flow = this.$spreadFormat(this.detailInfo.group.cash_flow);
							dataType = this.detailInfo.agent_children; //判断是直属玩家 还是团队
							if(dataType.length == 0 || dataType == '') {
								this.Type = '直属玩家';
								this.Type2 = '直属流水';
								this.agntInfo = this.detailInfo.agent;
								this.agntInfo.flow = this.$spreadFormat(this.agntInfo.flow);
								this.agntInfo.taxIncome = this.$spreadFormat(this.agntInfo.taxIncome);
							} else {
								this.Type = '团队玩家';
								this.Type2 = '团队流水';
								this.reportListDatas = this.detailInfo.agent_children;

								for(var i = 0; i < this.reportListDatas.length; i++) {
									this.reportListDatas[i].flow = this.$spreadFormat(this.reportListDatas[i].flow);
									this.reportListDatas[i].taxIncome = this.$spreadFormat(this.reportListDatas[i].taxIncome);
								}
								console.log('This is team!!')
							}

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
			chose(e) {
				var type = e.target.innerHTML;
				if(type == '团队玩家') {
					this.teamborder = '#2196F3 2px  solid';
					this.agentborder = '#ffffff 2px  solid';
					this.includeGroup = 1;
				} else {
					this.agentborder = '#2196F3 2px  solid';
					this.teamborder = '#ffffff 2px  solid';
					this.includeGroup = 0;
				}

			}

		},
		components: {
			'back': back,
			'report-list': reportList
		},

	}
</script>
<style lang="scss" rel="stylesheet/sass" scoped>
	.report-play {
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
	
	.mu-form-item {
		margin-bottom: 5px;
	}
	
	.search-btn {
		width: 100%;
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
	
	.context {
		height: 100px !important;
		display: flex !important;
		flex-direction: row !important;
		justify-content: space-between !important;
		padding: 0 40px !important;
	}
	
	.left_text {
		font-size: 20px !important;
		border-right: solid 0.1px rgb(176, 176, 176);
	}
	
	.right_text {
		font-size: 20px !important;
		border-left: solid 0.1px rgb(176, 176, 176);
	}
	
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
	
	.choseType {
		width: 100% !important;
		padding: 0 !important;
		margin: 0 !important;
		line-height: 3;
		font-size: 18px;
		font-weight: 800;
		display: flex;
		flex-direction: row;
		justify-content: center;
		span {
			padding-left: 30px;
			padding-right: 30px;
		}
	}
</style>