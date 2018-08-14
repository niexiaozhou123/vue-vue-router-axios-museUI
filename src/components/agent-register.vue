<template>
	<div class="extend">
		<mu-appbar color="primary" class='extend-starts'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			代理注册链接
			<mu-icon value="add_circle_outline" class="add-circle-outline" slot="right" @click="goExtendEdit"></mu-icon>
		</mu-appbar>

		<mu-button fab small color="teal" v-if='topUp' class='top_style' @click='onTop'>
			<mu-icon value="arrow_upward"></mu-icon>
		</mu-button>

		<mu-container class="whole-screen-wrapper2" @scroll='woListScroll($event)' style='margin-top: 0 !important; overflow: auto !important;'>
			<mu-load-more @refresh="refresh" :refreshing="refreshing" ref="container" @load='loadMore' :loading='loading'>
				<div class="extend-margin" v-for="(getNameList,index) in getNameLists" :key="index">
					<mu-paper :z-depth="3" style='padding: 0 8px; background-color: #FFFFFF !important;'>
						<mu-flex align-items="center">
							<mu-flex class="align-items-starts" fill>
								<mu-flex class="mar-right-5">
									<img :src="getIconUrl('icon-title')" style="width: 50%;">
								</mu-flex>
								{{getNameList.name}}
							</mu-flex>
							<mu-flex class="flex-demo align-items-starts" fill :data-id='getNameList.id' style='display:flex !important;justify-content: flex-end !important;'>
								<mu-flex class="mar-right-5">
								</mu-flex>
							</mu-flex>
						</mu-flex>
						<mu-flex class="flex-wrapper">
							{{getNameList.tuiguang_url}}
						</mu-flex>
						<mu-flex align-items="center" class="item-content">
							<mu-flex class="segmented segmenteds" justify-content='center' fill v-clipboard:copy="getNameList.tuiguang_url" v-clipboard:success="onCopy" v-clipboard:error="onError">复制链接</mu-flex>
							<mu-flex class="segmented color-font" justify-content='center' fill @click='extecd_look(getNameList.tuiguang_url)'>预览链接</mu-flex>
						</mu-flex>
						<mu-row gutter>
							<mu-col span="12">
								<div class="grid-cell">
									<img :src="'http://qr.liantu.com/api.php?bg=ffffff&amp;fg=000000&amp;el=l&amp;w=250&amp;m=4&amp;text='+getNameList.url_encode" alt="" />
								</div>
							</mu-col>
						</mu-row>
						<mu-flex align-items="center" class="card-footers">
							<mu-flex class="card-footer" fill>可注册人数:
								<span class="badge" v-if='getNameList.num ==-1'>无限次</span>
								<span class="badge" v-else>{{getNameList.num}}</span>
							</mu-flex>
							<mu-flex class="card-footer" style='display: flex !important; justify-content: flex-end !important;' fill>已注册人数：
								<span class="badge" v-if='getNameList.ctime'>{{getNameList.use_num}}</span>
								<span class="badge" v-else>0</span>
							</mu-flex>
						</mu-flex>
					</mu-paper>
				</div>
			</mu-load-more>
		</mu-container>

	</div>
</template>
<script type="text/javascript">
	import back from 'base/back'
	import { getIconUrl } from 'common/js/tools.js'
	import { getAccountInfo, getBankList, bankCardWithdraw } from 'api/manage-transfer.js'
	import eventBus from 'common/js/event-bus.js'
	export default {
		data() {
			return {
				user: null,
				refreshing: false,
				loading: false,
				topUp: false,
				getNameLists: [],
				choseId: 0,
				imgcopy: '',
				imgsrc: '',
				pageNum: 1,

			}
		},
		created() {
			this.getIconUrl = getIconUrl;
			this.user = this.$apps.spreadUser();
			this.load()
		},
		methods: {
			goExtendEdit() {
				this.$router.push({
					path: '/agent/register/edit/'
				})
			},
			refresh() {
				this.refreshing = true;
				this.$refs.container.scrollTop = 0;
				setTimeout(() => {
					this.refreshing = false;
					this.getNameLists.length = this.getNameLists.length;
					this.load();
				}, 1200)

			},
			loadMore() {
				//				this.pageNum = this.pageNum + 1;
				//				this.loading = true;
				//				setTimeout(() => {										
				//					this.loading = false;
				//					
				//				}, 1200)

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
				console.log('--');
				var that = this;
				var num = setInterval(function() {
					that.$el.childNodes[4].scrollTop = that.$el.childNodes[4].scrollTop - 150 || 0;
				}, 50)
				that.temp = num;
				//				this.$el.childNodes[4].scrollTop= 0 ;
			},
			load() {
				eventBus.$emit('showNotification', '正在加载，请稍候...')
				this.$axios.post('api/agentTem/getAgentRegTemplate', {
						token: this.user.token,
						page: this.pageNum
					})
					.then((res) => {
						//						console.log(res.data.data)
						if(res.data && res.data.status == 0) {
							this.getNameLists = res.data.data;

							for(var i = 0; i < this.getNameLists.length; i++) {
								this.getNameLists[i].url_encode = encodeURIComponent(this.getNameLists[i].tuiguang_url);
							}
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
			onCopy(e) {
				eventBus.$emit('showNotification', '已复制到剪切板!')
			},
			onError(e) {
				eventBus.$emit('showNotification', '复制出问题了..请点击重试哦!!')
			},
			extecd_look(url) {
				window.open(url);
			},
		},
		components: {
			'back': back,
		}
	}
</script>
<style lang="scss" scoped>
	@import 'common/sass/variable.scss';
	.extend-starts {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
	
	.icon-check {
		background-color: $color;
		vertical-align: middle;
	}
	
	.extend {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: #eee;
	}
	
	.add-circle-outline {
		margin-right: 10px;
		font-size: 25px;
	}
	
	.extend-margin {
		min-height: 40px;
		margin: 65px 8px 8px 8px;
		position: relative;
		background-color: #fff;
	}
	
	.align-items-starts {
		line-height: 40px;
		font-size: 16px;
	}
	
	.mar-right-5 {
		margin-top: 12px;
	}
	
	.flex-demo {
		color: $color;
		font-size: 14px;
	}
	
	.flex-wrapper {
		background-color: #eee;
		font-size: 14px;
		overflow: hidden;
	}
	
	.item-content {
		padding: 10px 0;
	}
	
	.segmented {
		min-height: 40px;
		line-height: 40px;
		border: 1px solid $color;
		padding: 0 8px;
	}
	
	.segmenteds {
		background-color: $color;
		color: $font-size-color;
	}
	
	.color-font {
		color: $color;
	}
	
	.grid-cell {
		text-align: center;
		padding-top: 14px;
		padding-bottom: 14px;
		padding-right: 16px;
		padding-left: 16px;
	}
	
	.badge {
		font-size: 10px;
		border-radius: 3px;
		padding: 1px 6px;
		vertical-align: middle;
		display: inline-block;
		color: #fff;
		background: #8e8e93;
		position: relative;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		text-align: center;
	}
	
	.card-footer {
		color: #757575;
		font-size: 14px;
	}
	
	.card-footers {
		border-top: 1px solid #e1e1e1;
		min-height: 48px;
	}
	
	.top_style {
		position: fixed !important;
		bottom: 20px;
		right: 30px;
		z-index: 9999;
	}
</style>