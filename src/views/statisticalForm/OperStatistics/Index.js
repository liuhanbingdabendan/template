import React, { Component } from 'react';
import {  Card, Switch, Form,  Button,Badge,Popconfirm, message} from 'antd';
import '@/assets/css/style';
import BaseForm from '@/components/BaseForm';
import ETable from '@/components/ETable';
import { operStatisticsList} from '@/service/api';
import Utils from '@/utils/utilsT';

class operStatistics extends Component {
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
		operStatisticsList(params).then(res => {
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
	
	render() {
		const p = this;
		const { list ,loading , params , total , pageNo, selectedRowKeys,selectedUserIds=[]} = this.state;
		const formList = [
			  {
				type: 'time',
				width: 135,
				label: '创建时间',
				field: ['startTime', 'endTime'],
			  }
		];

		const columns = [
			{
				title: '贷款名称',
				dataIndex: 'loanName',
				key: 'loanName',
				render:t=>t||'-',
				width: 250,
			},
			{
				title: 'pv数',
				dataIndex: 'openPV',
				key: 'openPV',
				render:t=>t||'0'
			},
			{
				title: 'uv数',
				dataIndex: 'openUV',
				key: 'openUV',
				render:t=>t||'0'
			},
			{
				title: '申请点击数',
				dataIndex: 'applyPv',
				key: 'openPV',
				render:t=>t||'0'
			},
			{
				title: '独立申请点击数',
				dataIndex: 'applyUv',
				key: 'applyUv',
				render:t=>t||'0'
			},
		    {
				title: '创建时间',
				dataIndex: 'createTime',
				key: 'createTime',
				render: t => t || '-',
				width: 250,
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
					<ETable
						dataSource={list}
						columns={columns}
						rowKey={(_, index) => index}
						pagination={paginationProps}
						size="small"
						loading={loading}
						rowSelection={false}
						selectedRowKeys={selectedRowKeys}
						updateSelectedItem={Utils.updateSelectedItem.bind(this)}
					/>
				</Card>
			</div>
		);
	}
}

export default Form.create()(operStatistics);
