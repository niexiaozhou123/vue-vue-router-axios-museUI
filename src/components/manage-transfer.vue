<template>
	<div class="manage-transfer">
		<!-- 头部导航 -->
		<mu-appbar color="primary" class='extend-starts'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			银行卡提现管理
		</mu-appbar>
		<mu-container class="whole-screen-wrapper" style='margin-top: 0 !important;'>
			<mu-paper :z-depth="3" class="account-info">
				<mu-list>
					<mu-list-item :ripple="false">
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="info-title">账户余额</mu-flex>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action>{{accountInfo.money}}</mu-list-item-action>
					</mu-list-item>
					<mu-divider></mu-divider>
					<mu-list-item :ripple="false">
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="info-title">提现金额</mu-flex>
								<mu-flex fill>
									<mu-form :model="form" class="mu-demo-form" label-position="left" label-width="0">
										<mu-form-item>
											<mu-text-field v-model="withdrawAccount" placeholder="金额不得少于10元"></mu-text-field>
										</mu-form-item>
									</mu-form>
								</mu-flex>
							</mu-flex>
						</mu-list-item-title>
					</mu-list-item>
				</mu-list>
			</mu-paper>
			<mu-paper :z-depth="3" class="team-total">
				<mu-list>
					<mu-list-item :ripple="false">
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="mar-right-5">
									<img :src="getIconUrl('icon-title')" style="width: 50%;">
								</mu-flex>
								<mu-flex justify-content="center" class="info-title">银行信息</mu-flex>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action>
							<mu-flex>
								<mu-flex justify-content="center" class="info-title" :style="getPrimaryColor" @click="openChangeCardDialog">更换银行卡</mu-flex>
							</mu-flex>
						</mu-list-item-action>
					</mu-list-item>
					<mu-divider></mu-divider>
					<mu-list-item :ripple="false">
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="info-title">银行名称</mu-flex>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action>{{currentCard.bank_name}}</mu-list-item-action>
					</mu-list-item>
					<mu-divider></mu-divider>
					<mu-list-item :ripple="false">
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="info-title">银行卡号</mu-flex>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action>{{currentCard.bank_number}}</mu-list-item-action>
					</mu-list-item>
					<mu-divider></mu-divider>
					<mu-list-item :ripple="false">
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="info-title">开户人</mu-flex>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action>{{currentCard.true_name}}</mu-list-item-action>
					</mu-list-item>
				</mu-list>
			</mu-paper>
			<mu-paper :z-depth="3" class="account-info">
				<mu-list>
					<mu-list-item :ripple="false">
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="info-title">结算密码</mu-flex>
								<mu-flex fill>
									<mu-form :model="form" class="mu-demo-form" label-position="left" label-width="0">
										<mu-form-item>
											<mu-text-field type="password" v-model="balancePwd" placeholder="请输入结算密码"></mu-text-field>
										</mu-form-item>
									</mu-form>
								</mu-flex>
							</mu-flex>
						</mu-list-item-title>
					</mu-list-item>
				</mu-list>
			</mu-paper>
			<mu-row>
				<mu-col span="12">
					<mu-button large color="primary" class="withdraw-btn" @click="withdraw">立即提现</mu-button>
				</mu-col>
			</mu-row>
		</mu-container>

		<!-- 更换银行卡对话框 -->
		<mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="openChangeCard" class="change-card-dialog">
			<mu-appbar color="primary" title="更换银行卡">
				<mu-button slot="left" icon @click="closeChangeCardDialog">
					<mu-icon value="keyboard_backspace"></mu-icon>
				</mu-button>
			</mu-appbar>
			<mu-container class="card-list whole-screen-wrapper" style='margin-top: 0 !important;'>
				<mu-divider></mu-divider>
				<mu-list>
					<mu-list-item v-for="cardItem in bankCards" :key="cardItem.id" class="card-item">
						<mu-list-item-title @click="closeChangeCardDialog">
							<mu-radio :label="getCardLabel(cardItem.bank_name, cardItem.bank_number)" :value="cardItem.id" @change="onChangeCard(cardItem)"></mu-radio>
						</mu-list-item-title>
					</mu-list-item>
				</mu-list>
				<mu-divider></mu-divider>
			</mu-container>
		</mu-dialog>
	</div>
