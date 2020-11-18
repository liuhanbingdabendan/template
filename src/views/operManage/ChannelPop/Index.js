import React, { Component } from 'react';
import {  Card, Switch, Form,  Button,Badge,Popconfirm, message} from 'antd';
import '@/assets/css/style';
import BaseForm from '@/components/BaseForm';
import ETable from '@/components/ETable';
import { channelPopList,exportLoanList,downloadExcl} from '@/service/api';
import Utils from '@/utils/utilsT';

class channelPop extends Component {
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
	 	channelPopList(params).then(res => {
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
			 const exportUrl ='/api/web/dkPromotionStatistics/channelexport'
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
				label: '渠道名称',
				field: 'channelName',
				placeholder: '请输入名称',
				width: 200,
				type: 'INPUT'
			},
			{
				label: 'uv数量',
				field: 'startUv',
				placeholder: '最小范围',
				width: 150,
				type: 'INPUT'
            },
            {
				label: '-',
				field: 'endUv',
				placeholder: '最大范围',
				width: 150,
				type: 'INPUT'
            },
            {
				label: '注册人数',
				field: 'startRegisterCount',
				placeholder: '最小范围',
				width: 150,
				type: 'INPUT'
            },
            {
				label: '-',
				field: 'endRegisterCount',
				placeholder: '最小范围',
				width: 150,
				type: 'INPUT'
            },
            {
				type: 'SELECT',
				label: '来源系统',
				field: 'from',
				width: 200,
				list: [{ id: '', name: '所有' },{ id: 1, name: 'Android' },{ id: 2 , name: 'IOS' }],
				name: 'name', // 展示的
			},
			  {
				type: 'time',
				width: 135,
				label: '创建时间',
				field: ['startDateStart', 'startDateEnd'],
			  }	 
		];

		const columns = [
			{
				title: '渠道名称',
				dataIndex: 'channelName',
				key: 'channelName',
				render:t=>t||'-'
			},
			{
				title: '注册数',
				dataIndex: 'registerCount',
				key: 'registerCount',
				render:t=>t||'-'
			},
			{
				title: 'uv数量',
				dataIndex: 'uv',
				key: 'uv',
				render:t=>t||'-'
			},
			{
				title: '来源系统',
				dataIndex: 'from',
				key: 'from',
				render:t=>( <Badge count={{'1':'Android','2':'IOS'}[t]} style={{ backgroundColor: '#f8ac59' }} />)
			},
            {
				title: '创建时间',
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

export default Form.create()(channelPop);
