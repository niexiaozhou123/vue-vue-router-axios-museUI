<template>
	<div class="manage-card">
		<mu-appbar color="primary" class="user-info-name">
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			银行卡管理
			<mu-icon value="add_circle_outline" class="add-circle-outline" slot="right" @click="TOAddCard" v-if='cardLength<5'></mu-icon>
		</mu-appbar>
		<div class="containers">
			<div class="card" v-for="(CardList,index) in CardLists" :key="index">
				<div class="card-header" color="primary" :style="getPrimaryColor">
					银行卡
					<a class="button" @click='bankChange' style="color: #FFFFFF !important;" :data-id="CardList.id">
						<mu-icon value="check_circle_outline" class="check_circle_outline" v-if='CardList.default_bank=="1"'></mu-icon>
						{{CardList.default_bank_text}}
					</a>
				</div>
				<div class="card-content">
					<div class="list">
						<ul>
							<li>
								<div class="item-content">
									<div class="item-inner">
										<div class="item-title">银行卡号</div>
										<div class="item-after">{{CardList.bank_number}}</div>
									</div>
								</div>
							</li>
							<li>
								<div class="item-content">
									<div class="item-inner">
										<div class="item-title">开户人</div>
										<div class="item-after">{{CardList.true_name}}</div>
									</div>
								</div>
							</li>
							<li>
								<div class="item-content">
									<div class="item-inner">
										<div class="item-title">银行</div>
										<div class="item-after">{{CardList.bank_name}}</div>
									</div>
								</div>
							</li>
							<li>
								<div class="item-content">
									<div class="item-inner item-none">
										<div class="item-title">更新时间</div>
										<div class="item-after">{{CardList.update_time}}</div>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<div class="card-margin">
			<mu-button color="primary" :style="getPrimaryColor" class="addCard-btn" @click="TOAddCard" v-if='cardLength<5'>添加银行卡</mu-button>
		</div>
	</div>
</template>

<script type="text/javascript">
	import back from 'base/back'
	import reportList from 'base/report-list'
	import { primaryColor } from 'common/js/config.js'
	import { getIconUrl } from 'common/js/tools.js'
	import { requestDomain, ERROR_OK } from 'api/config.js'
	import eventBus from 'common/js/event-bus.js'
	import { getAccountInfo, getBankList, bankCardWithdraw } from 'api/manage-transfer.js'
	import { httpUrl } from 'api/http_url.js'
	export default {
		data() {
			return {
				user: null,
				CardLists: [],
				cardLength: 0,
				issetDefaultBank: false,
				changeID: 0,
			}
		},
		computed: {
			getPrimaryColor() {
				return `backgroundColor:${primaryColor};`
			},
		},
		created() {
			this.getIconUrl = getIconUrl
			this.user = this.$apps.spreadUser();
			this.GetCard()

		},
		methods: {
			GetCard() {
				let url = httpUrl + 'api/bill/bankcardlist'
				let params = {
					token: this.user.token
				}
				getAccountInfo(url, params).then((res) => {
					if(res.status === ERROR_OK) {
						this.CardLists = res.data.data
						this.cardLength = this.CardLists.length;
						for(var i = 0; i < this.CardLists.length; i++) {
							this.CardLists[i].default_bank_text = this.CardLists[i].default_bank === '1' ? '默认' : '设置为默认银行卡'
						}
					} else if(!res.status) {
						eventBus.$emit('showNotification', '登录已过期')
					} else {
						eventBus.$emit('showNotification', res.msg)
					}
				})
			},
			bankChange(e) {
				var targetText = e.target.innerText;
				if(targetText.indexOf('设置') > -1) {
					this.changeID = e.target.dataset.id;
					if(this.changeID == 0) return;
					this.setDefaultBank(this.changeID);
				}
			},
			setDefaultBank(id) {
				this.$axios.post('api/bill/setDefaultBank', {
						token: this.user.token,
						bank_id: id
					})
					.then((res) => {
						console.log(res);
						if(res.data && res.data.status == 0 && res.data.data) {
							this.$alert('修改默认银行卡成功!')
							this.$router.push({
								path:'/refresh/',
								query:{
									stats:'2'
								}
							})							
						}else{
							eventBus.$emit('showNotification', res.data.msg)
						}

					})
					.catch(function(err) {
						eventBus.$emit('showNotification', err)
					})
			},
			TOAddCard() {
				this.$router.push({
					path: '/manage/card/edit'
				})
			}

		},
		components: {
			'back': back,
		}
	}
