/* eslint-disable consistent-return */
import React from 'react';
import { Select, Checkbox, Radio } from 'antd';
import queryString from 'query-string';

const { Option } = Select;
export default {
  // formateDate(time) {
  //   if (!time) return '';
  //   const date = new Date(time);
  //   const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  //   const Data = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  //   return `${date.getFullYear()}-${month}-${Data}`;
  // },
  formateDate(time) {
    if (!time) return '';
    const date = new Date(time);
    const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const Data = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    return `${date.getFullYear()}-${month}-${Data}`;
  },

  formateYearMonth(time) {
    if (!time) return '';
    const date = new Date(time);
    const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    return `${date.getFullYear()}-${month}`;
  },
  calendarYear() {
    // 获取上个月日期
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month === 0) {
      year -= 1;
      month = 12;
    }
    return `${year}-${month}`;
  },
  getLastYear() {
    // 获取上个月日期
    const date = new Date();
    let year = date.getFullYear() - 1;
    // let month = date.getMonth();
    let month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const Data = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    if (month === 0) {
      year -= 1;
      month = 12;
    }
    return `${year}-${month}-${Data}`;
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
    if (!data) {
      return [];
    }
    const options = []; // [<Option value="0" key="all_key">全部</Option>];
    // eslint-disable-next-line array-callback-return
    data.map(item => {
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

  getRadioButtonList(data, name) {
    if (!data) {
      return [];
    }

    const radioOtion = []; // [<Option value="0" key="all_key">全部</Option>];
    data.map(item => {
      radioOtion.push(
        <Radio.Button value={item.id} key={item.id}>
          {item[`${name}`]}
        </Radio.Button>
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
  updateSelectedItem(selectedRowKeys, selectedRows, selectedIds, selectedItemIds) {
    console.log(selectedRowKeys);
    if (selectedIds) {
      this.setState({
        selectedRowKeys,
        selectedIds,
        selectedItem: selectedRows,
        selectedItemIds,
      });
    } else {
      this.setState({
        selectedRowKeys,
        selectedItem: selectedRows,
        selectedItemIds,
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

  // 处理图片
  dealPicList(picName, type, file) {
    let dealPicfileName;
    if (!picName) return;
    if (type === 'every') {
      dealPicfileName = '';
      picName.forEach(item => {
        dealPicfileName = item[file || 'fileName'] || item.response.data[file || 'fileName'];
      });
    }
    if (type === 'more') {
      dealPicfileName = [];
      picName.forEach(item => {
        dealPicfileName.push(item[file || 'fileName'] || item.response.data[file || 'fileName']);
      });
    }
    if (type === 'saveEvery') {
      dealPicfileName = [];
      picName.forEach(item => {
        dealPicfileName.push({
          url: item[file || 'fileName'] || item.response.data[file || 'fileName'],
          fileName: item.fileName || item.response.data.fileName,
          uid: String(-Math.random().toFixed(2)),
        });
      });
    }
    if (type === 'savemore') {
      dealPicfileName = [];
      picName.forEach(item => {
        dealPicfileName.push({
          url: item[file || 'fileName'] || item.response.data[file || 'fileName'],
          fileName: item.fileName || item.response.data.fileName,
          uid: String(-Math.random().toFixed(2)),
        });
      });
    }
    return dealPicfileName;
  },
};
