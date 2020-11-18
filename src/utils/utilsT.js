import React from 'react';
import { Select, Checkbox, Radio } from 'antd';
import queryString from 'query-string';

const { Option } = Select;

export default {
  // formateDate(time) {
  //   if (!time) return '';
  //   const date = new Date(time);
  //   return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  //   // ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
  // },
  formateDate(time) {
    if (!time) return '';
    const date = new Date(time);
    const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const Data = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    return `${date.getFullYear()}-${month}-${Data}`;
  },
  pagination(data, callback) {
    return {
      onChange: current => {
        callback(current);
      },
      current: data.result.page,
      pageSize: data.result.page_size,
      total: data.result.total_count,
      showTotal: () => `共${data.result.total_count}条`,
      showQuickJumper: true,
    };
  },
  // 格式化金额,单位:分(eg:430分=4.30元)
  formatFee(fee, suffix = '') {
    if (!fee) {
      return 0;
    }
    return Number(fee).toFixed(2) + suffix;
  },
  // 格式化公里（eg:3000 = 3公里）
  formatMileage(mileage, text) {
    if (!mileage) {
      return 0;
    }
    if (mileage >= 1000) {
      text = text || ' km';
      return Math.floor(mileage / 100) / 10 + text;
    }
    text = text || ' m';
    return mileage + text;
  },
  // 隐藏手机号中间4位
  formatPhone(phone) {
    phone += '';
    return phone.replace(/(\d{3})\d*(\d{4})/g, '$1***$2');
  },
  // 隐藏身份证号中11位
  formatIdentity(number) {
    number += '';
    return number.replace(/(\d{3})\d*(\d{4})/g, '$1***********$2');
  },
  getOptionList(data, name) {
    if (!(data instanceof Array)) {
      return [];
    }
    const options = []; // [<Option value="0" key="all_key">全部</Option>];
    data.forEach(item => {
      options.push(
        <Option value={item.id} key={item.id}>
          {item[`${name}`]}
        </Option>
      );
    });
    return options;
  },
  getRadioList(data, name) {
    if (!data) {
      return [];
    }
    const radioOtion = []; // [<Option value="0" key="all_key">全部</Option>];
    data.map(item => {
      radioOtion.push(
        <Radio value={item.id} key={item.id}>
          {item[`${name}`]}
        </Radio>
      );
      return '';
    });

    return radioOtion;
  },
  getCheckboxList(data) {
    if (!data) {
      return [];
    }
    const options = []; // [<Option value="0" key="all_key">全部</Option>];
    data.map(item => {
      options.push(
        <Checkbox value={item.id} key={item.key}>
          {item.name}
        </Checkbox>
      );
      return '';
    });
    return options;
  },
  /**
   * ETable 行点击通用函数
   * @param {*选中行的索引} selectedRowKeys
   * @param {*选中行对象} selectedItem
   */
  updateSelectedItem(selectedRowKeys, selectedRows, selectedIds, selectedUserIds,selectRoleIds) {
    if (selectedIds) {
      this.setState({
        selectedRowKeys,
        selectedIds,
        selectedItem: selectedRows,
        selectedUserIds,
        selectRoleIds
      });
    } else {
      this.setState({
        selectedRowKeys,
        selectedItem: selectedRows,
        selectedUserIds,
        selectRoleIds
      });
    }
  },

  stopPropagation(e) {
    e = e || window.event;
    if (e.stopPropagation) {
      // W3C阻止冒泡方法
      e.stopPropagation();
    } else {
      e.cancelBubble = true; // IE阻止冒泡方法
    }
  },

  //  导出
  exportLoanList(path, params) {
    const { origin } = window.location;
    const url = `${origin}/${path}?${queryString.stringify(params)}`;
    window.open(url);
  },
};

// 处理图片
export function dealPicList(picName, type) {
  let dealPicfileName;
  if (type === 'every') {
    dealPicfileName = '';
    picName.forEach(item => {
      dealPicfileName = item.fileName || item.response.data.fileName;
    });
  }
  if (type === 'more') {
    dealPicfileName = [];
    picName.forEach(item => {
      dealPicfileName.push(item.fileName || item.response.data.fileName);
    });
  }
  return dealPicfileName;
}
