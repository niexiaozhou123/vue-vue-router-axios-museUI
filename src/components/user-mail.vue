<template>
	<div class="user-mail">
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			邮箱绑定
		</mu-appbar>
		
		<mu-container class="user-margin ">
			<mu-flex class="info-title">提高您账号的安全性，用于您的密码找回</mu-flex>
			<mu-form ref="form" :model="validateForm" class="mu-demo-form" :label-position="labelPosition">
				<mu-form-item label="绑定邮箱" prop="email" >
					<mu-text-field v-model="validateForm.email" prop="email" placeholder="请输入需绑定的邮箱地址"></mu-text-field>
				</mu-form-item>
				<mu-form-item
					<mu-button color="primary" @click="submit" class="modify-btn">修改</mu-button>
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
				labelPosition: 'left',
				validateForm:{
					email:'',
				}
			}
		},
		created() {
			this.getIconUrl = getIconUrl
			this.user = this.$apps.spreadUser();
		},
		methods: {
			submit() {
				let url = httpUrl + 'api/bind/email'
				let email=this.validateForm.email
				if(!email ||  !(/^(?:\w+\.?)*\w+@(?:\w+\.)*\w+$/.test(email))) {
					alert('请输入合法的邮箱地址');
					return;
				}
				let params = {
					token: this.user.token,
					email:email,
					dosubmit: '1'
				}
				bankCardWithdraw(url, params).then((res) => {
					if(res.status === ERROR_OK) {
						eventBus.$emit('showNotification', '邮箱绑定成功')
					} else {
						eventBus.$emit('showNotification', res.msg)
					}
				})
				this.validateForm.email=''
			},
		},
		components: {
			'back': back,
		}
	}
</script>

<style lang="scss" scoped>
	.user-mail{
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: #fff;
	}
	
	.info-title {
		padding:0 10px 0 0;
		margin-top: 32px;
		margin-bottom:10px;
		color: rgba(0, 0, 0, 0.54);
		font-size: 14px;
	}
	.mu-button-wrapper{
		position:absolute;
		left:0;
		top:0;
		bottom:0;
		right:0;
	}
	.modify-btn {
		width: 100%;
		height: 48px;
		font-size: 18px;
	}
	.mu-form-item-label{
		font-size:16px !important;
	}
	.user-margin{
		margin:32px 0;
		padding: 0 10px;
	}
</style>