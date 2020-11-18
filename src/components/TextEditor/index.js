import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import draftToMarkdown from 'draftjs-to-markdown';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';

import '../../assets/css/editor';
// https://www.jianshu.com/p/c6f3a4e5d324 
// https://blog.csdn.net/genius_yym/article/details/82776430?utm_source=distribute.pc_relevant.none-task
// https://jpuri.github.io/react-draft-wysiwyg/#/docs

const comm = require('../../serverConfig');
const rawContentState = {
	entityMap: { '0': { type: 'IMAGE', mutability: 'MUTABLE', data: { src: 'http://i.imgur.com/aMtBIep.png', height: 'auto', width: '100%' } } },
	blocks: [{ key: '9unl6', text: '', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} }, { key: '95kn', text: ' ', type: 'atomic', depth: 0, inlineStyleRanges: [], entityRanges: [{ offset: 0, length: 1, key: 0 }], data: {} }, { key: '7rjes', text: '', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} }]
};

class TextEditor extends Component {
	state = {
		editorContent: undefined,
		contentState: rawContentState,
		editorState: ''
    };
	
	
	componentDidMount(){		
		const contentBlock = htmlToDraft(this.props.initialData);
        if(contentBlock){
			const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
			const editorState = EditorState.createWithContent(contentState);
			this.setState({ editorState })
		}
	}

	onEditorChange = editorContent => {
       const {submitEditValue} = this.props;
		this.setState({
			editorContent
        });
        submitEditValue(draftToHtml(editorContent))
	};

	clearContent = () => {
		this.setState({
			contentState: ''
		});
	};

	onContentStateChange = contentState => {
        // this.setState({
        //     contentState
        // })
	};

	onEditorStateChange = editorState => {
		this.setState({
			editorState
		});
	};

	imageUploadCallBack = file =>
		new Promise((resolve, reject) => {
			console.log("to upload file");
			const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
			xhr.setRequestHeader('Authorization', 'Client-ID 8d26ccd12712fca');
			xhr.setRequestHeader('Origin', comm.baseURL);
			xhr.withCredentials = true;
			xhr.open('POST', comm.baseURL+'/common/upload');

			const data = new FormData(); // eslint-disable-line no-undef
            data.append('file', file);
            
			xhr.send(data);
			xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText);
                console.log(response,'response')
                // 处理返回数据
                let formdata = {
                    data:{
                        link : response.url
                    }
                }
				resolve(formdata);
			});
			xhr.addEventListener('error', () => {
				const error = JSON.parse(xhr.responseText);
				reject(error);
			});
		});

	render() {
        const { editorContent, editorState } = this.state;

		return (
			<div className="shadow-radius" style={{width:400,marginBottom:20}}>
				<div className="gutter-example button-demo editor-demo" >
					<Row gutter={16} style={{padding:'0 5px'}}>
						<Col className="gutter-row" md={24} >
							<div className="gutter-box " >
                                    <Editor
										editorState={editorState}
										toolbarClassName="home-toolbar"
										wrapperClassName="home-wrapper"
										editorClassName="home-editor"
										onEditorStateChange={this.onEditorStateChange}
										toolbar={{
											history: { inDropdown: true },
											inline: { inDropdown: false },
											list: { inDropdown: true },
											textAlign: { inDropdown: true },
                                            image: { 
                                                uploadCallback: this.imageUploadCallBack,
                                                urlEnabled: true,
                                                uploadEnabled: true,
                                                alignmentEnabled: true,
                                                previewImage: true,
                                                inputAccept: 'image/*',
                                                alt:{ present: true, mandatory: true }
                                            }
                                        }}
										onContentStateChange={this.onEditorChange}
										placeholder="请输入介绍"
										spellCheck
										onFocus={() => {
											console.log('focus');
										}}
										onBlur={() => {
											console.log('blur');
										}}
										onTab={() => {
											console.log('tab');
											return true;
										}}
										localization={{ locale: 'zh', translations: { 'generic.add': 'Test-Add' } }}
										mention={{
											separator: ' ',
											trigger: '@',
											caseSensitive: true,
											suggestions: [{ text: 'A', value: 'AB', url: 'href-a' }, { text: 'AB', value: 'ABC', url: 'href-ab' }, { text: 'ABC', value: 'ABCD', url: 'href-abc' }, { text: 'ABCD', value: 'ABCDDDD', url: 'href-abcd' }, { text: 'ABCDE', value: 'ABCDE', url: 'href-abcde' }, { text: 'ABCDEF', value: 'ABCDEF', url: 'href-abcdef' }, { text: 'ABCDEFG', value: 'ABCDEFG', url: 'href-abcdefg' }]
										}}
									/>
							</div>
						</Col>
						{/*<Col className="gutter-row" md={8}>
							<Card title="同步转换HTML" bordered={false}>
								<pre>{draftToHtml(editorContent)}</pre>
							</Card>
						</Col>
						<Col className="gutter-row" md={8}>
							<Card title="同步转换MarkDown" bordered={false}>
								<pre style={{ whiteSpace: 'pre-wrap' }}>{draftToMarkdown(editorContent)}</pre>
							</Card>
						</Col>
						<Col className="gutter-row" md={8}>
							<Card title="同步转换JSON" bordered={false}>
								<pre style={{ whiteSpace: 'normal' }}>{JSON.stringify(editorContent)}</pre>
							</Card>
                                    </Col>*/}
					</Row>
				</div>
			</div>
		);
	}
}

export default TextEditor;
