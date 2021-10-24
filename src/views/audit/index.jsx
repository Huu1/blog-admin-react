import React, { useCallback, useEffect, useRef, useState } from "react";
import { withRouter } from "react-router-dom";
import * as dayjs from 'dayjs';
import { Card, Button, List, message, Popconfirm, Modal, Select, Table, Divider, Tag, Input } from "antd";
import request from '@/utils/request'
import { useSelector } from "react-redux";
import { useRequest } from "../../utils/useHttp";
import Img from "../../components/ImgPreview";
const { Option } = Select;
const { TextArea } = Input
const baseUrl = process.env.REACT_APP_BASE_API;
const Format = 'YYYY-MM-DD HH:mm';

const formatDate = (number) => {
  return dayjs(number).format(Format);
}

const columnsInit = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    render: text => <span>{text || '无标题'}</span>,
  },
  {
    title: '首页描述',
    dataIndex: 'brief',
    ellipsis: true,
    key: 'brief',
  },
  {
    title: '文章主图',
    dataIndex: 'background',
    key: 'background',
    width: 300,
    render: (record) => {
      if (record) {
        return <Img src={`${baseUrl}/${record}`} style={{ height: "100px", width: "200px" }} />
      } else {
        return <span>/</span>
      }
    }
  },
  {
    title: '文章状态',
    dataIndex: 'status',
    key: 'status',
    render: (record) => {
      const map = {
        1: { color: 'magenta', title: "草稿箱" },
        2: { color: 'red', title: "待审核" },
        3: { color: 'volcano', title: "已发布" },
        4: { color: '#f50', title: "驳回" },
      }
      const target = map[record];
      return (
        <Tag color={(target && target.color) || 'green'}>{(target && target.title) || '未知状态'}</Tag>
      )
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    render: text => <span>{formatDate(text)}</span>,
  },
  {
    title: '上次编辑时间',
    dataIndex: 'lastUpdateTime',
    key: 'lastUpdateTime',
    render: text => <span>{formatDate(text)}</span>,
  },
  {
    title: '阅读量',
    dataIndex: 'viewNum',
    key: 'viewNum',
  },
  {
    title: '类别',
    key: 'tid',
    dataIndex: 'tid',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
  },
];

