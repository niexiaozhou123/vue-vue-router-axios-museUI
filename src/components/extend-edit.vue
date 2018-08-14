<template>
	<div class="extend-edit">
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			推广链接
		</mu-appbar>

		<mu-container>
			<mu-paper :z-depth="3" style='margin: 60px 10px 10px 10px !important; padding: 0 8px; background-color: #FFFFFF !important;'>
				<mu-form :model="form" :label-position="labelPosition">
					<mu-form-item prop="input" label="配置名称" class="label-font">
						<mu-text-field v-model="form.input" placeholder="请输入配置名称"></mu-text-field>
					</mu-form-item>
				</mu-form>
				<mu-flex align-items="center" class="register-template" @click="openPageTemplate">
					<mu-flex fill>推广页模板</mu-flex>
					<mu-flex>
						{{choseHtml}}
						<mu-icon value="keyboard_arrow_right" class="icon-right"></mu-icon>
					</mu-flex>
				</mu-flex>
				<mu-flex align-items="center" class="register-templates" @click="openCodeTemplate">
					<mu-flex fill>二维码模板</mu-flex>
					<mu-flex>
						{{choseQr}}
						<mu-icon value="keyboard_arrow_right" class="icon-right"></mu-icon>
					</mu-flex>
				</mu-flex>
			</mu-paper>

			<div class="card-btn">
				<mu-button color="primary" class="extend-btn" @click='submit'>添加</mu-button>
			</div>
		</mu-container>

		<!--推广页模板-->

		<mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="openFullscreen" scrollable>
			<mu-appbar color="primary" :title="textInfo">
				<mu-button slot="left" icon @click="openFullscreen=false">
					<mu-icon value="keyboard_backspace"></mu-icon>
				</mu-button>
			</mu-appbar>

			<mu-paper :z-depth="3" v-if='isTemplates'>
				<mu-list>
					<mu-list-item v-for='item in TemplatesList' :key='item.id'>
						<mu-list-item-action>
							<mu-radio :value="item.id" v-model="choseRadio" :label="item.url" @click='send' :data-url="item.url"></mu-radio>
						</mu-list-item-action>
						<mu-list-item-content></mu-list-item-content>
						<mu-list-item-action style='color: rgb(52,133,251);' @click='openHTML(item.url)'>
							预览模板
						</mu-list-item-action>
					</mu-list-item>
				</mu-list>
			</mu-paper>

			<mu-paper :z-depth="3" v-if='isQRTemplates'>
				<mu-list>
					<mu-list-item v-for='item in QRTemplatesList' :key='item.id'>
						<mu-list-item-action>
							<mu-radio :value="item.id" v-model="choseRadio2" :label="item.title" @click='send2' :data-title='item.title'></mu-radio>
						</mu-list-item-action>
						<mu-list-item-content></mu-list-item-content>
						<mu-list-item-action>
							<img :src='QRTemplatesURL+item.url' style='width: 108px; height: 190px;' />
						</mu-list-item-action>
					</mu-list-item>
				</mu-list>
			</mu-paper>

		</mu-dialog>

	</div>
</template>

<script type="text/javascript">
	import back from 'base/back'
	import { primaryColor } from 'common/js/config.js'
	import { getIconUrl } from 'common/js/tools.js'
	import eventBus from 'common/js/event-bus.js'

	export default {
		data() {
			return {
				user: null,
				labelPosition: 'left',
				form: {
					input: '',
				},
				note: '',
				textInfo: '',
				openFullscreen: false,
				isTemplates: false,
				isQRTemplates: false,

				TemplatesList: {},
				TemplatesURL: '',
				QRTemplatesList: {},
				QRTemplatesURL: '',

				choseHtml: '',
				choseRadio: 0,

				choseQr: '',
				choseRadio2: 0,
			}
		},
		created() {
			this.user = this.$apps.spreadUser();
			this.loadPageTemplate();
			this.loadQRTemplate();

		},
		methods: {
			openPageTemplate() {
				this.openFullscreen = true;
				this.isTemplates = true;
				this.isQRTemplates = false;
				this.textInfo = '推广页模板';
			},
			openCodeTemplate() {
				this.openFullscreen = true;
				this.isQRTemplates = true;
				this.isTemplates = false;
				this.textInfo = '二维码模板';
			},
			loadPageTemplate() {
				this.$axios.post('api/templates/getTemplatesList', {
						token: this.user.token
					})
					.then((res) => {
						//					console.log(res.data.data)
						if(res.data && res.data.status == 0 && res.data.data) {
							this.TemplatesList = res.data.data.data;
							this.TemplatesURL = res.data.data.spread_domain_name;
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
			loadQRTemplate() {
				this.$axios.post('api/templates/getQRTemplatesList', {
						token: this.user.token
					})
					.then((res) => {
						//					console.log(res.data.data)
						if(res.data && res.data.status == 0 && res.data.data) {
							this.QRTemplatesList = res.data.data.data;
							this.QRTemplatesURL = res.data.data.spread_domain_name;
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
			send(e) {
				//				console.log(e.srcElement.parentElement.parentElement.innerText)
				this.choseHtml = e.srcElement.parentElement.parentElement.innerText;
				if(!this.choseHtml || !this.choseRadio) return;
				this.openFullscreen = false;
			},
			send2(e) {
				//				console.log(e.srcElement.parentElement.parentElement.innerText)
				this.choseQr = e.srcElement.parentElement.parentElement.innerText;
				if(!this.choseQr || !this.choseRadio2) return;
				this.openFullscreen = false;
			},
			openHTML(url) {
				var urls = this.TemplatesURL + url;
				window.open(urls)
			},
			submit() {

				if(!this.form.input) {
					eventBus.$emit('showNotification', '请输入配置名称!')
					return;
				}
				if(this.choseRadio == 0) {
					eventBus.$emit('showNotification', '请选择推广页模板!')
					return;
				}
				if(this.choseRadio2 == 0) {
					eventBus.$emit('showNotification', '请选择二维码模板!')
					return;
				}

				eventBus.$emit('showNotification', '正在提交..请稍候!')
				this.$axios.post('api/templates/addUserTemplate', {
						token: this.user.token,
						name: this.form.input,
						note: this.note || '',
						template_id: this.choseRadio,
						qr_template_id: this.choseRadio2
					})
					.then((res) => {
						if(res.data && res.data.status == 0) {
							this.$alert('推广链接创建成功');
							this.$router.go(-1);
						} else if(!res.data.status) {
							eventBus.$emit('showNotification', '登录已过期')
						} else {
							eventBus.$emit('showNotification', res.data.msg)
						}
					})
					.catch(function(err) {
						eventBus.$emit('showNotification', err)
					})

			}
		},
		components: {
			'back': back,
		}
	}
</script>
<style lang="scss" scoped>
	div {
		margin: 0;
		padding: 0;
	}
	
	.extend-edit {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: #eee;
	}
	
	.extend-from {
		margin: 8px 8px 0 8px;
		padding: 8px 8px 0 8px;
		background-color: #fff;
	}
	
	.register-template {
		position: relative;
		top: -5px;
		line-height: 36px;
		height: 36px;
		font-size: 16px;
		border-bottom: 1px solid #666666;
	}
	
	.register-templates {
		position: relative;
		top: -5px;
		line-height: 36px;
		height: 36px;
		font-size: 16px;
		margin: 10px 0;
	}
	
	.icon-right {
		line-height: 40px;
	}
	
	.extend-btn {
		width: 100%;
		min-height: 48px;
		font-size: 16px;
		line-height: 48px;
	}
	
	.card-btn {
		margin: 0 8px;
	}
</style>