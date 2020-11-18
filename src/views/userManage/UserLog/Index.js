import React, { Component } from 'react';
import {  Card, Switch, Form,  Button,Badge,Popconfirm, message} from 'antd';
import '@/assets/css/style';
import BaseForm from '@/components/BaseForm';
import ETable from '@/components/ETable';
import { userLogList,exportLoanList,downloadExcl } from '@/service/api';
import Utils from '@/utils/utilsT';

class userLog extends Component {
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
	 	userLogList(params).then(res => {
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
	
		 // 导出
		 handleExport=()=>{
			const userName='',
				  mobile="",
				  params= {}
				  params.beginTime = ""
				  params.endTime = ""	  
			 const exportUrl ='/api/web/dkUserLog/export'
			 const exportDate = {userName,mobile,params} ;
			 exportLoanList(exportUrl,exportDate)
			 .then(res=>{
				downloadExcl(res.msg)
			 })
		 }

	render() {
		const p = this;
		const { list ,loading , params , total , pageNo, selectedRowKeys,selectedUserIds=[]} = this.state;
		const formList = [
			{
				label: '用户名',
				field: 'userName',
				placeholder: '请输入姓名',
				width: 150,
				type: 'INPUT'
			},
			{
				label: '用户手机',
				field: 'mobile',
				placeholder: '请输入手机号',
				width: 150,
				type: 'INPUT'
			},		
			  {
				type: 'time',
				width: 135,
				label: '申请时间',
				field: ['startDateStart', 'startDateEnd'],
			  },
		];

		const columns = [
			{
				title: '用户名',
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
				title: '用户手机',
				dataIndex: 'mobile',
				key: 'mobile',
				render:t=>t||'-'
			},
			{
				title: '信用卡',
				dataIndex: 'creditCard',
				key: 'creditCard',
				render:t=>t||'-'
			},
			{
				title: '贷款名称',
				dataIndex: 'loanName',
				key: 'loanName',
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
				dataIndex: 'channelName',
				key: 'channelName',
				render:t=>t||'-'
			},
			{
				title: '操作信息',
				dataIndex: 'logMsg',
				key: 'logMsg',
				render:t=>t||'-'
			},
			{
				title: '登录区域',
				dataIndex: 'loginIp',
				key: 'loginIp',
				render:t=>t||'-'
			},
			{
				title: '申请日期',
				dataIndex: 'createTime',
				key: 'createTime',
				render:t=>t||'-'
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

export default Form.create()(userLog);
