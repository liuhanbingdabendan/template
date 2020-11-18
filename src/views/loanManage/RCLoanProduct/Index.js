import React, { Component } from 'react';
import { Card, Switch, Form, Button, Popconfirm, message } from 'antd';
import '@/assets/css/style';
import BaseForm from '@/components/BaseForm';
import ETable from '@/components/ETable';
// import TextEditor from "@/components/TextEditor";
import ModalBaseForm from '@/components/ModalBaseForm';
import { getRCLoanProductList, updateRCProductList, addRCProductList, removeRCLoan,changeStatus,getCarrierStatus } from '@/service/api';
import Utils from '@/utils/utilsT';

let carrierName = '';
const tagName = {"0":"100% Online","1":"High Approve Rat", "2":"Quick"};
const taglist = [];
let carrierlist = [];
for(let key in tagName){
	taglist.push({id:key, name:tagName[key]});
}

class RCLoanProduct extends Component {
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
		// this.getRCLoanProductList();
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
		getRCLoanProductList(params).then(res => {
			p.setState({
				list: res.rows || [],
				loading: false,
				total: res.total
			});
		});
		getCarrierStatus().then(res => {
			// return
			console.log(res)
			carrierName = res.data
			carrierlist = [];
			for(let key in carrierName){
				carrierlist.push({id:carrierName[key], name:key});
			}
			console.log(carrierlist)			
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
		removeRCLoan(id).then(res => {
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
		removeRCLoan(selectedIds.toString()).then(res => {
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

	// Modal submit
	handleSubmit = data => {
		console.log(data);

		data.isHot = data.isHot ? 0 : 1;
		data.status = data.status ? 0 : 1;

		for(let key in tagName){
			if(tagName[key]===data.tag)data.tag=key;
		}
		for(let key in carrierName){
			if(carrierName[key]===data.carrier)data.carrier=key;
		}

		if( Object.prototype.toString.apply(data.icon) === '[object Array]') {
			data.icon = data.icon[0].response?data.icon[0].response.data:data.icon[0].url;
		}

		console.log(data);
		let total = 0;
		data.carrier.forEach((item) =>{
			total += parseInt(item)
		})
		console.log(total)
		data.carrier = total
		const { selectedIds } = this.state;
		const id = selectedIds && selectedIds[0];
		this.setState({
			loading: true
		});
		console.log(id)
		console.log(data);
		if (id) {
			updateRCProductList({ ...data, id }).then(res => {
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
			addRCProductList({ ...data }).then(res => {
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
		//getCarrierStatus
		
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
		changeStatus('/web/rcLoan/changeIsHot', { isHot: sta ? '0' : '1', id }).then(res => {
			if (res.code === 0) {
				this.initList();
			}
		});
	};

    // 切换状态
	onChangeIsStatus = (id, sta) => {
		changeStatus('/web/rcLoan/changeStatus', { status: sta ? '0' : '1',  id }).then(res => {
			if (res.code === 0) {
				this.initList();
			}
		});
	};
	 // 切换状态
	 onChangeStrId = (params) => {
		console.info('///////////////////////9999999')
	};


	render() {
		const p = this;
		const { list, loading, params, total, pageNo, selectedRowKeys, selectedIds = [], visible, echoList = {}, visibleT, labelList } = p.state;
		const chalist = [];

		console.log(echoList, 'echoList');
		console.log(carrierlist, 'carrierlist');
		console.log(taglist, 'taglist');
		const formList = [
			{
				type: 'SELECT',
				label: '是否热门',
				field: 'isHot',
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
			}
		];

		const columns = [
			{
				title: '贷款名称',
				dataIndex: 'name',
				key: 'name',
				render: t => t || '-',
				width: 100,
				fixed: 'left'
			},
			{
				title: 'logo',
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
				title: '额度(₹)',
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
				render: (t, r) => r.minDailyRate || 0 + '-' + r.maxDailyRate || 0
			},
			{
				title: '标签',
				dataIndex: 'tag',
				key: 'tag',
				width: 100,
				render: t => t?tagName[t]: '-'
            },
            {
				title: '投放载体',
				dataIndex: 'carrierStr',
				key: 'carrierStr',
				width: 100,
				render: (t, r) => t?r.carrierStr.join() : '-',
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
				render: (t, r) => <Switch checked={t === '0'} onChange={p.onChangeIsHot.bind(p, r.id)} />
			},
			{
				title: '状态',
				dataIndex: 'status',
				key: 'status',
				width: 100,
				render: (t, r) => <Switch checked={t === '0'} onChange={p.onChangeIsStatus.bind(p, r.id)} />
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
				label: '贷款名称',
				field: 'name',
				placeholder: '请输入贷款名称',
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
				field: 'description',
				placeholder: '请输入简介',
				rules: [{ required: false }],
				initialValue: echoList && echoList.description, // 初始值
				width: 400
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
				label: '最大日利率(%)',
				field: 'maxDailyRate',
				placeholder: '请输入最大日利率(%)',
				initialValue: echoList && echoList.minDailyRate, // 初始值
				width: 400
			},
			{
				type: 'INPUT',
				label: '最小日利率(%)',
				field: 'minDailyRate',
				placeholder: '请输入最小日利率(%)',
				initialValue: echoList && echoList.maxDailyRate, // 初始值
				width: 400
			},
			{
				type: 'SELECT',
				label: '标签',
				field: 'tag',
				placeholder: '请输入标签',
				list: taglist || [],
				name: 'name',
				initialValue: echoList && tagName[echoList.tag], // 初始值
				width: 400
			},
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
				type: 'SELECTMULTIPLE',
				label: '投放载体',
				field: 'carrier',
				placeholder: '请选择投放载体',
				list: carrierlist || [],
				name: 'name',
				// initialValue: echoList && listData[echoList.carrier], // 初始值
				// initialValue: echoList && echoList.carrierStr, // 初始值
				initialValue: echoList && carrierlist[echoList.carrier], // 初始值
				width: 400
			},
			{
				type: 'UPLOAD',
				label: '产品图标',
				uploadType: 1,
				field: 'icon',
				echoPic: [{ url: echoList && echoList.icon, uid: '0' }],
				// rules: [{ required: false }],
				placeholder: '请上传产品图标'
				// initialValue: echoList&&echoList.icon, // 初始值
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
					</div>
					<ETable dataSource={list} columns={columns} rowKey={(_, index) => index} pagination={paginationProps} size="small" loading={loading} rowSelection="checkbox" selectedRowKeys={selectedRowKeys} updateSelectedItem={Utils.updateSelectedItem.bind(this)} scroll={{ x: 1500, y: 500 }} />
					<ModalBaseForm onRef={p.onRef} visible={visible} width={800} modalFormList={modalFormList} submit={p.handleSubmit} close={p.closeModal.bind(this)} title={Object.keys(echoList).length === 0 ? '添加贷款产品' : '编辑贷款产品'} />
				
				</Card>
				{/**  <TextEditor submitEditValue={this.submitEditValue.bind(this)}/>*/}
			</div>
		);
	}
}

export default Form.create()(RCLoanProduct);
