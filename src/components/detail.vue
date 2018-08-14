<template>
	<div class="detail">
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			收益详情
		</mu-appbar>

		<mu-load-more @refresh="refresh" :refreshing="refreshing" ref="container">
			<mu-container @click='delInfo'>
				<mu-paper :z-depth="3" class="my-agent">
					<mu-list>
						<mu-list-item>
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" class="mar-right-5">
										<img :src="getIconUrl('icon-title')" style="width: 50%;">
									</mu-flex>
									<mu-flex justify-content="center" class="mar-right-5 agent-title">我的收益</mu-flex>
									<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="1"></mu-icon>
									<span v-if='info1' class='helpInfo'> 我的收益：我的税收收益总和</span>
								</mu-flex>

							</mu-list-item-title>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item :ripple="false">
							<mu-row fill>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center" justify-content="center">
										<mu-flex color="primary" :style="getPrimaryColor">总计</mu-flex>
										<mu-flex class="text-color-gray">{{nums.all.income}}</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">今日</mu-flex>
										<mu-flex class="text-color-gray">{{nums.today_all.income}}</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">昨日</mu-flex>
										<mu-flex class="text-color-gray">{{nums.yestoday_all.income}}</mu-flex>
									</mu-flex>
								</mu-col>
							</mu-row>
						</mu-list-item>
						<mu-divider></mu-divider>
					</mu-list>

					<mu-list>
						<mu-list-item>
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" class="mar-right-5">
										<img :src="getIconUrl('icon-title')" style="width: 50%;">
									</mu-flex>
									<mu-flex justify-content="center" class="mar-right-5 agent-title">团队流水</mu-flex>
									<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="2"></mu-icon>
									<span v-if='info2' class='helpInfo'> 团队流水：团队所有玩家提供的流水总额（直属玩家流水+下级团队玩家流水）</span>
								</mu-flex>
							</mu-list-item-title>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item :ripple="false">
							<mu-row fill>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center" justify-content="center">
										<mu-flex color="primary" :style="getPrimaryColor">总计</mu-flex>
										<mu-flex class="text-color-gray">{{nums.all.profit}}</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">今日</mu-flex>
										<mu-flex class="text-color-gray">{{nums.today_all.profit}}</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">昨日</mu-flex>
										<mu-flex class="text-color-gray">{{nums.yestoday_all.profit}}</mu-flex>
									</mu-flex>
								</mu-col>
							</mu-row>
						</mu-list-item>
						<mu-divider></mu-divider>
					</mu-list>

					<mu-list>
						<mu-list-item>
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" class="mar-right-5">
										<img :src="getIconUrl('icon-title')" style="width: 50%;">
									</mu-flex>
									<mu-flex justify-content="center" class="mar-right-5 agent-title">下级流水</mu-flex>
									<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="3"></mu-icon>
									<span v-if='info3' class='helpInfo'> 下级流水：团队流水-直属流水</span>
								</mu-flex>
							</mu-list-item-title>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item :ripple="false">
							<mu-row fill>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center" justify-content="center">
										<mu-flex color="primary" :style="getPrimaryColor">总计</mu-flex>
										<mu-flex class="text-color-gray">{{nums.all_child.profit}}</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">今日</mu-flex>
										<mu-flex class="text-color-gray">{{nums.today_child.profit}}</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">昨日</mu-flex>
										<mu-flex class="text-color-gray">{{nums.yestoday_child.profit}}</mu-flex>
									</mu-flex>
								</mu-col>
							</mu-row>
						</mu-list-item>
						<mu-divider></mu-divider>
					</mu-list>

					<mu-list>
						<mu-list-item>
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" class="mar-right-5">
										<img :src="getIconUrl('icon-title')" style="width: 50%;">
									</mu-flex>
									<mu-flex justify-content="center" class="mar-right-5 agent-title">直属流水</mu-flex>
									<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="4"></mu-icon>
									<span v-if='info4' class='helpInfo'> 下直属流水：直属玩家提供的流水总额</span>
								</mu-flex>
							</mu-list-item-title>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item :ripple="false">
							<mu-row fill>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center" justify-content="center">
										<mu-flex color="primary" :style="getPrimaryColor">总计</mu-flex>
										<mu-flex class="text-color-gray">{{nums.all_direct.profit}}</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">今日</mu-flex>
										<mu-flex class="text-color-gray">{{nums.today_direct.profit}}</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">昨日</mu-flex>
										<mu-flex class="text-color-gray">{{nums.yestoday_direct.profit}}</mu-flex>
									</mu-flex>
								</mu-col>
							</mu-row>
						</mu-list-item>
						<mu-divider></mu-divider>
					</mu-list>

					<mu-list>
						<mu-list-item>
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" class="mar-right-5">
										<img :src="getIconUrl('icon-title')" style="width: 50%;">
									</mu-flex>
									<mu-flex justify-content="center" class="mar-right-5 agent-title">团队税收</mu-flex>
									<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="5"></mu-icon>
									<span v-if='info5' class='helpInfo'> 团队税收：团队的税收收益总额（团队总流水*计税税率*团队最高代理分红额度）</span>
								</mu-flex>
							</mu-list-item-title>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item :ripple="false">
							<mu-row fill>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center" justify-content="center">
										<mu-flex color="primary" :style="getPrimaryColor">总计</mu-flex>
										<mu-flex class="text-color-gray">{{nums.all.tax}}</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">今日</mu-flex>
										<mu-flex class="text-color-gray">{{nums.today_all.tax}}</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">昨日</mu-flex>
										<mu-flex class="text-color-gray">{{nums.yestoday_all.tax}}</mu-flex>
									</mu-flex>
								</mu-col>
							</mu-row>
						</mu-list-item>
						<mu-divider></mu-divider>
					</mu-list>

					<mu-list>
						<mu-list-item>
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" class="mar-right-5">
										<img :src="getIconUrl('icon-title')" style="width: 50%;">
									</mu-flex>
									<mu-flex justify-content="center" class="mar-right-5 agent-title">下级税收</mu-flex>
									<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="6"></mu-icon>
									<span v-if='info6' class='helpInfo'> 下级税收：团队税收-直属税收</span>
								</mu-flex>
							</mu-list-item-title>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item :ripple="false">
							<mu-row fill>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center" justify-content="center">
										<mu-flex color="primary" :style="getPrimaryColor">总计</mu-flex>
										<mu-flex class="text-color-gray">{{nums.all_child.tax}}</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">今日</mu-flex>
										<mu-flex class="text-color-gray">{{nums.today_child.tax}}</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">昨日</mu-flex>
										<mu-flex class="text-color-gray">{{nums.yestoday_child.tax}}</mu-flex>
									</mu-flex>
								</mu-col>
							</mu-row>
						</mu-list-item>
						<mu-divider></mu-divider>
					</mu-list>

					<mu-list>
						<mu-list-item>
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" class="mar-right-5">
										<img :src="getIconUrl('icon-title')" style="width: 50%;">
									</mu-flex>
									<mu-flex justify-content="center" class="mar-right-5 agent-title">直属税收</mu-flex>
									<mu-icon value="help" color="primary" class="question-mark" size='18' @click.stop='info' data-num="7"></mu-icon>
									<span v-if='info7' class='helpInfo'> 直属税收：直属流水*计税税率*自身代理分红比例</span>
								</mu-flex>
							</mu-list-item-title>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item :ripple="false">
							<mu-row fill>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center" justify-content="center">
										<mu-flex color="primary" :style="getPrimaryColor">总计</mu-flex>
										<mu-flex class="text-color-gray">{{nums.all_direct.tax}}</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4" class="agent-info-item">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">今日</mu-flex>
										<mu-flex class="text-color-gray">{{nums.today_direct.tax}}</mu-flex>
									</mu-flex>
								</mu-col>
								<mu-col span="4">
									<mu-flex direction="column" align-items="center">
										<mu-flex color="primary">昨日</mu-flex>
										<mu-flex class="text-color-gray">{{nums.yestoday_direct.tax}}</mu-flex>
									</mu-flex>
								</mu-col>
							</mu-row>
						</mu-list-item>
						<mu-divider></mu-divider>
					</mu-list>
				</mu-paper>
			</mu-container>
		</mu-load-more>

	</div>
