<template>
	<div class="user-password">
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			登录密码
		</mu-appbar>
		<mu-container class="user-margin">
			<mu-form ref="form" :model="validateForm" class="mu-demo-form">
				<mu-form-item label="旧的密码" prop="OldPwd" :label-position="labelPosition">
					<mu-text-field type="password" v-model="validateForm.OldPwd" prop="OldPwd" placeholder="请输入原来的登录密码"></mu-text-field>
				</mu-form-item>
				<mu-form-item label="新的密码" prop="NewPwd" :label-position="labelPosition">
					<mu-text-field type="password" v-model="validateForm.NewPwd" prop="NewPwd" placeholder="请输入新的登录密码"></mu-text-field>
				</mu-form-item>
				<mu-form-item label="确认密码" prop="ConPwd" :label-position="labelPosition">
					<mu-text-field type="password" v-model="validateForm.ConPwd" prop="ConPwd" placeholder="请再输入一次登录密码"></mu-text-field>
				</mu-form-item>
				<mu-form-item
					<mu-button color="primary" @click="submit" class="submit-btn">修改</mu-button>
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
		data() {
			return {
				user:null,
				validateForm: {
					OldPwd: '',
					NewPwd:'',
					ConPwd:''
				},
				labelPosition: 'left',
			}
		},
		created() {
			this.getIconUrl = getIconUrl
			this.user = this.$apps.spreadUser();
		},
		methods:{
			submit () {
				let url = httpUrl + 'api/bind/updatePasswd';
				if(this.validateForm.OldPwd=='') {
					alert('旧密码不能为空！');
					return;
				}
				if(this.validateForm.NewPwd==''){
					alert('新密码不能为空！');
					return;
				}
				if(this.validateForm.NewPwd != this.validateForm.ConPwd){
					alert('两次密码不一致！');
					return;
				}
				let params={
					token: this.user.token,
					dosubmit: 1,
					old_passwd:this.validateForm.OldPwd,
					new_passwd:this.validateForm.NewPwd,
					re_new_passwd:this.validateForm.ConPwd
				}
				bankCardWithdraw(url, params).then((res) => {
					if(res&&res.status === ERROR_OK) {
						eventBus.$emit('showNotification', '密码修改成功')
					} else {
						eventBus.$emit('showNotification', res.msg)
					}
				})
				this.validateForm.OldPwd=''
				this.validateForm.NewPwd=''
				this.validateForm.ConPwd=''
			},
		},
		components: {
			'back': back,
		}
	}
</script>

<style lang="scss" scoped>
	.user-password {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: #fff;
	}
	.user-margin{
		margin:32px 0;
		padding: 0 20px;
	}
	.mu-button-wrapper{
		position:absolute;
		top:0;
		left:0;
		bottom:0;
		right:0;
	}
	.mu-form-item-label{
		font-size:16px;
	}
	.submit-btn{
		height:48px;
		width: 100%;
		font-size:18px;
	}
</style>