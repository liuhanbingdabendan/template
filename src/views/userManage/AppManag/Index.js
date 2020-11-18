import React, { Component } from 'react';
import {  Card, Switch, Form,  Button,Badge,Popconfirm, message} from 'antd';
import '@/assets/css/style';
import BaseForm from '@/components/BaseForm';
import ETable from '@/components/ETable';
import { getAppList,removeApp,exportLoanList,downloadExcl,changeStatus } from '@/service/api';
import Utils from '@/utils/utilsT';

class appManage extends Component {
	state = {
		list: [],
		loading:false
	};

	componentDidMount() {
		this.initList();
	}

	initList = (param,page) => {
		const p = this;
		this.setState({
			loading:true
		})
		const params = {
			pageNum: page||1,
			pageSize: 10,
			isAsc: 'asc',
			...param
		};
		getAppList(params).then(res => {
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
			loading:true,
			pageNo:page
		});
		this.initList(params, page);
	};

	// 删除
	handleDelete=(id)=>{
		const p =this;
		removeApp(id).then(res=>{
			if(res&&res.code===0){
				message.success('删除成功！')
				p.initList()
			}else{
				message.error('批量删除失败！')
			}
		})
	 }

	 // 批量删除
	 handlePitchDelete=()=>{
		 const p = this;
		 const {selectedUserIds} = this.state;
		 if(!selectedUserIds)return
		 removeApp(selectedUserIds.toString()).then(res=>{
			if(res&&res.code===0){
				message.success('批量删除成功！')
				p.initList()
			}else{
				message.error('批量删除失败！')
			}
		})
	 }

	 // 导出
	 handleExport=()=>{
		const userName='',
			  mobile="",
			  age='',
			  age_end="",
			  referName="",
			  status="",
			  params= {}
			  params.beginTime = ""
			  params.endTime = ""
			  
		 const exportUrl ='/api/web/tbUser/export'
		 const exportDate = {userName,mobile,age,age_end,referName,status,params} ;
		 exportLoanList(exportUrl,exportDate)
		 .then(res=>{
			downloadExcl(res.msg)
		 })
	 }

	   // 切换状态
	   onChangeStatus=(id,sta)=>{
			changeStatus('/api/web/tbUser/changeStatus',{status:sta?'0':'1',userId:id}).then(res=>{
				if(res.code===0){
					this.initList()
				}
			})
	  }

	render() {
		const p = this;
		const { list ,loading , params , total , pageNo, selectedRowKeys,selectedUserIds=[]} = this.state;
		console.log(this.state,'stats')
        console.log(selectedUserIds.length,'selectedUserIds')
		const formList = [
			{
				label: '姓名',
				field: 'userName',
				placeholder: '请输入姓名',
				width: 200,
				type: 'INPUT'
			},
			{
				label: '手机号',
				field: 'mobile',
				placeholder: '请输入手机号',
				width: 200,
				type: 'INPUT'
			},
			{
				label: '年龄',
				field: 'age',
				placeholder: '请输入年龄',
				width: 200,
				type: 'INPUT'
			},
			{
				label: '推广人',
				field: 'referName',
				placeholder: '请输入推广人',
				width: 200,
				type: 'INPUT'
			},
			{
				type: 'time',
				width: 135,
				label: '年龄',
				field: ['startDateStart', 'startDateEnd'],
			  },
			  {
				type: 'time',
				width: 135,
				label: '创建时间',
				field: ['startDateStart', 'startDateEnd'],
			  },
			  {
				type: 'SELECT',
				label: '状态',
				field: 'status',
				placeholder: '请选择状态',
				width: 200,
				list: [{ id: '', name: '所有' },{ id: 0, name: '正常' },{ id: 1 , name: '停用' }],
				name: 'name', // 展示的
			  }
		];

		const columns = [
			{
				title: '姓名',
				dataIndex: 'userName',
				key: 'userName',
				render:t=>t||'-'
			},
			{
				title: '年龄',
				dataIndex: 'age',
				key: 'age',
				render:t=>t||'-'
			},
			{
				title: '手机号',
				dataIndex: 'mobile',
				key: 'mobile',
				render:t=>t||'-'
			},
			{
				title: '账户类型',
				dataIndex: 'type',
				key: 'type',
				render:t=>( <Badge count={{'1':'普通用户'}[t]} style={{ backgroundColor: '#52c41a' }} />)
			},
			{
				title: '冻结金额',
				dataIndex: 'frozenAmount',
				key: 'frozenAmount',
				render:t=>t||'-'
			},
			{
				title: '账户余额',
				dataIndex: 'totalAmount',
				key: 'totalAmount',
				render:t=>t||'-'
			},
			{
				title: '账户收入',
				dataIndex: 'avaibleAmount',
				key: 'avaibleAmount',
				render:t=>t||'-'
			},
			{
				title: '用户来源',
				dataIndex: 'userSource',
				key: 'userSource',
				render:t=>t||'-'
			},
			{
				title: '系统',
				dataIndex: 'from',
				key: 'from',
				render:t=>( <Badge count={{'1':'Android'}[t]} style={{ backgroundColor: '#aaaaaa' }} />)
			},
			{
				title: '激活时间',
				dataIndex: 'loginDate',
				key: 'loginDate',
				render:t=>t||'-'
			},
			{
				title: '推广人',
				dataIndex: 'referName',
				key: 'referName',
				render:t=>t||'-'
			},
			{
				title: '渠道商',
				dataIndex: 'source',
				key: 'source',
				render:t=>t||'-'
			},
			{
				title: '登录区域',
				dataIndex: 'loginIp',
				key: 'loginIp',
				render:t=>t||'-'
			},
			{
				title: '状态',
				dataIndex: 'status',
				key: 'status',
				render:(t,r)=><Switch defaultChecked={t==='0'} onChange={this.onChangeStatus.bind(this,r.userId)}/>
			},
			{
				title: '操作',
				dataIndex: 'specificationDesc',
				key: 'specificationDesc',
				render:(t,r)=>(
					<Popconfirm
							title="确定删除？"
							onConfirm={this.handleDelete.bind(this, r.userId)}
						>
					     <Button type="primary"  icon="close">删除</Button>
					</Popconfirm>
				)
			}
		];

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
						<Popconfirm
								title="确定批量删除？"
								onConfirm={this.handlePitchDelete.bind(this)}
								
							>
							<Button type="primary" disabled={selectedUserIds.length===0}  icon="close" style={{marginRight:'20px'}}>删除</Button>
						</Popconfirm>
						<Popconfirm
								title="确定导出？"
								onConfirm={this.handleExport.bind(this)}
							>
							<Button type="primary"  icon="close">导出</Button>
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
				</Card>
			</div>
		);
	}
}

export default Form.create()(appManage);
