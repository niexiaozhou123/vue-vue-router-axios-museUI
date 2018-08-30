import Vue from 'vue'
import Router from 'vue-router'
import Login from 'components/login'
import Home from 'components/home'
import ReportTeam from 'components/report-team'
import ReportTeamDeatil from 'components/report-team-detail'
import AgentRegister from 'components/agent-register'
import AgentRegisterEdit from 'components/agent-register-edit'
import ManageTransfer from 'components/manage-transfer'
import ReportDate from 'components/report-date'
import ReportDateDeatil from 'components/report-date-detail'
import UserMail from 'components/user-mail'
import UserPassword from 'components/user-password'
import UserResult from 'components/user-result'
import ManageBoundAlipay from 'components/manage-bound-alipay'
import ManageCard from 'components/manage-card'
import ManageCardEdit from 'components/manage-card-edit'
import Detail from 'components/detail.vue'

import UserInfo from 'components/user_info.vue'
import Refresh from 'components/refresh.vue'
import ReportPlayer from 'components/report_player.vue'
import ReportPlayerSearchList from 'components/report_player_search_list.vue'
import ReportPlayerList from 'components/report_players_list.vue'
import ReportGame from 'components/report_game.vue'
import ReportGameList from 'components/report_game_list.vue'
import ReportGamePay from 'components/report_game_pay.vue'

import SubReg from 'components/sub-reg.vue'
import SubTransfer from 'components/sub_transfer.vue'
import SubPaytoPlayer  from 'components/sub_paytoplayer.vue'

import payAndturnRecord from 'components/payAndturn-record'
import payRecord from 'components/pay-record'
import extend from 'components/extend'
import extendEdit from 'components/extend-edit'
import copyCreate from 'components/copy-create'
import copyCreateEdit from 'components/copy-create-edit.vue'
import notFound   from 'components/404.vue'
import ManageAlipayTransfer from 'components/manage_alipay_transfer.vue'
import PlayerChange from 'components/player_change.vue'

import ManageSpread from 'components/manage_spread.vue'
import ManageSpreadEdit from 'components/manage_spread_edit.vue'
import ManageSpreadDetail from 'components/manage_spread_detail.vue'

Vue.use(Router)

export default new Router({
	mode: 'hash',
	base:'/dist/',
	routes: [
// 		{
// 			path: '/',
// 			name: 'login',
// 			component: Login
// 		},
// 		{
// 			path: '/home/',
// 			name: 'home',
// 			component: Home
// 		},
		{
			path: '/',
			name: 'home',
			component: Home,
			meta:{index:0}
		},
		{
			path: '/detail/',
			name: 'detail',
			component: Detail,
			meta:{index:1}
		},
		{
			path: '/report/team/',
			name: 'report-team',
			component: ReportTeam,
			meta:{index:1}
		},
		{
			path: '/report/player/',
			name: 'report-player',
			component: ReportPlayer,
			meta:{index:1}
		},
		{
			path: '/report/date/',
			name: 'report-date',
			component: ReportDate,
			meta:{index:1}
		},
		{
			path: '/report/game/',
			name: 'report-game',
			component: ReportGame,
			meta:{index:1}
		},
		{
			path: '/sub/reg/',
			name: 'sub-reg',
			component: SubReg,
			meta:{index:1}
		},		
		{
			path: '/pay/record/',
			name: 'pay-record',
			component: payRecord,
			meta:{index:1}
		},
		{
			path: '/sub/transfer/',
			name: 'sub-transfer',
			component: SubTransfer,
			meta:{index:1}
		},
		{
			path: '/sub/paytoplayer/',
			name: 'sub-paytoplayer',
			component: SubPaytoPlayer,
			meta:{index:1}
		},
		{
			path: '/extend/',
			name: 'extend',
			component: extend,
			meta:{index:1}
		},
		{
			path: '/copy/create/',
			name: 'copy-create',
			component: copyCreate,
			meta:{index:1}
		},
		{
			path: '/agent/register/',
			name: 'agent-register',
			component: AgentRegister,
			meta:{index:1}
		},
		{
			path: '/player/change/',
			name: 'player-change',
			component: PlayerChange,
			meta:{index:1}
		},
		{
			path: '/manage/spread/',
			name: 'manage-spread',
			component: ManageSpread,
			meta:{index:1}
		},
		{
			path: '/manage/transfer/',
			name: 'manage-transfer',
			component: ManageTransfer,
			meta:{index:1}
		},
		{
			path: '/manage/alipay/transfer/', 
			name: 'manage-alipay-transfer',
			component: ManageAlipayTransfer,
			meta:{index:1}
		},
		{
			path: '/user/info/',
			name: 'user-info',
			component: UserInfo,
			meta:{index:1}
		},
		{
			path: '/user/mail/',
			name: 'user-mail',
			component: UserMail,
			meta:{index:1}
		},
		{
			path: '/user/password/',
			name: 'user-password',
			component: UserPassword,
			meta:{index:1}
		},
		{
			path: '/user/result/',
			name: 'user-result',
			component: UserResult,
			meta:{index:1}
		},
		{
			path: '/manage/bound/alipay/', 
			name: 'manage-bound-alipay',
			component: ManageBoundAlipay,
			meta:{index:1}
		},
		{
			path: '/manage/card/',
			name: 'manage-card',
			component: ManageCard,
			meta:{index:1}
		},
		{
			path: '/refresh/',
			name: 'refresh', 
			component: Refresh,
			meta:{index:1}
		},
		{
			path: '/report/date/detail/',
			name: 'report-date-dateil',
			component: ReportDateDeatil,
			meta:{index:2}
		},
		{
			path: '/report/team/detail',
			name: 'report-team-detail',
			component: ReportTeamDeatil,
			meta:{index:2}
		},
		
		{
			path: '/report/player/list/',
			name: 'report-player-list',
			component: ReportPlayerList,
			meta:{index:2}
		},
		{
			path: '/extend/edit/',
			name: 'extend-edit',
			component: extendEdit,
			meta:{index:2}
		},
		{
			path: '/report/game/list/',
			name: 'report-game-list',
			component: ReportGameList,
			meta:{index:2}
		},
		{
			path: '/report/game/pay/',
			name: 'report-game-pay',
			component: ReportGamePay,
			meta:{index:2}
		},
		{
			path: '/copy/create/edit/',
			name: 'copy-create-edit',
			component: copyCreateEdit,
			meta:{index:2}
		},
		{
			path: '/agent/register/edit',
			name: 'agent-register-edit',
			component: AgentRegisterEdit,
			meta:{index:2}
		},
		{
			path: '/manage/spread/edit/',
			name: 'manage-spread-edit',
			component: ManageSpreadEdit,
			meta:{index:2}
		},
		{
			path: '/manage/spread/detail/',
			name: 'manage-spread-detail',
			component: ManageSpreadDetail,
			meta:{index:2}
		},
		{
			path: '/manage/card/edit/',
			name: 'manage-card-edit',
			component: ManageCardEdit,
			meta:{index:2}
		},
		{
			path: '/report/player/searchlist/',
			name: 'report-player-search-list',
			component: ReportPlayerSearchList,
			meta:{index:3}
		},					
//		{
//			path: '/payAndturn/record/',
//			name: 'payAndturn-record',
//			component: payAndturnRecord
//		},				
		{
			path: '(.*)',
			name: 'not-found',
			component: notFound,
			meta:{index:4}
		},
	]
})