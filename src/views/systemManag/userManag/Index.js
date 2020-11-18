import React, { Component } from 'react';
import { Card, Switch, Form, Button, Popconfirm, message, Divider } from 'antd';
import '@/assets/css/style';
import BaseForm from '@/components/BaseForm';
import ETable from '@/components/ETable';
import ModalBaseForm from '@/components/ModalBaseForm';
import ModalUpload from '@/components/ModalUpload';
import { userManagList, addUserManag, removeUserManag, editUserList, exportLoanList,exportMB, downloadExcl, changeStatus, resetPwdUserManag,importDataUserManag,newEditUserManag} from '@/service/api';
import Utils from '@/utils/utilsT';
class userManag extends Component {
	state = {
		list: [],
		loading: false,
		loading1: false,
		visible: false,
		visible1: false,
		visibleUpload: false,
		echoList: {},
		visibleT: false,
		loanId: '',
		labelList: [],
		SwitchSign: '',
		postArr:[],
		roleArr:[]
	};

	componentDidMount() {
		this.initList();
	}

	initList = (param, page) => {
		const p = this;
		p.setState({
			loading: true
		});
		const params = {
			pageNum: page || 1,
			pageSize: 10,
			isAsc: 'asc',
			...param
		};
		userManagList(params).then(res => {
			console.log(res);
			p.setState({
				list: res.rows || [],
				loading: false,
				total: res.total
			});
		});
	};

	// 搜索
	searchResult = (params, page) => {
		const p = this;
		p.setState({
			params,
			pageNo: page
		});
		this.initList(params, page);
	};
	// 删除
	handleDelete = id => {
		const p = this;
		this.setState({
			loading: true
		});
		//console.log(id)
		const params = {
			ids: id
		};
		removeUserManag(params).then(res => {
			if (res && res.code === 0) {
				message.success('删除成功！');
				p.initList();
				this.setState({
					selectedRowKeys: []
				});
			} else {
				message.error('删除失败！');
			}
			this.setState({
				loading: false
			});
		});
	};

