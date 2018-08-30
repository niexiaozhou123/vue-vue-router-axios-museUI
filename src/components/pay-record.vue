<template>
	<div class="detail">
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			提款记录
		</mu-appbar>

		<mu-scale-transition>
			<mu-button fab small color="teal" v-if='topUp' class='top_style' @click='onTop'>
				<mu-ripple color="yellow" :opacity="0.5">
					<mu-icon value="arrow_upward"></mu-icon>
				</mu-ripple>
			</mu-button>
		</mu-scale-transition>

		<mu-container @scroll='woListScroll($event)' class="whole-screen-wrapper">
			<mu-load-more @refresh="refresh" :refreshing="refreshing" ref="container" :loading='loading' @load='loadMore'>

				<mu-paper :z-depth="3" class="my-agent" v-for='item in countInfo' :key='item.id'>
					<mu-list>
						<mu-list-item>
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" class="mar-right-5">
										<img :src="getIconUrl('icon-title')" style="width: 50%;">
									</mu-flex>
									<mu-flex justify-content="center" class="mar-right-5 agent-title">{{item.created}}</mu-flex>
								</mu-flex>
							</mu-list-item-title>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item :ripple="false" style='margin: 10px 0;'>
							<mu-row fill>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center" justify-content="center">
										<mu-flex class="text-color-gray">订单编号</mu-flex>
										<mu-flex style='font-size:12px;'>{{item.dataNo}}</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="0" class="agent-info-item">
									<mu-flex direction="column" align-items="center">
										<mu-flex class="text-color-gray"></mu-flex>
										<mu-flex></mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center">
										<mu-flex class="text-color-gray">提现金额</mu-flex>
										<mu-flex>{{item.amount}}</mu-flex>
									</mu-flex>
								</mu-col>
							</mu-row>
						</mu-list-item>
						<mu-list-item :ripple="false" style='margin: 10px 0;'>
							<mu-row fill>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center" justify-content="center">
										<mu-flex class="text-color-gray">取现去向</mu-flex>
										<mu-flex style='font-size:12px;'>{{item.pay_account}}</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="0" class="agent-info-item">
									<mu-flex direction="column" align-items="center">
										<mu-flex class="text-color-gray"></mu-flex>
										<mu-flex color="primary"></mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center">
										<mu-flex class="text-color-gray">订单状态</mu-flex>
										<mu-flex>{{item.status}}</mu-flex>
									</mu-flex>
								</mu-col>
							</mu-row>
						</mu-list-item>
					</mu-list>
				</mu-paper>

			</mu-load-more>
		</mu-container>
	</div>
</template>

<script type="text/javascript">
	import back from 'base/back'
	import { primaryColor } from 'common/js/config.js'
	import { getIconUrl } from 'common/js/tools.js'
	import eventBus from 'common/js/event-bus.js'
	export default {
		data() {
			return {
				user: null,
				countInfo: [],
				refreshing: false,
				loading: false,
				pageNum: 1,
				topUp: false,

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
			this.getIconUrl = getIconUrl
			this.user = this.$apps.spreadUser();
			this.load();
		},
		methods: {
			load() {
				eventBus.$emit('showNotification', '正在加载，请稍候...')
				this.$axios.post('api/withdraw/history', {
						token: this.user.token,
						page: this.pageNum,
					})
					.then((response) => {
						//						console.log(response.data.data)
						if(response.data && response.data.status == 0 && response.data.data) {
							if(this.pageNum > 1 && (!response.data.data.data || response.data.data.data.length == 0)) {
								eventBus.$emit('showNotification', '暂无更多提现记录.')
								return;
							}
							if(this.pageNum == 1) {
								this.countInfo = response.data.data.data;
							} else {
								var count = response.data.data.data.length;
								for(var i = 0; i < count; i++) {
									this.countInfo.push(response.data.data.data[i]);
								}
							}

						} else if(!res.data.status) {
							eventBus.$emit('showNotification', '登录已过期')
						} else {
							eventBus.$emit('showNotification', response.data.msg)
						}
					})
					.catch(function(err) {
						console.log(err);
						eventBus.$emit('showNotification', err)
					})
			},

			refresh() {
				//下拉刷新 并重载数据
				this.refreshing = true;
				this.$refs.container.scrollTop = 0;
				setTimeout(() => {
					this.refreshing = false;
					//数据 列表重置
					this.countInfo.length = 0;
					this.pageNum = 1;
				}, 1200)
				this.load();
			},
			loadMore() {
				this.loading = true;
				this.pageNum = this.pageNum + 1;
				setTimeout(() => {
					this.loading = false;

					this.load();
				}, 1500)
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
		}
	}
</script>

<style type="text/css" scoped>
	.mu-paper {
		background-color: rgb(238, 238, 238) !important;
		z-index: 1 !important;
	}
	
	.mu-list {
		margin: 10px 0 !important;
		background-color: rgb(255, 255, 255) !important;
		z-index: 99 !important;
	}
	
	.top_style {
		position: fixed !important;
		bottom: 20px;
		right: 30px;
		z-index: 9999;
	}
</style>