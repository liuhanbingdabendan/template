import React, { Component } from 'react';
import Particles from 'react-particles-js';
import { Form, Row, Col, Icon, Input, Button, message } from 'antd';
import { connect } from 'react-redux';
import { setUserInfo } from '@/redux/actions/userInfo';
import '@/assets/css/login';
import { getCaptcha, toLogin } from '@/service/api';

const FormItem = Form.Item;
class Login extends Component {
	state = { clientHeight: document.documentElement.clientHeight || document.body.clientHeight };
	constructor(props) {
		super(props);
		this.onResize = this.onResize.bind(this);
		this.state = {
			image: ''
		};
	}

	login = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			values.rememberMe = false;
			localStorage.setItem('isLogin', '1');
			//模拟生成一些数据
			this.props.setUserInfo(Object.assign({}, values, { role: { type: 1, name: '超级管理员' } }));
			localStorage.setItem('userInfo', JSON.stringify(Object.assign({}, values, { role: { type: 1, name: '超级管理员' } })));
			this.props.history.push('/home');
			// return
			if (!err) {
				let data = values;
				toLogin(data).then(res => {
					if (!res) return;
					message.success('登录成功');
					localStorage.setItem('isLogin', '1');
					//模拟生成一些数据
					this.props.setUserInfo(Object.assign({}, values, { role: { type: 1, name: '超级管理员' } }));
					localStorage.setItem('userInfo', JSON.stringify(Object.assign({}, values, { role: { type: 1, name: '超级管理员' } })));
					this.props.history.push('/home');
				});
			} else {
				console.log(err);
			}
		});
	};
	componentDidMount() {
		window.addEventListener('resize', this.onResize);
		this.getCaptchaInfo();
	}

	componentWillUnmount() {
		window.addEventListener('resize', this.onResize);
		// componentWillMount进行异步操作时且在callback中进行了setState操作时，需要在组件卸载时清除state
		this.setState = () => {
			return;
		};
	}
	onResize() {
		this.setState({ clientHeight: document.documentElement.clientHeight || document.body.clientHeight });
	}

	// 获取图形验证码
	getCaptchaInfo() {
		const p = this;
		getCaptcha().then(res => {
			p.setState({
				image: res
			});
		});
	}

	// 切换图形验证码
	handleChangeImg = () => {
		this.getCaptchaInfo();
	};
	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div className="container">
				<Particles
					height={this.state.clientHeight - 5 + 'px'}
					params={{
						number: { value: 50 },
						ize: { value: 3 },
						interactivity: {
							events: {
								onhover: { enable: true, mode: 'repulse' }
							}
						}
					}}
				/>
				<div className="content">
					<div className="title">后台管理系统</div>
					<Form className="login-form">
						<FormItem>
							{getFieldDecorator('username', {
								rules: [{ required: true, message: '请填写用户名！' }]
							})(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />)}
						</FormItem>
						<FormItem>
							{getFieldDecorator('password', {
								rules: [{ required: true, message: '请填写密码！' }]
							})(<Input.Password prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="密码" />)}
						</FormItem>
						<FormItem>
							<Row>
								<Col align="left" span={12}>
									{getFieldDecorator('validateCode', {
										rules: [{ required: true, message: '请填写验证码！' }]
									})(<Input placeholder="验证码" />)}
								</Col>
								<Col align="right" span={12}>
									<img src={this.state.image} alt="" onClick={this.handleChangeImg.bind(this)} />
								</Col>
							</Row>
						</FormItem>

						<FormItem>
							<Button type="primary" htmlType="submit" block onClick={this.login}>
								登录
							</Button>
						</FormItem>
					</Form>
				</div>
			</div>
		);
	}
}
// <div style={{ color: '#999',paddingTop:'10px',textAlign:'center' }}>Tips : 输入任意用户名密码即可</div>
const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
	setUserInfo: data => {
		dispatch(setUserInfo(data));
	}
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Login));
