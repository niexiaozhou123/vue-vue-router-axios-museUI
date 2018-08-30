<template>
	<div class="report-date" @click='delInfo'>
		<!-- 头部导航 -->
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			日度报表
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
			<mu-load-more @refresh="refresh" :refreshing="refreshing" ref="container" :loading='loading' @load="load2" loading-text='正在加载...'>
				<mu-flex class="user-info" style='display: flex; flex-direction: row !important; justify-content: space-between !important;'>
					<mu-flex align-items="center">
						<mu-icon value="person" class="user-icon"></mu-icon>
						<mu-flex>{{user.nickName}}</mu-flex>
					</mu-flex>
					<mu-flex align-items="center" style='padding-top: 5px;'>
						<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="1"></mu-icon>
					</mu-flex>
				</mu-flex>
				
				<mu-slide-top-transition>
					<span v-if='info1' class='helpInfo'>团队总流水：团队所有玩家提供的流水总额（直属玩家流水+下级团队玩家流水）  </br>
                                                                                    团队税收收益：团队的税收收益总额（团队总流水*计税税率*团队最高代理分红额度）	</span>
				</mu-slide-top-transition>
				
				<span class='tip_text' ref='tip_text' :style='{color:tip_textColor,background:tip_textbgc}'>{{tip_text}}</span>
				
				<!-- 日度报告列表 -->
				<mu-paper :z-depth="3" class="list-item" v-for="reportItem in detailInfo" :key="reportItem.date" style='background-color: #FFFFFF;'>
					<mu-flex align-items="center" data-id="reportItem.promoters_id" @click="toDetailPage(reportItem.date)">
						<mu-flex class="item-image">
							<span class="text">{{reportItem.date}}</span>
							<img :src="getImgUrl(reportItem.children_count!='')">
						</mu-flex>
						<mu-flex fill class="list-content" direction="column" align-items="center">
							<mu-flex justify-content="center" class="content-info">团队总流水：{{reportItem.flow}}</mu-flex>
							<mu-flex justify-content="center" class="content-info">个人税收收益：{{reportItem.income}}</mu-flex>
						</mu-flex>
						<mu-flex fill justify-content="center">
							<mu-icon value="keyboard_arrow_right" class="icon-right"></mu-icon>
						</mu-flex>
					</mu-flex>
				</mu-paper>
			</mu-load-more>
			<!-- 搜索对话框 -->
			<mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="openSearch">
				<mu-appbar color="primary" title="日度报表">
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
	import { prefix, currentAgent } from 'common/js/config.js'
	import reportList from 'base/report-list'
	import { primaryColor } from 'common/js/config.js'
	import { getIconUrl } from 'common/js/tools.js'
	import eventBus from 'common/js/event-bus.js'

	export default {
		data() {
			var maxDate = new Date();
			var minDate = new Date();
			minDate.setMonth(maxDate.getMonth() - 1);
			return {
				user: null,
				pagenum: 1,
				keyword: '',
				refreshing: false,
				loading: false,
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
			getImgUrl(hasData) {
				let url = `${prefix}${currentAgent}-icon/`
				if(hasData) {
					url += 'icon-item-have.png'
				} else {
					url += 'icon-item-none.png'
				}
				return url
			},
			toDetailPage(date) {
				this.$router.push({
					path: '/report/date/detail/',
					query: {
						Type: 'date',
						Date: date,
						agentName: this.keyword
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

				this.load();

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
				this.$axios.post('api/daily/search', {
						token: this.user.token,
						begDate: this.search.startDate,
						endDate: this.search.endDate,
						agentName: this.search.agentName,
						page: this.pagenum
					})
					.then((response) => {
						if(response.data && response.data.status == 0 && response.data.data) {
							if(!response.data.data || response.data.data == '') {
								eventBus.$emit('showNotification', '暂无数据返回..')
								return;
							}
							if(this.pagenum==1){
								var list = [];
								var count = response.data.data.list.length;
								for(var i = 0; i < count; i++) {
									response.data.data.list[i].flow = this.$spreadFormat(response.data.data.list[i].flow);
									response.data.data.list[i].income = this.$spreadFormat(response.data.data.list[i].income);
									list.push(response.data.data.list[i]);
								}
								this.detailInfo = list;
							}else{
//								var list = [];
								var count = response.data.data.list.length;
								for(var i = 0; i < count; i++) {
									response.data.data.list[i].flow = this.$spreadFormat(response.data.data.list[i].flow);
									response.data.data.list[i].income = this.$spreadFormat(response.data.data.list[i].income);
									this.detailInfo.push(response.data.data.list[i]);
								}
//								this.detailInfo = list;
							}
							

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
			load2() {
				this.pagenum = this.pagenum + 1;
				this.loading = true;
				setTimeout(() => {
					this.loading = false;
					this.$el.childNodes[4].scrollTop = 0;
					//			        this.detailInfo  = this.detailInfo+this.detailInfo;
				}, 1000)
				this.load();
			},
			info(e) {
				let num = Number(e.target.attributes["data-num"].value);
				switch(num) {
					case 1:
						this.info1 = !this.info1;
						break;
					default:
						return;
						break;
				}
			},
			delInfo() {
				if(this.info1) {
					this.info1 = false;
				}
			},
			refresh() {
				//下拉刷新 并重载数据
				this.refreshing = true;
				this.$refs.container.scrollTop = 0;
				setTimeout(() => {
					this.refreshing = false;
				}, 1200)
				this.detailInfo.length = 0;
				this.pagenum =1;
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

		},
		components: {
			'back': back,
			'report-list': reportList
		},

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