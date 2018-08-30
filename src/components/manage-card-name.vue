<template>
	<div class="manage-name">
		<mu-appbar color="primary" class="bank-start">
			<mu-flex slot="left">
				<back></back>
			</mu-flex>
			银行卡名称
		</mu-appbar>
		<mu-container class="bank-name">
			<div class="select-control-group">
				<mu-flex class="select-control-row" v-for="(bankList,index) in bankLists" :key='index'>
					<mu-radio :value="index" v-model="normal.index" :label="bankList.bankName" @click="Hub"></mu-radio>
				</mu-flex>
			</div>
		</mu-container>
	</div>
</template>
<script type="text/javascript">
	import back from 'base/back'
	import { bankLists } from 'config/agent-menus.js'
	import { getIconUrl } from 'common/js/tools.js'
	import eventBus from 'common/js/event-bus.js'
	export default {
		data() {
			return {
				bankLists: [],
				normal: {
					index: 1,
				},
			}
		},
		created() {
			this.getIconUrl = getIconUrl
			this.bankLists = this._getBankList(bankLists)
		},
		methods: {
			_getBankList(bankLists) {
				if(bankLists.length <= 0) {
					return;
				}
				let count = []
				if(bankLists) {
					for(let bank in bankLists) {
						let banks = bankLists[bank]
						count.push(banks)
					}
					return count
				}
			},
			Hub () {
				let bankName=this.bankLists
				for(var  i=0;i<bankName.length;i++){
					console.log(bankName[i].bankName)
				}
			}
		},
		components: {
			'back': back,
		}
	}
</script>

<style>
	.bank-start{
		position:fixed;
		left:0;
		bottom:0;	
		top:0;
		right:0;
	}
	.manage-name {
		width: 100%;
		position: absolute;
		background-color: #eee;
	}
	.bank-name {
		margin:80px 0;
	}
	
	.mu-radio {
		height: 48px;
		line-height: 48px;
	}
	
	.mu-radio-label {
		height: 48px;
		line-height: 48px;
	}
	
	.mu-radio-icon {
		margin-right:20px;
	}
	.select-control-group{
		margin: 0 16px;
	}
</style>