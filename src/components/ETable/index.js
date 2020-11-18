import React from 'react';
import { Table, Button } from 'antd';
import style from './index.scss';

export default class ETable extends React.Component {
  state = {
    dataList: [],
    // newRow:{}
  };

  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this);
  }

  // 处理行点击事件
  onRowClick = (record, index) => {
    const p = this;
    const { rowSelection } = p.props;
    if (rowSelection === 'checkbox') {
      let { selectedRowKeys } = this.props;
      let { selectedIds } = this.props;
      let selectedItem = p.props.selectedItem || [];
      let selectUserIds = [];
      let selectRoleIds = [];
      if (selectedIds) {
        const i = selectedIds.indexOf(record.id);
        if (i === -1) {
          // 避免重复添加
          selectedIds.push(record.id);
          selectedRowKeys.push(index);
          selectedItem.push(record);
          selectUserIds.push(record.userId);
          selectRoleIds.push(record.roleId);
        } else {
          selectedIds.splice(i, 1);
          selectedRowKeys.splice(i, 1);
          selectedItem.splice(i, 1);
          selectUserIds.splice(i, 1);
          selectRoleIds.splice(i, 1);
        }
      } else {
        selectedIds = [record.id];
        selectUserIds = [record.userId];
        selectedRowKeys = [index];
        selectedItem = [record];
        selectRoleIds = [record.roleId];
      }
      this.props.updateSelectedItem(selectedRowKeys, selectedItem, selectedIds, selectUserIds,selectRoleIds);
      // this.props.updateSelectedItem(selectedRowKeys, selectedRows[0], selectedIds, selectUserIds);
    } else {
      const selectKey = [index];
      const { selectedRowKeys } = this.props;
      if (selectedRowKeys && selectedRowKeys[0] === index) {
        return;
      }
      this.props.updateSelectedItem(selectKey, record);
    }

    // this.props.onRowClick(record, index);
  };

  // 选择框变更
  onSelectChange = (selectedRowKeys, selectedRows) => {
    const { rowSelection } = this.props;
    const p = this;
    const selectedIds = [];
    const selectUserIds = [];
    const selectRoleIds = [];
    if (rowSelection === 'checkbox') {
      selectedRows.map(item => {
        selectedIds.push(item.id);
        selectUserIds.push(item.userId);
        selectRoleIds.push(item.roleId);
        return [];
      });
      p.setState({
        selectedRowKeys,
        selectedIds,
        selectUserIds,
        selectRoleIds,
        selectedItem: selectedRows[0],
      });
    }
    this.props.updateSelectedItem(selectedRowKeys, selectedRows[0], selectedIds, selectUserIds,selectRoleIds);
    // this.props.onRowClick(selectedRows[0]);
    return '';
  };

  onSelectAll = (selected, selectedRows) => {
    // const p = this;
    const selectUserId = [];
    const selectRoleId = [];
    const selectedIds = [];
    const selectKey = [];
    selectedRows.forEach((item, i) => {
      selectedIds.push(item.id);
      selectKey.push(i);
      selectUserId.push(item.userId);
      selectRoleId.push(item.roleId);
    });
    this.props.updateSelectedItem(selectKey, selectedRows[0] || {}, selectedIds, selectUserId,selectRoleId);
    // this.props.onRowClick(selectedRows[0]);
  };

  // 增加行
  handleAddRow = () => {
    const p = this;
    const newSkuData = p.state.dataList.length > 0 ? p.state.dataList : p.props.dataSource;
    this.setState(
      {
        dataList: newSkuData,
      },
      () => {
        const { dataList } = this.state;
        const skuLen = dataList.length;
        const lastId = skuLen < 1 ? 0 : dataList[dataList.length - 1].id;
        const newId = parseInt(lastId, 10) + 1;
        const newItem = {
          key: newId,
          id: newId,
          itemName: '',
          userId: '',
          itemSpecificationDesc: '',
          itemUnit: '',
          itemPrice: 0,
          quantity: 0,
          amount: 0,
        };
        dataList.push(newItem);
        this.setState({ dataList });
      }
    );
  };

  // 删除行
  deleteRow = id => {
    const { dataList } = this.state;
    const newSkuData = dataList.filter(item => id !== item.id);
    this.setState({ dataList: newSkuData });
  };

  getOptions = () => {
    const p = this.props;
    const ph = this;
    const nameList = {
      订单编号: 170,
      车辆编号: 80,
      手机号码: 96,
      用户姓名: 70,
      密码: 70,
      运维区域: 300,
      车型: 42,
      故障编号: 76,
      代理商编码: 97,
      角色ID: 64,
    };
    if (p.columns && p.columns.length > 0) {
      p.columns.forEach(item => {
        // 开始/结束 时间
        if (!item.title) {
          return;
        }
        if (!item.width) {
          if (item.title.indexOf('时间') > -1 && item.title.indexOf('持续时间') < 0) {
            item.width = 132;
          } else if (item.title.indexOf('图片') > -1) {
            item.width = 86;
          } else if (item.title.indexOf('权限') > -1 || item.title.indexOf('负责城市') > -1) {
            item.width = '40%';
            item.className = 'text-left';
          } else if (nameList[item.title]) {
            item.width = nameList[item.title];
          }
        }
        item.bordered = true;
      });
    }
    const { selectedRowKeys } = this.props;
    const rowSelection = {
      type: 'radio',
      selectedRowKeys,
      onChange: this.onSelectChange,
      // getCheckboxProps: record =>({
      //   // 禁止掉的就是Disabled User这一项，也就是不能点
      //   // disabled : record&&record.userId === 33,
      // }),
      getCheckboxProps: this.props.getCheckboxProps,
      onSelect: () => {},
      onSelectAll: this.onSelectAll,
    };
    let rowLelection = this.props.rowSelection;
    // 当属性未false或者null时，说明没有单选或者复选列
    if (rowLelection === false || rowLelection === null) {
      rowLelection = false;
    } else if (rowLelection === 'checkbox') {
      // 设置类型未复选框
      rowSelection.type = 'checkbox';
    } else {
      // 默认未单选
      rowLelection = 'radio';
    }

    return (
      <>
        {this.props.addRow && (
          <Button type="primary" className={style.addrow} onClick={ph.handleAddRow.bind(ph, p)}>
            {this.props.addRow}
          </Button>
        )}
        <Table
          className="card-wrap page-table"
          bordered
          {...this.props}
          dataSource={this.state.dataList.length > 0 ? this.state.dataList : this.props.dataSource}
          rowSelection={rowLelection ? rowSelection : null}
          onRow={(record, index) => ({
            onClick: () => {
              if (!rowLelection) {
                return;
              }
              if (this.props.noRowClick) return;
              this.onRowClick(record, index);
            },
          })}
        />
      </>
    );
  };

  render = () => {
    return <div>{this.getOptions()}</div>;
  };
}
