<template>
	<div class="report-game-list" @click="delInfo">
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			游戏记录

			<mu-button flat small slot="right" class="user-text" color="primary" @click="openSearchDialog">
				<mu-icon value="search" size="24"></mu-icon>搜索
			</mu-button>
		</mu-appbar>

		<!--top-->
		<mu-button fab small color="teal" v-if='topUp' class='top_style' @click='onTop'>
			<mu-icon value="arrow_upward"></mu-icon>
		</mu-button>

		<mu-container style="padding:0 16px;overflow: hidden;" @click="delInfo" ref='container'>
			<mu-load-more @refresh="refresh" :refreshing="refreshing" ref="container">
				<mu-form :model='name'>
					<mu-form-item class='choseType'>
						<span :style="{borderBottom:teamborder}" @click='chose'>税收记录<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="1"></mu-icon></span>
						<span :style="{borderBottom:agentborder}" @click='chose'>亏损记录<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="2"></mu-icon></span>
					</mu-form-item>
				</mu-form>

				<span v-if='info1' class='helpInfo'>游戏流水：当前操作提供的游戏流水总额 </br>
                                税收收益：当前操作提供给代理的税收收益总额（游戏流水*计税税率*（代理分红比-下级代理分红比））	</span>

				<span v-if='info2' class='helpInfo'>游戏流水：当前操作提供的游戏流水总额 </br>
						亏损收益：当前操作提供给总代团队带来的亏损收益额（游戏流水*(1-计税税率)*当前代理亏损分红比）	</span>
				<span class='tip_text' ref='tip_text' :style='{color:tip_textColor,background:tip_textbgc}'>{{tip_text}}</span>

				<mu-paper :z-depth="3" v-for='item in datalist' :key='item.id'>
					<mu-list >
						<mu-list-item avatar class='infoTitle'>
							<mu-list-item-action class='infoTitle_msg'>{{item.created}}</mu-list-item-action>
							<mu-list-item-content></mu-list-item-content>
							<mu-list-item-action class='infoTitle_msg'>{{item.name}}</mu-list-item-action>
						</mu-list-item>
						<mu-list-item avatar>
							<mu-list-item-action>
								订单编号<span class="infoText"> {{item.id}}</span>
							</mu-list-item-action>
							<mu-list-item-content></mu-list-item-content>
							<mu-list-item-action>
								游戏ID号 <span class="infoText">{{item.gameId}}</span>
							</mu-list-item-action>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item avatar>
							<mu-list-item-action >
								游戏名称<span class="infoText" >{{item.gname}}</span>
							</mu-list-item-action>
							<mu-list-item-content></mu-list-item-content>
							<mu-list-item-action>
								游戏房间<span class="infoText">{{item.sname}}</span>
							</mu-list-item-action>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item avatar>
							<mu-list-item-action>
								{{dataText}}<span class="infoText" v-if="item.profit>0" style="color: green !important;">{{item.profit}}</span>
								<span class="infoText" v-else style="color: red !important;">{{item.profit}}</span>
							</mu-list-item-action>
							<mu-list-item-content></mu-list-item-content>
							<mu-list-item-action>
								{{dataText2}}<span class="infoText">{{item.tax}}</span>
							</mu-list-item-action>
						</mu-list-item>
					</mu-list>
				</mu-paper>
			</mu-load-more>

			<!-- 搜索对话框 -->
			<mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="openSearch">
				<mu-appbar color="primary" title="游戏记录">
					<mu-button slot="left" icon @click="openSearch=false">
						<mu-icon value="keyboard_backspace"></mu-icon>
					</mu-button>
				</mu-appbar>
				<mu-container style="padding: 16px; margin-top: 0 !important;">
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
						<mu-form-item label="游戏筛选" >
							<mu-row gutter style='width: 100%;'>
								<mu-col span="12" lg="4" sm="6">
									<mu-select v-model="selectedGameName" full-width ref='selectgame' chips filterable underline-color='green'>
										<mu-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" ripple></mu-option>
									</mu-select>
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
				types: 'tax',
				teamborder: '#2196F3 2px  solid',
				agentborder: 'rgb(250,250,250) 2px  solid',
				refreshing: false,
				topUp: false,
				pagenum: 1,
				search: {
					agentName: '',
					startDate: '',
					endDate: ''
				},
				datalist: {},
				gameId: '',
				options: {},
				selectedGameName: '所有游戏',

				openSearch: false,
				info1: false,
				info2: false,
				tip_text: '*仅展示近一个月内的记录',
				tip_textColor: '#f44336',
				tip_textbgc: 'none',
				dataText: '',
				dataText2: '',

			}
		},
		computed: {
			getPrimaryColor() {
				return `color:${primaryColor};`
			}
		},
		created() {
			this.user = this.$apps.spreadUser();
			if(this.types == 'tax') {
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
				this.$axios.post('api/game/getPlayList', {
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
							if(!response.data.data.dataLst || response.data.data.dataLst == '') {
								eventBus.$emit('showNotification', '该账户暂无此权限..')
								return;
							}
							this.datalist = {};
							this.dataText = '游戏流水';
							this.dataText2 = '税收收益';
							this.datalist = response.data.data.dataLst;
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
			loadtwo() {
				eventBus.$emit('showNotification', '正在加载....');
				this.$axios.post('api/game/getRenjiPlayList', {
						token: this.user.token,
						page: this.pagenum,

					})
					.then((response) => {
						//						console.log(response.data.data)
						if(response.data && response.data.status == 0 && response.data.data) {
							if(!response.data.data.dataLst || response.data.data.dataLst == '') {
								eventBus.$emit('showNotification', '该账户暂无此权限..')
								return;
							}
							this.datalist = {};
							this.dataText = '游戏盈亏';
							this.dataText2 = '亏损收益';
							this.datalist = response.data.data.dataLst;
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
				var type = e.target.innerText;
				var chose = type.slice(0, 4);
				if(chose == '税收记录') {
					this.teamborder = '#2196F3 2px  solid';
					this.agentborder = 'rgb(250,250,250) 2px  solid';
					this.types = 'tax';
					this.loadone();
				} else {
					this.agentborder = '#2196F3 2px  solid';
					this.teamborder = 'rgb(250,250,250) 2px  solid';
					this.types = 'loss';
					this.loadtwo();
				}
			},

			openSearchDialog() {
				this.openSearch = true;
				this.$axios.post('api/game/getGameList', {
						token: this.user.token,
					})
					.then((response) => {
						//						console.log(response.data.data)
						this.options = response.data.data;
					})
					.catch(function(err) {
						eventBus.$emit('showNotification', err)
					})

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

				this.tip_text = '筛选条件:' + this.search.startDate + '--' + this.search.endDate + '' + this.search.agentName + '' + this.$refs.selectgame.$refs.input._value;
				this.tip_textColor = 'rgb(51,54,63)';
				this.tip_textbgc = 'rgb(250,250,250)';

				if(this.selectedGameName == '所有游戏') {
					this.gameId = '';
				} else {
					this.gameId = this.selectedGameName;
				}
				this.loadone();

				this.search.agentName = ''
				this.search.startDate = ''
				this.search.endDate = ''
				this.selectedGameName == '所有游戏'
				this.openSearch = false
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
				}
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
		padding-top: 5px !important;
		padding-left: 23% !important;
		width: max-content !important;
		margin: 0 auto !important;
		font-size: 12px !important;
	}
	
	.mu-form-item {
		margin-bottom: 5px;
	}
	
	.search-btn {
		width: 100%;
	}
	
	.helpInfo {
		position: fixed;
		right: 15px !important;
		left: 15px !important;
		z-index: 999 !important;
		background-color: rgb(33, 150, 243) !important;
		padding: 10px !important;
		font-size: 12px !important;
		overflow: inherit !important;
		white-space: normal !important;
	}
	
	.infoTitle {
		background: rgb(28, 131, 210);
		color: #FFFFFF !important;
	}
	
	.infoTitle_msg {
		color: #FFFFFF !important;
		font-weight: 800;
	}
	
	.infoText {
		color: rgb(33, 33, 33);
		font-weight: 500;
	}
	
	.top_style {
		position: fixed !important;
		bottom: 20px;
		right: 30px;
		z-index: 9999;
	}
</style>