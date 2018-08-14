<template>
	<div class="manage-card-edit">
		<mu-appbar color="primary">
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			银行卡管理
		</mu-appbar>

		<mu-paper :z-depth="3" style='margin: 8px; padding: 8px 0; background-color: #FFFFFF !important;'>
			<div class="block-title" :style="getPrimaryColor">添加银行卡</div>
			<div class="user-names">

				<mu-form ref="form" :model="validateForm" class="mu-demo-form" :label-position="labelPosition">
					<mu-form-item label="开户人" prop="CardUser">
						<mu-text-field v-model="validateForm.CardUser" prop="CardUser" placeholder="请输入姓名，只能是中文字符，最长16个汉字"  :max-length='16'></mu-text-field>
					</mu-form-item>
					<mu-form-item label="银行卡号" prop="CardNum">
						<mu-text-field v-model="validateForm.CardNum" prop="CardNum" placeholder="卡号由16-19位数字组成" :max-length='19'></mu-text-field>
					</mu-form-item>
				</mu-form>

				<div class="item-content">
					<div class="item-inner" @click="addCardList">
						<div class="item-title">银行名称</div>
						<div class="item-after">
							{{bank_name}}
							<mu-icon value="keyboard_arrow_right" class="keyboard_arrow_right"></mu-icon>
						</div>
					</div>
				</div>
				<mu-container class="user-name" style='margin-top: 0 !important;'>
					<mu-form ref="form" :model="validateForm" class="mu-demo-form" :label-position="labelPosition">
						<mu-form-item label="结算密码" prop="CardUserPwd">
							<mu-text-field v-model="validateForm.CardUserPwd" prop="CardUserPwd" placeholder="请输入您的结算密码" type="password" :max-length='12'></mu-text-field>
						</mu-form-item>
						<mu-form-item label="已绑定过的任意一个银行卡卡号" prop="CardOldNum">
							<mu-text-field v-model="validateForm.CardOldNum" prop="CardOldNum" placeholder="卡号由16-19位数字组成" :max-length='19'></mu-text-field>
						</mu-form-item>
					</mu-form>
				</mu-container>
			</div>
		</mu-paper>

		<!--银行列表弹框-->
		<mu-dialog width="360" transition="slide-bottom" fullscreen scrollable :open.sync="openFullscreen">
			<mu-appbar color="primary" title="银行名称">
				<mu-button slot="left" icon @click="openFullscreen=false">
					<mu-icon value="keyboard_backspace"></mu-icon>
				</mu-button>
			</mu-appbar>

			<mu-container class="bank-name">
				<div class="select-control-group">
					<mu-flex class="select-control-row" v-for="(bankList,index) in bankLists" :key='index'>
						<mu-radio :value="bankList.bankCode" v-model="choseRadio" :label="bankList.bankName" @click="send"></mu-radio>
					</mu-flex>
				</div>
			</mu-container>

		</mu-dialog>

		<div class="item-margin">
			<mu-button color="primary" class="addCard-btns" @click='submit'>添加</mu-button>
		</div>
	</div>
</template>

