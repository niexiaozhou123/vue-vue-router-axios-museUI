<template>
	<div class="extend">
		<mu-appbar color="primary" class='extend-starts'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			推广模板
			<mu-icon value="add_circle_outline" class="add-circle-outline" slot="right" @click="goExtendEdit"></mu-icon>
		</mu-appbar>

		<mu-scale-transition>
			<mu-button fab small color="teal" v-if='topUp' class='top_style' @click='onTop'>
				<mu-ripple color="yellow" :opacity="0.5">
					<mu-icon value="arrow_upward"></mu-icon>
				</mu-ripple>			
			</mu-button>
		</mu-scale-transition>

		<mu-container class="whole-screen-wrapper2" @scroll='woListScroll($event)' style=' overflow: auto !important;'>
			<mu-load-more @refresh="refresh" :refreshing="refreshing" ref="container">
				<div class="extend-margin" v-for="(getNameList,index) in getNameLists" :key="index">
					<mu-paper :z-depth="3" style='padding: 0 8px; background-color: #FFFFFF !important;'>
						<mu-flex align-items="center">
							<mu-flex class="align-items-starts" fill>
								<mu-flex class="mar-right-5">
									<img :src="getIconUrl('icon-title')" style="width: 50%;">
								</mu-flex>
								{{getNameList.name}}
							</mu-flex>
							<mu-flex class="flex-demo align-items-starts" fill :data-id='getNameList.id' @click='changeDefault' style='display:flex !important;justify-content: flex-end !important;'>
								<mu-flex class="mar-right-5">
									<!--<img :src="getIconUrl('icon_check_line')" style="width: 50%;" class="icon-check" color="primary">-->
									<mu-icon v-if='getNameList.is_default ==="0"'></mu-icon>
									<mu-icon value='check' v-else></mu-icon>
								</mu-flex>
								{{getNameList.default_text}}
							</mu-flex>
						</mu-flex>
						<mu-flex class="flex-wrapper">
							{{getNameList.jumpUrl}}
						</mu-flex>
						<mu-flex align-items="center" class="item-content">
							<mu-flex class="segmented segmenteds" justify-content='center' fill v-clipboard:copy="getNameList.jumpUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">复制链接</mu-flex>
							<mu-flex class="segmented color-font" justify-content='center' fill @click='extecd_look(getNameList.jumpUrl)'>预览链接</mu-flex>
							<mu-flex class="segmented color-font" justify-content='center' fill @click='lookInfo(getNameList.spread_img)'>预览推广页</mu-flex>
						</mu-flex>
						<mu-row gutter>
							<mu-col span="12">
								<div class="grid-cell">
									<img :src="'http://qr.liantu.com/api.php?bg=ffffff&amp;fg=000000&amp;el=l&amp;w=250&amp;m=4&amp;text='+getNameList.downloadpic" alt="" />
								</div>
							</mu-col>
						</mu-row>
						<mu-flex align-items="center" class="card-footers">
							<mu-flex class="card-footer" fill>点击数:
								<span class="badge" v-if='getNameList.click_num'>{{getNameList.click_num}}</span>
								<span class="badge" v-else>0</span>
							</mu-flex>
							<mu-flex class="card-footer" style='display: flex !important; justify-content: flex-end !important;' fill>下载数:
								<span class="badge" v-if='getNameList.down_num'>{{getNameList.down_num}}</span>
								<span class="badge" v-else>0</span>
							</mu-flex>
						</mu-flex>
					</mu-paper>
				</div>
			</mu-load-more>
		</mu-container>

		<!--预览推广-->
		<mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="openFullscreen" style='background-color: rgb(7,7,7) !important;'>
			<mu-appbar color="black" title="preview">
				<mu-button slot="left" icon @click="closeDialog">
					<mu-icon value="arrow_back"></mu-icon>
				</mu-button>

			</mu-appbar>
			<div style="background-color: rgb(7,7,7);" justify-content='center'>
				<img :src='imgsrc' full style='width: 100%; height: 100%;' />
			</div>
		</mu-dialog>

	</div>
</template>
<script type="text/javascript">
	import back from 'base/back'
	import { getIconUrl } from 'common/js/tools.js'
	import { requestDomain, ERROR_OK } from 'api/config.js'
	import { getAccountInfo, getBankList, bankCardWithdraw } from 'api/manage-transfer.js'
	import { httpUrl } from 'api/http_url.js'
	import eventBus from 'common/js/event-bus.js'
	export default {
		data() {
			return {
				user: null,
				refreshing: false,
				topUp: false,
				getNameLists: [],
				choseId: 0,
				imgcopy: '',
				imgsrc: '',
				openFullscreen: false,

			}
		},
		created() {
			this.getIconUrl = getIconUrl;
			this.user = this.$apps.spreadUser();
			this.getDataList()
		},
		methods: {
			goExtendEdit() {
				this.$router.push({
					path: '/extend/edit/'
				})
			},
			refresh() {
				this.refreshing = true;
				this.$refs.container.scrollTop = 0;
				setTimeout(() => {
					this.refreshing = false;
					this.load();
				}, 1200)

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
			getDataList() {
				let url = httpUrl + 'api/templates/getUserTemplatesList'
				let params = {
					token: this.user.token
				}
				getAccountInfo(url, params).then((res) => {
					if(res.status === ERROR_OK) {
						this.getNameLists = res.data.data.UserTemplates;
						for(var i = 0; i < this.getNameLists.length; i++) {
							this.getNameLists[i].default_text = this.getNameLists[i].is_default === '0' ? '设置为默认推广链接' : '默认';
							this.getNameLists[i].spread_img = this.$apps.spreadUrl(this.getNameLists[i].spread_img);
						}

					} else if(!res.data.status) {
						eventBus.$emit('showNotification', '登录已过期')
					} else {
						eventBus.$emit('showNotification', res.msg)
					}
				})
			},
			changeDefault(e) {
				var targerText = e.target.innerText;
				this.choseId = Number(e.target.dataset.id);
				if(targerText.indexOf('设置') > -1 && this.choseId != 0) {
					this.$axios.post('api/templates/setDefaultTemplate', {
							token: this.user.token,
							id: this.choseId
						})
						.then((res) => {
							if(res.data.status == 0) {
								eventBus.$emit('showNotification', res.data.msg)
								this.$router.push({
									path: '/refresh/',
									query: {
										stats: '1'
									}
								})
							}
						})
						.catch(function(err) {
							eventBus.$emit('showNotification', err)
						})
				}
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
			lookInfo(url) {
				this.imgsrc = url;
				this.openFullscreen = true;
			},
			closeDialog() {
				this.openFullscreen = false;
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
		margin: 8px 8px 8px 8px;
		position: relative;
		background-color: #fff !important;
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