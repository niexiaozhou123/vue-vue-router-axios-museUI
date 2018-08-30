<template>
	<div class="manage-transfer">
		<!-- 头部导航 -->
		<mu-appbar color="primary">
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			下级转账
		</mu-appbar>
		<mu-container class="whole-screen-wrapper" style='margin-top: 0 !important;'>
			<mu-paper :z-depth="3" class="account-info" >
				<mu-list>
					<mu-list-item :ripple="false">
						<mu-list-item-title @click='openDialog'>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="info-title">直属下级</mu-flex>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action @click='openDialog'>
							<mu-flex align-items="center">
								<strong>{{choseLabel}}</strong>
								<mu-icon value='keyboard_arrow_right'></mu-icon>
							</mu-flex>
						</mu-list-item-action>
					</mu-list-item>
					<mu-divider></mu-divider>
					<mu-list-item :ripple="false">
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="info-title">提现余额：{{listInfo.balance}}</mu-flex>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action></mu-list-item-action>
					</mu-list-item>

					<mu-list-item :ripple="false">
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="info-title">转账金额</mu-flex>
								<mu-flex fill>
									<mu-form :model="form" class="mu-demo-form" label-position="left" label-width="0">
										<mu-form-item>
											<mu-text-field v-model="withdrawAccount" placeholder="金额不得少于1元" type='number'></mu-text-field>
										</mu-form-item>
									</mu-form>
								</mu-flex>
							</mu-flex>
						</mu-list-item-title>
					</mu-list-item>
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

			<mu-paper :z-depth="3">
				<mu-row>
					<mu-col span="12">
						<mu-button large color="primary" class="withdraw-btn" @click="withdraw">转账</mu-button>
					</mu-col>
				</mu-row>
			</mu-paper>

			<!--下级列表-->

			<mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="openFullscreen" scrollable>
				<mu-appbar color="primary" title="直属下级">
					<mu-button slot="left" icon @click="closeDialog">
						<mu-icon value="keyboard_backspace"></mu-icon>
					</mu-button>
				</mu-appbar>

				<mu-paper :z-depth="3">
					<mu-list>
						<mu-list-item v-for='item in listInfo.agents' :key='item.id'>
							<mu-list-item-action>
								<mu-radio :value="item.id" v-model="choseRadio" :label="item.name" @click='send'></mu-radio>
							</mu-list-item-action>
						</mu-list-item>
					</mu-list>
				</mu-paper>
			</mu-dialog>
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
				openFullscreen: false,
				choseRadio: '',
				choseLabel: '',
				withdrawAccount: '',
				balancePwd: '',
				form: {},
				listInfo: {},
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

		},
		methods: {
			load() {
				eventBus.$emit('showNotification', '正在加载数据..')
				this.$axios.post('api/agent/getlist', {
						token: this.user.token,
						size: 9999
					})
					.then((res) => {
						//									console.log(res.data.data)
						if(res.data && res.data.status == 0 && res.data.data) {
							this.listInfo = res.data.data.data;

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
			withdraw() {
				var _that = this;
				if(!_that.withdrawAccount) {
					eventBus.$emit('showNotification', '请输入提现金额!')
					return
				}
				if(!_that.balancePwd) {
					eventBus.$emit('showNotification', '请输入结算密码!')
					return
				}
				if(_that.withdrawAccount <= 1) {
					eventBus.$emit('showNotification', '转账金额需大于1元!')
					return
				}
				if(!_that.choseRadio || !_that.choseLabel) {
					eventBus.$emit('showNotification', '必须选择转账对象!')
					return
				}
				_that.$confirm('是否确认转账信息?转账下级：' + _that.choseLabel, '转账确认', {
					type: 'warning',
				}).then(({
					result
				}) => {
					if(result) {
						_that.$axios.post('api/recharge/addAgentMoney', {
								token: _that.user.token,
								agentId: _that.choseRadio,
								amount: _that.withdrawAccount,
								billPwd: _that.balancePwd
							})
							.then((res) => {
								if(res.data && res.data.status == 0) {
									_that.getMoney();
									eventBus.$emit('showNotification', '转账成功');
									_that.$router.push({
										path: '/refresh/',
										query: {
											stats: '2'
										}
									})
								} else if(!res.data.status) {
									eventBus.$emit('showNotification', '登录已过期')
								} else {
									eventBus.$emit('showNotification', res.data.msg)
								}
							})
							.catch(function(err) {
								eventBus.$emit('showNotification', err)
							})
					} else {
						return;
					}
				})

			},
			openDialog() {
				
				this.openFullscreen = true;
				console.log('--')
			},
			closeDialog() {
				this.openFullscreen = false;
			},
			send(e) {
				this.choseLabel = e.srcElement.parentElement.parentElement.innerText;
				if(!this.choseLabel || !this.choseRadio) return;
				this.closeDialog();
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
	
	.mu-dialog {
		padding: 20px 0 !important;
	}
</style>