</template>
<script type="text/javascript">
	import Back from 'base/back'
	import { primaryColor } from 'common/js/config.js'
	import { getAccountInfo, getBankList, bankCardWithdraw } from 'api/manage-transfer.js'
	import { requestDomain, ERROR_OK } from 'api/config.js'
	import eventBus from 'common/js/event-bus.js'
	import { getIconUrl } from 'common/js/tools.js'
	import { httpUrl } from 'api/http_url.js'

	export default {
		data() {
			return {
				user: null,
				accountInfo: {},
				withdrawAccount: '',
				balancePwd: '',
				form: {},
				bankCards: [],
				openChangeCard: false,
				currentCard: {},
				withdrawLimitDown: 10
			}
		},
		computed: {
			getPrimaryColor() {
				return `color:${primaryColor};`
			}
		},
		created() {
			this.getIconUrl = getIconUrl
			this.user = this.$apps.spreadUser();
			this._getAccountInfo()
			this._getBankList()
		},
		methods: {
			_getAccountInfo() {
				let url = httpUrl + 'api/bill/apply'
				let params = {
					token: this.user.token
				}
				getAccountInfo(url, params).then((res) => {
					if(res.status === ERROR_OK) {
						this.accountInfo = res.data
						this.currentCard = this.accountInfo.bankinfo
						this.currentCard.true_name = this.$apps.addStar(this.currentCard.true_name, this.$apps.interceptStrAccordByte(this.currentCard.true_name,2))||'';
						this.currentCard.bank_number = this.$apps.addStar(this.currentCard.bank_number, this.currentCard.bank_number.substr(6, this.currentCard.bank_number.length-10))||'';
					} else if(!res.status) {
						eventBus.$emit('showNotification', '登录已过期')
					} else {
						eventBus.$emit('showNotification', res.msg)
					}
				})
			},
			_getBankList() {
				let url = httpUrl + 'api/bill/bankcardlist'
				let params = {
					token: this.user.token
				}
				getBankList(url, params).then((res) => {
					if(res.status === ERROR_OK) {
						this.bankCards = res.data.data
					} else if(!res.status) {
						eventBus.$emit('showNotification', '登录已过期')
					} else {
						eventBus.$emit('showNotification', res.msg)
					}
				})
			},
			getCardLabel(name, num) {
				return `${name}：${num}`
			},
			withdraw() {
				if(!this.withdrawAccount) {
					eventBus.$emit('showNotification', '请输入提现金额！')
					return
				}
				if(!this.balancePwd) {
					eventBus.$emit('showNotification', '请输入结算密码！')
					return
				}
				let url = httpUrl + 'api/bill/apply'
				let params = {
					token: this.user.token,
					amount: this.withdrawAccount,
					password: this.balancePwd,
					bank_number: this.currentCard.bank_number,
					dosubmit: '1'
				}
				bankCardWithdraw(url, params)
					.then((res) => {
						if(res.status === ERROR_OK) {
							eventBus.$emit('showNotification', '银行卡提现申请成功！')
						} else {
							eventBus.$emit('showNotification', res.msg)
						}
					})
			},
			openChangeCardDialog() {
				this.openChangeCard = true
			},
			closeChangeCardDialog() {
				this.openChangeCard = false
			},
			onChangeCard(cardItem) {
				this.currentCard = cardItem
			}
		},
		components: {
			'back': Back
		}
	}
</script>
<style lang="scss" rel="stylesheet/sass" scoped>

	.manage-transfer {
		.info-title {
			font-size: 16px;
		}
		.account-info {
			margin-top: 10px;
			.mu-form-item {
				padding: 0;
				margin-bottom: 0;
			}
		}
		.mu-form-item .mu-input {
			position: relative;
			top: 5px;
		}
		.withdraw-btn {
			width: 100%;
		}
	}
	.extend-starts {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
	
	.card-list {
		padding-top: 20px;
		.card-item {
			border-bottom: 1px solid rgba(0, 0, 0, 0.12);
			&:last-child {
				border-bottom: none;
			}
		}
	}
</style>