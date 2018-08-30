<template>
	<div class="sub-reg">
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			代理注册链接
		</mu-appbar>

		<mu-container style="padding:10px 10px;overflow: hidden;">
			<mu-paper :z-depth="3" style='background-color: #FFFFFF !important;'>
				<mu-form :model="validateForm" class="mu-demo-form">
					<mu-form-item label="链接名称" prop="linkName">
						<mu-text-field v-model="validateForm.linkName" prop="UserName" placeholder="请输入链接名称"></mu-text-field>
					</mu-form-item>
					<mu-form-item label="可注册数量" prop="regnum">
						<mu-flex class="select-control-row" :key="index" v-for="(item,index) in label">
							<mu-radio :value="item.num" v-model="validateForm.regnum" :label="item.name"></mu-radio>
						</mu-flex>
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

			<mu-paper :z-depth="3" style="margin-top:10px; overflow: hidden; background-color: #FFFFFF !important;">
				<mu-form class="mu-demo-form" :model='validateForm'>
					<mu-form-item style='justify-content: center;'>
						<mu-row>
							<mu-col lg="4" sm="6" style='margin-top: 8px;'><img :src="getIconUrl('icon-title')" class="icon-title">分红比例：</mu-col>
							<mu-col lg="4" sm="6">
								<mu-select v-model="selectRatio" style='width: 120%;' @change='selectChange'>
									<mu-option v-for="item in choseList2" :key="item" :label="item" :value="item" ripple></mu-option>
								</mu-select>
							</mu-col>
						</mu-row>
					</mu-form-item>
				</mu-form>
			</mu-paper>

			<mu-paper :z-depth="3" style="margin-top:10px; overflow: hidden; background-color: #FFFFFF !important;">
				<mu-form style='padding: 5px 10px;' class="mu-demo-form" :model='validateForm'>
					<mu-form-item><img :src="getIconUrl('icon-title')" class="icon-title">配额设定</mu-form-item>
				</mu-form>
				<mu-list>
					<mu-list-item style='justify-content: center;'>
						<mu-row class='rowstyle'>
							<mu-col class='colstyle'>分成档位</mu-col>
							<mu-col class='colstyle'>配额设定</mu-col>
							<mu-col class='colstyle'>剩余配额</mu-col>
						</mu-row>
					</mu-list-item>
					<mu-divider></mu-divider>
				</mu-list>
				<mu-list v-for='item in list' :key='item.id'>
					<mu-list-item style='justify-content: center;' v-if='item.level!="0%"&&item.remain!=0'>
						<mu-row class='rowstyle'>
							<mu-col class='colstyle' style='padding-top: 15px ;'>{{item.level}}</mu-col>
							<mu-col class='colstyle' style='padding-top: 5px ;'>

								<input type="text" ref='i_peier' style='width: 35px !important; font-size: 12px  !important;' placeholder='MAX' />
								<a @click="btn" ref='set_btn'>{{item.quota_text}}</a>
							</mu-col>
							<mu-col class='colstyle' style='padding-top: 15px ;'>{{item.remain}}</mu-col>
						</mu-row>
					</mu-list-item>
					<mu-divider></mu-divider>
				</mu-list>
			</mu-paper>

			<!--注册页模板-->

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
								<mu-radio :value="item.url" v-model="choseRadio" :label="item.url" @click='send' :data-url="item.url"></mu-radio>
							</mu-list-item-action>
							<mu-list-item-content></mu-list-item-content>
							<mu-list-item-action style='color: rgb(52,133,251); font-size: 8px !important;' @click='openHTML(item.url)'>
								预览模板
							</mu-list-item-action>
						</mu-list-item>
					</mu-list>
				</mu-paper>
			</mu-dialog>

		</mu-container>

		<div class="alert-info">剩余配额为0或无法分配档位不予显示</div>
		<div class="username-margin">
			<mu-button color="primary" @click="submit" class="modify-btn">注册用户</mu-button>
		</div>

	</div>
</template>

