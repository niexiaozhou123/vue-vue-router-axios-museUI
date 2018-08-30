<template>
	<div class="login">
		<!--bg-->

		<!--login面板-->
		<mu-container class='container'>
			<mu-paper>
				<mu-form ref="form" :model="validateForm" class="mu-demo-form">
					<mu-form-item prop="username" :rules="usernameRules">
						<mu-text-field v-model="validateForm.username" prop="username" placeholder='用户名' :action-icon='usericon' @change='userchange' :action-click='userclear'></mu-text-field>
					</mu-form-item>
					<mu-form-item prop="password" :rules="passwordRules">
						<mu-text-field type="password" v-model="validateForm.password" prop="password" placeholder='密码' :action-icon='pwdicon' @change='pwschange' :action-click='pwdclear'></mu-text-field>
					</mu-form-item>

					<mu-form-item class='login_btn'>
						<mu-button color="white" @click="login2" full-width round ref='login_button'>{{btn_msg}}</mu-button>
					</mu-form-item>
				</mu-form>
			</mu-paper>
		</mu-container>

		<!--err弹框-->
		<mu-dialog title="Error" width="360" :open.sync="openSimple">
			{{msg}}
			<mu-button slot="actions" flat color="primary" @click="closeSimpleDialog">Close</mu-button>
		</mu-dialog>
		<mu-snackbar position="top" color="#fff" :open.sync="isShow">
			{{message}}
		</mu-snackbar>

	</div>
</template>

