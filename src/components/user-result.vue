<template>
	<div class="user-result">
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			结算密码
		</mu-appbar>
		<mu-container class="user-result-margin">
			<mu-form ref="form" :model="validateForm" class="mu-demo-form">
				<mu-form-item label="旧的密码" prop="ClearOldPwd" :label-position="labelPosition">
					<mu-text-field type="password" v-model="validateForm.ClearOldPwd" prop="ClearOldPwd" placeholder="请输入原来的结算密码"></mu-text-field>
				</mu-form-item>
				<mu-form-item label="新的密码" prop="NewPwd" :label-position="labelPosition">
					<mu-text-field type="password" v-model="validateForm.ClearNewPwd" prop="ClearNewPwd" placeholder="请输入新的结算密码"></mu-text-field>
				</mu-form-item>
				<mu-form-item label="确认密码" prop="ConPwd" :label-position="labelPosition">
					<mu-text-field type="password" v-model="validateForm.ClearConPwd" prop="ClearConPwd" placeholder="请再输入一次结算密码"></mu-text-field>
				</mu-form-item>
				<mu-form-item
					<mu-button color="primary" @click="ClearSubmit" class="modify-btn">修改</mu-button>
				</mu-form-item>
			</mu-form>
		</mu-container>
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
		data () {
			return {
				user:null,
				validateForm: {
					ClearOldPwd:'',
					ClearNewPwd:'',
					ClearConPwd:''
				},
				labelPosition: 'left',
				setup: false,
			}
		},
		created() {
			this.getIconUrl = getIconUrl
			this.user = this.$apps.spreadUser();
			this._ClearSubmit()
		},
		methods:{
			_ClearSubmit () {
				let url=httpUrl+'api/bill/isSetPwd';
				let params = {
					token: this.user.token,
				}
				getBankList(url, params).then((res) => {
					if(res && res.status == ERROR_OK && res.data) {
						this.setup=res.data.isSet == 1
					} else {
						eventBus.$emit('showNotification', res.msg)
					}
				})
			},
			ClearSubmit () {
				let url=httpUrl+'api/bill/reppwd';
				if(this.validateForm.ClearOldPwd==''){
					alert('旧密码不能为空！')
					return;
				}
				if(this.validateForm.ClearNewPwd==''){
					alert('新密码不能为空! ')
					return;
				}
				if(this.validateForm.ClearNewPwd!=this.validateForm.ClearConPwd){
					alert('两次密码不一致！')
					return;
				}
				let params={
					token: this.user.token,
					dosubmit: 1,
					oldpwd:this.validateForm.ClearOldPwd,
					npwd:this.validateForm.ClearNewPwd,
					renpwd:this.validateForm.ClearConPwd
				}
				bankCardWithdraw(url, params).then((res) => {
					if(res&&res.status === ERROR_OK) {
						this.setup = true;
						eventBus.$emit('showNotification','结算密码修改成功');
						setTimeout(()=>{
							this.$router.back();
						},2000)	
					} else {
						eventBus.$emit('showNotification',res.msg)
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
	.user-result{
		width:100%;
		height:100%;
		position:absolute;
		background-color:#fff;
	}
	.user-result-margin{
		padding: 0 20px;
	}
	.modify-btn{
		width:100%;
		height:48px;
		font-size:16px;
	}
</style>