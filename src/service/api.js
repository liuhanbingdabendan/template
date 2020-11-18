import Axios from '../axios/server'
import qs from 'qs'
import queryString from 'query-string';

 //登录接口
const login='/login';                                  
export function toLogin(data) {
    console.log(data,'data')
  return Axios({
    url: login,
    method: 'post',
    data:qs.stringify(data),
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  })
}

//首页数据接口
const getCaptchaUrl= '/captcha/captchaImage?type=math'; 
export function getCaptcha() {
  return Axios({
    url: getCaptchaUrl,
    method: 'get',
    responseType:'arraybuffer'
  })
}
// 系统管理—— 角色管理list
const roleManagUrl = '/system/role/list';       
export function roleManagList(data){
    return Axios({
        url: roleManagUrl,
        method: 'post',
        data:qs.stringify(data),
        headers:{'Content-Type':'application/x-www-form-urlencoded'}
      })
}
// 角色管理 - 删除 ids=""
const removeroleManagUrl = 'system/role/remove';
export function removeroleManag(data){
  return Axios({
      url: removeroleManagUrl,
      method: 'post',
      data:qs.stringify({ids:data}),
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
}
// 角色管理 —— 编辑
const editRoleUrl = 'system/role/add'
export function editRoleList(data) {
  return Axios({
    url: editRoleUrl,
    method: 'post',
    data: qs.stringify(data),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

// 角色管理 —— 添加
const addRoleUrl = 'system/role/add'
export function addRoleManag(data) {
  return Axios({
    url: addRoleUrl,
    method: 'post',
    data: qs.stringify(data),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
// 系统管理—— 用户管理list
const userManagUrl = '/system/user/list';
export function userManagList(data) {
  return Axios({
		url: userManagUrl,
		method: 'post',
		data: qs.stringify(data),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});
}
// 系统管理—— 用户管理list-添加用户
const addUserManagUrl = '/system/user/add';
export function addUserManag(data) {
  return Axios({
		url: addUserManagUrl,
		method: 'post',
		data: qs.stringify(data),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});
}
// 系统管理—— 用户管理list-重置密码
const resetPwdUserManagUrl = '/system/user/resetPwd';
export function resetPwdUserManag(data) {
					return Axios({
            url: resetPwdUserManagUrl,
						method: 'post',
						data: qs.stringify(data),
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
					});
}
// 系统管理—— 用户管理list-删除用户
const removeUserManagUrl = '/system/user/remove';
export function removeUserManag(data) {
  return Axios({
    url: removeUserManagUrl,
    method: 'post',
    data: qs.stringify(data),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}
// 系统管理—— 用户管理list-导入用户
const importDataUserManagUrl = '/system/user/importData';
export function importDataUserManag(data) {
  return Axios({
		url: importDataUserManagUrl,
		method: 'post',
		data: data,
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});
}
// 系统管理—— 用户管理list-编辑用户
const newEditUserManagUrl = '/system/user/newedit/';
export function newEditUserManag(data) {
  return Axios({
		url: newEditUserManagUrl + data,
		method: 'get',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});
}
// 渠道管理 ——用户管理list-编辑用户
const editUserUrl = '/system/user/edit';
export function editUserList(data) {
  return Axios({
    url: editUserUrl,
    method: 'post',
    data: qs.stringify(data),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
// 系统管理—— 菜单管理list
const menuManagUrl = '/system/menu/menusepList?flag=sep';
export function menuManagList(data) {
  return Axios({
		url: menuManagUrl,
    method: 'get',
		headers: { 'Content-Type': 'application/json;charset=UTF-8' }
	});
}
// 系统管理—— 角色管理弹出-菜单权限list
const seproleMenuTreeDataUrl= '/system/menu/seproleMenuTreeData/?roleId=';
export function seproleMenuTreeData(data) {
  return Axios({
		url: seproleMenuTreeDataUrl+data,
    method: 'get',
		headers: { 'Content-Type': 'application/json;charset=UTF-8' }
	});
}
// 用户管理—— APP用户list
const getAppUrl = '/web/tbUser/list';       
export function getAppList(data){
    return Axios({
        url: getAppUrl,
        method: 'post',
        data:qs.stringify(data),
        headers:{'Content-Type':'application/x-www-form-urlencoded'}
      })
}

// APP用户 - 删除 ids=""
const removeAppUrl = '/web/tbUser/remove';
export function removeApp(data){
  return Axios({
      url: removeAppUrl,
      method: 'post',
      data:qs.stringify({ids:data}),
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
}

// 用户管理—— 用户日志list
const userLogUrl = '/web/dkUserLog/list';       
export function userLogList(data){
    return Axios({
        url: userLogUrl,
        method: 'post',
        data:qs.stringify(data),
        headers:{'Content-Type':'application/x-www-form-urlencoded'}
      })
}

// 导出 
// const exportUrl="/api/web/dkUserLog/export";
export function exportLoanList(exportUrl,params) {
  return Axios({
    url: exportUrl,
    method: 'post',
    data:qs.stringify(params),
    headers:{
      'Content-Type':'application/x-www-form-urlencoded',
      'Accept':'*/*'
    }
  })
}
// 导出模板
export function exportMB(exportUrl) {
  return Axios({
    url: exportUrl,
    method: 'get',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded',
      'Accept':'*/*'
    }
  })
}

// 下载
export function downloadExcl(params) {
  const downloadUrl = `/common/download?fileName=${params}&delete=true`;
  return Axios({
    url: downloadUrl,
    method: 'get',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded',
      'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
  }
  })
}

// 贷款管理—— 产品标签list
const  productLabelUrl= '/web/dkLoanTag/list';       
export function getProductLabelList(data){
    return Axios({
        url: productLabelUrl,
        method: 'post',
        data:qs.stringify(data),
        headers:{'Content-Type':'application/x-www-form-urlencoded',}
      })
}

// 产品标签 —— 删除 ids=""
const removedkLoanTagUrl = '/web/dkLoanTag/remove';
export function removeDkLoanTag(data){
  return Axios({
      url: removedkLoanTagUrl,
      method: 'post',
      data:qs.stringify({ids:data}),
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
}

// 产品标签 —— 编辑
const editProductUrl = '/web/dkLoanTag/edit'
export function editProductList(data){
  return Axios({
      url: editProductUrl,
      method: 'post',
      data:qs.stringify(data),
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
}

// 产品标签 —— 添加
const addProductUrl = '/web/dkLoanTag/add'
export function addProductList(data){
  return Axios({
      url: addProductUrl,
      method: 'post',
      data:qs.stringify(data),
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
}

// 贷款管理—— 贷款产品list
const  getLoanProductUrl= '/web/dkLoan/list';       
export function getLoanProductList(data){
    return Axios({
        url: getLoanProductUrl,
        method: 'post',
        data:qs.stringify(data),
        headers:{'Content-Type':'application/x-www-form-urlencoded'}
      })
}
// 贷款产品 —— 编辑
const editLoanProductUrl = '/web/dkLoan/edit'
export function editLoanProductList(data){
  return Axios({
      url: editLoanProductUrl,
      method: 'post',
      data:qs.stringify(data),
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
}

// 贷款产品 —— 添加
const addLoanProductUrl = '/web/dkLoan/addloan'
export function addLoanProductList(data){
  return Axios({
      url: addLoanProductUrl,
      method: 'post',
      data:qs.stringify(data),
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
}
// 贷款产品 —— 删除 ids=""
const removedkLoanUrl = '/web/dkLoan/remove';
export function removeDkLoan(data){
  return Axios({
      url: removedkLoanUrl,
      method: 'post',
      data:qs.stringify({ids:data}),
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
}
// 贷款产品 —— 推送
const  sendmsgUrl= '/web/dkLoan/sendmsg';       
export function sendmsg(data){
    return Axios({
        url: sendmsgUrl,
        method: 'post',
        data:qs.stringify(data),
        headers:{'Content-Type':'application/x-www-form-urlencoded'}
      })
}

// 切换状态等
export function changeStatus(url,data){
  return Axios({
      url: url,
      method: 'post',
      data:qs.stringify(data),
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
}
// 运营管理 —— 渠道推广统计list
const channelPopUrl = '/web/dkPromotionStatistics/channellist';       
export function channelPopList(data){
    return Axios({
        url: channelPopUrl,
        method: 'post',
        data:qs.stringify(data),
        headers:{'Content-Type':'application/x-www-form-urlencoded'}
      })
}
// 运营管理 —— 渠道管理list
const channelManag = '/web/dkChannel/list';       
export function channelManagList(data){
    return Axios({
        url: channelManag,
        method: 'post',
        data:qs.stringify(data),
        headers:{'Content-Type':'application/x-www-form-urlencoded'}
      })
}
// 渠道管理 —— 编辑
const editChannelUrl = '/web/dkChannel/edit'
export function editChannelList(data){
  return Axios({
      url: editChannelUrl,
      method: 'post',
      data:qs.stringify(data),
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
}
// 渠道管理 —— 添加
const addChannelUrl = '/web/dkChannel/add'
export function addChannelList(data){
  return Axios({
      url: addChannelUrl,
      method: 'post',
      data:qs.stringify(data),
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
}
// 渠道管理 —— 删除 ids=""
const removeChannMagUrl = '/web/dkChannel/remove';
export function removeChannMag(data){
  return Axios({
      url: removeChannMagUrl,
      method: 'post',
      data:qs.stringify({ids:data}),
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
}
// 统计报表——渠道报表list
const channelForm = '/web/dkChannelStatistics/list';       
export function channelFormList(data){
    return Axios({
        url: channelForm,
        method: 'post',
        data:qs.stringify(data),
        headers:{'Content-Type':'application/x-www-form-urlencoded'}
      })
}
// 统计报表——产品运营报告list
const productReport = '/web/dkLoanOperationStatistics/list';       
export function productReportList(data){
    return Axios({
        url: productReport,
        method: 'post',
        data:qs.stringify(data),
        headers:{'Content-Type':'application/x-www-form-urlencoded'}
      })
}
//统计报表——RupeeClub运营统计list
const operStatistics = '/web/statistics/list';       
export function operStatisticsList(data){
    return Axios({
        url: operStatistics,
        method: 'post',
        data:qs.stringify(data),
        headers:{'Content-Type':'application/x-www-form-urlencoded'}
      })
}

// 获取RupeeClub贷款产品list
const  getRCLoanProductUrl= '/web/rcLoan/list';       
export function getRCLoanProductList(data){
    return Axios({
        url: getRCLoanProductUrl,
        method: 'post',
        data:qs.stringify(data),
        headers:{'Content-Type':'application/x-www-form-urlencoded'}
      })
}

// RupeeClub贷款产品 - 删除 id=""
const removeRCLoanUrl = '/web/rcLoan/remove';
export function removeRCLoan(data){
  return Axios({
      url: removeRCLoanUrl,
      method: 'post',
      data:qs.stringify({id:data}),
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
}

// RupeeClub贷款产品 —— 编辑
const updateRCProductUrl = '/web/rcLoan/edit'
export function updateRCProductList(data){
  return Axios({
      url: updateRCProductUrl,
      method: 'post',
      data:qs.stringify(data),
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
}

// RupeeClub贷款产品 —— 添加
const addRCProductUrl = '/web/rcLoan/add'
export function addRCProductList(data){
  return Axios({
      url: addRCProductUrl,
      method: 'post',
      data:qs.stringify(data),
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
}
//获取征信查询订单list
const creditOrderUrl="/web/rcLoan/order/getOrders"
export function getcreditOrderList(data){
  return Axios({
      url: creditOrderUrl,
      method: 'post',
      data:qs.stringify(data),
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
}
//征信查询订单状态
const OrderStatusUrl="/enum/getOrderStatus"
export function getOrderStatus(){
  return Axios({
      url: OrderStatusUrl,
      method: 'get',
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
}
//RupeeClub ——投放载体
const CarrierStatusUrl="/enum/getCarrierStatus"
export function getCarrierStatus(){
  return Axios({
      url: CarrierStatusUrl,
      method: 'get',
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
}