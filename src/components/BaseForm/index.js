import React from 'react';
import { Input, Select, Form, Button, Checkbox, DatePicker, Cascader, Popconfirm } from 'antd';
import Utils from '../../utils/utils';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

class FilterForm extends React.Component {
  state = {};

  handleFilterSubmit = () => {
    const p = this;
    const fieldsValue = p.props.form.getFieldsValue();
    if (fieldsValue.startTime) {
      fieldsValue.startTime = Utils.formateDate(fieldsValue.startTime);
    }
    if (fieldsValue.endTime) fieldsValue.endTime = Utils.formateDate(fieldsValue.endTime);
    if (fieldsValue.startTime1) {
      fieldsValue.startTime1 = Utils.formateDate(fieldsValue.startTime1);
    }
    if (fieldsValue.endTime1) fieldsValue.endTime1 = Utils.formateDate(fieldsValue.endTime1);
    p.props.filterSubmit(fieldsValue);
  };

  reset = () => {
    const p = this;
    p.props.form.resetFields();
  };

  handleAdd = () => {
    const p = this;
    p.props.handleOpenModal('add');
  };

  pitchDelete = selectedRowKeys => {
    const p = this;
    if (!selectedRowKeys || selectedRowKeys.length === 0) return;
    p.props.pitchDelete();
  };