<script type="text/javascript">
	import back from 'base/back'
	import { primaryColor } from 'common/js/config.js'
	import { bankLists } from 'config/agent-menus.js'
	import { getIconUrl } from 'common/js/tools.js'
	import eventBus from 'common/js/event-bus.js'
	import { getAccountInfo, getBankList, bankCardWithdraw } from 'api/manage-transfer.js'
	export default {
		data() {
			return {
				user: null,
				labelPosition: 'top',
				openFullscreen: false,
				validateForm: {
					CardUser: '',
					CardNum: '',
					CardUserPwd: '',
					CardOldNum: '',
				},
				choseRadio: '',
				bankLists: {},
				bank_name: '',
				resetBankCard: 0,
				bank: '',
			}
		},
		created() {
			this.getIconUrl = getIconUrl
			this.user = this.$apps.spreadUser();
			this.bankLists = this._getBankList(bankLists)
		},
		methods: {
			addCardList() {
				this.openFullscreen = true;
			},
			_getBankList(bankLists) {
				if(bankLists.length <= 0) {
					return;
				}
				let count = []
				if(bankLists) {
					for(let bank in bankLists) {
						let banks = bankLists[bank]
						count.push(banks)
					}
					return count
				}
			},
			send(e) {
				//				console.log(e.srcElement.parentElement.parentElement.innerText)
				this.bank_name = e.srcElement.parentElement.parentElement.innerText;
				if(!this.bank_name || !this.choseRadio) return;
				this.openFullscreen = false;
			},
			submit() {
				if(!this.validateForm.CardUser) {
					this.$alert("请填写开户人姓名");
					return;
				}
				if(this.validateForm.CardNum.length < 16 | this.validateForm.CardNum.length > 19) {
					this.$alert("请输入正确的卡号");
					return;
				}
				if(!this.choseRadio) {
					this.$alert("请选择输入银行卡号对应的银行");
					return;
				}
				if(!this.validateForm.CardUserPwd) {
					this.$alert("请填写结算密码");
					return;
				}
				if((this.validateForm.CardOldNum.length < 16 || this.validateForm.CardOldNum.length > 19)) {
					if(this.$apps.spreadParam.call(this, "isBind")) {
						this.$alert("请输入已绑定过的正确格式的银行卡号");
						return;
					}
				}

				this.$axios.post('api/bill/bindBankCard', {
						"token": this.user.token,
						"bank_code": this.choseRadio,
						"bank_name": this.bank_name,
						"billPwd": this.validateForm.CardUserPwd,
						"bank_address": 'bank_address',
						"pay_account": this.validateForm.CardNum,
						"old_bank_number": this.validateForm.CardOldNum,
						"name": this.validateForm.CardUser,
						"dosubmit": 1,
						"resetBankCard": this.resetBankCard
					})
					.then((res) => {
						console.log(res);
						if(res.data && res.data.status == 0) {
							this.$alert("添加银行卡成功");
							this.$router.go(-1);
						} else if(res.data && res.data.status == 12) {
							eventBus.$emit('showNotification', res.data.msg)
							this.$router.back('/user/result/')
						} else {
							eventBus.$emit('showNotification', res.data.msg)
						}
					})
					.catch(function(err) {
						eventBus.$emit('showNotification', err)
					})
			},
			namechange(e){
				console.log(e);
			}
		},
		computed: {
			getPrimaryColor() {
				return `color:${primaryColor};`
			}
		},
		components: {
			'back': back,
		}
	}
</script>
<style lang="scss" scoped>
	.manage-card-edit {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: #fff;
	}
	
	div {
		margin: 0;
		padding: 0;
	}
	
	.block-title {
		margin: 16px 0 16px 16px;
		line-height: 16px;
		font-weight: 500;
	}
	
	.mu-text-field-input {
		height: 36px;
	}
	
	.user-names {
		padding-left: 12px;
	}
	
	.mu-form-item {
		margin-bottom: 0;
		padding-bottom: 0;
	}
	
	.mu-form-item-label {
		font-size: 12px;
	}
	
	.item-inner {
		position: relative;
		width: 100%;
		padding-top: 8px;
		padding-bottom: 8px;
		padding-right: 10px;
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
	
	.item-inner:after {
		content: '';
		position: absolute;
		background-color: rgba(0, 0, 0, 0.12);
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
	
	.item-content {
		min-height: 48px;
		padding-left: 12px;
	}
	
	.item-after {
		color: #757575;
		font-size: 14px;
		padding-left: 8px;
		max-width: 70%;
		overflow: hidden;
		text-overflow: ellipsis;
		position: relative;
		display: block;
		white-space: nowrap;
		-webkit-flex-shrink: 0;
		-ms-flex-negative: 0;
		flex-shrink: 0;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		margin-left: auto;
		height: 32px;
		line-height: 32px;
	}
	
	.item-title {
		height: 32px;
		line-height: 32px;
		font-size: 16px;
	}
	
	.addCard-btns {
		width: 100%;
		min-height: 48px;
		outline: none;
		border: none;
		font-size: 18px;
		font-weight: 500;
	}
	
	.item-margin {
		margin: 0 8px;
	}
	
	.keyboard_arrow_right {
		vertical-align: middle;
		line-height: 32px;
		margin-left: 12px;
	}
	
	.bank-start {
		position: fixed;
		left: 0;
		bottom: 0;
		top: 0;
		right: 0;
	}
	
	.manage-name {
		width: 100%;
		position: absolute;
		background-color: #eee;
	}
	
	.bank-name {
		margin: 80px 0;
		/*background-color:rgb(238,238,238) ;*/
	}
	
	.mu-radio {
		height: 48px;
		line-height: 48px;
	}
	
	.mu-radio-label {
		height: 48px;
		line-height: 48px;
	}
	
	.mu-radio-icon {
		margin-right: 20px;
	}
	
	.select-control-group {
		margin: 0 16px;
	}
</style>