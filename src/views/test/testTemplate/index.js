import React, { Component } from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, DatePicker, Tabs, Table, Divider, Tag } from 'antd';
import moment from 'moment';
const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];
const { TabPane } = Tabs;
const residences = [
	{
		value: 'zhejiang',
		label: 'Zhejiang',
		children: [
			{
				value: 'hangzhou',
				label: 'Hangzhou',
				children: [
					{
						value: 'xihu',
						label: 'West Lake'
					}
				]
			}
		]
	},
	{
		value: 'jiangsu',
		label: 'Jiangsu',
		children: [
			{
				value: 'nanjing',
				label: 'Nanjing',
				children: [
					{
						value: 'zhonghuamen',
						label: 'Zhong Hua Men'
					}
				]
			}
		]
	}
];
class testTemplate extends Component {
	state = {
		confirmDirty: false,
		autoCompleteResult: []
	};
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
			}
		});
	};
	render() {
		const { getFieldDecorator } = this.props.form;
		const { autoCompleteResult } = this.state;

		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 8 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 }
			}
		};
		const tailFormItemLayout = {
			wrapperCol: {
				xs: {
					span: 24,
					offset: 0
				},
				sm: {
					span: 16,
					offset: 8
				}
			}
		};
		const prefixSelector = getFieldDecorator('prefix', {
			initialValue: '86'
		})(
			<Select style={{ width: 70 }}>
				<Option value="86">+86</Option>
				<Option value="87">+87</Option>
			</Select>
		);
		function callback(key) {
			console.log(key);
		}
		// const columns = [
		// 	{
		// 		title: 'Name',
		// 		dataIndex: 'name',
		// 		key: 'name',
		// 		render: text => <a>{text}</a>
		// 	},
		// 	{
		// 		title: 'Age',
		// 		dataIndex: 'age',
		// 		key: 'age'
		// 	},
		// 	{
		// 		title: 'Address',
		// 		dataIndex: 'address',
		// 		key: 'address'
		// 	},
		// 	{
		// 		title: 'Tags',
		// 		key: 'tags',
		// 		dataIndex: 'tags',
		// 		render: tags => (
		// 			<span>
		// 				{tags.map(tag => {
		// 					let color = tag.length > 5 ? 'geekblue' : 'green';
		// 					if (tag === 'loser') {
		// 						color = 'volcano';
		// 					}
		// 					return (
		// 						<Tag color={color} key={tag}>
		// 							{tag.toUpperCase()}
		// 						</Tag>
		// 					);
		// 				})}
		// 			</span>
		// 		)
		// 	},
		// 	{
		// 		title: 'Action',
		// 		key: 'action',
		// 		render: (text, record) => (
		// 			<span>
		// 				<a>Invite {record.name}</a>
		// 				<Divider type="vertical" />
		// 				<a>Delete</a>
		// 			</span>
		// 		)
		// 	}
		// ];
		const listHeader = () => {
			var columns_1 = this.props.data.table.columns;
			var list = [];
			for (var i in columns_1) {
				var obj = {
					title: columns_1[i].title,
					dataIndex: columns_1[i].dataIndex,
					key:columns_1[i].dataIndex,
				};
				if (columns_1[i].action) {
					obj.render = (text, record) => {
						return <div>
							{columns_1[i].action.map((item, index) => {
								return (
									<span key={index}>
										<a>{item}</a>
										<Divider type="vertical" />
									</span>
								);
							})}
						</div>	
					};
				}
				list.push(obj);
			}
			return list
		};
		const columns = listHeader()
		console.log(columns)
		const data = [
			{
				key: '1',
				name: 'John Brown',
				age: 32,
				address: 'New York No. 1 Lake Park',
				tags: ['nice', 'developer']
			},
			{
				key: '2',
				name: 'Jim Green',
				age: 42,
				address: 'London No. 1 Lake Park',
				tags: ['loser']
			},
			{
				key: '3',
				name: 'Joe Black',
				age: 32,
				address: 'Sidney No. 1 Lake Park',
				tags: ['cool', 'teacher']
			}
		];
		// console.log(this.props);
		return (
			<div>
				<div className="templateHeader">
					<Form onSubmit={this.handleSubmit} layout="inline">
						{this.props.data.search.map((item, index) => {
							switch (item.type) {
								case 'input':
									return (
										<Form.Item label={item.label} key={item.label}>
											{getFieldDecorator(`${item.parameter}`, {
												initialValue: '',
												rules: [
													{
														required: true,
														message: 'Please input your E-mail!'
													}
												]
											})(<Input />)}
										</Form.Item>
									);
								case 'select':
									return (
										<Form.Item label={item.label} key={item.label}>
											{getFieldDecorator(`${item.parameter}`, {
												initialValue: '',
												rules: [{ required: true, message: 'Please select your gender!' }]
											})(
												<Select style={{ width: 160 }} placeholder="Select a option and change input text above">
													{item.list.map((item, index) => {
														return (
															<Option value={item.value} key={index}>
																{item.name}
															</Option>
														);
													})}
												</Select>
											)}
										</Form.Item>
									);
								case 'selectMore':
									return (
										<Form.Item label={item.label} key={item.label}>
											{getFieldDecorator(`${item.parameter}`, {
												initialValue: [],
												rules: [{ required: true, message: 'Please select !' }]
											})(
												<Select style={{ width: 160 }} mode="multiple" placeholder="Select a option and change input text above">
													{item.list.map((item, index) => {
														return (
															<Option value={item.value} key={index}>
																{item.name}
															</Option>
														);
													})}
												</Select>
											)}
										</Form.Item>
									);
								case 'timeInterval':
									return (
										<Form.Item label={item.label} key={item.label}>
											{getFieldDecorator(`${item.parameter}`, {
												initialValue: [moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)],
												rules: [{ required: true, message: 'please select time' }]
											})(<RangePicker format={dateFormat} />)}
										</Form.Item>
									);
							}
						})}
						{/* <Form.Item label="Habitual Residence">
							{getFieldDecorator('residence', {
								initialValue: ['zhejiang', 'hangzhou', 'xihu'],
								rules: [{ type: 'array', required: true, message: 'Please select your habitual residence!' }]
							})(<Cascader options={residences} />)}
						</Form.Item> */}
						{/* <Form.Item label="Phone Number">
							{getFieldDecorator('phone', {
								rules: [{ required: true, message: 'Please input your phone number!' }]
							})(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
						</Form.Item> */}
						<Form.Item {...tailFormItemLayout}>
							<Button type="primary" htmlType="submit">
								Register
							</Button>
						</Form.Item>
					</Form>
				</div>
				<div className="tabs">
					<Tabs onChange={callback}>
						{this.props.data.tabs.map((item, index) => {
							return <TabPane tab={item.name} key={item.key}></TabPane>;
						})}
					</Tabs>
				</div>
				<div className="tableContent">
					<Table columns={columns} dataSource={data} />
				</div>
			</div>
		);
	}
}
export default Form.create()(testTemplate);
