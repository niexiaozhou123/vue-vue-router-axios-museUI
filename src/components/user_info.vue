<template>
	<div class="user_info">
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			个人信息
		</mu-appbar>
		
		<mu-scale-transition>
			<mu-button fab small color="teal" v-if='topUp' class='top_style' @click='onTop'>
				<mu-ripple color="yellow" :opacity="0.5">
					<mu-icon value="arrow_upward"></mu-icon>
				</mu-ripple>
			</mu-button>
		</mu-scale-transition>

		<mu-container  class="whole-screen-wrapper" @scroll='woListScroll($event)' style='margin-top: 12px !important;'>
			<mu-load-more @refresh="refresh" :refreshing="refreshing" ref="container" >
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
									<mu-flex justify-content="center">分成比例</mu-flex>
								</mu-flex>
							</mu-list-item-title>
							<mu-list-item-action>
								<mu-flex align-items="center">
									<mu-flex justify-content="center">{{userInfo.divided_proportion}}%</mu-flex>
								</mu-flex>
							</mu-list-item-action>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item button :ripple="false">
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center">创建时间</mu-flex>
								</mu-flex>
							</mu-list-item-title>
							<mu-list-item-action>
								<mu-flex align-items="center">
									<mu-flex justify-content="center">{{userInfo.created}}</mu-flex>
								</mu-flex>
							</mu-list-item-action>
						</mu-list-item>
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
						<mu-list-item button :ripple="false" >
							<mu-data-table height="600" :columns="columns" :sort.sync="sort" :data="userList" :loading='loading' stripe  style='width: 100%;'>
								<template slot-scope="scope" >
									<td>{{scope.row.level}}%</td>

									<td class="is-left" v-if='scope.row.num>-1'>{{scope.row.num}}</td>
									<td class="is-left" v-if='scope.row.num<=-1'>不限</td>

									<td class="is-left" v-if='scope.row.num>-1&&scope.row.use_num>-1'>{{scope.row.num - scope.row.use_num}}</td>
									<td class="is-left" v-if='scope.row.num<=-1||scope.row.use_num<=-1'>不限</td>

									<td class="is-left" v-if='scope.row.use_num>-1'>{{scope.row.use_num}}</td>
									<td class="is-left" v-if='scope.row.use_num<=-1'>不限</td>
								</template>
							</mu-data-table>
						</mu-list-item>
					</mu-list>
				</mu-paper>

				
				<mu-paper :z-depth="3">
					<mu-list>
						<mu-list-item button :ripple="false">
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center">登录密码修改</mu-flex>
								</mu-flex>
							</mu-list-item-title>
							<mu-list-item-action @click='login_pwd'>
								<mu-icon value='autorenew'></mu-icon>
							</mu-list-item-action>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item button :ripple="false">
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center">修改状态</mu-flex>
								</mu-flex>
							</mu-list-item-title>
							<mu-list-item-action>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" v-if='userInfo.modified'>已修改</mu-flex>
									<mu-flex justify-content="center" v-else>未修改</mu-flex>
								</mu-flex>
							</mu-list-item-action>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item button :ripple="false">
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center">上次修改</mu-flex>
								</mu-flex>
							</mu-list-item-title>
							<mu-list-item-action>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" v-if='userInfo.modified'>{{userInfo.modified}}</mu-flex>
									<mu-flex justify-content="center" v-else></mu-flex>
								</mu-flex>
							</mu-list-item-action>
						</mu-list-item>
					</mu-list>
				</mu-paper>

				<mu-paper :z-depth="3">
					<mu-list>
						<mu-list-item button :ripple="false">
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center">结算密码修改</mu-flex>
								</mu-flex>
							</mu-list-item-title>
							<mu-list-item-action @click='result_pwd'>
								<mu-icon value='autorenew'></mu-icon>
							</mu-list-item-action>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item button :ripple="false">
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center">设定状态</mu-flex>
								</mu-flex>
							</mu-list-item-title>
							<mu-list-item-action>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" v-if='userInfo.bill_password'>已设定</mu-flex>
									<mu-flex justify-content="center" v-else>未设定</mu-flex>
								</mu-flex>
							</mu-list-item-action>
						</mu-list-item>
						<mu-divider></mu-divider>
						<mu-list-item button :ripple="false">
							<mu-list-item-title>
								<mu-flex align-items="center">
									<mu-flex justify-content="center">上次修改</mu-flex>
								</mu-flex>
							</mu-list-item-title>
							<mu-list-item-action>
								<mu-flex align-items="center">
									<mu-flex justify-content="center" v-if='userInfo.modified'>{{userInfo.modified}}</mu-flex>
									<mu-flex justify-content="center" v-else></mu-flex>
								</mu-flex>
							</mu-list-item-action>
						</mu-list-item>
					</mu-list>
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
				userInfo: {},
				userList: [],
				refreshing: false,
				columns: [{
						title: '比例(%)',
						align:'left',
						cellAlign:'center',
						name: 'bili'
					},
					{
						title: '总计',
						align:'left',
						cellAlign:'center',
						name: 'zongji'
					},
					{
						title: '已用',
						align:'left',
						cellAlign:'center',
						name: 'yiyong'
					},
					{
						title: '剩余',
						align:'left',
						cellAlign:'center',
						name: 'shengyu'
					},
				],
				sort: {
					name: '',
					order: 'asc'
				},
				loading: false,
				topUp:false,
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
			this.load()

		},
		methods: {
			load() {
				eventBus.$emit('showNotification', '正在加载..');
				this.loading = true;
				this.$axios.post('api/Promoters/list', {
						token: this.user.token
					})
					.then((response) => {
						if(response.data && response.data.status == 0 && response.data.data) {
							this.userInfo = response.data.data.data;
							this.userList = response.data.data.divide_levels;
						} else {
							app.methods.spreadNotification(result.msg);
						}
					})
					.catch(function(err) {
						eventBus.$emit('showNotification', err);
					})
				this.loading = false;
			},
			refresh() {
				this.refreshing = true;
				this.$refs.container.scrollTop = 0;
				setTimeout(() => {
					this.refreshing = false;
				}, 1200)
				this.load();
			},
			login_pwd(){
				this.$router.push('/user/password/');
			},
			result_pwd(){
				this.$router.push('/user/result/');
			},
			woListScroll(event) {
				var scrollTop = event.target.scrollTop;
				if(scrollTop > 1) {
					this.topUp = true;
				} else {
					window.clearInterval(this.temp);
					this.topUp = false;
				}
			},
			onTop() {
				var that = this;
				var num = setInterval(function() {
					that.$el.childNodes[4].scrollTop = that.$el.childNodes[4].scrollTop - 150 || 0;
				}, 50)
				that.temp = num;
				//				this.$el.childNodes[4].scrollTop= 0 ;
			},
			
		},
		components: {
			'back': back,
		}
	}
</script>

<style type="text/css" scoped>
	
	
	.start {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
	}
	.top_style {
		position: fixed !important;
		bottom: 20px;
		right: 30px;
		z-index: 9999;
	}
</style>