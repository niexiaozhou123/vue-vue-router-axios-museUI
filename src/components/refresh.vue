<template>
	<div class="refresh">
		
		<mu-container>
			<mu-paper :z-depth="3">
				<!--<h1><strong>ERROR.页面未找到!!</strong></h1>-->
			</mu-paper>
			
		</mu-container>
	</div>
</template>

<script type="text/javascript">
	export default {
		data() {
			return {

			}
		},
		computed: {

		},
		created() {
			var that = this;
			var stats =that.$router.history.current.query.stats;
			//延时做效果用的
			if(stats){
				setTimeout(function(){
					that.load2();
				},50)
				
			}else{
				this.load();
			}

		},
		methods: {
			load(){
				//页面强制刷新  
				window.location.replace('/dist/index.html');
//				console.log(location)
			},
			load2(){
				//页面伪重载
				this.$router.go(-1);
			}
		},
		components: {

		}
	}
</script>

<style>

</style>