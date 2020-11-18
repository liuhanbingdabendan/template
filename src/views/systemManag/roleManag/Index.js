import React, { Component } from 'react';
import { Card, Switch, Form, Button, Popconfirm, message,Divider } from 'antd';
import '@/assets/css/style';
import BaseForm from '@/components/BaseForm';
import ETable from '@/components/ETable';
import ModalBaseForm from '@/components/ModalBaseForm';
import {roleManagList, removeroleManag,changeStatus,addRoleManag,exportLoanList,downloadExcl,editRoleList,menuManagList,seproleMenuTreeData } from '@/service/api';
import Utils from '@/utils/utilsT';

class roleManag extends Component {
	state = {
		list: [],
		loading: false,
		visible: false,
		visible1: false,
		echoList: {},
		visibleT: false,
		loanId: '',
		labelList: [],
		menuListData:[]
	};

    componentDidMount() {
		this.initList();
		this.menuListData()
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
		roleManagList(params).then(res => {
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
		removeroleManag(id).then(res => {
			if (res && res.code === 0) {
				message.success('删除成功！');
				p.initList();
				this.setState({
					selectedRowKeys: []
				});
			} else {
				message.error('批量删除失败！');
			}
			this.setState({
				loading: false
			});
		});
	};

	// 批量删除
	handlePitchDelete = () => {
		const p = this;
		const { selectRoleIds } = this.state;
		console.log(this.state)
		if (!selectRoleIds) return;
		this.setState({
			loading: true
		});
		removeroleManag(selectRoleIds.toString()).then(res => {
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
		const roleName = '',
		    roleKey = '',
			status = '',
			params = {};
		params.beginTime = '';
		params.endTime = '';

		const exportUrl = '/system/role/export';
		const exportDate = { roleName,roleKey, status, params };
		exportLoanList(exportUrl, exportDate).then(res => {
			downloadExcl(res.msg);
		});
	};
     
     // 切换状态
	onChangeIsStatus = (id, sta) => {
		changeStatus('system/role/changeStatus', { status: sta ? '0' : '1',  id }).then(res => {
			if (res.code === 0) {
				this.initList();
			}
		});
	};

	// Modal submit
	handleSubmit = data => {
		data.isHot = data.isHot ? 0 : 1;
		const { selectRoleIds } = this.state;
		const id = selectRoleIds && selectRoleIds[0];
		let menuIdList = sessionStorage.getItem('menuIdList')
		console.log(data)
		console.log(menuIdList)
		data.menuIds = menuIdList ;
		const status = data.status;
		if (status === true) {
			data.status = '0';
		} else {
			data.status = '1';
		}
		this.setState({
			loading: true
		});
		if (id !== undefined) {
			editRoleList({ ...data, id }).then(res => {
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
			addRoleManag({ ...data }).then(res => {
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
		//this.menuListData()
		p.setState(
			{
				visible: true
			},
			() => {
				const { selectedItem = [] } = p.state;
				//selectedItem[0].menuIds = ["1","2","3"]
				var menuIdList= [];
				function getChecked(data) {
					data.forEach((item)=>{
						if(item.ischeck === true){
						   menuIdList.push(item.menuId + "")
						}
						if(item.children.length > 0){
							getChecked(item.children)
						}
					})
					
				}
				seproleMenuTreeData(selectedItem[0].roleId).then(res => {
					getChecked(res);
					selectedItem[0].menuIds = menuIdList;
					//sessionStorage.setItem('menuIdList',menuIdList);
					p.setState({
						// echoList: r ?  r : selectedItem[0]
						echoList: r ? r : selectedItem instanceof Array ? selectedItem[0] : selectedItem[0]
					});
					
				});
			}
		);
	};
	// openModal
	openModal1 = r => {
		const p = this;
		p.setState(
			{
				visible1: true
			},
			() => {
				const { selectedItem = [] } = p.state;
				p.setState({
					// echoList: r ?  r : selectedItem[0]
					echoList: r ? r : selectedItem instanceof Array ? selectedItem[0] : selectedItem
				});
			}
		);
	};

	// close Modal
	closeModal = () => {
		this.setState({
			visible: false,
			selectedRowKeys: [],
			selectedItem: [],
			selectRoleIds: [],
			echoList: {}
		});
	};
	// close Modal
	closeModal1 = () => {
		this.setState({
			visible1: false,
			selectedRowKeys: [],
			selectedItem: [],
			selectRoleIds: [],
			echoList: {}
		});
	};
	menuListData =() =>{
		const p = this;
		menuManagList().then(res => {
			console.log(res)
			const addKey = arr => arr.map((item, index) => ({
				...item,
				key: item.menuId + "",
				title: item.menuName,
				children: addKey(item.children),
			}))
			const result = addKey(res);
			p.setState({
				menuListData: result
			});
		});
	}
	render() {
        const p = this;
		const { list, loading, params, total, pageNo, selectedRowKeys, selectRoleIds = [], visible, visible1,echoList = {},menuListData, visibleT, labelList } = p.state;
		const chalist = [];

		const formList = [
			{
				label: '角色名称',
				field: 'roleName',
				width: 200,
				type: 'INPUT'
			},
			{
				label: '权限字符',
				field: 'roleKey',
				width: 200,
				type: 'INPUT'
			},
			{
				type: 'SELECT',
				label: '角色状态',
				field: 'status',
				placeholder: '请选择状态',
				width: 200,
				list: [
					{ id: '', name: '所有' },
					{ id: '0', name: '正常' },
					{ id: '1', name: '停用' }
				],
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
				title: '角色编号',
				dataIndex: 'roleId',
				key: 'roleId',
                render:t=>t||'-',
                width:200
			},
            {
				title: '角色名称',
				dataIndex: 'roleName',
				key: 'roleName',
                render:t=>t||'-',
                width:200
            },
            {
				title: '权限字符',
				dataIndex: 'roleKey',
				key: 'roleKey',
                render:t=>t||'-',
                width:200
			},
			{
				title: '显示顺序',
				dataIndex: 'roleSort',
				key: 'roleSort',
                render:t=>t||'-',
                width:200
			},
			{
				title: '角色状态',
				dataIndex: 'status',
                key: 'status',
                width:200,
                render: (t, r) => <Switch checked={t === '0'} onChange={p.onChangeIsStatus.bind(p, r.id)} />
			},
			{
				title: '创建时间',
				dataIndex: 'createTime',
                key: 'createTime',
                width:200,
				render:t=>t||'-'
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
						{/* <Button type="primary" size="small" icon="check" style={{ marginRight: '20px', backgroundColor: '#23c6c8', borderColor: '#23c6c8' }} onClick={() => this.openModal1()}>
							数据权限
						</Button> */}
						<Popconfirm title="确定删除？" onConfirm={this.handleDelete.bind(this, r.roleId)}>
							<Button type="primary" size="small" icon="close" style={{ marginRight: '20px', backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}>
								删除
							</Button>
						</Popconfirm>
					</>
				)
			}
		];
		const modalFormList = [
			{
				type: 'INPUT',
				label: '角色名称',
				field: 'roleName',
				placeholder: '请输入名称',
				initialValue: echoList && echoList.roleName, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '权限字符',
				field: 'roleKey',
				initialValue: echoList && echoList.roleKey, // 初始值
				width: 400
			},
			{
				type: 'INPUTNUM',
				label: '显示顺序',
				field: 'roleSort',
				initialValue: echoList && echoList.roleSort, // 初始值
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
				type: 'INPUT',
				label: '备注',
				field: 'remark',
				initialValue: echoList && echoList.remark, // 初始值
				width: 400
			},
			{
				type: 'TREESELECT',
				label: '菜单权限',
				tree:menuListData,
				field: 'menuIds',
				initialValue: echoList && echoList.menuIds, // 初始值
				width: 400
			},
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
						<Button type="primary" disabled={!(selectRoleIds.length === 1)} icon="edit" style={{ marginRight: '20px' }} onClick={() => this.openModal()}>
							编辑
						</Button>
						<Popconfirm title="确定批量删除？" onConfirm={this.handlePitchDelete.bind(this)}>
							<Button type="primary" disabled={selectRoleIds.length === 0} icon="close" style={{ marginRight: '20px' }}>
								删除
							</Button>
						</Popconfirm>
						<Popconfirm title="确定导出？" onConfirm={this.handleExport.bind(this)}>
							<Button type="primary" icon="download">
								导出
							</Button>
						</Popconfirm>
					</div>
                    <ETable dataSource={list} columns={columns} rowKey={(_, index) => index} pagination={paginationProps} size="small" loading={loading} rowSelection="checkbox" selectedRowKeys={selectedRowKeys} updateSelectedItem={Utils.updateSelectedItem.bind(this)} />
					<ModalBaseForm onRef={p.onRef} visible={visible} width={800} modalFormList={modalFormList} submit={p.handleSubmit} close={p.closeModal.bind(this)} title={Object.keys(echoList).length === 0 ? '添加用户' : '修改用户'} />
				</Card>
			</div>
		);
	}
}

export default Form.create()(roleManag);
