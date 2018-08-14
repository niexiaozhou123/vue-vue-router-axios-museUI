<template>
	<div class="user_info">
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			代理详情
		</mu-appbar>

		<mu-container>
			<mu-load-more @refresh="refresh" :refreshing="refreshing" ref="container">
				<mu-paper :z-depth="3">
					<mu-list>
						<mu-list-item button :ripple="false">
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center">
										<!--<img :src="getIconUrl('icon-accounts')" class="brief-user-icon mar-right-5">-->
										<mu-icon value='person' color='darkgray' class='mar-right-5'></mu-icon>
									</mu-flex>
									<mu-flex justify-content="center">{{userInfo.name}}</mu-flex>
								</mu-flex>
							</mu-list-item-title>
						</mu-list-item>
					</mu-list>
				</mu-paper>

				<mu-paper :z-depth="3">
					<mu-list>
						<mu-list-item button :ripple="false">
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center">分成比例：
										<a style='color: red;'>{{currentRate}}%</a>
									</mu-flex>
								</mu-flex>
							</mu-list-item-title>
							<mu-list-item-content></mu-list-item-content>
							<mu-list-item-action id='picker-alert' v-if='notChose' @click='nonChose'>
								请选择
							</mu-list-item-action>
							<mu-list-item-action v-if='!notChose'>
								<mu-select v-model="selectRatio" style='width: 40%;' @change='selectChange'>
									<mu-option v-for="item in choseList" :key="item" :label="item" :value="item" ripple></mu-option>
								</mu-select>
							</mu-list-item-action>
						</mu-list-item>
						<mu-divider></mu-divider>

					</mu-list>
				</mu-paper>

				<mu-paper :z-depth="3">
					<mu-list>
						<mu-list-item button :ripple="false">
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" class="mar-right-5">
										<img :src="getIconUrl('icon-title')" style="width: 50%;">
									</mu-flex>
									<mu-flex justify-content="center">配额状态</mu-flex>
								</mu-flex>
							</mu-list-item-title>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item style='justify-content: center;'>
							<!--<mu-list-item-action>分成档位</mu-list-item-action>
						<mu-list-item-content>配额设定</mu-list-item-content>
						<mu-list-item-action>剩余配额</mu-list-item-action>-->
							<mu-row class='rowstyle'>
								<mu-col class='colstyle'>分成档位</mu-col>
								<mu-col class='colstyle'>总计</mu-col>
								<mu-col class='colstyle'>已用</mu-col>
								<mu-col class='colstyle'>可赠与</mu-col>
								<mu-col class='colstyle'>赠与</mu-col>
							</mu-row>
						</mu-list-item>
						<mu-divider></mu-divider>
					</mu-list>

					<mu-list v-for='item in parent_levels' :key='item.id'>
						<mu-list-item style='justify-content: center;' v-if='item.label'>
							<mu-row class='rowstyle'>
								<mu-col class='colstyle cell-value' style='padding-top: 10px ;' :data-level='item.level'>{{item.label}}</mu-col>
								<mu-col class='colstyle' style='padding-top: 10px ;'>{{item.total}}</mu-col>
								<mu-col class='colstyle' style='padding-top: 10px ;'>{{item.use}}</mu-col>
								<mu-col class='colstyle' style='padding-top: 10px ;'>{{item.remain}}</mu-col>
								<mu-col class='colstyle' style='padding-top: 10px ; font-size: 12px !important;'>
									<!--<mu-text-field v-model='input_item'  style='width: 30px !important; font-size: 12px  !important;' ref='i_peier' placeholder='MAX'></mu-text-field>-->
									<input type="text" style='width: 35px !important; font-size: 12px  !important;' placeholder='MAX' :data-key='item.id' :value="item.quote_val" class="id-value" />
									<a @click="btn(item,$event)" class="set-quota">{{item.set_quota_text}}</a>
								</mu-col>
							</mu-row>
						</mu-list-item>
					</mu-list>
				</mu-paper>

				<mu-paper>
					<mu-button color="info" @click='submit' full-width style='height: 50px;'>确认配置</mu-button>
				</mu-paper>

			</mu-load-more>
		</mu-container>
	</div>
</template>