<script type="text/javascript">
	import back from 'base/back'
	import { getIconUrl } from 'common/js/tools.js'
	import eventBus from 'common/js/event-bus.js'
	export default {
		data() {
			return {
				user: null,
				labelPosition: 'top',
				openFullscreen: false,
				label: [{
						name: '1次',
						num: 1
					},
					{
						name: '无限',
						num: 2
					},
				],
				validateForm: {
					linkName: '',
					regnum: 0,
				},
				user: {
					group: '',
				},
				TemplatesList: {},
				TemplatesListURL: '',
				choseHtml: '',
				choseRadio: '',
				choseList: {},
				choseList2: [],
				dataList: {},
				selectRatio: '0%',
				currentRate: 0,
				columns: [{
						title: '分成档位',
						width: 120,
						name: 'dangwei'
					},
					{
						title: '配额设定',
						width: 120,
						name: 'peie'
					},
					{
						title: '剩余配额',
						width: 120,
						name: 'shengyu'
					},
				],
				list: [],
				input_item: new Array(),

			}
		},
		created() {
			this.getIconUrl = getIconUrl;
			this.user = this.$apps.spreadUser();
			this.load();
			this.loadPageTemplate();

		},
		methods: {
			load() {
				eventBus.$emit('showNotification', '正在加载数据!')
				this.$axios.post('api/Promoters/ratio', {
						token: this.user.token
					})
					.then((response) => {
						if(response.data && response.data.status == 0 && response.data.data) {
							this.choseList = response.data.data.ratioLst;
							//下拉框的值更改
							for(var i = 0; i < this.choseList.length; i++) {
								if(this.choseList[i].assign_num != '0') {
									var share = this.choseList[i].assign_num > -1 ? this.choseList[i].assign_num : '无限';
									this.choseList2.push(this.choseList[i].level + '%  ' + share);
								}
							}
							//
							this.currentRate = Number(this.choseList2[0].split('%')[0]);

							//配额设定数据
							this.dataList = response.data.data.ratioLst;
						} else if(!res.data.status) {
							eventBus.$emit('showNotification', '登录已过期')
						} else {
							eventBus.$emit('showNotification', response.data.msg)
						}
					})
					.catch(function(err) {
						eventBus.$emit('showNotification', err)
					})
			},
			loadPageTemplate() {
				this.$axios.post('api/agentTem/getAgentTemplateList', {
						token: this.user.token
					})
					.then((res) => {
						//					console.log(res.data.status)
						if(res.data && res.data.status == 0 && res.data.data) {
							this.TemplatesList = res.data.data.data;
							this.TemplatesListURL = res.data.data.spread_domain_name;
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
			selectChange(e) {
				this.list.length = 0;
				this.currentRate = Number(e.split('%')[0]);
				for(var i = 0; i < this.dataList.length; i++) {
					var arr = [];
					if(this.currentRate <= parseInt(this.dataList[i].level) || this.dataList[i].assign_num === 0) return;
					arr.level = this.dataList[i].level + '%';
					arr.id = this.dataList[i].id;
					arr.remain = this.dataList[i].assign_num == -1 ? '无限制' : this.dataList[i].assign_num;
					arr.quota_text = this.dataList[i].assign_num == -1 ? '取消' : '';
					arr.quote_val = this.dataList[i].assign_num == -1 ? 'MAX' : '0';
					this.list.push(arr);
					//数据二次检验
					//					if(this.list[i].level.slice(0,1)==0||this.list[i].remain==0){
					//						this.list.splice(i,1);
					//						
					//					}
					//					console.log(this.list);
				}

			},
			btn() {
				var set_btn = this.$refs.set_btn["0"].innerText;
				var i_peier = this.$refs.i_peier["0"].value;
				if(this.$refs.set_btn["0"].innerText == '取消') {
					this.$refs.i_peier["0"].value = '0';
					this.$refs.set_btn["0"].innerText = '无限';
				} else {
					this.$refs.i_peier["0"].value = 'MAX';
					this.$refs.set_btn["0"].innerText = '取消';
				}
			},
			submit() {
				var agentInfo = {
					token: this.user && this.user.token,
					name: this.validateForm.linkName,
					divided_proportion: this.currentRate,
					ids: [],
					peedu: [],
					num: this.validateForm.regnum
				};
				var reg_exp = /\s/;
				if(this.currentRate < 0) {
					eventBus.$emit('showNotification', '分成比率不能小于0')
					return;
				}
				var str = agentInfo.name;
				if(escape(str).indexOf("%u") != -1) {
					eventBus.$emit('showNotification', '链接名称不能包含中文字符')
					return;
				}
				if(reg_exp.test(str)) {
					eventBus.$emit('showNotification', '链接名称不能包含空格')
					return;
				}
				// NULL 校验
				if(!agentInfo.name || !agentInfo.num) {
					eventBus.$emit('showNotification', '请检查链接名称/可注册数量是否正确')
					return;
				}
				if(!this.choseHtml || this.choseRadio == '') {
					eventBus.$emit('showNotification', '请选择注册页模板!')
					return;
				}

				// 配额设定
				var rateList = [];
				var errorMsg = null;
				var ids = [];
				var peedu = [];
				for(var i = 0; i < this.choseList.length; i++) {
					var rateItem = this.choseList[i];
					if(this.currentRate > rateItem.level) {
						if(rateItem.level != 0 && rateItem.assign_num != 0) {
							ids.push(rateItem.id);
						}
					}
				}
				for(var i = 0; i < this.$refs.i_peier.length; i++) {
					peedu.push(this.$refs.i_peier[i].value || 0)
				}
				// 合并到提交对象
				agentInfo.ids = ids;
				agentInfo.peedu = peedu;

				this.$axios.post('api/agentTem/addAgentRegTemplate', {
						token: this.user && this.user.token,
						name: agentInfo.name,
						divided_proportion: agentInfo.divided_proportion,
						ids: agentInfo.ids,
						peedu: agentInfo.peedu,
						num: agentInfo.num,
						template_name: this.choseRadio
					})
					.then((res) => {
						if(res.data.status == 0) {
							eventBus.$emit('showNotification', res.data.msg)
							//跳转到刷新页  带 stats 参数 值不做限定  然后回退 做页面重载效果
							setTimeout(() => {
								this.$router.push({
									path: '/refresh/',
									query: {
										stats: '2'
									}
								})
							}, 1000)
						}
					})
					.catch(function(err) {
						eventBus.$emit('showNotification', err)
					})

			},
			openPageTemplate() {
				this.openFullscreen = true;
			},
			send(e) {
				//				console.log(e.srcElement.parentElement.parentElement.innerText)
				this.choseHtml = e.srcElement.parentElement.parentElement.innerText;
				if(!this.choseHtml || !this.choseRadio) return;
				this.openFullscreen = false;
			},
			openHTML(url) {
				var urls = this.TemplatesListURL + url;
				window.open(urls)
			}
		},
		components: {
			'back': back,
		}
	}
</script>

<style lang="scss" scoped>
	.mu-demo-form {
		padding: 0 10px !important;
	}
	
	.sub-reg {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: #eee;
	}
	
	div,
	table,
	thead,
	th,
	tbody {
		margin: 0;
		padding: 0;
	}
	
	.modify-btn {
		width: 100%;
		min-height: 48px;
		line-height: 48px;
		font-size: 18px;
	}
	
	.alert-info {
		padding: 5px 10px;
		width: max-content;
		margin: 0 auto;
		background-color: #fff;
		font-size: 12px;
	}
	
	.username-margin {
		margin: 8px;
		-webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
	}
	
	.card-content {
		position: relative;
		background-color: #fff;
	}
	
	.data-table {
		overflow-x: auto;
	}
	
	th {
		height: 56px;
		color: rgba(0, 0, 0, 0.54);
		text-align: center;
	}
	
	.label-cell {
		padding: 0 24px;
	}
	
	.numeric-cell {
		padding: 0 28px;
	}
	
	.picker-rate {
		width: 70px;
		text-align: right;
		color: #757575;
	}
	
	.card-header {
		font-size: 16px;
		min-height: 48px;
		padding: 4px 16px;
		background-color: #fff;
		border-radius: 2px 2px 0 0;
		position: relative;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-pack: justify;
		-webkit-justify-content: space-between;
		-ms-flex-pack: justify;
		justify-content: space-between;
		-webkit-box-align: center;
		-webkit-align-items: center;
		-ms-flex-align: center;
		align-items: center;
	}
	
	.card-line {
		border-bottom: 1px solid #e1e1e1;
	}
	
	.icon-title {
		width: 4px;
		height: 13px;
		margin-right: 5px;
	}
	
	.username-color {
		background-color: #fff;
		padding: 0 12px;
	}
	
	.container {
		padding-bottom: 0;
	}
	
	.rowstyle {
		display: flex;
		flex-direction: row-reverse;
		justify-content: center;
	}
	
	.colstyle {
		width: 120px;
		padding: 0 20px;
	}
	
	.register-template {
		position: relative;
		top: -5px;
		line-height: 36px;
		height: 36px;
		font-size: 16px;
		border-bottom: 1px solid #666666;
		padding: 0 8px;
	}
</style>