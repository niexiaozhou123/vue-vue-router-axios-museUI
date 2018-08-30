<template>
	<div class="not-found">
		页面走丢啦！！！
		<p>对不起</p>
		<p>你访问页面未找到！</p>
	</div>
</template>

<script type="text/javascript">
	export default {
		data() {
			return {
				user: null,
				

			}
		},
		created() {
			this.user = this.$apps.spreadUser();			
//			this.load();
			console.log('当前url为:'+this.$router.history.current.fullPath)
		},
		methods: {
			load(){
				
			}
		},
		components: {
			
		}
	}
</script>

<style>

</style>