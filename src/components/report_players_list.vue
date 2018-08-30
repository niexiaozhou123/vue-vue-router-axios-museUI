<template>
	<div class="report-player-search-list">
		<!-- 头部导航 -->
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			玩家列表
		</mu-appbar>

		<!-- 内容主体 -->
		<mu-button fab small color="teal" v-if='topUp' class='top_style' @click='onTop'>
			<mu-icon value="arrow_upward"></mu-icon>
		</mu-button>

		<mu-container class="whole-screen-wrapper" @scroll='woListScroll($event)' style='margin-top:10px !important; overflow: auto !important;'>
			<!-- 用户信息 -->
			<mu-load-more @refresh="refresh" :refreshing="refreshing" ref="container" :loading='loading' @load="load2" loading-text='正在加载...'>
				<mu-flex class="user-info" style='display: flex; flex-direction: row !important; justify-content: space-between !important;'>
					<mu-flex align-items="center">
						<mu-icon value="person" class="user-icon"></mu-icon>
						<mu-flex>{{user.nickName}}</mu-flex>
					</mu-flex>
				</mu-flex>
				<span class='tip_text' ref='tip_text' v-if='no_play'>{{tip_text}}</span>
				<!-- 查询玩家列表 -->
				<mu-paper :z-depth="3" class="list-item" v-for="reportItem in detailInfo" :key='reportItem.id'>
					<!-- data-id="reportItem.promoters_id" -->
					<mu-flex align-items="center">
						<mu-flex class="item-image">
							<span class="text">{{reportItem.nick_name}}</span>
							<img :src="getImgUrl(1==1)">
						</mu-flex>
						<mu-flex fill class="list-content" direction="column" align-items="center">
							<mu-flex justify-content="center" class="content-info">流水：{{reportItem.cash_flow}}</mu-flex>
							<mu-flex justify-content="center" class="content-info">不活跃时长：{{reportItem.active_term}}</mu-flex>
						</mu-flex>
						<!--<mu-flex fill justify-content="center">
							<mu-icon value="keyboard_arrow_right" class="icon-right"></mu-icon>
						</mu-flex>-->
					</mu-flex>
				</mu-paper>
			</mu-load-more>
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
			return {
				user: null,
				pagenum: 1,
				id: 0,
				fristname: '',
				keyword: '',
				refreshing: false,
				loading: false,
				detailInfo: {},
				total_flowing: null,
				pflow: null,
				nflow: null,
				total_tax: null,
				topUp: false,
				temp: null,

				tip_text: '没有玩家',
				no_play: false,

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
			load() {
				eventBus.$emit('showNotification', '正在加载数据..')
				//				console.log(this.$router.history.current.query);
				this.fristname = this.$router.history.current.query.Name;
				this.id = this.$router.history.current.query.Id;

				this.$axios.post('api/player/getAgentPlayers', {
						token: this.user.token,
						agentId: this.id,
						agentName: this.fristname,
						page: this.pagenum
					})
					.then((response) => {
						//						console.log(response.data.data);
						if(response.data && response.data.status == 0 && response.data.data) {
							if(!response.data.data.players || response.data.data.players == '') {
								eventBus.$emit('showNotification', '暂无数据返回..')
								this.no_play = true;
								return;
							}
							this.detailInfo = response.data.data.players;
							var count = this.detailInfo.length;
							for(var i = 0; i < count; i++) {
								this.detailInfo[i].cash_flow = this.$spreadFormat(this.detailInfo[i].cash_flow);
								if(this.detailInfo[i].isBind == 1) {
									this.detailInfo[i].nick_name = '玩家' + this.detailInfo[i].nick_name;
								} else {
									this.detailInfo[i].nick_name = '游客' + this.detailInfo[i].nick_name;
								}
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
		padding-left: 42% !important;
		width: max-content !important;
		margin: 0 auto !important;
		font-size: 15px !important;
		font-weight: 800;
	}
</style>