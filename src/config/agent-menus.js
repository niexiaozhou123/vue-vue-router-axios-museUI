const currentAgent = window.localStorage.getItem('agent') || 'qibao'

// 各工作室开放功能菜单
let agentMenu = {
  'qibao': ['team', 'date', 'game', 'player', 'reg', 'record','transfer','paytoplayer', 'extend', 'create', 'register', 'playerChange','spread', 'manage', 'alipay', ]
}

// 所有菜单
const allMenus = {
  'team': {
    name: '团队报表',
    icon: 'icon-report-team',
    link: '/report/team/',
    part: 'one'
  },
  'date': {
    name: '日度报表',
    icon: 'icon-report-date',
    link: '/report/date/',
    part: 'one'
  },
  'game': {
    name: '游戏报表',
    icon: 'icon-report-game',
    link: '/report/game/',
    part: 'one'
  },
  'player': {
    name: '玩家报表',
    icon: 'icon-report-player',
    link: '/report/player/',
    part: 'one'
  },
  'reg': {
    name: '注册下级',
    icon: 'icon-sub-reg',
    link: '/sub/reg/',
    part: 'two'
  },
  'record': {
    name: '提款记录',
    icon: 'icon-pay-record',
    link: '/pay/record/',
    part: 'two'
  },
  'transfer': {
    name: '下级转账',
    icon: 'icon-sub-transfer',
    link: '/sub/transfer/',
    part: 'two'
  },
  'paytoplayer': {
    name: '玩家充值',
    icon: 'icon-sub-transfer',
    link: '/sub/paytoplayer/',
    part: 'two'
  },
  'extend': {
    name: '玩家后置注册链接',
    icon: 'icon-extend',
    link: '/extend/',
    part: 'two'
  },
  'create': {
    name: '玩家前置注册链接(推荐)',
    icon: 'icon-extend',
    link: '/copy/create/',
    part: 'two'
  },
  'register': {
    name: '代理注册链接',
    icon: 'icon-extend',
    link: '/agent/register/',
    part: 'two'
  },
  'playerChange': {
    name: '玩家转代理',
    icon: 'icon-extend',
    link: '/player/change/',
    part: 'two'
  },
  'spread': {
    name: '代理管理',
    icon: 'icon-manage-spread',
    link: '/manage/spread/',
    part: 'three'
  },
  'manage': {
    name: '提现管理',
    icon: 'icon-manage-transfer',
    link: '/manage/transfer/',
    part: 'three'
  },
  'alipay': {
    name: '支付宝提现',
    icon: 'icon-manage-transfer',
    link: '/manage/alipay/transfer',
    part: 'three'
  },
//'notice': {
//  name: '公告列表',
//  icon: 'icon-notice',
//  link: '/notice/',
//  part: 'four'
//}
}

let filterMenus = (() => {
  let menus = []
  for (let key in allMenus) {
//  if (agentMenu[currentAgent].indexOf(key) > -1) {
//    menus.push(allMenus[key])
//  }
    if (agentMenu[currentAgent]) {
      menus.push(allMenus[key])
    }
  }
  if (menus.length <= 0) {
    return allMenus
  } else {
    return menus
  }
})()

export function getLeftMenus () {
  return filterMenus
}

export const rightMenus = {
  'team': {
    name: '个人信息',
    icon: 'icon-user-info',
    link: '/user/info/',
    part: 'one'
  },
  'date': {
    name: '邮箱绑定',
    icon: 'icon-user-mail',
    link: '/user/mail/',
    part: 'one'
  },
  'game': {
    name: '登录密码',
    icon: 'icon-user-password',
    link: '/user/password/',
    part: 'one'
  },
  'player': {
    name: '结算密码',
    icon: 'icon-user-result',
    link: '/user/result/',
    part: 'one'
  },
  'reg': {
    name: '支付宝绑定',
    icon: 'icon-manage-card',
    link: '/manage/bound/alipay/',
    part: 'two'
  },
  'record': {
    name: '银行卡管理',
    icon: 'icon-manage-card',
    link: '/manage/card/',
    part: 'two'
  },
  'transfer': {
    name: '页面刷新',
    icon: 'icon-manage-card',
    link: '/refresh/',
    part: 'three'
  },
  'paytoplayer': {
    name: '安全退出',
    icon: 'icon-manage-card',
    link: '/',
    part: 'three'
  }
}
export const bankLists =[
  	{
	  	bankName: "中国工商银行",
	    bankCode: "ICBC"
    },
    {
	  	bankName: "中国农业银行",
	    bankCode: "ABC"
    },
    {
	  	bankName: "中国建设银行",
	    bankCode: "CCB"
    },
    {
	  	bankName: "中国邮政储蓄银行",
	    bankCode: "PSBC"
    },
    {
	  	bankName: "中国银行",
	    bankCode: "BOC"
    },
    {
	  	bankName: "交通银行",
	    bankCode: "BOCM"
    },
    {
	  	bankName: "中信银行",
	    bankCode: "CNCB"
    },
    {
	  	bankName: "上海浦东发展银行",
	    bankCode: "SPDB"
    },
    {
	  	bankName: "光大银行",
	    bankCode: "CEB"
    },
    {
	  	bankName: "兴业银行",
	    bankCode: "CIB"
    },
    {
	  	bankName: "华夏银行",
	    bankCode: "HXB"
    },
    {
	  	bankName: "平安银行",
	    bankCode: "PAB"
    },
    {
	  	bankName: "广发银行",
	    bankCode: "CGB"
    },
    {
	  	bankName: "招商银行",
	    bankCode: "CMB"
    },
    {
	  	bankName: "民生银行",
	    bankCode: "CMBC"
    }
  ];