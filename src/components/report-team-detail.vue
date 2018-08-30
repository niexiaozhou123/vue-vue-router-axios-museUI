<template>
	<div class="report-team-detail">
		<!-- 头部导航 -->
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			团队报表
		</mu-appbar>
		
		<mu-container class="whole-screen-wrapper" @click='delInfo' style='margin-top: 10px !important; overflow-y: auto !important;'>
			<!-- 用户信息 -->
			<mu-paper :z-depth="3" class="user-info">
				<mu-list>
					<mu-list-item>
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="mar-right-5">
									<mu-icon value="person" class="user-icon"></mu-icon>
								</mu-flex>
								<mu-flex justify-content="center" class="mar-right-5 info-title">{{name}}</mu-flex>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action @click='back'>返回</mu-list-item-action>
					</mu-list-item>
				</mu-list>
			</mu-paper>
			<!-- 税收 -->
			<mu-paper :z-depth="3" class="tax-info">
				<mu-list>
					<mu-list-item>
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="mar-right-5">
									<img :src="getIconUrl('icon-title')" style="width: 50%;">
								</mu-flex>
								<mu-flex justify-content="center" class="mar-right-5 info-title">税收</mu-flex>
							</mu-flex>
						</mu-list-item-title>
					</mu-list-item>
					<mu-divider></mu-divider>
					<mu-list-item :ripple="false">
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="mar-right-5 text-color-gray">团队总流水</mu-flex>
								<mu-flex justify-content="center">
									<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="1"></mu-icon>
								</mu-flex>
								<mu-slide-top-transition>
									<span v-if='info1' class='helpInfo'>团队总流水：团队所有玩家提供的流水总额（直属玩家流水+下级团队玩家流水）</span>
								</mu-slide-top-transition>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action>{{total_flowing}}</mu-list-item-action>
					</mu-list-item>
					<mu-divider></mu-divider>
					<mu-list-item :ripple="false">
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="mar-right-5 text-color-gray">团队正流水</mu-flex>
								<mu-flex justify-content="center">
									<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="2"></mu-icon>
								</mu-flex>
								<mu-slide-top-transition>
									<span v-if='info2' class='helpInfo'>团队正流水：旗下玩家从系统赢走的流水总数</span>
								</mu-slide-top-transition>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action>{{p_flowing}}</mu-list-item-action>
					</mu-list-item>
					<mu-divider></mu-divider>
					<mu-list-item :ripple="false">
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="mar-right-5 text-color-gray">团队负流水</mu-flex>
								<mu-flex justify-content="center">
									<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="3"></mu-icon>
								</mu-flex>
								<mu-slide-top-transition>
									<span v-if='info3' class='helpInfo'>团队负流水：旗下玩家输给系统的流水总数</span>
								</mu-slide-top-transition>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action>{{n_flowing}}</mu-list-item-action>
					</mu-list-item>
					<mu-divider></mu-divider>
					<mu-list-item :ripple="false">
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="mar-right-5 text-color-gray">团队税收收益</mu-flex>
								<mu-flex justify-content="center">
									<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="4"></mu-icon>
								</mu-flex>
								<mu-slide-top-transition>
									<span v-if='info4' class='helpInfo'>团队税收收益：团队的税收收益总额（团队总流水*计税税率*团队最高代理分红额度）</span>
								</mu-slide-top-transition>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action>{{group_taxincome}}</mu-list-item-action>
					</mu-list-item>
					<mu-divider></mu-divider>
					<mu-list-item :ripple="false">
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="mar-right-5 text-color-gray">个人税收收益</mu-flex>
								<mu-flex justify-content="center">
									<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="5"></mu-icon>
								</mu-flex>
								<mu-slide-top-transition>
									<span v-if='info5' class='helpInfo'>个人税收收益：团队税收收益总额-所有直属代理团队税收收益总额</span>
								</mu-slide-top-transition>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action>{{total_tax}}</mu-list-item-action>
					</mu-list-item>
				</mu-list>
			</mu-paper>
			<!-- 亏损 -->
			<mu-paper :z-depth="3" class="loss-info" v-if='kuishun'>
				<mu-list>
					<mu-list-item>
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="mar-right-5">
									<img :src="getIconUrl('icon-title')" style="width: 50%;">
								</mu-flex>
								<mu-flex justify-content="center">
									<mu-flex class="mar-right-5">亏损</mu-flex>
									<mu-flex justify-content="center">
										<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="6"></mu-icon>
									</mu-flex>
									<mu-slide-top-transition>
										<span v-if='info6' class='helpInfo'>亏损：团队在所有人机游戏中的盈亏总额（玩家输给系统视为代理盈利，玩家盈利视为代理亏损）</span>
									</mu-slide-top-transition>
								</mu-flex>
							</mu-flex>
						</mu-list-item-title>
					</mu-list-item>
					<mu-divider></mu-divider>
					<mu-list-item :ripple="false">
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="mar-right-5 text-color-gray">总额</mu-flex>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action>{{losstotal}}</mu-list-item-action>
					</mu-list-item>
					<mu-divider></mu-divider>
					<mu-list-item :ripple="false" v-if='kuishun_shouyi'>
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="mar-right-5 text-color-gray">收益</mu-flex>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action>{{loss}}</mu-list-item-action>
					</mu-list-item>
				</mu-list>
			</mu-paper>
			<!-- 充提信息 -->
			<mu-paper :z-depth="3" class="loss-info" v-if='chongzhi'>
				<mu-list>
					<mu-list-item>
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="mar-right-5">
									<img :src="getIconUrl('icon-title')" style="width: 50%;">
								</mu-flex>
								<mu-flex justify-content="center">
									<mu-flex class="mar-right-5">充提信息</mu-flex>
									<mu-flex justify-content="center">
										<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="7"></mu-icon>
									</mu-flex>
									<mu-slide-top-transition>
										<span v-if='info7' class='helpInfo'>总充值：团队所有玩家总充值额度   总提现：团队所有玩家总提现额度</span>
									</mu-slide-top-transition>
								</mu-flex>
							</mu-flex>
						</mu-list-item-title>
					</mu-list-item>
					<mu-divider></mu-divider>
					<mu-list-item :ripple="false">
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="mar-right-5 text-color-gray">总充值</mu-flex>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action>{{orders}}</mu-list-item-action>
					</mu-list-item>
					<mu-divider></mu-divider>
					<mu-list-item :ripple="false">
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="mar-right-5 text-color-gray">总提现</mu-flex>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action>{{withdraw}}</mu-list-item-action>
					</mu-list-item>
				</mu-list>
			</mu-paper>
			<mu-paper :z-depth="3">
				<mu-data-table :columns="columns" :data="list">
					<template slot-scope="scope">
						<td>{{scope.row.title}}</td>
						<td>{{scope.row.total}}人</td>
						<td>{{scope.row.add}}人</td>
					</template>
				</mu-data-table>
			</mu-paper>
		</mu-container>
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
				columns: [{
						title: ''
					},
					{
						title: '总数'
					},
					{
						title: '今日新增'
					}
				],
				list: [{
						title: '代理',
						total: '0人',
						add: '0人'
					},
					{
						title: '玩家',
						total: '0人',
						add: '0人'
					}
				],
				id: 0,
				name: '',
				type: 'team',
				begDate: null,
				endDate: null,
				kuishun_shouyi: false,
				kuishun: true,
				chongzhi: true,
				allInfo: {},

				total_flowing: 0,
				p_flowing: 0,
				n_flowing: 0,
				group_taxincome: 0,
				total_tax: 0,
				losstotal: 0,
				loss: 0,
				orders: 0,
				withdraw: 0,

				agent_total: 0,
				agent_today: 0,
				user_total: 0,
				user_today: 0,

				info1: false,
				info2: false,
				info3: false,
				info4: false,
				info5: false,
				info6: false,
				info7: false,

			}
		},
		created() {
			this.getIconUrl = getIconUrl
			this.user = this.$apps.spreadUser();
			this.load();
		},
		methods: {
			back() {
				this.$router.back()
			},
			load() {
				this.name = this.$router.history.current.query.Name;
				this.id = this.$router.history.current.query.Id;
				this.type = this.$router.history.current.query.Type;
				var url;
				if(this.type == 'team') {
					url = 'api/group/detail';
				} else {
					url = 'api/group/totalDetail';
				}
				eventBus.$emit('showNotification', '正在加载数据..')
				this.$axios.post(url, {
						token: this.user.token,
						promoter_id: this.id || '',
						begDate: this.begDate || '',
						endDate: this.endDate || ''
					})
					.then((res) => {
						//  			console.log(res.data.data)
						if(res.data && res.data.status == 0 && res.data.data) {
							this.allInfo = res.data.data;
							//亏损 充值权限隐藏
							if(!res.data.data.data || !res.data.data.data.losstotal) {
								this.kuishun = false;
							}
							if(!res.data.data.orders || !res.data.data.withdraw) {
								this.chongzhi = false;
							}

							this.total_flowing = this.$spreadFormat(res.data.data.data.total_flowing);
							this.p_flowing = this.$spreadFormat(res.data.data.data.p_flowing);
							this.n_flowing = this.$spreadFormat(res.data.data.data.n_flowing);
							this.group_taxincome = this.$spreadFormat(res.data.data.data.group_taxincome);
							this.total_tax = this.$spreadFormat(res.data.data.data.total_tax);
							this.losstotal = this.$spreadFormat(res.data.data.data.losstotal);
							this.loss = this.$spreadFormat(res.data.data.data.loss);
							this.orders = this.$spreadFormat(res.data.data.orders);
							this.withdraw = this.$spreadFormat(res.data.data.withdraw);

							this.agent_total = res.data.data.agent.total;
							this.agent_today = res.data.data.agent.today;
							this.user_total = res.data.data.user.total;
							this.user_today = res.data.data.user.today;
							this.list[0].total = this.agent_total;
							this.list[0].add = this.agent_today;
							this.list[1].total = this.user_total;
							this.list[1].add = this.user_today;

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
			info(e) {
				let num = Number(e.target.attributes["data-num"].value);
				switch(num) {
					case 1:
						this.info1 = !this.info1;
						break;
					case 2:
						this.info2 = !this.info2;
						break;
					case 3:
						this.info3 = !this.info3;
						break;
					case 4:
						this.info4 = !this.info4;
						break;
					case 5:
						this.info5 = !this.info5;
						break;
					case 6:
						this.info6 = !this.info6;
						break;
					case 7:
						this.info7 = !this.info7;
						break;
					default:
						return;
						break;
				}
			},
			delInfo() {
				if(this.info1) {
					this.info1 = false;
				} else if(this.info2) {
					this.info2 = false;
				} else if(this.info3) {
					this.info3 = false;
				} else if(this.info4) {
					this.info4 = false;
				} else if(this.info5) {
					this.info5 = false;
				} else if(this.info6) {
					this.info6 = false;
				} else if(this.info7) {
					this.info7 = false;
				}
			},

		},
		components: {
			'back': back
		}
	}
</script>
<style lang="scss" rel="stylesheet/sass" scoped>
	.user-info {
		margin-top: 10px;
		.user-icon {
			color: #737373;
		}
	}
	
	.helpInfo {
		overflow:initial;
		white-space: normal ;
		display: block;
		background-color: rgb(33,150,243);
		padding: 5px 10px !important;
		position: absolute;
		top: 20px;	
		left: 15px;
		color: #FFFFFF;
		text-align: center;
		font-size: 12px;
		line-height: 16px;
		z-index: 1000;
	}
	.start {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
	}
</style>