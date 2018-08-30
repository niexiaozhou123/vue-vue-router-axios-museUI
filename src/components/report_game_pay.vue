<template>
	<div class="report-game-list">
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			充值记录

			<mu-button flat small slot="right" class="user-text" color="primary" @click="openSearchDialog">
				<mu-icon value="search" size="24"></mu-icon>搜索
			</mu-button>
		</mu-appbar>
		
		<mu-scale-transition>
			<mu-button fab small color="teal" v-if='topUp' class='top_style' @click='onTop'>
				<mu-ripple color="yellow" :opacity="0.5">
					<mu-icon value="arrow_upward"></mu-icon>
				</mu-ripple>				
			</mu-button>
		</mu-scale-transition>

		<mu-container style="padding:0 16px;overflow: hidden;">
			<mu-load-more @refresh="refresh" :refreshing="refreshing" ref="container">
				<mu-form :model='name'>
					<mu-form-item class='choseType'>
						<span :style="{borderBottom:teamborder}" @click='chose'>充值记录</span>
						<span :style="{borderBottom:agentborder}" @click='chose'>提现记录</span>
					</mu-form-item>
				</mu-form>

				<span class='tip_text' ref='tip_text' :style='{color:tip_textColor,background:tip_textbgc}'>{{tip_text}}</span>

				<mu-paper :z-depth="3" v-for='(item,index) in datalist' :key='index' v-show='noData==false'>
					<mu-list>
						<mu-list-item  class='infoName'>
							<mu-list-item-action class='infoTitle_msg'>{{item.name}}</mu-list-item-action>
							<mu-list-item-content></mu-list-item-content>
							<mu-list-item-action ></mu-list-item-action>
						</mu-list-item>
						<mu-list-item avatar>
							<mu-list-item-action>
								订单编号<span class="infoText"> </span>
							</mu-list-item-action>
							<mu-list-item-content></mu-list-item-content>
							<mu-list-item-action>
								充值金额 <span class="infoText">{{item.amount}}</span>
							</mu-list-item-action>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item avatar>
							<mu-list-item-action>
								充值方式<span class="infoText">{{item.pay_type}}</span>
							</mu-list-item-action>
							<mu-list-item-content></mu-list-item-content>
							<mu-list-item-action>
								充值状态<span class="infoText">{{item.status}}</span>
							</mu-list-item-action>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item avatar>
							<mu-list-item-action>
								发起时间
							</mu-list-item-action>
							<mu-list-item-content></mu-list-item-content>
							<mu-list-item-action></mu-list-item-action>
						</mu-list-item>
					</mu-list>
				</mu-paper>
				
				<label v-show="noData" class="noData">暂无数据</label>

			</mu-load-more>

			<!-- 搜索对话框 -->
			<mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="openSearch">
				<mu-appbar color="primary" title="充值记录">
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
						<mu-form-item label="玩家搜索">
							<mu-text-field v-model="search.agentName" placeholder="请输入玩家名"></mu-text-field>
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
	import { primaryColor } from 'common/js/config.js'
	import eventBus from 'common/js/event-bus.js'
	export default {
		data() {
			var maxDate = new Date();
			var minDate = new Date();
			minDate.setMonth(maxDate.getMonth() - 1);
			return {
				user: null,
				maxDate,
				minDate,
				name: {},
				types: 'recharge',
				teamborder: '#2196F3 2px  solid',
				agentborder: 'rgb(250,250,250) 2px  solid',
				pagenum: 1,
				search: {
					agentName: '',
					startDate: '',
					endDate: ''
				},
				datalist: {},
				gameId: '',
				refreshing: false,

				openSearch: false,
				tip_text: '*仅展示近一个月内的报表数据',
				tip_textColor: '#f44336',
				tip_textbgc: 'none',
				noData:false,
				topUp:false,
				

			}
		},
		computed: {
			getPrimaryColor() {
				return `color:${primaryColor};`
			}
		},
		created() {
			this.user = this.$apps.spreadUser();
			if(this.types == 'recharge') {
				this.loadone();
			} else {
				this.loadtwo();
			}
			window.addEventListener('scroll', () => {
				this.woListScroll()
			}, false);

		},
		methods: {
			refresh() {
				//下拉刷新 并重载数据
				this.refreshing = true;
				this.$refs.container.scrollTop = 0;
				setTimeout(() => {
					this.refreshing = false;
				}, 1200)
				this.loadone();
			},
			woListScroll() {
				var scroll = document.documentElement.scrollTop || document.body.scrollTop;
				if(scroll >= 100) {
					this.topUp = true;
				} else {
					window.clearInterval(this.temp);
					this.topUp = false;
				}

			},
			onTop() {
				var that = this;
				var num = setInterval(function() {
					document.documentElement.scrollTop = document.documentElement.scrollTop - 150 || 0;
				}, 50)
				that.temp = num;
				//				this.$el.childNodes[4].scrollTop= 0 ;
			},
			loadone() {
				eventBus.$emit('showNotification', '正在加载....');
				this.$axios.post('api/game//getPayList', {
						token: this.user.token,
						begDate: this.search.startDate,
						endDate: this.search.endDate,
						nickName: this.search.agentName,
						page: this.pagenum,
						gameId: this.gameId
					})
					.then((response) => {
						//						console.log(response.data.data)
						if(response.data && response.data.status == 0 && response.data.data) {
							
							if(!response.data.data || response.data.data == '') {
								eventBus.$emit('showNotification', '该账户暂无此权限..')
								this.noData = true;
								return;
							}
							this.noData = false;
							this.datalist = {};
							this.datalist = response.data.data.orderLst;
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
			loadtwo() {
				eventBus.$emit('showNotification', '正在加载....');
				this.$axios.post('api/game/getWithdrawList', {
						token: this.user.token,
						page: this.pagenum,

					})
					.then((response) => {
						//						console.log(response.data.data)
						if(response.data && response.data.status == 0 && response.data.data) {
							if(!response.data.data.withdrawLst || response.data.data.withdrawLst == '') {
								eventBus.$emit('showNotification', '该账户暂无此权限..')
								this.noData = true;
								return;
							}
							this.noData = false;
							this.datalist = {};
							this.datalist = response.data.data.withdrawLst;
							for(var i = 0; i < this.datalist.length; i++) {
								this.datalist[i].profit = Number(this.datalist[i].profit);
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
			getImgUrl(hasData) {
				let url = `${prefix}${currentAgent}-icon/`
				if(hasData) {
					url += 'icon-item-have.png'
				} else {
					url += 'icon-item-none.png'
				}
				return url
			},
			chose(e) {
				var type = e.target.innerHTML;
				if(type == '充值记录') {
					this.teamborder = '#2196F3 2px  solid';
					this.agentborder = 'rgb(250,250,250) 2px  solid';
					this.types = 'recharge';
					this.loadone();
				} else {
					this.agentborder = '#2196F3 2px  solid';
					this.teamborder = 'rgb(250,250,250) 2px  solid';
					this.types = 'withdraw';
					this.loadtwo();
				}
			},

			openSearchDialog() {
				this.openSearch = true;

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

				this.tip_text = '筛选条件:' + this.search.startDate + '--' + this.search.endDate + '' + this.search.agentName;
				this.tip_textColor = 'rgb(51,54,63)';
				this.tip_textbgc = 'rgb(250,250,250)';
				this.loadone();

				this.search.agentName = ''
				this.search.startDate = ''
				this.search.endDate = ''
				this.openSearch = false
			},

		},
		components: {
			'back': back,
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
	
	.search_title {
		font-size: 15px !important;
		color: rgb(33, 150, 243) !important;
	}
	
	.tip_text {
		padding-top: 10px !important;
		padding-left: 30% !important;
		
		margin: 0 auto !important;
		font-size: 12px !important;
	}
	.noData{
		color: darkgray;
		position: fixed;
		left: 42%;
		top: 50%;
	}
	.infoName{
		background-color: rgb(28,131,210);
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
</style>