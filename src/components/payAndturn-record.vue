<template>
	<div class="payAndturn-record">
		<mu-appbar color="primary" class='start'>
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			提转记录
		</mu-appbar>
		<div class="page-content" @click="GotopayRecord">
			<div class="card">
				<div class="list">
					<div class="item-media">
						<img :src="getIconUrl('icon-report-game')" alt="" />
						<span class="item-title">提现记录</span>
						<mu-icon value="keyboard_arrow_right" class="keyboard-right"></mu-icon>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import back from 'base/back'
	import { getIconUrl } from 'common/js/tools.js'
	export default {

		created() {
			this.getIconUrl = getIconUrl;
		},
		methods : {
			GotopayRecord () {
				this.$router.push({
					path: '/pay/record'
				})
			}
		},
		components: {
			'back': back,
		}
	}
</script>

<style lang="scss" scoped>
	div,
	img {
		margin: 0;
		padding: 0;
	}
	
	.page-content {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: #eee;
	}
	
	.card {
		margin: 8px;
		-webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		background: #fff;
		position: relative;
		border-radius: 2px;
		font-size: 14px;
	}
	.list{
		min-height: 48px;
    	padding-left: 16px;
	}
	.item-media{
		position:relative;
		height:48px;
		line-height:48px;
	}
	.item-media img{
		width:24px;
		height:24px;
		vertical-align:middle;
	}
	.item-title{
		margin-left:5px;
	}
	.keyboard-right{
		position:absolute;
		left:90%;
		top:25%;
		color:#ccc;
	}
</style>