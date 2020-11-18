import React, { Component } from 'react';
import {  Card, Switch, Form,  Button,Badge,Popconfirm, message} from 'antd';
import '@/assets/css/style';
import BaseForm from '@/components/BaseForm';
import ETable from '@/components/ETable';
import {channelFormList,exportLoanList,downloadExcl} from '@/service/api';
import Utils from '@/utils/utilsT';

class channelForm extends Component {
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
	 	channelFormList(params).then(res => {
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
	 	const channelName='',
			  params= {}
	 		  params.beginTime = ""
			  params.endTime = ""
			  
	 	 const exportUrl ='/api/web/dkChannelStatistics/export'
	 	 const exportDate = {channelName,params} ;
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
				width: 200,
				type: 'INPUT'
			},
			{   
                label: '日期',
				type: 'time',
				width: 135,
				field: ['startDateStart', 'startDateEnd']
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
				title: 'pv数量',
				dataIndex: 'pv',
				key: 'pv',
				render:t=>t||'-'
			},
			{
				title: 'uv数量',
				dataIndex: 'uv',
				key: 'uv',
				render:t=>t||'-'
			},
			{
				title: '打开量',
				dataIndex: 'openNum',
				key: 'openNum',
				render:t=>t||'-'
			},
			{
				title: '注册数量',
				dataIndex: 'activeCount',
				key: 'activeCount',
				render:t=>t||'-'
			},
			{
				title: '注册转化率(%)',
				dataIndex: 'registrationConversionRate',
				key: 'registrationConversionRate',
				render:t=>t||'-'
			},
			{
				title: '激活数量',
				dataIndex: 'cpa',
				key: 'cpa',
				render:t=>t||'-'
			},
			{
				title: '激活率(%)',
				dataIndex: 'activation',
				key: 'activation',
				render:t=>t||'-'
			},
			{
                title: '注册单价(元)',
				dataIndex: 'cpaPrice',
				key: 'cpaPrice',
				render:t=>t||'-'
			},
			{
				title: '结算费用(元)',
				dataIndex: 'closingCost',
				key: 'closingCost',
				render:t=>t||'-'
			},
			{
				title: 'UV单价(元)',
				dataIndex: 'uvPrice',
				key: 'uvPrice',
				render:t=>t||'-'
            },
            {
				title: 'UV总价(元)',
				dataIndex: 'uvTotalPrice',
				key: 'uvTotalPrice',
				render:t=>t||'-'
            },
            {
				title: '日期',
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

export default Form.create()(channelForm);