  initFormList = () => {
    const p = this;
    const { getFieldDecorator } = p.props.form;
    const { formList } = this.props;
    const { extendFormList } = this.props;
    const formItemList = [];
    if (formList && formList.length > 0) {
      formList.forEach(item => {
        const { label } = item;
        const { field } = item;
        const { tree } = item;
        const initialValue = item.initialValue || undefined;
        const { placeholder } = item;
        const { width } = item;
        const { style } = item;
        const { name } = item;
        const mode = item.mode || null;
        if (item.type === 'time') {
          const beginTime = (
            <FormItem label="选择日期" label={label} key={1}>
              {getFieldDecorator('startTime')(
                <DatePicker
                  style={{ width }}
                  showTime
                  // placeholder={placeholder}
                  placeholder="开始时间"
                  // format="YYYY-MM-DD HH:mm:ss"
                  format="YYYY-MM-DD"
                />
              )}
            </FormItem>
          );
          formItemList.push(beginTime);
          const endTime = (
            <FormItem label="~" colon={false} key={2}>
              {getFieldDecorator('endTime')(
                <DatePicker
                  style={{ width }}
                  showTime
                  // placeholder={placeholder}
                  // format="YYYY-MM-DD HH:mm:ss"
                  placeholder="结束时间"
                  format="YYYY-MM-DD"
                />
              )}
            </FormItem>
          );
          formItemList.push(endTime);
        }else if (item.type === 'time1') {
          const beginTime = (
            <FormItem label="选择日期" label={label} key={1}>
              {getFieldDecorator('startTime1')(
                <DatePicker
                  style={{ width }}
                  showTime
                  placeholder="开始时间"
                  format="YYYY-MM-DD"
                />
              )}
            </FormItem>
          );
          formItemList.push(beginTime);
          const endTime = (
            <FormItem label="~" colon={false} key={2}>
              {getFieldDecorator('endTime1')(
                <DatePicker
                  style={{ width }}
                  showTime
                  placeholder="结束时间"
                  format="YYYY-MM-DD"
                />
              )}
            </FormItem>
          );
          formItemList.push(endTime);
        } else if (item.type === 'INPUT') {
          const INPUT = (
            <FormItem label={label} key={field} style={style}>
              {getFieldDecorator(`${field}`, {
                initialValue,
              })(<Input type="text" style={{ width }} placeholder={placeholder} />)}
            </FormItem>
          );
          formItemList.push(INPUT);
        } else if (item.type === 'SELECT') {
          // console.log(item.list[0]&&item.list[0].id,'item.list[0].id??')
          const SELECT = (
            <FormItem label={label} key={field}>
              {getFieldDecorator(`${field}`, {
                initialValue: item.list[0] && item.list[0].id,
              })(
                <Select
                  style={{ width }}
                  placeholder={placeholder}
                  mode={mode}
                  // onSelect={value => this.props.onSelect(value)}
                  onSelect={value => this.props.onSelect && this.props.onSelect(value)}
                >
                  {Utils.getOptionList(item.list, name)}
                </Select>
              )}
            </FormItem>
          );
          formItemList.push(SELECT);
        }else if (item.type === 'SELECT1') {
          // console.log(item.list[0]&&item.list[0].id,'item.list[0].id??')
          const SELECT = (
            <FormItem label={label} key={field}>
              {getFieldDecorator(`${field}`, {
                initialValue: '',
              })(
                <Select
                  style={{ width }}
                  placeholder={placeholder}
                  mode={mode}
                  // onSelect={value => this.props.onSelect(value)}
                  onSelect={value => this.props.onSelect && this.props.onSelect(value)}
                >
                  {Utils.getOptionList(item.list, name)}
                </Select>
              )}
            </FormItem>
          );
          formItemList.push(SELECT);
        } else if (item.type === 'CHECKBOX') {
          const CHECKBOX = (
            <FormItem label={label} key={field}>
              {getFieldDecorator(`${field}`, {
                valuePropName: 'checked',
                initialValue, // true | false
              })(<Checkbox>{label}</Checkbox>)}
            </FormItem>
          );
          formItemList.push(CHECKBOX);
        } else if (item.type === 'CASCADER') {
          const CASCADER = (
            <FormItem label={label} key={field}>
              {getFieldDecorator(`${field}`, {
                initialValue, // true | false
              })(
                <Cascader
                  style={{ width }}
                  placeholder={placeholder}
                  allowClear
                  options={tree}
                  // placeholder="请选择所属类目"
                  expandTrigger="hover"
                />
              )}
            </FormItem>
          );
          formItemList.push(CASCADER);
        }
      });
    }
    if (extendFormList && extendFormList.length > 0) {
      extendFormList.forEach(item => {
        const { label } = item;
        const { field } = item;
        const { style } = item;
        const { name } = item;
        const initialValue = item.initialValue || undefined;
        const { placeholder } = item;
        const { width } = item;
        if (item.type === 'INPUT') {
          const INPUT = (
            <FormItem label={label} key={field} style={style}>
              {getFieldDecorator(`${field}`, {
                initialValue,
              })(<Input type="text" placeholder={placeholder} style={{ width }} />)}
            </FormItem>
          );
          if (this.props.moreSearch === true) {
            formItemList.push(INPUT);
          } else {
            formItemList.push([]);
          }
        } else if (item.type === 'time') {
          const Time = (
            <div key={1}>
              <FormItem label="选择日期" label={label} key={1} style={{ style }}>
                {getFieldDecorator('startTime')(
                  <DatePicker
                    style={{ width }}
                    showTime
                    // placeholder={placeholder}
                    placeholder="开始时间"
                    // format="YYYY-MM-DD HH:mm:ss"
                    format="YYYY-MM-DD"
                  />
                )}
              </FormItem>
              <FormItem label="~" colon={false} key={2} style={{ style }}>
                {getFieldDecorator('endTime')(
                  <DatePicker
                    style={{ width }}
                    showTime
                    // placeholder={placeholder}
                    // format="YYYY-MM-DD HH:mm:ss"
                    placeholder="结束时间"
                    format="YYYY-MM-DD"
                  />
                )}
              </FormItem>
            </div>
          );
          if (this.props.moreSearch === true) {
            formItemList.push(Time);
          } else {
            formItemList.push([]);
          }
        }else if (item.type === 'time1') {
          const Time = (
            <div key={1}>
              <FormItem label="选择日期" label={label} key={1} style={{ style }}>
                {getFieldDecorator('startTime1')(
                  <DatePicker
                    style={{ width }}
                    showTime
                    // placeholder={placeholder}
                    placeholder="开始时间"
                    // format="YYYY-MM-DD HH:mm:ss"
                    format="YYYY-MM-DD"
                  />
                )}
              </FormItem>
              <FormItem label="~" colon={false} key={2} style={{ style }}>
                {getFieldDecorator('endTime1')(
                  <DatePicker
                    style={{ width }}
                    showTime
                    // placeholder={placeholder}
                    // format="YYYY-MM-DD HH:mm:ss"
                    placeholder="结束时间"
                    format="YYYY-MM-DD"
                  />
                )}
              </FormItem>
            </div>
          );
          if (this.props.moreSearch === true) {
            formItemList.push(Time);
          } else {
            formItemList.push([]);
          }
        } else if (item.type === 'CHECKBOX') {
          const CHECKBOX = (
            <FormItem label={label} key={field} style={{ width }}>
              {getFieldDecorator(`${field}`, {
                valuePropName: 'checked',
                initialValue, // true | false
              })(
                <CheckboxGroup placeholder={placeholder}>
                  {Utils.getCheckboxList(item.list)}
                </CheckboxGroup>
              )}
            </FormItem>
          );
          if (this.props.moreSearch === true) {
            formItemList.push(CHECKBOX);
          } else {
            formItemList.push([]);
          }
        } else if (item.type === 'SELECT') {
          // moreSearch
          const SELECT = (
            <FormItem label={label} key={field} style={style}>
              {getFieldDecorator(`${field}`, {
                initialValue,
              })(
                <Select style={{ width }} placeholder={placeholder}>
                  {Utils.getOptionList(item.list, name)}
                </Select>
              )}
            </FormItem>
          );
          if (this.props.moreSearch === true) {
            formItemList.push(SELECT);
          } else {
            formItemList.push([]);
          }
        }
      });
    }

    return formItemList;
  };