const Audit = (props) => {
  const { history } = props;
  const [newLoading, setNewLoading] = useState(false);
  const [auditVisible, setAuditVisible] = useState(false);
  const [pulishVisible, setPulishVisible] = useState(false);
  const [currentArticle, setCrurrentArticle] = useState(null);
  const [auditRes, setAuditRes] = useState({
    status: 1,
    info: ''
  });
  const [columns, setColumns] = useState(columnsInit);

  const { appData: { tagList = [] } } = useSelector(state => state.app);

  const [searchParam, setSearchParam] = useState({
    status: null,
    tid: null,
  });

  const { state, setParam } = useRequest('article/queryAll', {
    current: 1,
    pageSize: 5,
    status: 0,
    tid: 0,
  });
  const { data: { data: { list: tableData = [], total = 0, pageSize, current } = { list: [], total: 0 } }, isLoading, isError } = state;

  const searchClickHandle = useCallback(() => {
    const { status, tid } = searchParam;
    setParam({
      pageSize,
      current,
      status: status || 0,
      tid: tid || 0
    })
  }, [current, pageSize, searchParam, setParam])



  useEffect(() => {
    const preivewArticle = (articleId) => {
      const hide = message.loading('loading...', 0)
      setTimeout(() => {
        history.push('/article/view/' + articleId);
        hide();
      }, 300);
    }
    const getColumns = (tagList) => {
      columnsInit.find(i => i.key === 'tid').render = (record) => {
        const tag = tagList.find(i => i.tagId === record)
        return <Tag color={(tag && tag.color) || '#f50'}>{(tag && tag.title) || '暂未发布'}</Tag>
      }
      columnsInit.find(i => i.key === 'action').render = (record, article) => {
        const { status, articleId } = article;
        // eslint-disable-next-line no-lone-blocks
        const preivew = () => <Button type='link' onClick={()=>{preivewArticle(articleId)}}>预览</Button>
        {/* // 1:草稿  2:待审核  3:已发布  4:驳回 */ }
        if (status === 1) {
          return <span>
            {preivew()}
          </span>
        } else if (status === 2) {
          return <span>
            {<Button type='link' onClick={() => { onAuditHandle(article) }}>审核</Button>}
            <Divider type="vertical" />
            <Button type='link'>下架</Button>
          </span>
        } else if (status === 3) {
          return <span>
            {preivew()}
            <Divider type="vertical" />
            <Button type='link'>下架</Button>
          </span>
        } else {
          return <span>
            <Button type='link'>驳回原因</Button>
            <Divider type="vertical" />
            {preivew()}
          </span>
        }
      }
      return columnsInit;
    }
    setColumns(getColumns(tagList))
  }, [history, searchClickHandle, tagList])

  const onAuditHandle = (article) => {
    setCrurrentArticle(article);
    setAuditVisible(true);
  }

  const statusChange = (status) => {
    setSearchParam((p) => {
      return { ...p, status }
    })
  }

  const tagChange = (tid) => {
    setSearchParam((p) => {
      return { ...p, tid }
    })
  }

  const pageChange = (current) => {
    setParam((param) => {
      return { ...param, current }
    })
  }

  const pageSizeChange = (current, pageSize) => {
    setParam((param) => {
      return { ...param, current, pageSize }
    })
  }

  const auditHandleOk = () => {
    setAuditVisible(true);
    const { articleId } = currentArticle;
    const { status, info } = auditRes;
    if (!articleId) return;
    let param;

    if (status === 2 && !info) {
      return message.info('请输入驳回原因')
    } else {
      param = {
        status,
        info,
        articleId
      }
    }
    request.post('article/setAudit', param).then(res => {
      const { code, msg } = res;
      if (code === 0) {
        message.info(msg);
        setAuditVisible(false);
        setSearchParam((p) => {
          return { ...p, current: 1 }
        })
        searchClickHandle();
      } else {
        message.error(msg)
      }
    })
  }

  const auditHandleCancel = () => {
    setAuditVisible(false);
  }

  const auditChange = (value) => {
    setAuditRes((p) => {
      return { ...p, status: value }
    })
  }

  const auditInfoChange = (e) => {
    const info = e.target.value
    setAuditRes((p) => {
      return { ...p, info }
    })
  }



  return (
    <div className="app-container">
      <Card bordered={false} title='文章'>
        <div className='flex column-center'>
          <span>文章状态：</span>
          <Select defaultValue={null} value={searchParam.status} style={{ width: 150, marginRight: "2em" }} onChange={statusChange} >
            <Option value={null}>全部</Option>
            <Option value={3}>已发布</Option>
            <Option value={2}>待审核</Option>
            <Option value={4}>驳回</Option>
            <Option value={1}>草稿箱</Option>
          </Select>
          <span>文章类别：</span>
          <Select defaultValue={null} value={searchParam.tid} style={{ width: 150 }} onChange={tagChange}>
            <Option value={null}>全部</Option>
            {
              tagList.map(tag => {
                return <Option key={tag.tagId} value={tag.tagId}>{tag.title}</Option>
              })
            }
          </Select>
          <Button style={{ marginLeft: "2em" }} type="default" loading={isLoading} onClick={searchClickHandle}>查询</Button>
        </div>

      </Card>
      <br />
      <Card>
        <Table
          columns={columns}
          dataSource={tableData}
          loading={isLoading}
          rowKey={(record) => {
            return record.articleId
          }}
          pagination={
            {
              showSizeChanger: true,//设置每页显示数据条数
              showQuickJumper: false,
              showTotal: () => `共${total}篇文章`,
              pageSize: pageSize,
              total,  //数据的总的条数
              onChange: (current) => pageChange(current), //点击当前页码
              onShowSizeChange: (current, pageSize) => {//设置每页显示数据条数，current表示当前页码，pageSize表示每页展示数据条数
                pageSizeChange(current, pageSize)
              }
            }
          }
          scroll={{ x: 2000 }}
        />
      </Card>

      <Modal
        title="文章审核"
        visible={auditVisible}
        onOk={auditHandleOk}
        onCancel={auditHandleCancel}
      >
        <div>
          <span>审核结果：</span>
          <Select defaultValue={1} value={auditRes.status} style={{ width: 150 }} onChange={auditChange} >
            <Option value={1}>通过</Option>
            <Option value={2}>拒绝</Option>
          </Select>
        </div>
        {
          auditRes.status === 2 && <div>
            <span>驳回原因：</span>
            <TextArea value={auditRes.info} onChange={auditInfoChange} />
          </div>
        }
      </Modal>
    </div>
  );
};

export default withRouter(Audit);
