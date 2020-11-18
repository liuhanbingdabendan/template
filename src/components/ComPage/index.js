import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import Utils from '../utils/utils';
import ETable from '@/components/ETable';
import BaseForm from '@/components/BaseForm';
import TableAlertTip from '@/components/TableAlertTip';

/**
 *      注释：
 *      引入 import ComPage from '@/components/ComPage';
 *       <ComPage
 *        1、搜索条件列表list           
 *        formList={formList}
 *        2、带有展开条件的列表list
           extendFormList={extendFormList}
 *        3、新增时父组件直接调用handleOpenModal方法执行
          addBtn={{
            name: ['add'],
            note: '养殖户',
            auth: '新建养殖户/供应商/首次注册登录时补全公司信息',
            show: 'display',
          }}
 *        4、 导出&&下载清理功能
 *        ArertTip={{
            isArertTip: true,
            ArertTipMsg: `已选择${num}项`,
          }}
          5、table中如果执行方法后调用刷新列表，通过this.ComPage.initList()
          parent={p}            // 把num 和 每行key setState到父级，子调父
          onRef={ref => {       // 父组件调子组件的方法
            this.ComPage = ref;
          }}
          columns={this.columns()}
          selectType="checkbox"

          6、 设置initUrl&&导出url
          urlPath={{
            initPath: 'creditsales',
          7、 设置初始化列表参数传递
            widthParams: {
              state: state && state.status,
            },
          8、设置导出参数
            exportParams: {
              selectType:this.isSale ? 2 : 1
            }
          9、设置导出url
            exportUrl: 'creditsales/export', // 导出url
          }}
          10、table可展开行
          expanded={{
            expandedRowRender: record =>
              this.state.expandVisible[record.id] === true
                ? this.state.expandedRowRenders[record.id]
                : true
          }}
          11、BaseForm提交时要处理的数据
           dealData={{
            isDetail:true,
            key:'itemTypeId'
          }}

          12、
          tableRest={{
            scroll:{ x: 1500, y: 300 }
          }}
          13、 扩展中间部分
          midaBlock={} 
        />
 */
