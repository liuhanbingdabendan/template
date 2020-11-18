import React, { Component } from 'react';
import { Card, Switch, Form, Button, Popconfirm, message } from 'antd';
import '@/assets/css/style';
import BaseForm from '@/components/BaseForm';
import ETable from '@/components/ETable';
// import TextEditor from "@/components/TextEditor";
import ModalBaseForm from '@/components/ModalBaseForm';
import { getLoanProductList, removeDkLoan, exportLoanList, editLoanProductList, addLoanProductList, sendmsg,changeStatus } from '@/service/api';
import Utils from '@/utils/utilsT';

class LoanProduct extends Component {
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
		const params = {
			pageNum: page || 1,
			pageSize: 10,
			isAsc: 'asc',
			...param
		};
		getLoanProductList(params).then(res => {
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
		removeDkLoan(id).then(res => {
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
		removeDkLoan(selectedIds.toString()).then(res => {
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
			mobile = '',
			age = '',
			age_end = '',
			referName = '',
			status = '';
		const exportUrl = '/web/tbUser/export';
		const exportDate = { name, mobile, age, age_end, referName, status };
		exportLoanList(exportUrl, exportDate).then(res => {
			if (res && res.code === 0) {
				message.success('导出成功！');
			}
		});
	};

	// Modal submit
	handleSubmit = data => {
		data.isHot = data.isHot ? 0 : 1;
		data.status = data.status ? 0 : 1;
		if( Object.prototype.toString.apply(data.icon) === '[object Array]') {
			data.icon = data.icon[0].response?data.icon[0].response.data:data.icon[0].url;
		}
		const { selectedIds } = this.state;
		const id = selectedIds && selectedIds[0];
		this.setState({
			loading: true
		});
		if (id) {
			editLoanProductList({ ...data, id }).then(res => {
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
			addLoanProductList({ ...data }).then(res => {
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

	// Modal submitT 推送
	handleSubmitT = data => {
		const { loanId } = this.state;
		// loanId
		this.setState({
			loading: true,
			visibleT: false
		});
		sendmsg({ ...data, loanId }).then(res => {
			if (res.code === 0) {
				message.success('推送成功');
			} else {
				message.error('推送失败');
			}
			this.setState({
				loading: false
			});
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
			selectedIds: [],
			echoList: {}
		});
	};

	submitEditValue = data => {
		//   console.log(data,'data+++')
	};

	// 切换是否热点
	onChangeIsHot = (id, sta) => {
		console.log(id,'id')
		changeStatus('/web/dkLoan/changeIsHot', { isHot: sta ? '0' : '1', id }).then(res => {
			if (res.code === 0) {
				this.initList();
			}
		});
	};

    // 切换状态
	onChangeIsStatus = (id, sta) => {
		changeStatus('/web/dkLoan/changeStatus', { status: sta ? '0' : '1',  id }).then(res => {
			if (res.code === 0) {
				this.initList();
			}
		});
	};

	render() {
		const p = this;
		const { list, loading, params, total, pageNo, selectedRowKeys, selectedIds = [], visible, echoList = {}, visibleT, labelList } = p.state;
		const chalist = [];
		// labelList.forEach(el => {
		// 	chalist.push({ id: el.delFlag, name: el.name });
		// });
		labelList.forEach(el => {
			chalist.push({name: el.name});
		});
		console.log(echoList, 'echoList');
		const formList = [
			{
				label: '产品名称',
				field: 'name',
				placeholder: '请输入产品名称',
				width: 200,
				type: 'INPUT'
			},
			{
				label: '额度',
				field: 'minAmount',
				placeholder: '请输入最低额度',
				width: 200,
				type: 'INPUT'
			},
			{
				label: '-',
				field: 'maxAmount',
				placeholder: '请输入最高额度',
				width: 200,
				type: 'INPUT'
			},
			{
				label: '日利率',
				field: 'dailyRate',
				placeholder: '请输入日利率',
				width: 200,
				type: 'INPUT'
			},
			{
				type: 'SELECT',
				label: '是否热门',
				field: 'status',
				placeholder: '请选择是否热门',
				width: 200,
				list: [
					{ id: '', name: '所有' },
					{ id: '0', name: '是' },
					{ id: '1', name: '否' }
				],
				name: 'name' // 展示的
			},
			{
				type: 'SELECT',
				label: '状态',
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
				title: '产品名称',
				dataIndex: 'name',
				key: 'name',
				render: t => t || '-',
				width: 100,
				fixed: 'left'
			},
			{
				title: '产品图像',
				dataIndex: 'icon',
				key: 'icon',
				width: 100,
				fixed: 'left',
				render: t => (t ? <img src={t} style={{ width: '100%', height: '50px' }} alt="" /> : '-')
			},
			{
				title: '跳转链接',
				dataIndex: 'url',
				key: 'url',
				width: 100,
				render: t => t || '-'
			},
			{
				title: '额度(元)',
				dataIndex: 'ed',
				key: 'ed',
				width: 100,
				render: (t, r) => r.minAmount || 0 + '-' + r.maxAmount || 0
			},
			{
				title: '日利率(%)',
				dataIndex: 'dailyRate',
				key: 'dailyRate',
				width: 100,
				render: t => t || '-'
			},
			{
				title: '申请成功率(%)',
				dataIndex: 'successRate',
				key: 'successRate',
				width: 100,
				render: t => t || '-'
			},
			{
				title: '放款时间(分钟)',
				dataIndex: 'advanceDate',
				key: 'advanceDate',
				width: 100,
				render: t => t || '-'
			},
			{
				title: '最高赔付(元)',
				dataIndex: 'maxCompensate',
				key: 'maxCompensate',
				width: 100,
				render: t => t || '-'
			},
			{
				title: '分期期限(天)',
				dataIndex: 'maxStage',
				key: 'maxStage',
				width: 100,
				render: t => t || '-'
			},
			{
				title: '申请人数',
				dataIndex: 'applyCount',
				key: 'applyCount',
				width: 100,
				render: t => t || '-'
			},
			{
				title: '排序',
				dataIndex: 'orderNum',
				key: 'orderNum',
				width: 50,
				render: t => t || '-'
			},
			{
				title: '是否热门',
				dataIndex: 'isHot',
				key: 'isHot',
				width: 50,
				render: (t, r) => <Switch defaultChecked={t === '0'} onChange={p.onChangeIsHot.bind(p, r.id)} />
			},
			{
				title: '状态',
				dataIndex: 'status',
				key: 'status',
				width: 100,
				render: (t, r) => <Switch defaultChecked={t === '0'} onChange={p.onChangeIsStatus.bind(p, r.id)} />
			},
			{
				title: '创建时间',
				dataIndex: 'createTime',
				key: 'createTime',
				width: 100,
				render: t => t || '-'
			},
			{
				title: '更新时间',
				dataIndex: 'updateTime',
				key: 'updateTime',
				render: t => t || '-',
				width: 100
			},
			{
				title: '操作',
				dataIndex: 'specificationDesc',
				key: 'specificationDesc',
				fixed: 'right',
				width: 100,
				render: (t, r) => (
					<>
						<Button type="primary" size="small" icon="login" onClick={() => this.setState({ visibleT: true, loanId: r.id })} style={{ marginBottom: '15px' }}>
							推送
						</Button>
						<br />
						<Button type="primary" size="small" icon="edit" onClick={() => this.openModal(r)} style={{ marginBottom: '15px' }}>
							编辑
						</Button>
						<br />
						<Popconfirm title="确定删除？" onConfirm={this.handleDelete.bind(this, r.id)}>
							<Button type="primary" size="small" icon="close">
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
				label: '产品名称',
				field: 'name',
				placeholder: '请输入产品名称',
				initialValue: echoList && echoList.name, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '跳转链接',
				field: 'url',
				placeholder: '请输入跳转链接',
				initialValue: echoList && echoList.url, // 初始值
				width: 400
			},
			{
				type: 'TEXTAREA',
				label: '简介',
				field: 'describe',
				placeholder: '请输入简介',
				rules: [{ required: false }],
				initialValue: echoList && echoList.describe, // 初始值
				width: 400
			},
			{
				type: 'Editor',
				label: '产品内容',
				field: 'content',
				placeholder: '请输入产品内容',
				rules: [{ required: false }],
				initialValue: echoList && echoList.content || " ", // 初始值
				submitEditValue: this.submitEditValue.bind(this),
				width: 300
			},
			{
				type: 'INPUT',
				label: '最大额度(元)',
				field: 'maxAmount',
				placeholder: '请输入最大额度(元)',
				initialValue: echoList && echoList.maxAmount, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '最小额度(元)',
				field: 'minAmount',
				placeholder: '请输入最小额度(元)',
				initialValue: echoList && echoList.minAmount, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '日利率(%)',
				field: 'dailyRate',
				placeholder: '请输入日利率(%)',
				initialValue: echoList && echoList.dailyRate, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '申请成功率(%)',
				field: 'successRate',
				placeholder: '请输入申请成功率(%)',
				initialValue: echoList && echoList.successRate, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '放款时间(分钟)',
				field: 'advanceDate',
				placeholder: '请输入放款时间(分钟)',
				initialValue: echoList && echoList.advanceDate, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '最高赔付(元)',
				field: 'maxCompensate',
				placeholder: '请输入最高赔付(元)',
				rules: [{ required: false }],
				initialValue: echoList ? echoList.maxCompensate : 0.0, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '正常赔付(元)',
				field: 'commonCompensate',
				rules: [{ required: false }],
				placeholder: '请输入正常赔付(元)',
				initialValue: echoList && echoList.commonCompensate, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '正常下款奖励(元)',
				field: 'commonReward',
				rules: [{ required: false }],
				placeholder: '请输入正常下款奖励(元)',
				initialValue: echoList && echoList.commonReward, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: 'UV单价(元)',
				field: 'uvPrice',
				rules: [{ required: false }],
				placeholder: '请输入UV单价(元)',
				initialValue: echoList && echoList.uvPrice, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '注册单价(元)',
				field: 'cpaPrice',
				rules: [{ required: false }],
				placeholder: '请输入注册单价(元)',
				initialValue: echoList && echoList.cpaPrice, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '分期期限(天)',
				field: 'maxStage',
				rules: [{ required: false }],
				placeholder: '请输入分期期限(天)',
				initialValue: echoList && echoList.maxStage, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '申请人数',
				field: 'applyCount',
				placeholder: '请输入申请人数',
				rules: [{ required: false }],
				initialValue: echoList && echoList.applyCount, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '申请成功人数',
				field: 'successCount',
				placeholder: '请输入申请成功人数',
				rules: [{ required: false }],
				initialValue: echoList && echoList.successCount, // 初始值
				width: 400
			},
			{
				type: 'SELECTTAG',
				label: '关键提醒',
				field: 'auditTip',
				placeholder: '请输入关键提醒',
				rules: [{ required: false }],
				initialValue: echoList && echoList.auditTip && JSON.parse(echoList.auditTip), // 初始值
				width: 400
			},
			{
				type: 'SELECTTAG',
				label: '审核说明',
				field: 'auditInstruct',
				placeholder: '请输入审核说明',
				rules: [{ required: false }],
				initialValue: echoList && echoList.auditInstruct ? JSON.parse(echoList.auditInstruct) : [], // 初始值
				width: 400
			},
			{
				type: 'SELECTTAG',
				label: '申请条件',
				field: 'aduitRequire',
				placeholder: '请输入申请条件',
				rules: [{ required: false }],
				initialValue: echoList && echoList.aduitRequire && JSON.parse(echoList.aduitRequire), // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '申请流程',
				field: 'auditProcess',
				placeholder: '请输入申请流程',
				rules: [{ required: false }],
				initialValue: echoList && echoList.auditProcess, // 初始值
				width: 400
			},
			// {
			// 	type: 'SELECTTAG',
			// 	label: '标签',
			// 	field: 'delFlag',
			// 	placeholder: '请输入标签',
			// 	list: chalist || [],
			// 	name: 'name',
			// 	initialValue: echoList && echoList.delFlag, // 初始值
			// 	width: 400
			// },
			{
				type: 'SWITCH',
				label: '是否热门',
				field: 'isHot',
				placeholder: '请输入是否热门',
				initialValue: echoList && echoList.isHot, // 初始值
				width: 400
			},
			{
				type: 'SWITCH',
				label: '状态',
				field: 'status',
				placeholder: '请选择状态',
				initialValue: echoList && echoList.status, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '显示顺序',
				field: 'orderNum',
				placeholder: '请选择显示顺序',
				initialValue: echoList && echoList.orderNum, // 初始值
				width: 400
			},
			{
				type: 'UPLOAD',
				label: '产品图标',
				uploadType: 1,
				field: 'icon',
				//echoPic: echoList && echoList.icon && [{ url: echoList && echoList.icon, uid: '-1' }],
				echoPic: [{ url: echoList && echoList.icon, uid: '0' }],
				placeholder: '请上传产品图标'
				// initialValue: echoList&&echoList.icon, // 初始值
			}
		];

		const modalFormListT = [
			{
				type: 'INPUT',
				label: '标题',
				field: 'desc',
				placeholder: '请输入标题',
				width: 400
			},
			{
				type: 'INPUT',
				label: '推送内容',
				field: 'content',
				placeholder: '请输入推送内容',
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
						{/*<Popconfirm
								title="确定导出？"
								onConfirm={this.handleExport.bind(this)}
							>
							<Button type="primary"  icon="download">导出</Button>
						</Popconfirm>*/}
					</div>
					<ETable dataSource={list} columns={columns} rowKey={(_, index) => index} pagination={paginationProps} size="small" loading={loading} rowSelection="checkbox" selectedRowKeys={selectedRowKeys} updateSelectedItem={Utils.updateSelectedItem.bind(this)} scroll={{ x: 1500, y: 500 }} />
					<ModalBaseForm onRef={p.onRef} visible={visible} width={800} modalFormList={modalFormList} submit={p.handleSubmit} close={p.closeModal.bind(this)} title={Object.keys(echoList).length === 0 ? '添加贷款产品' : '编辑贷款产品'} />
					<ModalBaseForm visible={visibleT} width={800} modalFormList={modalFormListT} submit={p.handleSubmitT} close={() => this.setState({ visibleT: false })} title="推送消息" />
				</Card>
				{/**  <TextEditor submitEditValue={this.submitEditValue.bind(this)}/>*/}
			</div>
		);
	}
}

export default Form.create()(LoanProduct);
