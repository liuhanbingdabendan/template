import Home from '../views/home/Index';
import Error404 from '../views/error/Error404';
import Error500 from '../views/error/Error500';
import Intercept from '../views/permission/Intercept';
import Toggle from '../views/permission/Toggle';

import UserManag from '../views/systemManag/userManag/Index';
import RoleManag from '../views/systemManag/roleManag/Index';
import MenuManag from '../views/systemManag/menuManag/Index';

import AppManag from '../views/userManage/AppManag/Index';
import UserLog from '../views/userManage/UserLog/Index';

import LoanProduct from '../views/loanManage/LoanProduct/Index';
import ProductLabel from '../views/loanManage/ProductLabel/Index';
import RCLoanProduct from '../views/loanManage/RCLoanProduct/Index';

import ChannelPop from '../views/operManage/ChannelPop/Index';
import ChannelManag from '../views/operManage/ChannelManag/Index';

import ChannelForm from '../views/statisticalForm/ChannelForm/Index';
import ProductReport from '../views/statisticalForm/ProductReport/Index';
import OperStatistics from '../views/statisticalForm/OperStatistics/Index';

import CreditOrder from '../views/creditManag/CreditOrder/Index';

import TestList from '../views/test/testList/index';
import TestTemplate from '../views/test/testTemplate/index';
import GetTemplate from '../views/test/getTemplate/index';
export const routes = [
	{ path: '/home', component: Home },
	{ path: '/permission/toggle', component: Toggle, permission: 1 },
	{ path: '/permission/intercept', component: Intercept },
	{ path: '/error/404', component: Error404 },
	{ path: '/error/500', component: Error500 },
	{ path: '/UserManag', component: UserManag },
	{ path: '/RoleManag', component: RoleManag },
	{ path: '/MenuManag', component: MenuManag },
	{ path: '/AppManag', component: AppManag },
	{ path: '/UserLog', component: UserLog },
	{ path: '/LoanProduct', component: LoanProduct },
	{ path: '/ProductLabel', component: ProductLabel },
	{ path: '/RCLoanProduct', component: RCLoanProduct },
	{ path: '/ChannelPop', component: ChannelPop },
	{ path: '/ChannelManag', component: ChannelManag },
	{ path: '/ChannelForm', component: ChannelForm },
	{ path: '/ProductReport', component: ProductReport },
	{ path: '/OperStatistics', component: OperStatistics },
	{ path: '/CreditOrder', component: CreditOrder },
	{ path: '/testList', component: TestList },
	{ path: '/testTemplate', component: TestTemplate },
	{ path: '/getTemplate', component: GetTemplate },
];
