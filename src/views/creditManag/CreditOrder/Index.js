import React, { Component } from 'react';
import {  Card, Switch, Form,  Button,Badge,Popconfirm, message} from 'antd';
import '@/assets/css/style';
import BaseForm from '@/components/BaseForm';
import ETable from '@/components/ETable';
import { getcreditOrderList,getOrderStatus} from '@/service/api';
import Utils from '@/utils/utilsT';

class CreditOrder extends Component {
	state = {
		list: [],
		loading:false,
		listData:[]
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
			searchParams:JSON.stringify(param)
		};
		getcreditOrderList(params).then(res => {
			//console.log(res.result)
			p.setState({
				list: res.result.list|| [],
				loading:false,
				total:res.total
			});
		});
		getOrderStatus().then(res => {
			console.log(res.data)
			let arr = [];
			for(let k in res.data){
				let obj = {
					id:res.data[k],
					name:k
				}
				arr.push(obj)
			}
			console.log(arr)
			p.setState({
				listData:arr
			});
		});
	};
	// 搜索
	searchResult = (params, page) => {
		const p = this;
		console.log(params)
		var obj = {
			startCreateTime:params.startTime,
			endCreateTime:params.endTime,
			startCreateReportTime:params.startTime1,
			endCreateReportTime:params.endTime1,
			orderStatus:params.orderStatus,
		}
		p.setState({
			obj,
			loading:true,
			pageNo:page
		});
		this.initList(obj, page);
	};
	
	render() {
		const p = this;
		const { list ,loading , params , total , pageNo, selectedRowKeys,selectedUserIds=[],listData} = this.state;
		const formList = [
			  {
				type: 'time',
				width: 135,
				label: '下单时间',
				field: ['startCreateTime ', 'endCreateTime '],
              },
              {
				type: 'time1',
				width: 135,
				label: '报告生成时间',
				field: ['startCreateReportTime', 'endCreateReportTime'],
              },
              {
				type: 'SELECT1',
				width: 135,
				placeholder: '请选择状态',
				label: '订单状态',
				field: 'orderStatus',
				list: listData,
				name: 'name' // 展示的
			  }
		];

		const columns = [
			{
				title: '手机号',
				dataIndex: 'phoneNum',	
				key: 'phoneNum',
                render:t=>t||'-',
                width:240
			},
			{
				title: '下单时间',
				dataIndex: 'createTime',
				key: 'createTime',
                render:t=>t||'-',
                width:240
			},
			{
				title: '报告生成时间',
				dataIndex: 'summaryCreateTime',
				key: 'summaryCreateTime',
                render:t=>t||'-',
                width:240
			},
			{
				title: '订单状态',
				dataIndex: 'orderStatus',
				key: 'orderStatus',
				render:(t) =>  {
					switch(t){
					    case "0": 
						  return "个人信息填写" ;
					    case "1":
						  return "信息填写完成";
					    case "2":
							return "支付请求中";
						case "4":
							return "支付成功";
						case "5":
							return "报告认证中";
						case "6":
							return "报告生成中";
						case "7":
						    return "报告已生成";
						case "8":
						    return "订单失效";
					}
				},
                width:300
			},
			{
				title: '支付金额',
				dataIndex: 'amount',
				key: 'amount',
                render:t=>t||'-',
                width:240
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

export default Form.create()(CreditOrder);
