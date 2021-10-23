import React, { useEffect, useRef, useState } from "react";
import { withRouter } from "react-router-dom";
import * as dayjs from 'dayjs';
import { Card, Button, List, message, Popconfirm, Modal, Select, Table, Divider, Tag } from "antd";
import request from '@/utils/request'
import Publish from '@/components/Publish'
import { useSelector } from "react-redux";
import { useRequest } from "../../utils/useHttp";
const { Option } = Select;

const Format = 'YYYY-MM-DD HH:mm';

const formatDate = (number) => {
  return dayjs(number).format(Format);
}

const columnsInit = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    render: text => <a>{text}</a>,
  },
  {
    title: '首页描述',
    dataIndex: 'brief',
    key: 'brief',
  },
  {
    title: '文章主图',
    dataIndex: 'background',
    key: 'background',
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
    render: (text, record) => (
      <span>
        <a>Invite {record.name}</a>
        <Divider type="vertical" />
        <a>Delete</a>
      </span>
    ),
  },
];


const getColumns = (tagList) => {
  columnsInit.find(i => i.key === 'tid').render = (record) => {
    const tag = tagList.find(i => i.tagId === record)
    return <Tag color={(tag && tag.color) || '#f50'}>{(tag && tag.title) || '暂未发布'}</Tag>
  }
  return columnsInit
}

const Craft = (props) => {
  const { history } = props;
  const [pulishVisible, setPulishVisible] = useState(false);
  const [currentArticle, setCrurrentArticle] = useState(null);
  const [columns, setColumns] = useState(columnsInit);

  const { appData: { tagList = [] } } = useSelector(state => state.app);

  const [searchParam, setSearchParam] = useState({
    status: null,
    tid: null,
  });

  const { state, setParam } = useRequest('article/queryAll', {
    current: 1,
    pageSize: 10,
    status: 0,
    tid: 0,
  });
  const { data: { data: { list: tableData = [], total = 0, pageSize, current } = { list: [], total: 0 } }, isLoading, isError } = state;

  useEffect(() => {
    setColumns(getColumns(tagList))
  }, [tagList])

  const delConfirm = async (articleId) => {

  }

  const editDraft = (articleId) => {
    setTimeout(() => {
      history.push('/article/new/' + articleId);
    }, 300);
  }

  const onSetCrurrentArticle = (article) => {
    setCrurrentArticle(article);
    setPulishVisible(true);
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

  const searchClickHandle = () => {
    const { status, tid } = searchParam;
    setParam({
      pageSize,
      current,
      status: status || 0,
      tid: tid || 0
    })
  }

  const pageChange = (current) => {
    setParam((param) => {
      return { ...param, current }
    })
  }

  const pageSizeChange = (current, pageSize) => {
    // setParamData((param) => {
    //   return {
    //     ...param,
    //     pageSize,
    //   }
    // })
    setParam((param) => {
      return { ...param, current, pageSize }
    })
  }

  return (
    <div className="app-container">
      {/* // 1:草稿  2:待审核  3:已发布  4:驳回 */}
      <Card bordered={false} title='文章'>
        <div className='flex column-center'>
          <span>发布状态：</span>
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
          <Button style={{ marginLeft: "2em" }} type="primary" loading={isLoading} onClick={searchClickHandle}>查询</Button>
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
          scroll={{ x: 1500 }}
        />
      </Card>
      <Publish visible={pulishVisible} data={currentArticle} onClose={() => { setPulishVisible(false) }} />
    </div>
  );
};

export default withRouter(Craft);
