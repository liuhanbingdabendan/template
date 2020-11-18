/**
 * @ Author: Jone Chen
 * @ Create Time: 2019-06-19 16:58:23
 * @ Modified by: Jone Chen
 * @ Modified time: 2019-07-18 16:09:41
 * @ Description:权限控制，permission 1==超级管理员，其它为普通用户
 */

export const menus = [
	{
		path: '/home',
		title: '首页',
		icon: 'home'
	},
	{
		path: '/systemManage',
	 	title: '系统管理',
	 	icon: 'switcher',
	 	children: [
	 		{
	 			path: '/UserManag',
	 			title: '用户管理'
			 },
			{
				path: '/RoleManag',
				title: '角色管理'
			},
			{
				path: '/MenuManag',
				title: '菜单管理'
			}
	 	]
	},
	{
		path: '/userManage',
		title: '用户管理',
		icon: 'user',
		children: [
			{
				path: '/AppManag',
				title: 'App用户'
			},
			{
				path: '/UserLog',
				title: '用户日志'
			}
		]
	},
	{
		path: '/loanManage',
		title: '贷款管理',
		icon: 'safety-certificate',
		children: [
			{
				path: '/LoanProduct',
				title: '贷款产品'
			},
			{
				path: '/ProductLabel',
				title: '产品标签'
			},
			{
				path: '/RCLoanProduct',
				title: 'RupeeClub贷款产品'
			}
		]
	},
	{
		path: '/operManage',
		title: '运营管理',
		icon: 'sketch',
		children: [
			{
				path: '/ChannelManag',
				title:'渠道管理'
			},
			{
				path: '/ChannelPop',
				title: '渠道推广统计'
			}
		]
	},
	{
		path: '/statisticalForm',
		title: '统计报表',
		icon: 'switcher',
		children: [
			{
				path: '/ChannelForm',
				title:'渠道报表'
			},
			{
				path: '/ProductReport',
				title:'产品运营报告'
			},
			{
				path: '/OperStatistics',
				title:'RupeeClub运营统计'
			}
		]
	},
	{
		path: '/creditManag',
		title: '征信查询管理',
		icon: 'search',
		children: [
			{
				path: '/CreditOrder',
				title:'征信查询订单'
			}
		]
	},
	{
		path:'/test',
		title:'测试',
		icon:'search',
		children:[
			{
				path:'/testList',
				title:'测试列表'
			},
			{
				path:'/testTemplate',
				title:'测试模板'
			},
			{
				path:'/getTemplate',
				title:'获取模板'
			}
		]
	}
	// {
	// 	path: '/permission',
	// 	title: '权限测试',
	// 	icon: 'safety-certificate',
	// 	children: [
	// 		{
	// 			path: '/permission/toggle',
	// 			title: '权限切换',
	// 			permission: 1
	// 		},
	// 		{
	// 			path: '/permission/intercept',
	// 			title: '路由拦截'
	// 		}
	// 	]
	// },
	// {
	// 	path: '/error',
	// 	title: '错误页面',
	// 	icon: 'switcher',
	// 	children: [
	// 		{
	// 			path: '/error/404',
	// 			title: '404'
	// 		},
	// 		{
	// 			path: '/error/500',
	// 			title: '500'
	// 		}
	// 	]
	// },
];
