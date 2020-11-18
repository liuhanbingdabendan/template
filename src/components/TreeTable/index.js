import React from 'react';
import { Table } from 'antd';

export default class treeTable extends React.Component {
  state = {
    dataList: [],
    // newRow:{}
  };

  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this);
    console.log(this.props.onRef)
  }
  // 处理行点击事件
  // 删除行
  deleteRow = id => {
    const { dataList } = this.state;
    const newSkuData = dataList.filter(item => id !== item.id);
    this.setState({ dataList: newSkuData });
  };

  getOptions = () => {
    const p = this.props;
    //const { selectedRowKeys } = this.props;
    const rowSelection = {
      type: 'radio',
      //selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      
    };
    const expandable = {
      defaultExpandAllRows:true
    }
    return (
			<>
        <Table className="card-wrap page-table" indentSize="30" bordered 
          columns={this.props.columns}
          dataSource={this.state.dataList.length > 0 ? this.state.dataList : this.props.dataSource} 
          rowSelection={rowSelection} 
          expandable={expandable}
           />
			</>
		);
  };

  render = () => {
    return <div>{this.getOptions()}</div>;
  };
}
