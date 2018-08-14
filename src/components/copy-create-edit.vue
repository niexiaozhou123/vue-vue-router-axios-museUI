<template>
	<div class="extend-edit">
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			注册链接新增
		</mu-appbar>

		<div>
			<mu-paper :z-depth="3" style='margin: 60px 10px 10px 10px; padding: 0 8px; background-color: #FFFFFF !important;'>
				<mu-form :model="form" :label-position="labelPosition">
					<mu-form-item prop="input" label="链接名称" class="label-font">
						<mu-text-field v-model="form.input" placeholder="请输入链接名称"></mu-text-field>
					</mu-form-item>
				</mu-form>
				<mu-flex align-items="center" class="register-template" @click="openPageTemplate">
					<mu-flex fill>注册模板</mu-flex>
					<mu-flex style='font-size: 14px;'>
						{{choseHtml}}
						<mu-icon value="keyboard_arrow_right" class="icon-right"></mu-icon>
					</mu-flex>
				</mu-flex>
			</mu-paper>
		</div>
		<div class="card-btn">
			<mu-button color="primary" class="extend-btn" @click='submit'>添加</mu-button>
		</div>

		<!--推广页模板-->

		<mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="openFullscreen" scrollable>
			<mu-appbar color="primary" title="注册页模板">
				<mu-button slot="left" icon @click="openFullscreen=false">
					<mu-icon value="keyboard_backspace"></mu-icon>
				</mu-button>
			</mu-appbar>

			<mu-paper :z-depth="3">
				<mu-list>
					<mu-list-item v-for='item in TemplatesList' :key='item.id'>
						<mu-list-item-action>
							<mu-radio :value="item.id" v-model="choseRadio" :label="item.url" @click='send' :data-url="item.url"></mu-radio>
						</mu-list-item-action>
						<mu-list-item-content></mu-list-item-content>
						<mu-list-item-action style='color: rgb(52,133,251); font-size: 8px !important;' @click='openHTML(item.url)'>
							预览模板
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

				TemplatesList: {},
				TemplatesURL: '',

				choseHtml: '',
				choseHtmls: '',
				choseRadio: 0,

			}
		},
		created() {
			this.user = this.$apps.spreadUser();
			this.loadPageTemplate();

		},
		methods: {
			openPageTemplate() {
				this.openFullscreen = true;
			},
			loadPageTemplate() {
				this.$axios.post('api/reg/getRegWebTemplatesList', {
						token: this.user.token
					})
					.then((res) => {
						//					console.log(res.data.data)
						if(res.data && res.data.status == 0 && res.data.data) {
							this.TemplatesList = res.data.data.data;
							this.TemplatesURL = res.data.data.spread_domain_name;
							//							for(var i = 0; i < this.TemplatesList.length; i++) {
							//								this.TemplatesList[i].urls = (this.TemplatesList[i].url.slice(0, 30)) + '...'
							//							}
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
					eventBus.$emit('showNotification', '请选择注册模板!')
					return;
				}

				eventBus.$emit('showNotification', '正在提交..请稍候!')
				this.$axios.post('api/reg/addRegAccountTemplates', {
						token: this.user.token,
						name: this.form.input,
						note: this.note || '',
						reg_web_template_id: this.choseRadio,
						url: this.choseHtml
					})
					.then((res) => {
						if(res.data && res.data.status == 0) {
							this.$alert('注册链接创建成功');
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
	
	.mu-radio-label {
		font-size: 14px !important;
	}
</style>