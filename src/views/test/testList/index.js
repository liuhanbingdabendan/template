import React, {Component} from 'react'
import ETable from '@/components/ETable'
import Utils from '@/utils/utilsT';
class testList extends Component{
    state = {
        list:[],
        total:10,
        loading:false,
        selectedRowKeys:[],
        pageNo:2
    }
    componentDidMount(){
        this.setState({
            list:[
                {
                    phoneNum:'123',
                    createTime:'01-05',
                    summaryCreateTime:'报告01.02',
                    orderStatus:'0',
                    amount:'100'
                }
            ]
        })
    }
    render(){
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
        const paginationProps = {
			total:this.state.total,
			defaultPageSize: 100,
			pageSize:10,
			current: this.state.pageNo || 1,
			onChange(pageIndex) {
			  
			},
		  };
        return(
            <div>
                <p>测试表格列表</p>
                <ETable
						dataSource={this.state.list}
                        columns={columns}
                        rowKey={(_, index) => index}
						pagination={paginationProps}
						size="small"
						loading={this.state.loading}
						rowSelection={false}
						selectedRowKeys={this.state.selectedRowKeys}
						updateSelectedItem={Utils.updateSelectedItem.bind(this)}
					/>
            </div>
        )
    }
}
export default testList