	// 批量删除
	handlePitchDelete = () => {
		const p = this;
		const { selectedUserIds } = this.state;
		console.log(this.state);
		console.log(selectedUserIds);
		if (!selectedUserIds) return;
		this.setState({
			loading: true
		});
		const params = {
			ids: selectedUserIds.toString()
		};
		removeUserManag(params).then(res => {
			// return
			if (res && res.code === 0) {
				message.success('批量删除成功！');
				this.setState({
					selectedRowKeys: []
				});
				p.initList();
			} else {
				message.error('批量删除失败！');
			}
			this.setState({
				loading: false
			});
		});
	};
	// 导出
	handleExport = () => {
		const name = '',
			status = '',
			params = {};
		params.beginTime = '';
		params.endTime = '';

		const exportUrl = '/system/user/export';
		const exportDate = { name, status, params };
		exportLoanList(exportUrl, exportDate).then(res => {
			downloadExcl(res.msg);
		});
	};
	// 下载模板
	downloadExport = () => {
		const exportUrl = '/system/user/importTemplate';
		exportMB(exportUrl).then(res => {
			downloadExcl(res.msg);
		});
	};
	// 切换状态
	onChangeIsStatus = (id, sta) => {
		console.log(id);
		console.log(sta);
		this.setState({
			loading: true
		});
		changeStatus('/system/user/changeStatus', { status: sta ? '0' : '1', userId: id }).then(res => {
			if (res.code === 0) {
				this.initList();
			}
		});
	};
	// Modal submit
	handleSubmit = data => {
		const { selectedUserIds } = this.state;
		const userId = selectedUserIds && selectedUserIds[0];
		const status = data.status;
		console.log(this.state);
		console.log(userId);
		if (status === true) {
			data.status = '0';
		} else {
			data.status = '1';
		}
		data.roleIds = data.roleIds.join(',');
		data.deptId = this.state.echoList.deptId;
		console.log(data);
		// this.setState({
		//    loading:true
		// })
		if (userId) {
			editUserList({ ...data, userId }).then(res => {
				if (res && res.code === 0) {
					message.success('编辑成功');
					this.initList();
				} else {
					message.error('编辑失败');
				}
				this.setState({
					loading: false
				});
			});
		} else {
			console.log(data);
			addUserManag({ ...data }).then(res => {
				if (res && res.code === 0) {
					message.success('新增成功');
					this.initList();
				} else {
					message.error('新增失败');
				}
				this.setState({
					loading: false
				});
			});
		}
		this.closeModal();
	};
	// openModal
	openModal = r => {
		const p = this;
		p.setState(
			{
				visible: true,
				loading1: true
			},
			() => {
				const { selectedItem = [] } = p.state;
				
				newEditUserManag(selectedItem[0].userId).then(res => {
					console.log(res)
					let roleIds =[];
				let postIds = [];
				let roleList = [];
				let postList = [];
					res.posts.forEach((item,index) =>{
						if(item.flag === true){
							postIds.push(item.postId)
						}
						let obj = {
							name:item.postName,
							id:item.postId
						}
						postList.push(obj)
					})
					res.roles.forEach((item,index) =>{
						if(item.flag === true){
							roleIds.push(item.roleId)
						}
						let obj = {
							name:item.roleName,
							id:item.roleId,
							key:item.roleId
						}
						roleList.push(obj)
					})
				p.setState({
					echoList: r ? r : selectedItem instanceof Array ? selectedItem[0] : selectedItem,
					postArr:postList,
					roleArr:roleList,
					loading1:false
				});
				});
				
			}
		);
	};
	// close Modal
	closeModal = () => {
		//  const p = this;
		this.setState({
			visible: false,
			selectedRowKeys: [],
			selectedItem: [],
			selectedIds: [],
			echoList: {}
		});
	};
	// openModal1
	openModal1 = r => {
		const p = this;
		p.setState(
			{
				visible1: true
			},
			() => {
				const { selectedItem = [] } = p.state;
				p.setState({
					echoList: r ? r : selectedItem instanceof Array ? selectedItem[0] : selectedItem
				});
			}
		);
	};
	// close Modal1
	closeModal1 = () => {
		//  const p = this;
		this.setState({
			visible1: false
		});
	};
	// Modal1 submit
	handleSubmit1 = data => {
		const { selectedUserIds } = this.state;
		const userId = selectedUserIds && selectedUserIds[0];
		console.log(this.state);
		console.log(data);
		this.setState({
			loading: true
		});
		if (userId) {
			resetPwdUserManag({ ...data, userId }).then(res => {
				if (res && res.code === 0) {
					message.success('重置成功');
					this.initList();
				} else {
					message.error('重置失败');
				}
				this.setState({
					loading: false
				});
			});
		}
		this.closeModal1();
	};
	// 关闭上传
	closeUpload = () => {
		//  const p = this;
		this.setState({
			visibleUpload: false
		});
	};
	// 提交上传
	uploadSubmit = data => {
		console.log('222')
		console.log(data)
		var formData = new FormData();
                formData.append('updateSupport', data.updateSupport);
                formData.append('file', data.uploadFile);
		importDataUserManag(formData).then(res => {
			if (res && res.code === 0) {
				message.success('上传成功');
				this.initList();
			} else {
				message.error(res.msg);
			}
		});
		this.closeUpload();
	};
	render() {
		const p = this;
		const { list, loading,loading1, params, total, pageNo, selectedRowKeys, selectedIds = [], visible, visible1, visibleUpload, echoList = {},postArr,roleArr, visibleT, labelList } = p.state;
		const chalist = [];

		const formList = [
			{
				label: '登录名称',
				field: 'loginName',
				width: 200,
				type: 'INPUT'
			},
			{
				label: '手机号码',
				field: 'phoneNumber',
				width: 200,
				type: 'INPUT'
			},
			{
				type: 'SELECT',
				label: '用户状态',
				field: 'status',
				placeholder: '请选择状态',
				width: 200,
				list: [{ id: '', name: '所有' }, { id: '0', name: '正常' }, { id: '1', name: '停用' }],
				name: 'name' // 展示的
			},
			{
				type: 'time',
				width: 135,
				label: '创建时间',
				field: ['startDateStart', 'startDateEnd']
			}
		];

		const columns = [
			{
				title: '用户ID',
				dataIndex: 'userId',
				key: 'userId',
				render: t => t || '-',
				width: 200
			},
			{
				title: '登录名称',
				dataIndex: 'loginName',
				key: 'loginName',
				render: t => t || '-',
				width: 200
			},
			{
				title: '用户名称',
				dataIndex: 'userName',
				key: 'userName',
				render: t => t || '-',
				width: 200
			},
			{
				title: '部门',
				dataIndex: 'deptName',
				key: 'deptName',
				render: t => t || '-',
				width: 200
			},
			{
				title: '手机',
				dataIndex: 'phonenumber',
				key: 'phonenumber',
				render: t => t || '-',
				width: 200
			},
			{
				title: '用户状态',
				dataIndex: 'status',
				key: 'status',
				width: 200,
				// render: (t, r) => <Switch defaultChecked={t === '0'} onChange={p.onChangeIsStatus.bind(p, r.userId)} />,
				render: (t, r) => (
					<>
						<Switch defaultChecked={t === '0'} onChange={p.onChangeIsStatus.bind(p, r.userId)}></Switch>
						{/* <Popconfirm title={t === '0' ? '确定要关闭用户？' : '确定要启动用户？'} onConfirm={p.onChangeIsStatus.bind(p, r.userId)}>
							<Switch defaultChecked={t === '0'}></Switch>
						</Popconfirm> */}
					</>
				)
			},
			{
				title: '创建时间',
				dataIndex: 'createTime',
				key: 'createTime',
				width: 200,
				render: t => t || '-'
			},
			{
				title: '操作',
				dataIndex: 'specificationDesc',
				key: 'specificationDesc',
				width: 400,
				render: (t, r) => (
					<>
						<Button type="primary" size="small" icon="edit" style={{ marginRight: '20px' }} onClick={() => this.openModal()}>
							编辑
						</Button>
						<Popconfirm title="确定删除？" onConfirm={this.handleDelete.bind(this, r.userId)}>
							<Button type="primary" size="small" icon="close" style={{ marginRight: '20px', backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}>
								删除
							</Button>
						</Popconfirm>
						<Button type="primary" size="small" icon="key" style={{ marginRight: '20px', backgroundColor: '#23c6c8', borderColor: '#23c6c8' }} onClick={() => this.openModal1()}>
							重置
						</Button>
					</>
				)
			}
		];
		const modalFormList = [
			{
				type: 'INPUT',
				label: '登录名称',
				field: 'loginName',
				placeholder: '请输入名称',
				initialValue: echoList && echoList.loginName, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '部门名称',
				disabled: true,
				field: 'deptName',
				initialValue: echoList && echoList.deptName, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '用户名称',
				field: 'userName',
				initialValue: echoList && echoList.userName, // 初始值
				width: 400
			},
			{
				type: 'PASSWORD',
				label: '密码',
				field: 'password',
				initialValue: echoList && echoList.password, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '邮箱',
				field: 'email',
				rules: [{ required: false }],
				initialValue: echoList && echoList.email, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '手机',
				field: 'phonenumber',
				rules: [{ required: false }],
				initialValue: echoList && echoList.phonenumber, // 初始值
				width: 400
			},
			{
				type: 'SELECT',
				label: '性别',
				field: 'sex',
				placeholder: '请输入性别',
				list: [{ id: '0', name: '男' }, { id: '1', name: '女' }, { id: '2', name: '未知' }],
				name: 'name',
				initialValue: echoList && echoList.sex, // 初始值, // 初始值
				width: 400
			},
			{
				type: 'SWITCH',
				label: '状态',
				field: 'status',
				initialValue: echoList && echoList.status, // 初始值
				width: 400
			},
			{
				type: 'SELECT',
				label: '岗位',
				field: 'postIds',
				placeholder: '请输入岗位',
				list: postArr,
				name: 'name',
				initialValue: echoList && echoList.postIds, // 初始值
				width: 400
			},
			{
				type: 'CHECKBOXGROUP',
				label: '角色',
				field: 'roleIds',
				list: roleArr,
				name: 'name',
				initialValue: echoList && echoList.roleIds, // 初始值
				width: 400
			}
		];
		const modalFormList1 = [
			{
				type: 'INPUT',
				label: '登录名称',
				field: 'loginName',
				disabled: true,
				placeholder: '请输入名称',
				initialValue: echoList && echoList.loginName, // 初始值
				width: 400
			},
			{
				type: 'PASSWORD',
				label: '密码',
				field: 'password',
				initialValue: '123456', // 初始值
				width: 400
			}
		];
		// 分页
		const paginationProps = {
			total,
			defaultPageSize: 10,
			pageSize: 10,
			current: pageNo || 1,
			onChange(pageIndex) {
				p.searchResult(params, pageIndex);
			}
		};

		return (
			<div>
				<Card bordered={false}>
					<BaseForm formList={formList} filterSubmit={this.searchResult} />
				</Card>
				<br />
				<Card>
					<div style={{ display: 'flex', marginBottom: '20px' }}>
						<Button type="primary" icon="plus" style={{ marginRight: '20px' }} onClick={() => this.setState({ visible: true })}>
							添加
						</Button>
						<Button type="primary" disabled={!(selectedIds.length === 1)} icon="edit" style={{ marginRight: '20px' }} onClick={() => this.openModal()}>
							编辑
						</Button>
						<Popconfirm title="确定批量删除？" onConfirm={this.handlePitchDelete.bind(this)}>
							<Button type="primary" disabled={selectedIds.length === 0} icon="close" style={{ marginRight: '20px' }}>
								删除
							</Button>
						</Popconfirm>
						<Button type="primary" icon="upload" style={{ marginRight: '20px' }} onClick={() => this.setState({ visibleUpload: true })}>
							导入
						</Button>
						<Popconfirm title="确定导出？" onConfirm={this.handleExport.bind(this)}>
							<Button type="primary" icon="download">
								导出
							</Button>
						</Popconfirm>
					</div>
					<ETable dataSource={list} columns={columns} rowKey={(_, index) => index} pagination={paginationProps} size="small" loading={loading} rowSelection="checkbox" selectedRowKeys={selectedRowKeys} updateSelectedItem={Utils.updateSelectedItem.bind(this)} />
					<ModalBaseForm onRef={p.onRef} visible={visible} width={800} modalFormList={modalFormList} submit={p.handleSubmit} loading={loading1}  close={p.closeModal.bind(this)} title={Object.keys(echoList).length === 0 ? '添加用户' : '修改用户'} />
					<ModalBaseForm visible={visible1} width={800} modalFormList={modalFormList1} submit={p.handleSubmit1} close={p.closeModal1.bind(this)} title={'重置密码'} />
					<ModalUpload visible={visibleUpload} width={500} submit={p.uploadSubmit} close={p.closeUpload.bind(this)} title={'导入用户数据'} downloadExport={this.downloadExport}></ModalUpload>
				</Card>
			</div>
		);
	}
}

export default Form.create()(userManag);
