<template>
	<div class="manage-transfer">
		<!-- 头部导航 -->
		<mu-appbar color="primary">
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			支付宝提现管理
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
						<mu-list-item-action>{{moneyInfo.money}}</mu-list-item-action>
					</mu-list-item>
					<mu-divider></mu-divider>
					<mu-list-item :ripple="false">
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="info-title">提现金额</mu-flex>
								<mu-flex fill>
									<mu-form :model="form" class="mu-demo-form" label-position="left" label-width="0">
										<mu-form-item>
											<mu-text-field v-model="withdrawAccount" placeholder="金额不得少于10元" type='number'></mu-text-field>
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
								<mu-flex justify-content="center" class="info-title">支付宝账号信息</mu-flex>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action></mu-list-item-action>
					</mu-list-item>
					<mu-divider></mu-divider>
					<mu-list-item :ripple="false">
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="info-title">支付宝账号</mu-flex>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action>{{alipayInfo.alipay}}</mu-list-item-action>
					</mu-list-item>
					<mu-divider></mu-divider>
					<mu-list-item :ripple="false">
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="info-title">真实姓名</mu-flex>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action>{{alipayInfo.true_name}}</mu-list-item-action>
					</mu-list-item>
					<mu-divider></mu-divider>
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

	</div>
</template>
<script type="text/javascript">
	import Back from 'base/back'
	import { primaryColor } from 'common/js/config.js'

	import eventBus from 'common/js/event-bus.js'
	import { getIconUrl } from 'common/js/tools.js'

	export default {
		data() {
			return {
				user: null,
				accountInfo: {},
				withdrawAccount: '',
				balancePwd: '',
				form: {},
				moneyInfo: {},
				alipayInfo: {},
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
			this.load();
			this.getMoney();
		},
		methods: {
			getMoney() {
				this.$axios.post('api/bill/apply', {
						token: this.user.token
					})
					.then((res) => {
						//			console.log(res.data.data)
						if(res.data && res.data.status == 0 && res.data.data) {
							this.moneyInfo = res.data.data;
							this.moneyInfo.money = this.$spreadFormat(this.moneyInfo.money) || '';
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
			load() {
				eventBus.$emit('showNotification', '正在加载数据..')
				this.$axios.post('api/bill/getAlipay', {
						token: this.user.token
					})
					.then((res) => {
						//			console.log(res.data.data)
						if(res.data && res.data.status == 0 && res.data.data) {
							this.alipayInfo = res.data.data;
							this.alipayInfo.true_name = this.$apps.addStar(this.alipayInfo.true_name, this.$apps.interceptStrAccordByte(this.alipayInfo.true_name, 2)) || '';
						} else if(res.data.data==''||!res.data.data){
							eventBus.$emit('showNotification', '该账号暂未绑定支付宝信息');
							this.$router.push('/manage/bound/alipay/');
						}else if(!res.data.status) {
							eventBus.$emit('showNotification', '登录已过期')
						} else {
							eventBus.$emit('showNotification', res.data.msg)
						}
					})
					.catch(function(err) {
						eventBus.$emit('showNotification', err)
					})
			},
			withdraw() {
				var _that = this;
				if(!_that.withdrawAccount) {
					eventBus.$emit('showNotification', '请输入提现金额！')
					return
				}
				if(!_that.balancePwd) {
					eventBus.$emit('showNotification', '请输入结算密码！')
					return
				}

				_that.$axios.post('api/bill/getMoneyWithAlipay', {
						token: _that.user.token,
						dosubmit: 1,
						amount: _that.withdrawAccount,
						password: _that.balancePwd
					})
					.then((res) => {
						if(res.data && res.data.status == 0 && res.data.data) {
							_that.getMoney();
							eventBus.$emit('showNotification', '支付宝提现申请成功')
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