@connect(({ comModal, chain, loading }) => ({
  comModal,
  chain,
  pageSize: comModal.pageSize,
  pageNo: comModal.pageNo,
  total: comModal.total,
  loading: loading.effects['comModal/queryList'],
}))
class ComPage extends PureComponent {
  state = {
    moreResult: false,
  };

  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this);
    this.initList();
  }

  componentWillUnmount() {
    const p = this;
    p.props.dispatch({
      type: 'comModal/clearList',
    });
  }

  initList = (values, page) => {
    const p = this;
    const { urlPath } = this.props;
    const finval = values || (urlPath && urlPath.widthParams);
    p.props.dispatch({
      type: 'comModal/queryList',
      payload: {
        path: urlPath && urlPath.initPath,
        pageNo: typeof page === 'number' ? page : 1,
        source: urlPath && urlPath.source, // 判断是那个时候后端数据
        params: {
          // ...values,
          // ...(urlPath && urlPath.widthParams), // 有的直接带参
          ...finval,
        },
      },
    });
  };

  // 搜索
  searchResult = (params, page) => {
    const p = this;
    const { dealData } = p.props;
    if (dealData && dealData.isDetail) {
      const num = params[dealData.key].length;
      const val = params[dealData.key][num - 1];
      params[dealData.key] = val;
      p.setState({
        params,
      });
      this.initList(params, page);
    } else {
      p.setState({
        params,
      });
      this.initList(params, page);
    }
  };

  handleClose = () => {
    this.setState({
      selectedRowKeys: [],
    });
  };

  ExportTable = () => {
    const { selectedIds = '' } = this.state;
    const { urlPath } = this.props;
    this.props.dispatch({
      type: 'comModal/exportInfo',
      payload: {
        path: urlPath.exportUrl,
        params: {
          ids: selectedIds || selectedIds.length === 0 ? '' : selectedIds,
          ...urlPath.exportParams,
        },
      },
    });
  };

  changeExport = () => {
    const p = this;
    this.setState({
      moreResult: !p.state.moreResult,
    });
  };

  onExpand = (expanded, record) => {
    const p = this;
    const { parent } = this.props;
    const listy = {
      paddingLeft: '12px',
      textAlign: 'left',
      borderBottom: '1px solid #eee',
      lineHeight: '30px',
      color: '#a59999',
    };
    const { expandVisible, expandedRowRenders, expandedData } = parent.state;
    if (expanded === true) {
      p.props
        .dispatch({
          type: 'chain/ChainLog',
          payload: {
            path: `chain/${record.id}/logs`,
          },
        })
        .then(data => {
          const res = {
            ...expandedData,
            [record.id]: data && data.length !== 0 ? data : null,
          };
          parent.setState({
            expandVisible: {
              ...expandVisible,
              [record.id]: true,
            },
            // 注意,用key对应value的形式来标识每个扩展行的子组件,不然,一个请求,所有数据又变成一个了...访问的时候,根据key来访问
            expandedRowRenders: {
              ...expandedRowRenders,
              [record.id]: (
                <ul style={{ marginLeft: '-40px' }}>
                  {(res[record.id] &&
                    res[record.id].map((item, index) => (
                      <li style={item.log ? listy : null} key={res[index]}>
                        {item.log}
                      </li>
                    ))) ||
                    '暂无数据'}
                </ul>
              ),
            },
          });
        });
    } else {
      // 当关闭扩展行的时候,仅仅把改行改成false,其他行不用改,不然导致的bug就是关闭了某一行,其他行数据都没了.....
      parent.setState({
        expandVisible: {
          ...expandVisible,
          [record.id]: false,
        },
      });
    }
  };

  tableChange = () => {
    this.setState({
      selectedIds: '',
      selectedRowKeys: [],
    });
  };

  render() {
    const p = this;
    const {
      pageNo,
      comModal,
      pageSize,
      total,
      formList,
      parent,
      columns,
      ArertTip = {},
      selectType = null,
      extendFormList,
      addBtn = {},
      expanded = {},
      onSelect,
      tableRest = {},
      title,
      midaBlock,
    } = p.props;
    const { isArertTip = false, ArertTipMsg } = ArertTip;
    const list = comModal.list instanceof Array ? comModal.list : comModal.list.data || [];
    const { selectedRowKeys, params, moreResult, selectedIds } = this.state;
    const num = (this.state.selectedRowKeys && this.state.selectedRowKeys.length) || 0;
    // 父组件需要设置PureComponent， 数据处理，否则会一直setState 报错
    parent.setState({
      num,
      selectedIds,
    });
    const paginationProps = {
      total,
      defaultPageSize: 10,
      pageSize,
      current: pageNo,
      onChange(pageIndex) {
        p.searchResult(params, pageIndex);
      },
    };
    return (
      <div>
        {formList && (
          <Card bordered={false} title={title}>
            <BaseForm
              // 常规条件
              formList={formList}
              filterSubmit={this.searchResult}
              // 可扩展的条件
              extendFormList={extendFormList}
              moreSearch={moreResult}
              changeExport={this.changeExport}
              // 附加按钮及权限控制
              {...addBtn}
              handleOpenModal={parent.handleOpenModal}
              selectedRowKeys={selectedRowKeys}
              onSelect={onSelect}
            />

            {midaBlock}
          </Card>
        )}
        <Card bordered={false}>
          {isArertTip && (
            <TableAlertTip
              message={`${ArertTipMsg}`}
              tip="下载"
              trigger={this.ExportTable}
              handleClose={this.handleClose}
              parent={p}
            />
          )}
          <ETable
            columns={columns}
            dataSource={list}
            updateSelectedItem={Utils.updateSelectedItem.bind(this)}
            selectedRowKeys={selectedRowKeys}
            rowKey={(_, index) => index}
            rowSelection={selectType}
            style={{ textAlign: 'center' }}
            pagination={paginationProps}
            loading={this.props.loading}
            // expand
            {...expanded}
            {...tableRest}
            onExpand={(parent.onExpand && parent.onExpand.bind(parent)) || this.onExpand.bind(this)}
            onChange={this.tableChange}
            // size="middle"
            // scroll={{ x: 300, y: 240 }}
          />
        </Card>
      </div>
    );
  }
}

export default ComPage;
