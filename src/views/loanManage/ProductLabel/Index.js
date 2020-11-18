import React, { Component } from 'react';
import {  Card, Switch,Form,  Button,Badge,Popconfirm, message, Divider} from 'antd';
import '@/assets/css/style';
import BaseForm from '@/components/BaseForm';
import ETable from '@/components/ETable';
import ModalBaseForm from '@/components/ModalBaseForm';
import { getProductLabelList,removeDkLoanTag,exportLoanList,editProductList,addProductList,downloadExcl,changeStatus} from '@/service/api';
import Utils from '@/utils/utilsT';

class ProductLabel extends Component {
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
		getProductLabelList(params).then(res => {
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
		removeDkLoanTag(id).then(res=>{
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
		 console.log(this.state)
		 console.log(selectedIds,selectedIds.toString())
		 if(!selectedIds)return
		 this.setState({
			loading:true
		 })
		 removeDkLoanTag(selectedIds.toString()).then(res=>{
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
			 editProductList({...data,id}).then(res=>{
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
			 addProductList({...data}).then(res=>{
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
	  
	  // 切换状态
	  onChangeStatus=(id,sta)=>{
		changeStatus('/api/web/dkLoanTag/changeStatus',{status:sta?'0':'1',id}).then(res=>{
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
				label: '名称',
				field: 'name',
				placeholder: '请输入名称',
				width: 200,
				type: 'INPUT'
			},
			  {
				type: 'SELECT',
				label: '状态',
				field: 'status',
				placeholder: '请选择状态',
				width: 200,
				list: [{ id: '', name: '所有' },{ id: 0, name: '正常' },{ id: 1 , name: '禁用' }],
				name: 'name', // 展示的
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
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
				render:t=>t||'-'
			},
			{
				title: '显示顺序',
				dataIndex: 'delFlag',
				key: 'delFlag',
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
				title: '更新时间',
				dataIndex: 'updateTime',
				key: 'updateTime',
				render:t=>t||'-'
			},
			{
				title: '操作',
				dataIndex: 'specificationDesc',
				key: 'specificationDesc',
				render:(t,r)=>(
					<>
					<Button type="primary" size="small"  icon="edit" onClick={()=>this.openModal(r)}>编辑</Button>
					<Divider type="vertical"/>
					<Popconfirm
							title="确定删除？"
							onConfirm={this.handleDelete.bind(this, r.id)}
						>
					     <Button type="primary" size="small" icon="close">删除</Button>
					</Popconfirm>
					</>
				)
			}
		];

		const modalFormList = [
			{
				type: 'INPUT',
				label: '名称',
				field: 'name',
				placeholder: '请输入名称',
				initialValue: echoList&&echoList.name, // 初始值
				width: 220
			  },
			  {
				type: 'INPUT',
				label: '显示顺序',
				field: 'delFlag',
				placeholder: '请输入显示顺序',
				initialValue: echoList&&echoList.delFlag, // 初始值
				width: 220
			  },
			  {
				type: 'REDIO',
				label: '状态',
				field: 'status',
				placeholder: '请选择状态',
				list: [{ id: '0', name: '正常' },{ id:'1' , name: '停用' }],
				name: 'name', // 展示的
				initialValue: echoList&&echoList.status,
				width: 220,
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

export default Form.create()(ProductLabel);
