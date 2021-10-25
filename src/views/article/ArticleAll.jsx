import React, { useCallback, useEffect, useRef, useState } from "react";
import { withRouter } from "react-router-dom";
import * as dayjs from 'dayjs';
import { Card, Button, List, message, Popconfirm, Modal, Select, Table, Divider, Tag } from "antd";
import request from '@/utils/request'
import Publish from '@/components/Publish'
import { useSelector } from "react-redux";
import { useRequest } from "../../utils/useHttp";
import Img from "../../components/ImgPreview";
import { delConfirm } from "../../api/article";
const { Option } = Select;
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

const Craft = (props) => {
  const { history } = props;
  const [newLoading, setNewLoading] = useState(false);
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
    const delConfirmHandle = (articleId) => {
      delConfirm(articleId, () => {
        searchClickHandle();
      })
    }
    const editDraft = (articleId) => {
      const hide = message.loading('loading...', 0);
      setTimeout(() => {
        hide()
        history.push('/article/new/' + articleId);
      }, 300);
    }
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
        {/* // 1:草稿  2:待审核  3:已发布  4:驳回 */ }
        const deleteAction = () => {
          return (
            <Popconfirm
              title="确定删除此草稿,不可恢复"
              onConfirm={() => { delConfirmHandle(articleId) }}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" >删除</Button>
            </Popconfirm>
          )
        }
        const editAtion = () => {
          return <Button type='link' onClick={() => { editDraft(articleId) }}>编辑</Button>
        }
        if (status === 1) {
          return <span>
            <Button type='link' onClick={() => { onSetCrurrentArticle(article) }}>发布</Button>
            <Divider type="vertical" />
            {
              editAtion()
            }
            <Divider type="vertical" />
            {
              deleteAction()
            }
          </span>
        } else if (status === 2) {
          return <span>
            {
              editAtion()
            }
          </span>
        } else if (status === 3) {
          return <span>
            <Button type='link' onClick={()=>{preivewArticle(articleId)}}>查看</Button>
            {/* <Divider type="vertical" /> */}
            {/* <Button type='link'>下架</Button> */}
          </span>
        } else {
          return <span>
            {
              editAtion()
            }
            <Divider type="vertical" />
            {
              deleteAction()
            }
          </span>
        }
      }
      return columnsInit;
    }
    setColumns(getColumns(tagList))
  }, [history, searchClickHandle, tagList])


  const newArticle = async () => {
    setNewLoading(true);
    const { code, data, msg } = await request.post('article/new', {});
    setNewLoading(false);
    if (code === 0) {
      history.push('/article/new/' + data.articleId);
    } else {
      message.info(msg)
    }
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

  const publishSuccessHandle = () => {
    searchClickHandle();
    setPulishVisible(false);
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
          <Button type="primary" style={{ marginLeft: "auto" }} loading={newLoading} onClick={newArticle}>新建文章</Button>
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
      <Publish visible={pulishVisible} successHandle={publishSuccessHandle} data={currentArticle} onClose={() => { setPulishVisible(false) }} />
    </div>
  );
};

export default withRouter(Craft);
