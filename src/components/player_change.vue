<template>
	<div class="player-change">
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			玩家转代理
		</mu-appbar>

		<mu-container style="padding:10px 10px;overflow: hidden;">

			<mu-list>
				<mu-list-item :ripple="false">
					<mu-list-item-action>
						开启转代理功能
					</mu-list-item-action>
					<mu-list-item-content></mu-list-item-content>
					<mu-list-item-action>
						<mu-flex class="select-control-row">
							<mu-switch v-model="openSwitch" @change='open'></mu-switch>
						</mu-flex>
					</mu-list-item-action>
				</mu-list-item>
				<mu-divider></mu-divider>

				<mu-list-item :ripple="false" v-if='openSwitch'>
					<mu-list-item-action>
						更改配置
					</mu-list-item-action>
					<mu-list-item-content></mu-list-item-content>
					<mu-list-item-action>
						<mu-flex class="select-control-row">
							<mu-switch v-model="settingSwitch"></mu-switch>
						</mu-flex>
					</mu-list-item-action>
				</mu-list-item>
				<mu-divider></mu-divider>
			</mu-list>

			<mu-paper :z-depth="3" style="margin-top:10px; overflow: hidden; background-color: #FFFFFF !important;">

				<!--查看配置-->
				<mu-list v-if='!settingSwitch&&openSwitch'>
					<mu-list-item>
						<mu-list-item-content>
							<img :src="getIconUrl('icon-title')" class="icon-title">分红比例：
						</mu-list-item-content>
						<mu-list-item-action>
							{{lookDistribution}}
						</mu-list-item-action>
					</mu-list-item>
				</mu-list>

				<!--修改配置-->
				<mu-form class="mu-demo-form" :model='validateForm' v-if='settingSwitch'>
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

			<!--查看配置-->
			<mu-paper :z-depth="3" v-if='!settingSwitch&&openSwitch'>
				<mu-list>
					<mu-list-item>
						<mu-list-item-content style='color:rgb(185,185,185) ; background-color: #FFFFFF !important;'>
							代理数量:
						</mu-list-item-content>
						<mu-list-item-action>
							{{reg_num}}
						</mu-list-item-action>
					</mu-list-item>
				</mu-list>
			</mu-paper>

			<!--查看配置-->
			<mu-paper :z-depth="3" style="margin-top:10px; overflow: hidden; background-color: #FFFFFF !important;" v-if='!settingSwitch&&openSwitch'>
				<mu-form style='padding: 5px 10px;' class="mu-demo-form" :model='validateForm'>
					<mu-form-item><img :src="getIconUrl('icon-title')" class="icon-title">配额详情</mu-form-item>
				</mu-form>
				<mu-list>
					<mu-list-item style='justify-content: center;'>
						<!--<mu-list-item-action>分成档位</mu-list-item-action>
						<mu-list-item-content>配额设定</mu-list-item-content>
						<mu-list-item-action>剩余配额</mu-list-item-action>-->
						<mu-row class='rowstyle'>
							<mu-col class='colstyle'>分成档位</mu-col>
							<mu-col class='colstyle'></mu-col>
							<mu-col class='colstyle'>剩余配额</mu-col>
						</mu-row>
					</mu-list-item>
					<mu-divider></mu-divider>
				</mu-list>
				<mu-list v-for='item in lookList' :key='item.id'>
					<mu-list-item style='justify-content: center;' v-if='item.num!="0"&&item.use_num!="0"'>
						<mu-row class='rowstyle'>
							<mu-col class='colstyle' style='padding-top: 15px ;'>{{item.label}}</mu-col>
							<mu-col class='colstyle' style='padding-top: 5px ;'></mu-col>
							<mu-col class='colstyle' style='padding-top: 15px ;'>{{item.remain}}</mu-col>
						</mu-row>
					</mu-list-item>
					<mu-divider></mu-divider>
				</mu-list>
			</mu-paper>

			<!--修改配置-->
			<mu-paper :z-depth="3" style="margin-top:10px; overflow: hidden; background-color: #FFFFFF !important;" v-if='settingSwitch'>
				<mu-form style='padding: 5px 10px;' class="mu-demo-form" :model='validateForm'>
					<mu-form-item><img :src="getIconUrl('icon-title')" class="icon-title">配额设定</mu-form-item>
				</mu-form>
				<mu-list style='margin: 0 !important;'>
					<mu-list-item style='justify-content: center;'>
						<!--<mu-list-item-action>分成档位</mu-list-item-action>
						<mu-list-item-content>配额设定</mu-list-item-content>
						<mu-list-item-action>剩余配额</mu-list-item-action>-->
						<mu-row class='rowstyle'>
							<mu-col class='colstyle'>分成档位</mu-col>
							<mu-col class='colstyle'>配额设定</mu-col>
							<mu-col class='colstyle'>剩余配额</mu-col>
						</mu-row>
					</mu-list-item>
					<mu-divider></mu-divider>
				</mu-list>
				<mu-list v-for='item in list' :key='item.id' style='margin: 0 !important;'>
					<mu-list-item style='justify-content: center;' v-if='item.level!="0%"&&item.remain!=0'>
						<mu-row class='rowstyle'>
							<mu-col class='colstyle' style='padding-top: 15px ;'>{{item.level}}</mu-col>
							<mu-col class='colstyle' style='padding-top: 5px ;'>
								<!--<mu-text-field v-model='input_item'  style='width: 30px !important; font-size: 12px  !important;' ref='i_peier' placeholder='MAX'></mu-text-field>-->
								<input type="text" ref='i_peier' style='width: 35px !important; font-size: 12px  !important;' placeholder='MAX' />
								<a @click="btn" ref='set_btn'>{{item.quota_text}}</a>
							</mu-col>
							<mu-col class='colstyle' style='padding-top: 15px ;'>{{item.remain}}</mu-col>
						</mu-row>
					</mu-list-item>
					<mu-divider></mu-divider>
				</mu-list>
			</mu-paper>

		</mu-container>

		<div class="alert-info" v-if='settingSwitch'>剩余配额为0或无法分配档位不予显示</div>
		<div class="username-margin" v-if='settingSwitch'>
			<mu-button color="primary" @click="change" class="modify-btn">确认配置</mu-button>
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
				validateForm: {
					UserName: '',
					UserPwd: '',
					RePwd: ''
				},
				openSwitch: false,
				settingSwitch: false,

				lookDistribution: '',
				reg_num: '',

				user: {
					group: '',
				},
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
				lookList: [],
				list: [],
				input_item: new Array(),
				stats: null,

			}
		},
		created() {
			this.getIconUrl = getIconUrl;
			this.user = this.$apps.spreadUser();
			this.checkreg();
			this.load();

		},
		methods: {
			checkreg() {
				eventBus.$emit('showNotification', '正在加载数据!')
				this.$axios.post('api/agent/getAccountDivide', {
						token: this.user.token,
					})
					.then((res) => {
						//						console.log(res);
						if(res.data.status == 0 && res.data.data != '') {
							this.currentRate = res.data.data.divided;
							if(res.data.data.reg_num == 0) {
								this.openSwitch = false;
								return;
							} else {
								this.openSwitch = true;
								this.lookDistribution = res.data.data.divided + '%';
								this.selectRatio = res.data.data.divided + '%';
								this.reg_num = 'MAX';
								this.lookList = res.data.data.divide_levels;
								for(var i = 0; i < this.lookList.length; i++) {
									if(this.lookList[i].level != 0) {
										var useNum = Number(this.lookList[i].use_num);
										var Num = Number(this.lookList[i].num);
										this.lookList[i].label = this.lookList[i].level + '%';
										this.lookList[i].remain = useNum > -1 ? useNum : '不限'; //剩余配额	
										if(Num > 0 && useNum != -1) {
											this.lookList[i].remain = Num - useNum;
										}
									}

								}

							}
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
			load() {
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
						} else if(!response.data.status) {
							eventBus.$emit('showNotification', '登录已过期')
						} else {
							eventBus.$emit('showNotification', response.data.msg)
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
			change() {
				var agentInfo = {
					token: this.user.token,
					reg_num: 1,
					divided: this.currentRate,
					ids: [],
					nums: [],
				};

				if(this.currentRate < 0) {
					eventBus.$emit('showNotification', '分成比率不能小于0')
					return;
				}

				// 配额设定
				var rateList = [];
				var errorMsg = null;
				var ids = [];
				var peedu = [];
				for(var i = 0; i < this.$refs.i_peier.length; i++) {
					peedu.push(this.$refs.i_peier[i].value || 'MAX')
				}
				for(var i = 0; i < this.choseList.length; i++) {
					var rateItem = this.choseList[i];
					if(this.currentRate > rateItem.level) {
						ids.push(rateItem.id);
						//						console.log(rateItem.id)
						if(rateItem.level != 0 && rateItem.assign_num != 0) {
							peedu[i] = peedu[i] || 'MAX';
						} else {
							peedu[i] = 0;
						}
					}
				}
				// 合并到提交对象
				agentInfo.ids = ids;
				agentInfo.nums = peedu;

				//				console.log('agentInfo.ids:' + agentInfo.ids)
				//				console.log('agentInfo.nums:' + agentInfo.nums)
				this.$axios.post('api/agent/editLevelForAccountToAgent', {
						token: this.user.token,
						reg_num: agentInfo.reg_num,
						divided: agentInfo.divided,
						ids: agentInfo.ids,
						nums: agentInfo.nums
					})
					.then((res) => {
						//						console.log(res);
						eventBus.$emit('showNotification', res.data.msg)
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
			open(e) {
				if(this.openSwitch && e == true) {
					this.changeOpen(1);
				} else {
					this.changeOpen(0);
				}
			},
			changeOpen(stats) {
				eventBus.$emit('showNotification', '开启/关闭代理功能中..')
				this.$axios.post('api/agent/editAccountToAgent', {
						token: this.user.token,
						reg_num: stats
					})
					.then((res) => {
						if(res.data.status == 0) {
							this.checkreg();
							this.$router.push({
								path: '/refresh/',
								query: {
									stats: '2'
								}
							})
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
	
	.colstyle2 {
		width: 140px;
		padding: 0 10px;
	}
</style>