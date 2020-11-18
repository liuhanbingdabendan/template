import React from 'react';
import { Modal, Button, Upload, Icon, message, Checkbox, Row, Col } from 'antd';

class ModalUpload extends React.Component {
  state = {
    updateSupport:false,
    uploadFile:''
  };

  closeModal = () => {
    const p = this;
    const { close } = p.props;
    // form.resetFields();
    close();
  };

  handleSubmit = () => {
    console.log('1111')
    console.log(this.state)
    this.props.submit(this.state)
    // const p = this;
    // const { form } = this.props;
    // form.validateFieldsAndScroll((err, values) => {
    // 	if (err) {
    // 		return;
    // 	}
    // 	p.props.submit(values);
    // 	form.resetFields();
    // });
  };
  onChangeCheckbox = (e) => {
    console.log(e)
    this.setState({
			updateSupport: e.target.checked
    });
    console.log(this.state.updateSupport)
  }
  downloadMB =() =>{
    this.props.downloadExport();
  }
  render() {
    const p = this;
    const { visible, title, width = 500,  disabled = false, directory = false } = this.props;
    const modalProps = {
      title,
      visible,
      width,
      onOk() {
        p.handleSubmit();
      },
      onCancel() {
        p.closeModal();
      }
    };
    const token =
      (JSON.parse(localStorage.getItem('USERDATA')) &&
        JSON.parse(localStorage.getItem('USERDATA')).token) ||
      '';

    const props = {
      // action: { uploadUrl },
      // listType: 'picture-card',
      disabled,
      directory, // 支持上传文件夹
      showUploadList: { showDownloadIcon: false },
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      customRequest(){

      },
      beforeUpload(file){
        console.log(file)
        p.setState({
          uploadFile: file
        });
      }
    };

    return (
      <Modal {...modalProps}>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> 上传文件
            </Button>
        </Upload>
        <Row>
            <Col span={24}>
              <Checkbox onChange={this.onChangeCheckbox}>是否更新已经存在的用户数据</Checkbox>
              <Button type="primary" icon='download' onClick={this.downloadMB}>>下载模板</Button>
            </Col>
            <Col span={24}>
              <p className="pStyle">提示：仅允许导入“xls”或“xlsx”格式文件！</p>
            </Col>
          </Row>
      </Modal>
    );
  }
}
export default (ModalUpload);
