<template>
	<div class="report-game">
		<!-- 头部导航 -->
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			游戏列表
		</mu-appbar>

		<!-- 内容主体 -->
		<mu-container >
			<!-- 用户信息 -->
			<mu-appbar :z-depth="3" class='title' >
				<mu-list @click='goGame'>
					<mu-list-item :ripple="false" >
						<mu-list-item-title>
							<mu-flex align-items="center" >
								<mu-flex justify-content="center" class="mar-right-5">
									<mu-icon value='face' size='20'></mu-icon>
								</mu-flex>
								<mu-flex justify-content="center" class="mar-right-5 info-title">游戏记录</mu-flex>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action>
							<mu-flex>
								<mu-flex justify-content="center">
									<mu-icon value="keyboard_arrow_right" class="icon-right"></mu-icon>
								</mu-flex>
							</mu-flex>
						</mu-list-item-action>
					</mu-list-item>
				</mu-list>
			</mu-appbar>

			<mu-appbar :z-depth="3" class='title' >
				<mu-list @click='goMoney'>
					<mu-list-item :ripple="false">
						<mu-list-item-title>
							<mu-flex align-items="center">
								<mu-flex justify-content="center" class="mar-right-5">
									<mu-icon value='book' size='20'></mu-icon>
								</mu-flex>
								<mu-flex justify-content="center" class="mar-right-5 info-title">充值记录</mu-flex>
							</mu-flex>
						</mu-list-item-title>
						<mu-list-item-action>
							<mu-flex>
								<mu-flex justify-content="center">
									<mu-icon value="keyboard_arrow_right" class="icon-right"></mu-icon>
								</mu-flex>
							</mu-flex>
						</mu-list-item-action>
					</mu-list-item>
				</mu-list>
			</mu-appbar>
		</mu-container>

	</div>
</template>
<script type="text/javascript">
	import back from 'base/back'
	import { prefix, currentAgent } from 'common/js/config.js'
	import { primaryColor } from 'common/js/config.js'

	export default {
		data() {
			return {

			}
		},
		computed: {
			getPrimaryColor() {
				return `color:${primaryColor};`
			}
		},
		created() {
			

		},
		methods: {
			getImgUrl(hasData) {
				let url = `${prefix}${currentAgent}-icon/`
				if(hasData) {
					url += 'icon-item-have.png'
				} else {
					url += 'icon-item-none.png'
				}
				return url
			},
			goGame(){
				this.$router.push('/report/game/list/')
			},
			goMoney(){
				this.$router.push('/report/game/pay/')
			}
			
		},
		components: {
			'back': back,
		},

	}
</script>
<style lang="scss" rel="stylesheet/sass" scoped>
	.title{
		margin: 10px 0 !important;
		padding: 0 !important;
		background: #FFFFFF !important;
		height: 40 !important;
		border-radius: 5px;
		
		.mu-list-item{
			padding: 0px !important;
		}
	}
	
	.mu-list {
		background: #FFFFFF !important;
		
		
	}
</style>