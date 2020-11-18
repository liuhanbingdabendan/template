import React, { Component } from 'react';
import { Card, Switch, Form, Button, Popconfirm, message, Tag } from 'antd';
import '@/assets/css/style';
import BaseForm from '@/components/BaseForm';
import TreeTable from '@/components/TreeTable';
import ModalBaseForm from '@/components/ModalBaseForm';
import { menuManagList, removeroleManag, changeStatus } from '@/service/api';
import Utils from '@/utils/utilsT';

class userManag extends Component {
	state = {
		list: [],
		loading: false,
		visible: false,
		echoList: {},
		visibleT: false,
		loanId: '',
		labelList: []
	};

	componentDidMount() {
		this.initList();
	}
	initList = (param, page) => {
		const p = this;
		p.setState({
			loading: true
		});
		menuManagList().then(res => {
			// console.log(res);
			//给tree增加key,如果children没有子类，值变成null
			var sign = 0;
			const addKey = arr => arr.map((item, index) => {
				let obj;
				if (item.children.length > 0) {
					obj = {
						...item,
						key: sign++,
						children: addKey(item.children),
					}
				} else {
					obj = {
						...item,
						key: sign++,
						children: null,
					}
				}
				return obj
			})
			const result = addKey(res);
			console.log(result);
			p.setState({
				list: result,
				loading: false
				// total: res.total
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
		const { selectedIds } = this.state;
		if (!selectedIds) return;
		this.setState({
			loading: true
		});
		removeroleManag(selectedIds.toString()).then(res => {
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

		const exportUrl = '/api/web/dkLoanTag/export';
		const exportDate = { name, status, params };
		// exportLoanList(exportUrl, exportDate)
		//     .then(res => {
		//         downloadExcl(res.msg)
		//     })
	};
	// 切换状态
	onChangeIsStatus = (id, sta) => {
		changeStatus('/system/role/changeStatus', { status: sta ? '0' : '1', id }).then(res => {
			if (res.code === 0) {
				this.initList();
			}
		});
	};
	// openModal
	openModal = r => {
		const p = this;
		p.setState(
			{
				visible: true
			},
			() => {
				const { selectedItem = [] } = p.state;
				p.setState({
					echoList: r ? r : selectedItem instanceof Array ? selectedItem[0] : selectedItem
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
	render() {
		const p = this;
		const { list, loading, params, total, pageNo, selectedRowKeys, selectedIds = [], visible, echoList = {}, visibleT, labelList } = p.state;
		const chalist = [];

		const formList = [
			{
				label: '菜单名称',
				field: 'menuName',
				width: 200,
				type: 'INPUT'
			},
			{
				type: 'SELECT',
				label: '菜单状态',
				field: 'status',
				placeholder: '请选择状态',
				width: 200,
				list: [{ id: '', name: '所有' }, { id: '0', name: '显示' }, { id: '1', name: '隐藏' }],
				name: 'name' // 展示的
			}
		];

		const columns = [
			{
				title: '菜单名称',
				dataIndex: 'menuName',
				key: 'menuName',
				render: t => t || '-',
				width: 300
			},
			{
				title: '排序',
				dataIndex: 'orderNum',
				key: 'orderNum',
				render: t => t || '-',
				width: 100
			},
			{
				title: '请求地址',
				dataIndex: 'url',
				key: 'url',
				render: t => t || '-',
				width: 200
			},
			{
				title: '类型',
				dataIndex: 'menuType',
				key: 'menuType',
				width: 200,
				render: (t, r) => {
					if (t === 'M') {
						return <Tag style={{ backgroundColor: '#1c84c6', color: '#fff' }}>目录</Tag>;
					} else if (t === 'C') {
						return <Tag style={{ backgroundColor: '#1ab394', color: '#fff' }}>菜单</Tag>;
					} else {
						return <Tag style={{ backgroundColor: '#f8ac59', color: '#fff' }}>按钮</Tag>;
					}

				}
			},
			{
				title: '可见',
				dataIndex: 'visible',
				key: 'visible',
				width: 200,
				render: (t, r) => {
					if (t === '0') {
						return <Tag style={{ backgroundColor: '#1ab394', color: '#fff', borderRadius: '35%' }}>显示</Tag>;
					} else {
						return <Tag style={{ backgroundColor: '#ed5565', color: '#fff', borderRadius: '35%' }}>隐藏</Tag>;
					}
				}
			},
			{
				title: '权限标识',
				dataIndex: 'perms',
				key: 'perms',
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
						<Button type="primary" size="small" icon="plus" style={{ marginRight: '20px', backgroundColor: '#23c6c8', borderColor: '#23c6c8' }} onClick={() => this.openModal()}>
							新增
						</Button>
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
				label: '上级菜单',
				field: 'parentName',
				initialValue: echoList && echoList.loginName, // 初始值
				width: 400
			},
			{
				type: 'REDIO',
				label: '菜单类型',
				field: 'dept.menuType',
				list: [{ id: '0', name: '目录' }, { id: '1', name: '菜单' }, { id: '2', name: '按钮' }],
				name: 'name',
				initialValue: echoList && echoList.menuType, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '菜单名称',
				field: 'menuName',
				initialValue: echoList && echoList.menuName, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '请求地址',
				field: 'url',
				initialValue: echoList && echoList.url, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '权限标识',
				field: 'perms',
				rules: [{ required: false }],
				initialValue: echoList && echoList.perms, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '显示排序',
				field: 'orderNum',
				rules: [{ required: false }],
				initialValue: echoList && echoList.orderNum, // 初始值
				width: 400
			},
			{
				type: 'REDIO',
				label: '菜单状态',
				field: 'visible',
				list: [{ id: '0', name: '显示' }, { id: '1', name: '隐藏' }],
				name: 'name',
				initialValue: echoList && echoList.visible, // 初始值
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
							修改
						</Button>
						<Button type="primary" icon="swap" style={{ marginRight: '20px' }} onClick={() => this.setState({ visible: true })}>
							展开/折叠
						</Button>
					</div>
					<TreeTable dataSource={list} columns={columns} rowKey={(_, index) => index} pagination={paginationProps} size="small" loading={loading} rowSelection="radio" selectedRowKeys={selectedRowKeys} updateSelectedItem={Utils.updateSelectedItem.bind(this)} />
					<ModalBaseForm onRef={p.onRef} visible={visible} width={800} modalFormList={modalFormList} submit={p.handleSubmit} close={p.closeModal.bind(this)} title={Object.keys(echoList).length === 0 ? '添加用户' : '修改用户'} />
				</Card>
			</div>
		);
	}
}

export default Form.create()(userManag);
