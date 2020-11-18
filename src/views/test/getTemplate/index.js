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
                        list:[]
                    },
                    {
                        label:'selectMore',
                        type:'selectMore',
                        parameter:'selectMore',
                        list:[]
                    },
                    {
                        label:'time',
                        type:'timeInterval',
                        parameter:'time',
                        list:''
                    },
                ],
				tabs: [],
				table: []
			}
		};
	}

	render() {
		console.log(this.state);
		const { data } = this.state;
		return (
			<div>
				<TemplateOne data={data}></TemplateOne>
			</div>
		);
	}
}
export default getTemplate;
