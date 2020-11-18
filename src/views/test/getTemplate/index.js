import React, { Component } from 'react';
import TemplateOne from '../testTemplate/index';
class getTemplate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				search: [
                    {
                        label:'name',
                        type:'input',
                        parameter:'name',
                        list:''
                    },
                    {
                        label:'select',
                        type:'select',
                        parameter:'select',
                        list:[
                            {
                                name:'测试一',
                                value:'0'
                            },
                            {
                                name:'测试二',
                                value:'1'
                            },
                        ]
                    },
                    {
                        label:'selectMore',
                        type:'selectMore',
                        parameter:'selectMore',
                        list:[
                            {
                                name:'测试多一',
                                value:'0'
                            },
                            {
                                name:'测试多二',
                                value:'1'
                            },
                            {
                                name:'测试多三',
                                value:'2'
                            },
                        ]
                    },
                    {
                        label:'time',
                        type:'timeInterval',
                        parameter:'time',
                        list:''
                    },
                ],
				tabs: [
                    {
                        name:'tab1',
                        key:0
                    },
                    {
                        name:'tab2',
                        key:1
                    },
                    {
                        name:'tab3',
                        key:2
                    },
                ],
				table: {
                    columns:[
                        {
                            title:'name',
                            dataIndex:'name',
                        },
                        {
                            title:'age',
                            dataIndex:'age',
                        },
                        {
                            title:'address',
                            dataIndex:'address',
                        },
                        {
                            title:'action',
                            dataIndex:'action',
                            action:['add','edit'],
                        },
                    ]
                }
			}
		};
	}

	render() {
		const { data } = this.state;
		return (
			<div>
				<TemplateOne data={data}></TemplateOne>
			</div>
		);
	}
}
export default getTemplate;
