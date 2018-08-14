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
			component: Home
		},
		{
			path: '/detail/',
			name: 'detail',
			component: Detail
		},
		{
			path: '/report/team/',
			name: 'report-team',
			component: ReportTeam
		},
		{
			path: '/report/team/detail',
			name: 'report-team-detail',
			component: ReportTeamDeatil
		},
		{
			path: '/report/date/',
			name: 'report-date',
			component: ReportDate
		},
		{
			path: '/report/date/detail/',
			name: 'report-date-dateil',
			component: ReportDateDeatil
		},
		{
			path: '/report/player/',
			name: 'report-player',
			component: ReportPlayer
		},
		{
			path: '/report/player/list/',
			name: 'report-player-list',
			component: ReportPlayerList
		},
		{
			path: '/report/player/searchlist/',
			name: 'report-player-search-list',
			component: ReportPlayerSearchList
		},
		{
			path: '/report/game/',
			name: 'report-game',
			component: ReportGame
		},
		{
			path: '/report/game/list/',
			name: 'report-game-list',
			component: ReportGameList
		},
		{
			path: '/report/game/pay/',
			name: 'report-game-pay',
			component: ReportGamePay
		},
		{
			path: '/agent/register/',
			name: 'agent-register',
			component: AgentRegister
		},
		{
			path: '/agent/register/edit',
			name: 'agent-register-edit',
			component: AgentRegisterEdit
		},
		{
			path: '/player/change/',
			name: 'player-change',
			component: PlayerChange
		},
		{
			path: '/manage/transfer/',
			name: 'manage-transfer',
			component: ManageTransfer
		},

		{
			path: '/user/info/',
			name: 'user-info',
			component: UserInfo
		},
		{
			path: '/user/mail/',
			name: 'user-mail',
			component: UserMail
		},
		{
			path: '/user/password/',
			name: 'user-password',
			component: UserPassword
		},
		{
			path: '/user/result/',
			name: 'user-result',
			component: UserResult
		},
		{
			path: '/manage/bound/alipay/', 
			name: 'manage-bound-alipay',
			component: ManageBoundAlipay
		},
		{
			path: '/manage/alipay/transfer/', 
			name: 'manage-alipay-transfer',
			component: ManageAlipayTransfer
		},
		{
			path: '/manage/card/',
			name: 'manage-card',
			component: ManageCard

		},
		{
			path: '/refresh/',
			name: 'refresh', 
			component: Refresh

		},
		{
			path: '/sub/reg/',
			name: 'sub-reg',
			component: SubReg
		},
		{
			path: '/sub/transfer/',
			name: 'sub-transfer',
			component: SubTransfer
		},
		{
			path: '/sub/paytoplayer/',
			name: 'sub-paytoplayer',
			component: SubPaytoPlayer
		},		
		{
			path: '/payAndturn/record/',
			name: 'payAndturn-record',
			component: payAndturnRecord
		},
		{
			path: '/pay/record/',
			name: 'pay-record',
			component: payRecord
		},
		{
			path: '/extend/',
			name: 'extend',
			component: extend
		},
		{
			path: '/extend/edit/',
			name: 'extend-edit',
			component: extendEdit
		},
		{
			path: '/copy/create/',
			name: 'copy-create',
			component: copyCreate
		},
		{
			path: '/copy/create/edit/',
			name: 'copy-create-edit',
			component: copyCreateEdit
		},		
		{
			path: '/manage/card/edit/',
			name: 'manage-card-edit',
			component: ManageCardEdit

		},
		{
			path: '/manage/spread/',
			name: 'manage-spread',
			component: ManageSpread

		},
		{
			path: '/manage/spread/edit/',
			name: 'manage-spread-edit',
			component: ManageSpreadEdit

		},
		{
			path: '/manage/spread/detail/',
			name: 'manage-spread-detail',
			component: ManageSpreadDetail

		},
		{
			path: '(.*)',
			name: 'not-found',
			component: notFound

		},

	]
})