  render() {
    const nameList = this.props.name || [];
    const note = this.props.note || '';
    const noteClass = this.props.noteClass || '';
    const { selectedRowKeys } = this.props;
    const changeStyle = {
      display: 'block',
    };
    const block = {
      display: 'inline-block',
    };
    return (
      <Form layout="inline">
        {/* 初始化加载这个方法 */}
        {this.initFormList()}
        <FormItem style={this.props.moreSearch ? changeStyle : block}>
          <Button type="primary" style={{ margin: '0 20px' }} onClick={this.handleFilterSubmit}>
            查询
          </Button>
          <Button onClick={this.reset} style={{ marginRight: '20px' }}>
            重置
          </Button>
          {nameList.map(item => {
            const domlist = []; 
            if (item === 'add') {
              domlist.push(
                <Button
                  key={item}
                  type="primary"
                  style={{ margin: '0 20px' }}
                  onClick={this.handleAdd}
                  className={`add${noteClass}`}
                >
                  新增{note}
                </Button>
              );
            } else if (item === 'patch') {
              domlist.push(
                <Popconfirm
                  title="确定删除？"
                  onConfirm={this.pitchDelete.bind(this, selectedRowKeys)}
                >
                  <Button
                    key={item}
                    disabled={!(selectedRowKeys && selectedRowKeys.length > 0)}
                    type="primary"
                  >
                    批量删除
                  </Button>
                </Popconfirm>
              );
            }
            return domlist;
          })}
          <a
            href="javascript:;"
            style={{ position: 'relative', top: '0px', left: '20px' }}
            onClick={this.props.changeExport}
          >
            {this.props.extendFormList && this.props.extendFormList.length > 0
              ? this.props.moreSearch === false
                ? '展开'
                : '收起'
              : ''}
          </a>
        </FormItem>
      </Form>
    );
  }
}
export default Form.create({})(FilterForm);
