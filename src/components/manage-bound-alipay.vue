<template>
	<div class="manage-bound">
		<mu-appbar color="primary">
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			绑定支付宝
		</mu-appbar>
		<mu-container v-show="local">
			<mu-flex color="primary" :style="getPrimaryColor" class="title-margin">添加支付宝</mu-flex>
			<mu-form ref="form" :model="validateForm" class="mu-demo-form">
				<mu-form-item label="真实姓名" prop="PayName" :label-position="labelPosition">
					<mu-text-field type="text" v-model="validateForm.PayName" prop="PayName" placeholder="请输入您的真实姓名"></mu-text-field>
				</mu-form-item>
				<mu-form-item label="支付宝账号" prop="PayAccount" :label-position="labelPosition">
					<mu-text-field type="text" v-model="validateForm.PayAccount" prop="PayAccount" placeholder="请输入支付宝账号"></mu-text-field>
				</mu-form-item>
				<mu-form-item label="结算密码" prop="PayConPwd" :label-position="labelPosition">
					<mu-text-field type="password" v-model="validateForm.PayConPwd" prop="PayConPwd" placeholder="请输入您的结算密码"></mu-text-field>
				</mu-form-item>
				<mu-form-item <mu-button color="primary" @click="PaySubmit" class="pay-btn">添加</mu-button>
				</mu-form-item>
			</mu-form>
		</mu-container>
		<div class="title-bound" v-show="locals">
			<mu-flex color="primary" :style="getPrimaryColor" class="title-margin">支付宝账号信息</mu-flex>
			<ul>
				<li>
					<div class="item-content">
						<div class="item-inner">
							<div class="item-title">支付宝账号</div>
							<div class="item-after">{{alipay}}</div>
						</div>
					</div>

				</li>
				<li>
					<div class="item-content">
						<div class="item-inner">
							<div class="item-title">真实姓名</div>
							<div class="item-after">{{true_name}}</div>
						</div>
					</div>
				</li>
				<li>
					<div class="item-content">
						<div class="item-inner item-inner-none">
							<div class="item-title">绑定时间</div>
							<div class="item-after">{{ctime}}</div>
						</div>
					</div>
				</li>
			</ul>
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
				labelPosition: 'left',
				validateForm: {
					PayName: '',
					PayAccount: '',
					PayConPwd: ''
				},
				alipay: '',
				ctime: '',
				true_name: '',
				local: true,
				locals: false
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
			this.LoadSubmit()
			this.LoadData()
		},
		methods: {
			LoadData() {
				let url = httpUrl + 'api/bill/getAlipay';
				let params = {
					token: this.user.token
				}
				getAccountInfo(url, params).then((res) => {
					if(res.status === ERROR_OK) {
						this.alipay = res.data.alipay
						this.ctime = res.data.ctime
						this.true_name = res.data.true_name
						if(res.status === ERROR_OK) {
							this.local = false
							this.locals = true
						} else {
							this.local = true
							this.locals = false
						}
					} else if(!res.status) {
						eventBus.$emit('showNotification', '登录已过期')
					} else {
						eventBus.$emit('showNotification', res.msg)
					}
				})
			},
			LoadSubmit() {
				let url = httpUrl + 'api/bill/isSetPwd';
				let params = {
					token: this.user.token
				}
				getAccountInfo(url, params).then((res) => {
					if(res.status === ERROR_OK) {
						
					} else if(!res.status) {
						eventBus.$emit('showNotification', '登录已过期')
					} else {
						eventBus.$emit('showNotification', res.msg)
					}
				})
			},
			PaySubmit() {
				let url = httpUrl + 'api/bill/binAliAccount'
				if(this.validateForm.PayName == '') {
					alert("请输入您的真实姓名");
					return;
				}
				if(this.validateForm.PayAccount == '') {
					alert("请输入支付宝账号");
					return;
				}
				if(this.validateForm.PayConPwd == '') {
					alert("请输入您的结算密码");
					return;
				}
				let params = {
					token: this.user.token,
					dosubmit: 1,
					true_name: this.validateForm.PayName,
					account: this.validateForm.PayAccount,
					re_new_passwd: this.validateForm.PayConPwd
				}
				bankCardWithdraw(url, params).then((res) => {
					if(res && res.status === ERROR_OK) {
						this.setup = true;
						eventBus.$emit('showNotification', '支付宝绑定成功')
					} else if(!res.status) {
						eventBus.$emit('showNotification', '登录已过期')
					} else {
						eventBus.$emit('showNotification', res.msg)
					}
				})
			},
		},
		components: {
			'back': back,
		}
	}
</script>

<style lang="scss" scoped>
	.title-margin {
		margin-top: 20px;
		min-height: 48px;
		line-height: 48px;
		padding: 0 10px;
		color: #fff;
		font-size: 16px;
		margin-bottom: 10px;
	}
	
	.pay-btn {
		width: 100%;
		min-height: 48px;
		font-size: 16px;
	}
	
	.mu-form-item-label {
		font-size: 16px !important;
	}
	
	ul,
	li,
	div {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	
	.item-content {
		min-height: 48px;
		padding-left: 16px;
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
		line-height: 48px;
	}
	
	.item-inner {
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
	
	.item-title {
		min-width: 0;
		-webkit-flex-shrink: 1;
		-ms-flex-negative: 1;
		flex-shrink: 1;
		white-space: nowrap;
		position: relative;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
		font-size: 16px;
	}
	
	.item-after {
		color: #757575;
		font-size: 14px;
		padding-left: 8px;
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
	
	.manage-bound {
		width: 100%;
		height: 100%;
		background-color: #fff;
	}
	
	.title-bound {
		margin: 8px;
		-webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		background: #fff;
		position: relative;
		border-radius: 2px;
		font-size: 14px;
	}
	
	.item-inner-none:after {
		height: 0;
	}
</style>