</script>
<style lang="scss" rel="stylesheet/sass" scoped>
	.containers {
		margin-top: 65px;
	}
	
	.user-info-name {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
	}
	
	.manage-card {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: #eee;
	}
	
	ul,
	li,
	div,
	button {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	
	.add-circle-outline {
		vertical-align: middle;
		font-size: 36px;
		padding-right: 15px;
	}
	
	.card {
		margin: 0 8px 8px 8px;
		background-color: #FFF;
		-webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
	}
	
	.title-margin {
		min-height: 40px;
		padding: 4px 16px;
		line-height: 40px;
		font-size: 16px;
		color: #fff;
	}
	
	a .card-content {
		position: relative;
	}
	
	.list {
		font-size: 16px;
		position: relative;
		z-index: 1;
	}
	
	.list .item-content {
		min-height: 48px;
		padding-left: 16px;
	}
	
	.list .item-inner {
		min-height: 48px;
		padding-right: 16px;
		position: relative;
		width: 100%;
		padding-top: 8px;
		padding-bottom: 8px;
		min-width: 0;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-pack: justify;
		-webkit-justify-content: space-between;
		-ms-flex-pack: justify;
		justify-content: space-between;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		-webkit-box-align: center;
		-webkit-align-items: center;
		-ms-flex-align: center;
		align-items: center;
		-webkit-align-self: stretch;
		-ms-flex-item-align: stretch;
		align-self: stretch;
	}
	
	.list .item-title {
		min-width: 0;
		-webkit-flex-shrink: 1;
		-ms-flex-negative: 1;
		flex-shrink: 1;
		white-space: nowrap;
		position: relative;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}
	
	.list .item-after {
		color: #757575;
		font-size: 14px;
		padding-left: 8px;
	}
	
	.list .item-after {
		white-space: nowrap;
		-webkit-flex-shrink: 0;
		-ms-flex-negative: 0;
		flex-shrink: 0;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		margin-left: auto;
	}
	
	.item-inner:after {
		content: '';
		position: absolute;
		background-color: rgba(0, 0, 0, 0.8);
		display: block;
		z-index: 15;
		top: auto;
		right: auto;
		bottom: 0;
		left: 0;
		height: 1px;
		width: 100%;
		-webkit-transform-origin: 50% 100%;
		transform-origin: 50% 100%;
	}
	
	.item-none:after {
		height: 0;
	}
	
	.container-title {
		width: 100%;
		min-height: 40px;
		height: 40px;
		line-height: 40px;
		color: #fff;
	}
	
	.container-big {
		font-size: 16px;
		padding-left: 10px;
	}
	
	.container-small {
		display: block;
		text-align: center;
		padding-left: 10px;
		height: 40px;
		line-height: 40px;
	}
	
	.check_circle_outline {
		width: 18px;
		height: 40px;
		line-height: 40px;
		vertical-align: middle;
		font-size: 20px !important;
	}
	
	.container {
		padding-left: 0 !important;
		padding-right: 0 !important;
	}
	
	.row {
		margin-right: 0 !important;
		margin-left: 0 !important;
	}
	
	.col {
		min-height: 0 !important;
	}
	
	.card-header {
		min-height: 40px;
		padding: 4px 16px;
		font-size: 16px;
		color: #fff;
		line-height: 40px;
		min-height: 44px;
		position: relative;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-pack: justify;
		-webkit-justify-content: space-between;
		-ms-flex-pack: justify;
		justify-content: space-between;
		-webkit-box-align: center;
		-webkit-align-items: center;
		-ms-flex-align: center;
		align-items: center;
	}
	
	.button {
		line-height: 40px;
		min-width: 49px;
		max-width: 278px;
		height: 40px;
		text-transform: uppercase;
		min-width: 64px;
		padding: 0 8px;
		border: none;
		-webkit-transition-duration: 300ms;
		transition-duration: 300ms;
		-webkit-transform: translate3d(0, 0, 0);
		transform: translate3d(0, 0, 0);
		text-decoration: none;
		text-align: center;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background: none;
		margin: 0;
		font-size: 14px;
		position: relative;
		outline: 0;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		vertical-align: middle;
	}
	
	.card-margin {
		margin: 32px 8px;
	}
	
	.addCard-btn {
		width: 100%;
		height: 48px;
		font-size: 18px;
		outline: none;
		border: none;
		color: #fff;
	}
</style>