<script>
	import back from 'base/back'
	import { primaryColor } from 'common/js/config.js'
	import { getIconUrl } from 'common/js/tools.js'
	import eventBus from 'common/js/event-bus.js'

	export default {
		data() {
			return {
				user: null,
				id: 0,
				userInfo: {},
				userList: [],
				refreshing: false,
				columns: [{
						title: '分成档位',
						width: 70,
						name: 'bili'
					},
					{
						title: '总计',
						width: 74,
						name: 'zongji'
					},
					{
						title: '已用',
						width: 50,
						name: 'yiyong'
					},
					{
						title: '可赠与',
						width: 74,
						name: 'kezneg'
					},
					{
						title: '赠与',
						width: 70,
						name: 'zengyu'
					},
				],
				sort: {
					name: '',
					order: 'asc'
				},

				currentRate: 0,
				notChose: false,
				selectRatio: '',
				choseList: {},
				divide_levels: {},
				parent_levels: {},
			}
		},
		computed: {
			getPrimaryColor() {
				return `backgroundColor:${primaryColor};`
			},
		},
		created() {
			this.getIconUrl = getIconUrl
			this.user = this.$apps.spreadUser();
			this.id = this.$router.history.current.query.id;
			this.load();

		},
		methods: {
			load() {
				eventBus.$emit('showNotification', '正在加载..');

				this.$axios.post('api/Promoters/show', {
						token: this.user.token,
						promoters_id: this.id
					})
					.then((res) => {
						//						console.log(res);
						if(res.data && res.data.status == 0 && res.data.data) {
							this.userInfo = res.data.data.data;
							this.currentRate = Number(this.userInfo.divided_proportion);
							this.divide_levels = res.data.data.divide_levels;
							this.parent_levels = res.data.data.parent_levels;

							this.showDivide(this.divide_levels, this.parent_levels);

							var chain_arr = this.userInfo.divided_chain.split(",");
							var minValue = parseInt(this.currentRate);
							var maxValue = parseInt(chain_arr[chain_arr.length - 1]) - 1;
							var reteList = this.getRateList(res.data.data.parent_levels, minValue, maxValue);
							var shareText = this.getDefaultShare(res.data.data.parent_levels, this.currentRate);

							if(reteList.length !== 0 && this.currentRate != reteList[0].split('%')[0]) {
								reteList.unshift(this.currentRate + '  ' + shareText);
							}
							if(reteList.length === 0) {
//								$('#picker-alert').on('click', function() {
//									
//									eventBus.$emit('showNotification', '您没有可以调整的分成比例！');
//								});
								//用其他方法代替  浏览器内失效
								this.notChose = true;
							} else {
								this.choseList = reteList;

							}

						} else {
							eventBus.$emit('showNotification', res.data.msg);
						}
					})
					.catch(function(err) {
						eventBus.$emit('showNotification', err);
					})
				this.loading = false;
			},
			selectChange(e) {
				this.currentRate = Number(e.slice(0, e.length - 2));
				this.selectRatio = e.slice(0, e.length - 1) + '%';
				//				console.log('this.currentRate:' + this.currentRate) //更改currentRate的值
			},
			getRateList(list, minValue, maxValue) {
				var rateList = [];
				for(var i = 0; i < list.length; i++) {
					if(list[i].level < maxValue && list[i].level >= minValue && list[i].use_num !== '0') {
						var share = list[i].use_num > -1 ? list[i].use_num : '无限';
						rateList.push(list[i].level + '  ' + share);
					}
				}
				return rateList;
			},
			getDefaultShare(list, level) {
				var share = '';
				for(var i = 0; i < list.length; i++) {
					// && list[i].use_num != '0'
					if(list[i].level == level) {
						share = list[i].use_num;
						break;
					}
				}
				if(share == -1) {
					share = '无限';
				}
				return share;
			},
			showDivide(list, parentList) {

				for(var i = 0; i < parentList.length; i++) {
					var level = parentList[i].level;
					var item = null;

					for(var j = 0; j < list.length; j++) {
						if(level == list[j].level) {
							item = list[j];
							break;
						}

					}

					this.showDivideItem(parentList[i], item);
				}
			},
			showDivideItem(items, item) {

				var num = 0;
				var useNum = 0;
				var item_id = 0;
				if(item) {
					num = parseInt(item.num) || 0;
					useNum = parseInt(item.use_num) || 0;
					item_id = item.id;

				}

				var p_usenum = parseInt(items.use_num) || 0;
				if(num == 0 && useNum == 0 && p_usenum == 0) return;
				if(items.level < this.currentRate) {
					//					item.count = item_id;
					items.level = items.level;
					items.label = items.level + '%';
					items.total = num > -1 ? num : '不限';
					items.use = num - useNum;
					items.remain = p_usenum > -1 ? p_usenum : '不限';
					items.set_quota_text = p_usenum <= -1 && num > -1 ? '取消' : '';
					items.quote_val = p_usenum <= -1 && num > -1 ? 'MAX' : '';
					//				console.log(items.label);
				}
				//				

			},
			refresh() {
				this.refreshing = true;
				this.$refs.container.scrollTop = 0;
				setTimeout(() => {
					this.refreshing = false;
				}, 1200)
				this.load();
			},
			btn(item, e) {
				var targetText = e.target.innerText;
				var target = $(e.target);
				if(target.text().indexOf('无限') > -1) {
					target.prev().val('MAX');
					target.text('取消');
				} else {
					target.prev().val('0');
					target.text('无限');
				}
			},
			submit() {
				var peedu = [];
				var ids = [];
				var level = [];
				var values = $('.id-value');
				if(values) {
					for(var i = 0; i < values.length; i++) {
						var give = $(values[i]).val() || 0;
						if(give < 0) {
							alert("请输入正确的赠予配额数");
							return;
						} else if(give == 0) {
							//							continue;
						}
						peedu.push(give);
						ids.push($(values[i]).attr('data-key'));
					}
				}
				var cells = $(".cell-value");
				if(cells) {
					for(var i = 0; i < cells.length; i++) {
						level.push($(cells[i]).attr('data-level'));
					}
				}

				this.$axios.post('api/Promoters/edit', {
						token: this.user.token,
						promoters_id: this.id,
						nick_name: this.userInfo.name,
						divided_proportion: this.currentRate,
						peedu: peedu,
						ids: ids,
						level: level,
						dosubmit: 1
					})
					.then((res) => {
						if(res.data && res.data.status == 0) {
							eventBus.$emit('showNotification', res.data.msg);
							setTimeout(function() {
								this.$router.push({
									path: '/refresh/',
									query: {
										stats: '2'
									}
								})
							}, 500)
						} else {
							eventBus.$emit('showNotification', res.data.msg);
						}

					})
					.catch(function(err) {
						eventBus.$emit('showNotification', err);
					})
			},
			nonChose(){
				eventBus.$emit('showNotification', '您没有可以调整的分成比例！');
			}
		},
		components: {
			'back': back,
		}
	}
</script>

<style type="text/css">
	.container {
		margin-top: 65px !important;
		overflow: hidden !important;
	}
	
	.start {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
	}
	
	.rowstyle {
		display: flex;
		flex-direction: row-reverse;
		justify-content: center;
	}
	
	.colstyle {
		width: 130px;
		padding: 0 20px;
	}
</style>