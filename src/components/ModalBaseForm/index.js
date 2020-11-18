import React, { useState } from 'react';
import {
  Input,
  Select,
  Form,
  Checkbox,
  DatePicker,
  Cascader,
  Modal,
  Radio,
  Tree,
  TreeSelect,
  InputNumber,
  Switch
} from 'antd';

import ComPicture from '../ComPicture';
import Utils from '@/utils/utilsT';
import UploadFile from '../UploadFile';
import TextEditor from "@/components/TextEditor";

const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class ModalBaseForm extends React.Component {
  state = {
    checkedKeys:[],
    checkedKeysList:[]
  };

  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this);
    //this.updataCheckedKeys()
  }
  // updataCheckedKeys = () =>{
  //   let menuIdList = sessionStorage.getItem('menuIdList')
  //   console.log(menuIdList)
  //   this.setState({
	// 		checkedKeys: menuIdList
  //   });
  // }
  reset = () => {
    const p = this;
    p.props.form.resetFields();
  };

  handleAdd = () => {
    const p = this;
    p.props.handleOpenModal('add');
  };

  pitchDelete = () => {
    const p = this;
    p.props.pitchDelete();
  };
  onCheck = (checkedKeys) => {
    console.log(checkedKeys)
    this.setState({
      checkedKeys:checkedKeys,
			checkedKeysList: checkedKeys.join(',')
    });
    sessionStorage.setItem('menuIdList',checkedKeys);
  };
  onTreeChange = () => {};

  initFormList = () => {
    const p = this;
    const { getFieldDecorator } = p.props.form;
    const { modalFormList } = this.props;
    const formItemList = [];
    console.log('modebaseform')
    console.log(this.props)
    if (modalFormList && modalFormList.length > 0) {
      modalFormList.forEach(item => {
        const {
          label,
          field,
          tree,
          rules,
          detail,
          disabled,
          addonAfter,
          autoSearch,
          onInputChange,
          format,
          disabledDate,
          dom,
          directory,
          echoPic=[],
          submitEditValue
        } = item;
        const rulesType = rules || [{ required: true, message: `${label}必填` }];

        const initialValue = item.initialValue || undefined;
        // const {validator} = item
        const { placeholder } = item;
        const { width } = item;
        const { style } = item;
        const { name } = item;
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
          },
        };
        if (item.type === 'time') {
          const beginTime = (
            <FormItem label="选择日期" label={label} {...formItemLayout} key={1}>
              {getFieldDecorator('beginTime')(
                <DatePicker style={{ width }} showTime placeholder="开始时间" format="YYYY-MM-DD" />
              )}
            </FormItem>
          );
          formItemList.push(beginTime);
          const endTime = (
            <FormItem label="~" colon={false} key={2} {...formItemLayout}>
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
        } else if (item.type === 'oneTime') {
          const oneTime = (
            <FormItem label="选择日期" label={label} {...formItemLayout} key={1}>
              {getFieldDecorator('beginTime', {
                rules: rulesType,
              })(
                <DatePicker
                  style={{ width }}
                  showTime
                  placeholder="选择时间"
                  disabledDate={disabledDate}
                  format={format || 'YYYY-MM-DD'}
                />
              )}
            </FormItem>
          );
          formItemList.push(oneTime);
        } else if (item.type === 'INPUT') {
          const INPUT = (
            <FormItem label={label} key={field} style={style} {...formItemLayout}>
              {detail
                ? initialValue
                : getFieldDecorator(`${field}`, {
                    rules: rulesType,
                    initialValue,
                  })(
                    <Input
                      type="text"
                      disabled={disabled}
                      addonAfter={addonAfter || ''}
                      style={{ width }}
                      placeholder={placeholder}
                      onChange={e => onInputChange && onInputChange(e)}
                    />
                  )}
            </FormItem>
          );
          formItemList.push(INPUT);
        } else if (item.type === 'PASSWORD') {
          const INPUT = (
            <FormItem label={label} key={field} style={style} {...formItemLayout}>
              {detail
                ? initialValue
                : getFieldDecorator(`${field}`, {
                    rules: rulesType,
                    initialValue,
                  })(
                    <Input.Password
                      type="text"
                      disabled={disabled}
                      addonAfter={addonAfter || ''}
                      style={{ width }}
                      placeholder={placeholder}
                      onChange={e => onInputChange && onInputChange(e)}
                    />
                  )}
            </FormItem>
          );
          formItemList.push(INPUT);
        }else if (item.type === 'INPUTNUM') {
          const INPUTNUM = (
            <FormItem label={label} key={field} style={style} {...formItemLayout}>
              {getFieldDecorator(`${field}`, {
                rules: rulesType,
                initialValue: initialValue || 0,
              })(
                <InputNumber
                  disabled={disabled}
                  type="text"
                  style={{ width }}
                  placeholder={placeholder}
                />
              )}
            </FormItem>
          );
          formItemList.push(INPUTNUM);
        } else if (item.type === 'TEXTAREA') {
          const TEXTAREA = (
            <FormItem label={label} key={field} style={style} {...formItemLayout}>
              {getFieldDecorator(`${field}`, {
                rules: rulesType,
                initialValue,
              })(
                <TextArea
                  type="text"
                  autosize={{ minRows: 4, maxRows: 6 }}
                  style={{ width }}
                  placeholder={placeholder}
                />
              )}
            </FormItem>
          );
          formItemList.push(TEXTAREA);
        } else if (item.type === 'UPLOAD') {
          const UPLOAD = (
            <ComPicture
              formItemLayout={formItemLayout}
              Parent={p}
              label={label}
              ruleType={rules}
              field={field}
              style={{ width: '100%' }}
              picNum={1}
              formItem={{
                style: { width: '100%' },
              }}
              echoPic={echoPic}
              text="* 建议: 图片750 * 340dpi,小于3M"
            />
          );
          formItemList.push(UPLOAD);
        } else if (item.type === 'UPLOADFILE') {
          const UPLOADFILE = (
            <UploadFile
              formItemLayout={formItemLayout}
              Parent={p}
              label={label}
              ruleType={rules}
              field={field}
              directory={directory}
              formItem={{
                style: { width: '100%' },
              }}
              uploadType={1}
            />
          );
          formItemList.push(UPLOADFILE);
        } else if (item.type === 'DOM') {
          const DOM = <div style={style}>{dom}</div>;
          formItemList.push(DOM);
        } else if (item.type === 'SELECT') {
          const SELECT = (
            <FormItem label={label} key={field} {...formItemLayout}>
              {getFieldDecorator(`${field}`, {
                rules: rulesType,
                initialValue,
              })(
                <Select
                  style={{ width }}
                  {...autoSearch}
                  placeholder={placeholder}
                  onSelect={value => this.props.onSelect && this.props.onSelect(value)}
                  onChange={value => this.props.onChange && this.props.onChange(value)}
                >
                  {Utils.getOptionList(item.list, name)}
                </Select>
              )}
            </FormItem>
          );
          formItemList.push(SELECT);
        }else if (item.type === 'SELECTTAG') {
          const SELECTTAG = (
            <FormItem label={label} key={field} {...formItemLayout}>
              {getFieldDecorator(`${field}`, {
                rules: rulesType,
                initialValue,
              })(
                <Select mode="tags" style={{ width }} placeholder={placeholder}   onChange={value => this.props.onChange && this.props.onChange(value)}>
                {Utils.getOptionList(item.list, name)}
              </Select>,
              )}
            </FormItem>
          );
          formItemList.push(SELECTTAG);
        }else if (item.type === 'SELECTMULTIPLE') {
          const SELECTTAG = (
            <FormItem label={label} key={field} {...formItemLayout}>
              {getFieldDecorator(`${field}`, {
                rules: rulesType,
                initialValue,
              })(
                <Select mode="multiple" style={{ width }} placeholder={placeholder}   onChange={value => this.props.onChange && this.props.onChange(value)}>
                {Utils.getOptionList(item.list, name)}
              </Select>,
              )}
            </FormItem>
          );
          formItemList.push(SELECTTAG);
        } else if (item.type === 'TREESELECT') {
          console.log(this.state.checkedKeys)
          const REDIO = (
            <FormItem label={label} key={field} {...formItemLayout}>
              {getFieldDecorator(`${field}`, {
                // rules: rulesType,
                initialValue,
              })(
                <Tree
                  checkable={true}
                  showLine={true}
                  // onCheck ={value => }
                  style={{ width }}
                  treeData={tree}
                  showCheckedStrategy="SHOW_PARENT"
                  checkedKeys={this.state.checkedKeys.length != 0 ? this.state.checkedKeys : initialValue}
                   onCheck={this.onCheck}
                  treeCheckable
                />
              )}
            </FormItem>
          );
          formItemList.push(REDIO);
        } else if (item.type === 'REDIO') {
          const REDIO = (
            <FormItem label={label} key={field} {...formItemLayout}>
              {getFieldDecorator(`${field}`, {
                rules: rulesType,
                initialValue: initialValue || 0,
              })(
                <RadioGroup
                  onChange={this.onChange}
                  disabled={disabled}
                  style={{ width }}
                  placeholder={placeholder}
                >
                  {Utils.getRadioList(item.list, name)}
                </RadioGroup>
              )}
            </FormItem>
          );
          formItemList.push(REDIO);
        } else if (item.type === 'CHECKBOX') {
          const CHECKBOX = (
            <FormItem label={label} key={field} {...formItemLayout}>
              {getFieldDecorator(`${field}`, {
                valuePropName: 'checked',
                initialValue, // true | false
              })(<Checkbox>{label}</Checkbox>)}
            </FormItem>
          );
          formItemList.push(CHECKBOX);
        } else if (item.type === 'CHECKBOXGROUP') {
          const CHECKBOXGROUP = (
            <FormItem label={label} key={field} {...formItemLayout}>
              {getFieldDecorator(`${field}`, {
                valuePropName: 'checked',
                initialValue, // true | false
              })(
                <CheckboxGroup placeholder={placeholder} value={initialValue} >
                  {Utils.getCheckboxList(item.list, name)}
                </CheckboxGroup>
              )}
            </FormItem>
          );
          formItemList.push(CHECKBOXGROUP);
        } else if (item.type === 'SWITCH') {
          const SWITCH = (
            <FormItem label={label} key={field} {...formItemLayout}>
              {getFieldDecorator(`${field}`, {
                valuePropName: 'checked',
                initialValue:initialValue==='0', // true | false
              })(<Switch  onChange={this.onChange}/>)}
            </FormItem>
          );
          formItemList.push(SWITCH);
        } 
        else if (item.type === 'SWITCHID') {
          const SWITCHID = (
						<FormItem label={label} key={field} {...formItemLayout}>
							{getFieldDecorator(`${field}`, {
								valuePropName: 'checked',
                initialValue, // true | false
							})(<Switch onChange={this.onChange} />)}
						</FormItem>
					);
          formItemList.push(SWITCHID);
        } 
        else if (item.type === 'Editor') {
          const Editor = (
            <FormItem label={label} key={field} {...formItemLayout} style={{height:'340px'}}>
              {getFieldDecorator(`${field}`, {
                valuePropName: 'checked',
                initialValue, // true | false
              })(<TextEditor initialData={initialValue} submitEditValue={submitEditValue} />)}
            </FormItem>
          );
          formItemList.push(Editor);
        } else if (item.type === 'CASCADER') {
          const CASCADER = (
            <FormItem label={label} key={field} {...formItemLayout}>
              {getFieldDecorator(`${field}`, {
                initialValue, // true | false
              })(
                <Cascader
                  style={{ width }}
                  placeholder={placeholder}
                  allowClear
                  options={tree}
                  expandTrigger="hover"
                />
              )}
            </FormItem>
          );
          formItemList.push(CASCADER);
        }
      });
    }
    return formItemList;
  };

  closeModal = () => {
    const p = this;
    const { form, close } = p.props;
    form.resetFields();
    close();
    p.setState({
      checkedKeys:[],
    });
  };

  handleSubmit = () => {
    const p = this;
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      p.props.submit(values);
      form.resetFields();
      p.setState({
        checkedKeys:[],
      });
    });
    
  };

  render() {
    const p = this;
    const { visible, title,width= 500  } = this.props;
    const modalProps = {
      title,
      visible,
      width,
      onOk() {
        p.handleSubmit();
      },
      onCancel() {
        p.closeModal();
      },
    };

    return (
      <Modal {...modalProps}>
        <Form layout="horizontal" onSubmit={p.handleSubmit.bind(p)}>
          {p.initFormList()}
        </Form>
      </Modal>
    );
  }
}
export default Form.create({})(ModalBaseForm);
