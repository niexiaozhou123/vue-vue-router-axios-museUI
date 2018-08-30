<template>
	<div class="user_info">
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			代理详情
		</mu-appbar>

		<mu-container style='margin-top: 10px !important;'>
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
						<mu-list-item button :ripple="false">
							<mu-data-table height="310" :columns="columns" :sort.sync="sort" :data="userList" :loading='loading' stripe  style='width: 100%;'>
								<template slot-scope="scope">
									<td v-if='scope.row.num!="0"'>{{scope.row.level}}%</td>
									
									<td class="is-left" v-if='scope.row.num>-1&&scope.row.num!="0"'>{{scope.row.num}}</td>
									<td class="is-left" v-if='scope.row.num<=-1&&scope.row.num!="0"'>不限</td>
									
									<td class="is-left" v-if='scope.row.use_num>-1&&scope.row.num!="0"'>{{scope.row.use_num}}</td>
									<td class="is-left" v-if='scope.row.use_num<=-1&&scope.row.num!="0"'>不限</td>
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
									<mu-flex justify-content="center">最后修改</mu-flex>
								</mu-flex>
							</mu-list-item-title>
							<mu-list-item-action @click='login_pwd'>
								{{userInfo.modified}}
							</mu-list-item-action>
						</mu-list-item>
						<mu-divider></mu-divider>
						
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
				id:0,
				userInfo: {},
				userList: [],
				refreshing: false,
				columns: [{
						title: '分成档位',
						algin:'left',
						cellAlign:'center',
						name: 'bili'
					},
					{
						title: '配额分发',
						algin:'right',
						cellAlign:'left',
						name: 'zongji'
					},
					
					{
						title: '剩余配额',
						algin:'right',
						cellAlign:'left',
						name: 'shengyu'
					},
				],
				sort: {
					name: '',
					order: 'asc'
				},
				loading: false,
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
			this.id=this.$router.history.current.query.id;
			this.load()

		},
		methods: {
			load() {
				eventBus.$emit('showNotification', '正在加载..');
				this.loading = true;
				this.$axios.post('api/Promoters/show', {
						token: this.user.token,
						promoters_id: this.id
					})
					.then((res) => {
//						console.log(res);
						if(res.data && res.data.status == 0 && res.data.data) {
							this.userInfo = res.data.data.data;
							this.userList = res.data.data.divide_levels;
						} else {
							eventBus.$emit('showNotification', res.data.msg);
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
			}
			
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
	.is-right{
		/*padding-left: 0 !important;*/
	}
</style>