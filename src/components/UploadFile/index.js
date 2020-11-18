import React, { PureComponent } from 'react';
import { Form, Upload, message, Icon, Button } from 'antd';

const FormItem = Form.Item;

// @Form.create()
class ComPicture extends PureComponent {
  state = {};

  render() {
    const {
      echoPic = [],
      Parent,
      field = '',
      label = '',
      ruleType,
      formItemLayout,
      formItem = {},
      text = '',
      style = {},
      disabled = false,
      uploadType,
      directory = false,
    } = this.props;
    const { getFieldDecorator } = Parent.props.form;
    const token =
      (JSON.parse(localStorage.getItem('USERDATA')) &&
        JSON.parse(localStorage.getItem('USERDATA')).token) ||
      '';

    const props = {
      action: `api/items/upload?type=${uploadType}`,

      // listType: 'picture-card',
      disabled,
      directory, // 支持上传文件夹
      showUploadList: { showDownloadIcon: false },
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      accept: '.zip',
      data(file) {
        return {
          pic: file.name || '',
        };
      },
      onChange(info) {
        const { status } = info.file;
        // if (status !== 'uploading') {

        // }
        if (status === 'done') {
          message.success(`${info.file.name}上传成功！`);
        } else if (status === 'error') {
          message.error(`${info.file.name}上传失败！`);
        }
      },
    };
    return (
      <FormItem
        label={`${label}`}
        {...formItemLayout}
        style={{ width: '60px' }}
        key={`${label}`}
        {...formItem}
        style={style}
      >
        {getFieldDecorator(`${field}`, {
          initialValue: echoPic,
          rules: ruleType || [{ required: true, message: '文件不能为空' }],
          valuePropName: 'fileList',
          getValueFromEvent(e) {
            if (!e || !e.fileList) {
              return e;
            }
            const { fileList } = e;
            return fileList;
          },
        })(
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> Click to Upload
            </Button>
          </Upload>
        )}
        {text && <div style={{ marginTop: '5px', marginBottom: '10px' }}>{text}</div>}
      </FormItem>
    );
  }
}

// export default ComPicture;
export default Form.create()(ComPicture);