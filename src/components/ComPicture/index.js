import React, { PureComponent } from 'react';
import { Form, Upload, message, Modal, Icon } from 'antd';

const comm = require('../../serverConfig');

const FormItem = Form.Item;

// @Form.create()
class ComPicture extends PureComponent {
  state = {
    previewVisible: false,
  };

  handleCancel = () => {
    this.setState({ previewVisible: false });
  };


  onChange = info => {
    const p = this;
    p.setState({ picList: info.fileList || [] });
    if (info.file && info.file.status === 'done') {
      if (info.file.response && info.file.response.code === 0) {
        message.success(`${info.file.name} 成功上传`);
        // 添加文件预览
        const newFile = info.file;
        newFile.url = info.file.response.data;
      } else {
        message.error(
          `${info.file.name} 解析失败：${info.file.response.msg || info.file.response.errorMsg}`
        );
      }
    } else if (info.file && info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };

  render() {
    const p = this;
    const { previewVisible, previewImage, picList } = this.state;

    // console.log(this,'this')
    const {
      echoPic = [],
      Parent,
      field = '',
      picNum = 1,
      label = '',
      picTxt = '上传图片',
      ruleType,
      formItemLayout,
      formItem = {},
      text = '',
      style = {},
    } = this.props;
    const { getFieldDecorator } = Parent.props.form;
    // // 获取初始化的图片列表
    let showAddIcon = false;
    //   // 操作加号
    let firstLoad = true;
    if (picList) firstLoad = false;
    if (firstLoad && !echoPic) showAddIcon = true;
    if (firstLoad && echoPic && echoPic.length < picNum) showAddIcon = true;
    if (!firstLoad && picList && picList.length < picNum) showAddIcon = true;


    const token =
      (JSON.parse(localStorage.getItem('USERDATA')) &&
        JSON.parse(localStorage.getItem('USERDATA')).token) ||
      '';

    const uploadProps = {
      action: comm.baseURL+'common/upload',
      listType: 'picture-card',
      showUploadList: { showDownloadIcon: false },
      headers: {
        // Authorization: token ? `Bearer ${token}` : '',
 
      },
     withCredentials:true,
      data(file) {
        return {
          pic: file.name || '',
        };
      },
      beforeUpload(file) {
        const isImg =
          file.type === 'image/jpeg' ||
          file.type === 'image/bmp' ||
          file.type === 'image/gif' ||
          file.type === 'image/png';
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isImg) {
          message.error('请上传图片文件');
        }
        if (!isLt5M) {
          message.error('照片大小必须小于5M,请重新上传');
        }
        return isImg && isLt5M;
      },
      onPreview(file) {
        p.setState({
          previewVisible: true,
          previewImage: file.url || file.thumbUrl,
        });
      },
      onChange(info) {
        console.log(info,'info///')
        const { status } = info.file;
        // if (status !== 'uploading') {
        //   console.log(info.file, info.fileList);
        // }
        if (status === 'done') {
          message.success(`${info.file.name}上传成功！`);
          // console.log(info,'info///')
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
          rules: ruleType || [{ required: true, message: '该照片不能为空' }],
          valuePropName: 'fileList',
          getValueFromEvent(e) {
            if (!e || !e.fileList) {
              return e;
            }
            const { fileList } = e;
            return fileList;
          },
        })(
          <Upload
            {...uploadProps}
            onChange={this.onChange.bind(this)} 
            style={{ width: '10%' }}
          >
            {showAddIcon && (
              <div>
                <Icon type="plus" className="uploadPlus" />
                <div className="ant-upload-text">{picTxt}</div>
              </div>
            )}
          </Upload>
        )}
        <Modal
          visible={previewVisible}
          title="预览图片"
          footer={null}
          onCancel={this.handleCancel.bind(this)}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        {text && <div style={{ marginTop: '5px', marginBottom: '10px' }}>{text}</div>}
      </FormItem>
    );
  }
}

// export default ComPicture;

export default Form.create()(ComPicture);