</template>

<script type="text/javascript">
	import back from 'base/back'
	import { primaryColor } from 'common/js/config.js'
	import { getIconUrl } from 'common/js/tools.js'
	import eventBus from 'common/js/event-bus.js'
	import { getAccountInfo, getBankList, bankCardWithdraw } from 'api/manage-transfer.js'
	export default {
		data() {
			return {
				user: null,
				nums: {},
				info1: false,
				info2: false,
				info3: false,
				info4: false,
				info5: false,
				info6: false,
				info7: false,
				refreshing: false

			}
		},
		computed: {
			getPrimaryColor() {
				return `color:${primaryColor};`
			},
			getPrimaryBorder() {
				return `border: 1px solid ${primaryColor};width: 100%;`
			}
		},
		created() {
			this.getIconUrl = getIconUrl
			this.user = this.$apps.spreadUser();
			this.load();
		},
		methods: {
			load() {
				eventBus.$emit('showNotification', '正在加载，请稍候...')
				this.$axios.post('api/user/moneyDetail', {
						token: this.user.token
					})
					.then((response) => {
						if(response.data && response.data.status == 0 && response.data.data) {
							this.nums = response.data.data;

							this.nums.all.income = this.$spreadFormat(this.nums.all.income);
							this.nums.all.profit = this.$spreadFormat(this.nums.all.profit);
							this.nums.all.tax = this.$spreadFormat(this.nums.all.tax);
							this.nums.all.taxProfit = this.$spreadFormat(this.nums.all.taxProfit);

							this.nums.all_child.income = this.$spreadFormat(this.nums.all_child.income);
							this.nums.all_child.profit = this.$spreadFormat(this.nums.all_child.profit);
							this.nums.all_child.tax = this.$spreadFormat(this.nums.all_child.tax);
							this.nums.all_child.taxProfit = this.$spreadFormat(this.nums.all_child.taxProfit);

							this.nums.all_direct.income = this.$spreadFormat(this.nums.all_direct.income);
							this.nums.all_direct.profit = this.$spreadFormat(this.nums.all_direct.profit);
							this.nums.all_direct.tax = this.$spreadFormat(this.nums.all_direct.tax);
							this.nums.all_direct.taxProfit = this.$spreadFormat(this.nums.all_direct.taxProfit);

							this.nums.today_all.income = this.$spreadFormat(this.nums.today_all.income);
							this.nums.today_all.profit = this.$spreadFormat(this.nums.today_all.profit);
							this.nums.today_all.tax = this.$spreadFormat(this.nums.today_all.tax);
							this.nums.today_all.taxProfit = this.$spreadFormat(this.nums.today_all.taxProfit);

							this.nums.today_child.income = this.$spreadFormat(this.nums.today_child.income);
							this.nums.today_child.profit = this.$spreadFormat(this.nums.today_child.profit);
							this.nums.today_child.tax = this.$spreadFormat(this.nums.today_child.tax);
							this.nums.today_child.taxProfit = this.$spreadFormat(this.nums.today_child.taxProfit);

							this.nums.today_direct.income = this.$spreadFormat(this.nums.today_direct.income);
							this.nums.today_direct.profit = this.$spreadFormat(this.nums.today_direct.profit);
							this.nums.today_direct.tax = this.$spreadFormat(this.nums.today_direct.tax);
							this.nums.today_direct.taxProfit = this.$spreadFormat(this.nums.today_direct.taxProfit);

							this.nums.yestoday_all.income = this.$spreadFormat(this.nums.yestoday_all.income);
							this.nums.yestoday_all.profit = this.$spreadFormat(this.nums.yestoday_all.profit);
							this.nums.yestoday_all.tax = this.$spreadFormat(this.nums.yestoday_all.tax);
							this.nums.yestoday_all.taxProfit = this.$spreadFormat(this.nums.yestoday_all.taxProfit);

							this.nums.yestoday_child.income = this.$spreadFormat(this.nums.yestoday_child.income);
							this.nums.yestoday_child.profit = this.$spreadFormat(this.nums.yestoday_child.profit);
							this.nums.yestoday_child.tax = this.$spreadFormat(this.nums.yestoday_child.tax);
							this.nums.yestoday_child.taxProfit = this.$spreadFormat(this.nums.yestoday_child.taxProfit);

							this.nums.yestoday_direct.income = this.$spreadFormat(this.nums.yestoday_direct.income);
							this.nums.yestoday_direct.profit = this.$spreadFormat(this.nums.yestoday_direct.profit);
							this.nums.yestoday_direct.tax = this.$spreadFormat(this.nums.yestoday_direct.tax);
							this.nums.yestoday_direct.taxProfit = this.$spreadFormat(this.nums.yestoday_direct.taxProfit);

						} else if(!response.data.status) {
							eventBus.$emit('showNotification', '登录已过期')
						} else {
							eventBus.$emit('showNotification', response.data.msg.toString())
						}
					})
					.catch(function(err) {
						console.log(err);
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
				}
				if(this.info2) {
					this.info2 = false;
				}
				if(this.info3) {
					this.info3 = false;
				}
				if(this.info4) {
					this.info4 = false;
				}
				if(this.info5) {
					this.info5 = false;
				}
				if(this.info6) {
					this.info6 = false;
				}
				if(this.info7) {
					this.info7 = false;
				}
			},
			refresh() {
				//下拉刷新 并重载数据
				this.refreshing = true;
				this.$refs.container.scrollTop = 0;
				setTimeout(() => {
					this.refreshing = false;
				}, 1200)
				this.load();
			},
		},
		components: {
			'back': back,
		}
	}
</script>

<style type="text/css">
	.mu-paper {
		background-color: rgb(238, 238, 238) !important;
		z-index: 1 !important;
	}
	
	.mu-list {
		margin: 10px 0 !important;
		background-color: rgb(255, 255, 255) !important;
		z-index: 99 !important;
	}
	
	.helpInfo {
		position: fixed;
		right: 15px !important;
		left: 35% !important;
		z-index: 999 !important;
		background-color: rgb(33, 150, 243) !important;
		padding: 10px !important;
		font-size: 12px !important;
		overflow: inherit !important;
		white-space: normal !important;
	}
</style>