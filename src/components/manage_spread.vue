<template>
	<div class="report-date">
		<!-- 头部导航 -->
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			代理管理

		</mu-appbar>

		<!-- 内容主体 -->
		<mu-button fab small color="teal" v-if='topUp' class='top_style' @click='onTop'>
			<mu-icon value="arrow_upward"></mu-icon>
		</mu-button>

		<mu-container class="whole-screen-wrapper" @scroll='woListScroll($event)' style='margin-top: 0 !important; overflow: auto !important;'>
			<!-- 用户信息 -->
			<mu-load-more @refresh="refresh" :refreshing="refreshing" ref="container" :loading='loading' @load="load2" loading-text='正在加载...'>
				<mu-flex class="user-info" style='display: flex; flex-direction: row !important; justify-content: space-between !important;'>
					<mu-flex align-items="center">
						<mu-icon value="person" class="user-icon"></mu-icon>
						<mu-flex>{{user.nickName}}</mu-flex>
					</mu-flex>
					<mu-flex align-items="center" style='padding-top: 5px;'>

					</mu-flex>
				</mu-flex>

				<mu-menu cover :open.sync='menuOpen' style='position: fixed !important; left: 80px;top: 200px;'>
					<mu-list slot="content">
						<mu-list-item button @click='goDetail'>
							<mu-list-item-content>查看详情</mu-list-item-content>
							<mu-list-item-action>
								<mu-icon value='chevron_right'></mu-icon>
							</mu-list-item-action>
						</mu-list-item>
						<mu-list-item button @click='goEdit'>
							<mu-list-item-content>调整分成比例和配额</mu-list-item-content>
							<mu-list-item-action>
								<mu-icon value='chevron_right'></mu-icon>
							</mu-list-item-action>
						</mu-list-item>
						<mu-list-item button @click='menuOpen=false'>
							<mu-list-item-content>取消</mu-list-item-content>
							<mu-list-item-action>
								<mu-icon value='chevron_right'></mu-icon>
							</mu-list-item-action>
						</mu-list-item>
					</mu-list>
				</mu-menu>

				<!-- 代理信息 -->
				<mu-paper :z-depth="3" class="list-item" v-for="item in detailInfo" :key="item.id" style='background-color: #FFFFFF !important;'>
					<mu-flex align-items="center" data-id="item.id" @click="toDetailPage(item)">
						<mu-flex class="item-image">
							<span class="text" v-if='item.is_children<=0'>{{item.name}}</span>
							<a class="text" v-if='item.is_children>0' style="color: #FFFFFF !important;">{{item.name}}</a>
							<img :src="getImgUrl(item.is_children>0)">
						</mu-flex>
						<mu-flex fill class="list-content" direction="column" align-items="center">
							<mu-flex justify-content="center" class="content-info">创建时间：{{item.created}}</mu-flex>
							<mu-flex justify-content="center" class="content-info">分成比例：{{item.divided}}</mu-flex>
						</mu-flex>
						<mu-flex fill justify-content="center">
							<mu-icon value="keyboard_arrow_right" class="icon-right"></mu-icon>
						</mu-flex>
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
			var maxDate = new Date();
			var minDate = new Date();
			minDate.setMonth(maxDate.getMonth() - 1);
			return {
				user: null,
				pagenum: 1,
				keyword: '',
				refreshing: false,
				loading: false,
				menuOpen: false,
				detailInfo: {},
				choseDetail: {},
				search: {
					agentName: '',
					startDate: '',
					endDate: ''
				},
				topUp: false,
				temp: null,
				itemId: '',

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
			toDetailPage(item) {
				this.menuOpen = true;
				this.choseDetail = item;
				//				if(item.is_children > 0 && item.edit > 0) {
				//					this.$router.push({
				//						path: '/manage/spread/detail/',
				//						query: {
				//							id: item.id
				//						}
				//					})
				//				}

			},
			goDetail() {
				this.$router.push({
					path: '/manage/spread/detail/',
					query: {
						id: this.choseDetail.id
					}
				})
			},
			goEdit() {
				this.$router.push({
					path: '/manage/spread/edit/',
					query: {
						id: this.choseDetail.id
					}
				})
			},
			load() {
				eventBus.$emit('showNotification', '正在加载数据..')
				this.$axios.post('api/Promoters/underAgent', {
						token: this.user.token,
						promoters_id: this.itemId || ''
					})
					.then((res) => {
						//						console.log(res.data.data);
						if(res.data && res.data.status == 0 && res.data.data) {
							if(!res.data.data || res.data.data == '') {
								eventBus.$emit('showNotification', '暂无数据返回..')
								return;
							}
							this.detailInfo = res.data.data;

						} else if(!res.data.status) {
							eventBus.$emit('showNotification', '登录已过期')
						} else {
							eventBus.$emit('showNotification', res.data.msg)
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
	
	.mu-form-item {
		margin-bottom: 5px;
	}
	
	.top_style {
		position: fixed !important;
		bottom: 20px;
		right: 30px;
		z-index: 9999;
	}
	
	.tip_text {
		padding-top: 5px !important;
		padding-left: 23% !important;
		width: max-content !important;
		margin: 0 auto !important;
		font-size: 12px !important;
	}
</style>