<script type="text/javascript">
	import { primaryColor } from 'common/js/config.js'
	import { getIconUrl } from 'common/js/tools.js'
	import { httpUrl } from 'api/http_url.js'

	export default {
		data() {
			return {
				id: 'com.029hch.spread',
				message: '',
				status: {
					"timeout": "读取数据超时",
					"parseerror": "数据解析错误"
				},
				user: null,
				login: {
					url: "http://{domain}/route/test",
					default: []
				},
				spread: {
					url: "http://{domain}/",
					domain: "",
					timeout: 15000,
					list: []
				},
				timeout: {
					count: 0,
					max: 3
				},
				//				servers: ["login1.jndsfs.com", "login2.jndsfs.com", "login.oim8d.com"],
				servers: ["login1.jndsfs.com", "login2.jndsfs.com"],
				isShow: false,
				validateForm: {
					username: '',
					password: ''
				},
				usernameRules: [{
					validate: (val) => !!val,
					message: '必须填写用户名'
				}, ],
				passwordRules: [{
					validate: (val) => !!val,
					message: '必须填写密码'
				}],
				usericon: '', //user栏 icon
				pwdicon: '', //pwd栏 icon
				openSimple: false,
				msg: '',
				btn_msg: '登 录'

			}
		},
		computed: {

		},
		created() { //钩子函数  渲染html之前    mounted  渲染html之后   区别在于 mounte只在每个页面加载时执行一次，和前者不能拿到dom操作*模板属性*的差异,不影响操作页面对象下data的属性。						
			var that = this;
			
			
			
			//本地环境屏蔽 此处代码   区分生产环境和服务器环境 生产环境需要login信息等  服务器环境直接转发至home页面
			
//			if(!that.$apps.spreadUser()){
//				console.log('spreadUser is null');
//				return;
//			}
			

			var urlName = that.$router.history.current.fullPath;
			if(urlName) {
				if(urlName.indexOf('/') != -1) {
					sessionStorage.spread_user = "";
					sessionStorage.spread_domain = "";
					that.login.default = that.servers || [];
					that.user = null;
					that.user = null;
					that.spread.domain = "";
					that.spread.list = [];

					if(localStorage.spread_user) {
						that.validateForm.username = localStorage.spread_user;
					}

					function loadServer() {
						that.showModal('正在测速，请稍候...');
						loadNext(that.loginUrl(), that.loginList());
					}

					function loadNext(url, list) {
						if(!list || list.length == 0) {
							that.showModal('无法获取地址!!');
							that.btn_msg = '重新获取地址';
							console.log('list:' + list)
							return;
						}
						var domain = list.shift();
						var loginUrl = url.replace("{domain}", domain);
						that.$axios.get(loginUrl)
							.then((data) => {
								if(data.data && data.data.login_list && data.data.spread_list) {
									localStorage.login_list = JSON.stringify(data.data.login_list);
									that.spread.list = [];
									testServer(data.data.spread_list);
								} else {
									loadNext(url, list);
									console.log(data);
								}
							})
							.catch(function(xhr, status) {
								loadNext(url, list);
							})
					}

					function testServer(list) {
						var spread = that.spread;
						var count = list.length;
						var url, children, node;
						for(var i = 0; i < count; i++) {
							url = spread.url.replace("{domain}", list[i]);
							console.warn("testServer", "test spreadUrl=", url);
							children = $("body").append('<img src="' + url + '" width="1" height="1" style="display:none">').children("img");
							node = $(children[children.length - 1]);
							node.on("error", function() {
								node = $(this);
								url = node.attr("src");
								console.warn("testServer", "call spreadUrl=", url);
								spread.list.push(url);								
								if(spread.list.length == 1) {
									sessionStorage.spread_domain = spread.domain = url;									
									that.btn_msg = '登 录';
								}
							});
						}
					}

					loadServer();

				}
			}

		},
		mounted() {

		},
		methods: {
			showModal(msg, time) {
				this.isShow = true;
				this.message = msg;
				time = time || 1500;
				setTimeout(() => {
					this.isHide()
				}, time)

			},
			isHide() {
				this.isShow = false;
				this.message = '';
			},
			login2() {
				var _that = this;
				_that.$refs.form.validate().then((result) => {
					if(_that.btn_msg == '登 录') {
						if(!result) {
							_that.msg = '请确认账号密码完整!';
							_that.openSimple = true;
							return;
						} else {							
							_that.btn_msg = '登陆中...';
							
							if(_that.spread.list.concat().length == 0) {
								_that.showModal('测速时产生了未知的错误!!');
								_that.btn_msg = '登 录';
								_that.$router.push('/refresh/')
								return;
							};

							var domain = _that.spread.list.concat().shift();
							domain = httpUrl;
							var url = httpUrl + 'api/login/checklogin';
							console.warn("signNext", "loginUrl=", url);
							_that.$axios.post(url, {
									username: _that.validateForm.username,
									password: _that.validateForm.password
								})
								.then((res) => {
									if(res.data) {
										if(res.data.status == 0) {
											sessionStorage.spread_domain = _that.spread.domain = domain;
											_that.timeout.count = 0;
											_that.user = {
												nickName: res.data.data.name || '',
												userName: res.data.data.name || '',
												token: res.data.data.token || '',
												group: res.data.data.source_group || '',
												channel: res.data.data.source || '',
												zongdai: res.data.data.isZongdai || false
											}
											
											//存储数据到缓存
											localStorage.setItem('spread_user',res.data.data.name);	
											sessionStorage.setItem ('spread_user',JSON.stringify(_that.user));
											sessionStorage.spread_user = JSON.stringify(_that.user);
											localStorage.setItem('agents','default');
//											location.replace("/home/");
//											_that.$router.push('/home/')
											_that.$router.replace('/home/')
//											var spread_user = JSON.parse(sessionStorage.spread_user);   json对象取出											
//											var spread_user = localStorage.spread_user;   字符串取出
											
											

										} else {
											_that.showModal(res.data.msg);
										}
									} else {
										_that.showModal(res.data.msg);
									}
								})
								.catch(function(err) {
									_that.showModal(err);
								})
						}

					} else if(_that.btn_msg == '重新获取地址') {
						_that.$router.push({
							path: '/refresh/',
							query: {
								stats: '1'
							}
						})
					}

				});
			},
			signNext(list, data, error) {
				var that = this;

				var domain = list.shift();
				domain = httpUrl;
				var url = httpUrl + 'api/login/checklogin';
				console.warn("signNext", "loginUrl=", url);
				that.$axios.post(url, data)
					.then((res) => {
						if(res.data) {
							if(res.data.status == 0) {
								sessionStorage.spread_domain = that.spread.domain = domain;

								console.log(sessionStorage.spread_domain)
								return;
							} else {
								app.methods.signNext([], data, res.data.msg);
							}
						} else {
							that.showModal(res.data.msg);
							that.signNext(list, data, "result is null");
						}
					})
					.catch(function(err) {
						that.showModal(err);
						that.signNext(list, data, that.status[status] || status);
					})
			},
			loginUrl() {
				return this.login.url;
			},
			loginList() {
				var list = null;
				if(localStorage.login_list) {
					try {
						list = JSON.parse(localStorage.login_list);
					} catch(e) {
						//TODO handle the exception
						console.warn(localStorage.login_list, e);
						list = null;
					}
				}

				return list || this.login.default.concat();

			},
			spreadUrl(path) {
				return sessionStorage.spread_domain + (path || "");
			},
			spreadPost(path, callback, data) {

				callback = callback || function() {
					return false;
				};


			},
			clear() {
				this.$refs.form.clear();
				this.validateForm = {
					username: '',
					password: '',
					isAgree: false
				};
			},
			userchange(e) { //添加清空按钮
				if(e != '' && e.length > 0) {
					this.usericon = 'backspace';
				}
			},
			pwschange(e) { //同上
				if(e != '' && e.length > 0) {
					this.pwdicon = 'backspace';
				}
			},
			userclear() {
				this.usericon = '';
				this.validateForm.username = '';
			},
			pwdclear() {
				this.validateForm.password = '';
				this.pwdicon = '';
			},
			closeSimpleDialog() {
				this.msg = '';
				this.openSimple = false;
			},

		},
	}
</script>

<style lang="scss" rel='stylesheet/sass' scoped>
	@import 'common/sass/variable.scss';
	.login {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
		margin: auto;
		max-width: 500px !important;
		background: url('../common/image/bg_login.jpg');
		background-size: 100%;
		font-size: 14pt;
	}
	
	.container {
		width: 80% !important;
		max-width: 420px !important;
		height: 100% !important;
		min-height: 300px !important;
		max-height: 400px !important;
		position: absolute;
		top: 35%;
		left: 10%;
	}
	
	.mu-paper {
		border-radius: 5px;
	}
	
	.mu-demo-form {
		width: 100%;
		max-width: 420px;
		height: 100%;
		padding: 8px 0;
	}
	
	.mu-form-item {
		min-height: 48px !important;
		margin: 5px 8px !important;
	}
	
	.login_btn {
		margin: 5px 0 !important;
		width: 95%;
	}
	
	.login_btn .mu-button {
		color: #2196F3;
		font-weight: 800;
		font-size: 15pt;
	}
	
	.mu-text-field {
		margin: 0 5px !important;
	}
</style>