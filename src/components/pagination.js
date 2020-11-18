import React, { Component } from 'react';
import { Pagination} from 'antd';
class pagination extends Component {
    constructor(props){
        super(props)
        this.state={
            pagination: {
                pageSize: 10,
                current: 1
            },
        };
    }
    
	render() {

		return (
            <Pagination 
                showSizeChanger 
                pageSize={this.state.pagination.pageSize} 
                showTotal={total => `共${total}条数据`}
            >
            </Pagination>
		);
	}
}
export default pagination
