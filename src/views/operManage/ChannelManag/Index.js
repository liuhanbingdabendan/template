import React, { Component } from 'react';
import {  Card, Switch,Form,  Button,Badge,Popconfirm, message, Divider} from 'antd';
import '@/assets/css/style';
import BaseForm from '@/components/BaseForm';
import ETable from '@/components/ETable';
import ModalBaseForm from '@/components/ModalBaseForm';
import { channelManagList,exportLoanList,downloadExcl,changeStatus,editChannelList,addChannelList,removeChannMag} from '@/service/api';
import Utils from '@/utils/utilsT';

class channelManag extends Component {
	state = {
		list: [],
		loading:false,
		visible:false,
		echoList:{}
	};
    componentDidMount() {
		this.initList();
	
	}

	initList = (param,page) => {
		const p = this;
		p.setState({
			loading:true
		})
		const params = {
			pageNum: page||1,
			pageSize: 10,
			isAsc: 'asc',
			...param
		};
		channelManagList(params).then(res => {
			p.setState({
				list: res.rows || [],
				loading:false,
				total:res.total
			});
		});
	};

	// 搜索
	searchResult = (params, page) => {
		const p = this;
		p.setState({
			params,
			pageNo:page
		});
		this.initList(params, page);
	};

	// 删除
	handleDelete=(id)=>{
		const p =this;
		this.setState({
			loading:true
		 })
		 removeChannMag(id).then(res=>{
			if(res&&res.code===0){
				message.success('删除成功！')
				p.initList()
				this.setState({
					selectedRowKeys:[]
				})
			}else{
				message.error('批量删除失败！')
			}
			this.setState({
				loading:false
			 })
		})
	 }

	 // 批量删除
	 handlePitchDelete=()=>{
		 const p = this;
		 const {selectedIds} = this.state;
		 if(!selectedIds)return
		 this.setState({
			loading:true
		 })
		 removeChannMag(selectedIds.toString()).then(res=>{
			// return 
			if(res&&res.code===0){
				message.success('批量删除成功！')
				this.setState({
					selectedRowKeys:[]
				})
				p.initList()
			}else{
				message.error('批量删除失败！')
			}
			this.setState({
				loading:false
			 })
		})
	 }

	 // 导出
	 handleExport=()=>{
		const name='',
	          status='',
			  params= {}
			  params.beginTime = ""
			  params.endTime = ""
			  
			  const exportUrl ='/api/web/dkLoanTag/export'
			  const exportDate = {name,status,params} ;
			  exportLoanList(exportUrl,exportDate)
			  .then(res=>{
				 downloadExcl(res.msg)
			  })
	 }

	 // Modal submit
	 handleSubmit=(data)=>{
		 const {selectedIds} = this.state;
		 const id = selectedIds&&selectedIds[0];
		 this.setState({
			loading:true
		 })
		 if(id){
			editChannelList({...data,id}).then(res=>{
				 if(res&&res.code===0){
					 message.success('编辑成功')
					 this.initList()
				 }else{
					message.error('编辑失败')
				 }
				 this.setState({
					loading:false
				 })
			 })
		 }else{
			addChannelList({...data}).then(res=>{
				if(res&&res.code===0){
					message.success('新增成功')
					this.initList()
				}else{
				   message.error('新增失败')
				}
				this.setState({
					loading:false
				 })
			})
		 }
		 this.closeModal()
	 }

    // openModal
	 openModal=(r)=>{
		 const p = this
         p.setState({
			visible:true,
		 },()=>{
			 const {selectedItem=[]} = p.state;
			 p.setState({
				echoList: r ?  r : selectedItem instanceof Array? selectedItem[0]:selectedItem
			 })
		 })
	 }

	 // close Modal
	 closeModal = () => {
		//  const p = this;
		this.setState({
		  visible: false,
		  selectedRowKeys:[],
		  selectedItem:[],
		  selectedIds:[],
		  echoList:{}
		});
	  };
	  // 切换是否开启扣量
	onChangeIsDedu = (id, sta) => {
		console.log(id,'id')
		changeStatus('/api/web/dkLoan/changeIsDedu', { isDeduction: sta ? '0' : '1', id }).then(res => {
			if (res.code === 0) {
				this.initList();
			}
		});
	};
	  // 切换状态
	  onChangeStatus=(id,sta)=>{
		changeStatus('/api/web/dkChannel/changeStatus',{status:sta?'0':'1',id}).then(res=>{
			if(res.code===0){
				this.initList()
			}
		})
	  }
		
	render() {
		const p = this;
		const { list ,loading , params , total , pageNo, selectedRowKeys,selectedIds=[],visible,echoList={}} = p.state;
		const formList = [
			{
				label: '渠道名称',
				field: 'name',
				width: 200,
				type: 'INPUT'
			},{
				label: '后台登录账户',
				field: 'systemUserName',
				width: 200,
				type: 'INPUT'
            },
            {
				type: 'SELECT',
				label: '开启扣量',
				field: 'staisDeductiontus',
				width: 200,
				list: [{ id: '', name: '所有' },{ id: 0, name: '是' },{ id: 1 , name: '否' }],
				name: 'name', // 展示的
			  },
			  {
				type: 'SELECT',
				label: '状态',
				field: 'status',
				placeholder: '请选择状态',
				width: 200,
				list: [{ id: '', name: '所有' },{ id: 0, name: '正常' },{ id: 1 , name: '停用' }],
				name: 'name', // 展示的
              },
              {
				label: '渠道电话',
				field: 'mobile',
				width: 200,
				type: 'INPUT'
            },
            {
				label: '注册数量',
				field: 'startCpa',
				placeholder: '请输入最小范围',
				width: 200,
				type: 'INPUT'
			},
			{
				label: '-',
				field: 'endCpa',
				placeholder: '请输入最大范围',
				width: 200,
				type: 'INPUT'
            },
            {
				label: 'uv数量',
				field: 'startUv',
				placeholder: '请输入最小范围',
				width: 200,
				type: 'INPUT'
			},
			{
				label: '-',
				field: 'endUv',
				placeholder: '请输入最大范围',
				width: 200,
				type: 'INPUT'
			},
			  {
				type: 'time',
				width: 135,
				label: '创建时间',
				field: ['startDateStart', 'startDateEnd'],
			  },
		];

		const columns = [
			{
				title: '渠道名称',
				dataIndex: 'name',
				key: 'name',
				render:t=>t||'-'
            },
            {
				title: '后台登录账号',
				dataIndex: 'systemUserName',
				key: 'systemUserName',
				render:t=>t||'-'
            },
            {
				title: '渠道电话',
				dataIndex: 'mobile',
				key: 'mobile',
				render:t=>t||'-'
            },
            {
				title: '跳转链接',
				dataIndex: 'url',
				key: 'url',
				width: 100,
				render: t => t || '-'
            },
            {
				title: '注册数量',
				dataIndex: 'cpa',
				key: 'cpa',
				render:t=>t||'-'
            },
            {
				title: '注册单价(元)',
				dataIndex: 'cpaPrice',
				key: 'cpaPrice',
				render:t=>t||'-'
            },
            {
				title: 'uv数量',
				dataIndex: 'uv',
				key: 'uv',
				render:t=>t||'-'
            },
            {
				title: 'uv单价(元)',
				dataIndex: 'uvPrice',
				key: 'uvPrice',
				render:t=>t||'-'
            },
            {
				title: '开启扣量',
				dataIndex: 'isDeduction',
				key: 'isDeduction',
				width: 100,
				render: (t, r) => <Switch defaultChecked={t === '0'} onChange={p.onChangeIsDedu.bind(p, r.id)} />
            },
            {
				title: '扣量比例(%)',
				dataIndex: 'deductionRate',
				key: 'deductionRate',
				render:t=>t||'-'
			},
			{
				title: '状态',
				dataIndex: 'status',
				key: 'status',
				render:(t,r)=><Switch defaultChecked={t==='0'} onChange={this.onChangeStatus.bind(this,r.id)}/>
			},
			{
				title: '创建时间',
				dataIndex: 'createTime',
				key: 'createTime',
				render:t=>t||'-'
			},
			{
				title: '操作',
				dataIndex: 'specificationDesc',
                key: 'specificationDesc',
				render:(t,r)=>(
					<>
					<Button type="primary" size="small"  icon="edit" onClick={()=>this.openModal(r)} style={{ marginLeft: '20px',marginBottom: '10px' }}>编辑</Button>
					<Divider type="vertical"/>
					<Popconfirm
							title="确定删除？"
							onConfirm={this.handleDelete.bind(this, r.id)}
						>
					     <Button type="primary" size="small" icon="close" style={{ marginBottom: '10px' }}>删除</Button>
					</Popconfirm>
					</>
				)
			}
		];

		 const modalFormList = [
		 	{
				type: 'INPUT',
		 		label: '渠道名称',
		 		field: 'name',
		 		placeholder: '请输入名称',
		 		initialValue: echoList&&echoList.name, // 初始值
		 		width: 400
             },
             {
				type: 'INPUT',
		 		label: '后台登录账号',
		 		field: 'systemUserName',
		 		initialValue: echoList&&echoList.systemUserName, // 初始值
		 		width: 400
             },
             {
				type: 'INPUT',
		 		label: '渠道电话',
		 		field: 'mobile',
		 		initialValue: echoList&&echoList.mobile, // 初始值
		 		width: 400
             },
             {
				type: 'INPUT',
				label: '第三方推广链接',
				field: 'url',
				initialValue: echoList && echoList.url, // 初始值
				width: 400
            },
            {
				type: 'INPUT',
				label: '注册数量',
				field: 'cpa',
				rules: [{ required: false }],
				initialValue: echoList && echoList.cpa, // 初始值
				width: 400
            },
            {
				type: 'INPUT',
				label: '注册单价',
				field: 'cpaPrice',
				rules: [{ required: false }],
				initialValue: echoList && echoList.cpaPrice, // 初始值
				width: 400
            },
            {
				type: 'INPUT',
				label: 'UV',
				field: 'uv',
				rules: [{ required: false }],
				placeholder: '请输入UV单价(元)',
				initialValue: echoList && echoList.uv, // 初始值
				width: 400
            },
            {
				type: 'INPUT',
				label: 'UV单价',
				field: 'uvPrice',
				rules: [{ required: false }],
				initialValue: echoList && echoList.uvPrice, // 初始值
				width: 400
            },
            {
				type: 'SWITCH',
				label: '开启扣量',
				field: 'isDeduction',
				placeholder: '请输入是否热门',
				initialValue: echoList && echoList.isDeduction, // 初始值
				width: 400
            },
            {
				type: 'INPUT',
				label: '扣量比例',
				field: 'deductionRate',
				initialValue: echoList && echoList.deductionRate, // 初始值
				width: 400
            },
            {
				type: 'INPUT',
				label: '显示顺序',
				field: 'orderNum',
				initialValue: echoList && echoList.orderNum, // 初始值
				width: 400
			},
            {
				type: 'SWITCH',
				label: '渠道状态',
				field: 'status',
				placeholder: '请选择状态',
				initialValue: echoList && echoList.status, // 初始值
				width: 400
            },
            {
				type: 'INPUT',
				label: '备注',
				field: 'remark',
				initialValue: echoList && echoList.orderNum, // 初始值
				width: 400
			}
            
		]

        // 分页
		const paginationProps = {
			total,
			defaultPageSize: 10,
			pageSize:10,
			current: pageNo || 1,
			onChange(pageIndex) {
			  p.searchResult(params, pageIndex);
			},
		  };

		return (
			<div>
				<Card bordered={false}>
					<BaseForm formList={formList} filterSubmit={this.searchResult} />
				</Card>
				<br/>
				<Card>
					 <div style={{display:'flex',marginBottom:'20px'}}>
					<Button type="primary" icon="plus" style={{marginRight:'20px'}} onClick={()=>this.setState({visible:true})}>添加</Button>
					<Button type="primary" disabled={!(selectedIds.length===1)}  icon="edit" style={{marginRight:'20px'}} onClick={()=>this.openModal()}>编辑</Button>
						<Popconfirm
								title="确定批量删除？"
								onConfirm={this.handlePitchDelete.bind(this)}
							>
							<Button type="primary" disabled={selectedIds.length===0}  icon="close" style={{marginRight:'20px'}}>删除</Button>
						</Popconfirm>
						<Popconfirm
								title="确定导出？"
								onConfirm={this.handleExport.bind(this)}
							>
							<Button type="primary"  icon="download">导出</Button>
						</Popconfirm>
					</div>
					<ETable
						dataSource={list}
						columns={columns}
						rowKey={(_, index) => index}
						pagination={paginationProps}
						size="small"
						loading={loading}
						rowSelection="checkbox"
						selectedRowKeys={selectedRowKeys}
						updateSelectedItem={Utils.updateSelectedItem.bind(this)}
					/>
					<ModalBaseForm
						onRef={p.onRef}
                        visible={visible}
                        width={800}
						modalFormList={modalFormList}
						submit={p.handleSubmit}
						close={p.closeModal.bind(this)}
						title={Object.keys(echoList).length===0? "添加贷款产品标签":"编辑贷款产品标签"}
						/>
				</Card>
			</div>
		);
	}
}

export default Form.create()(channelManag);
