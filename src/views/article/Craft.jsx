import React, { useEffect, useRef, useState } from "react";
import { Card, Button, List, message, Popconfirm, Modal } from "antd";
import { withRouter } from "react-router-dom";
import request from '@/utils/request'
import Publish from '@/components/Publish'
import * as dayjs from 'dayjs';
import { delConfirm } from "../../api/article";
import { useCallback } from "react";

const Format = 'YYYY-MM-DD HH:mm:ss A';

const formatDate = (number) => {
  return dayjs(number).format(Format);
}

const Craft = (props) => {
  const { history } = props;
  const [newLoading, setNewLoading] = useState(false);
  const [draft, setDraft] = useState([]);
  const [pulishVisible, setPulishVisible] = useState(false);
  const [currentArticle, setCrurrentArticle] = useState(null);

  const fetchData = useCallback(async () => {
    const { code, data, msg } = await request.get('article/allDraft');
    if (code === 0) {
      setDraft(data);
    } else {
      message.info(msg);
    }
  }, [])

  useEffect(() => {
    fetchData();
  }, [fetchData])

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

  const delConfirmHandle = (articleId) => {
    delConfirm(articleId, () => {
      setDraft(draft.filter(i => i.articleId !== articleId));
    })
  }

  const editDraft = (articleId) => {
    setTimeout(() => {
      history.push('/article/new/' + articleId);
    }, 300);
  }
  const peiviewDraft = (articleId) => {
    setTimeout(() => {
      history.push('/article/view/' + articleId);
    }, 300);
  }

  const onSetCrurrentArticle = (article) => {
    setCrurrentArticle(article);
    setPulishVisible(true);
  }

  return (
    <div className="app-container">
      <Card>
        <Button type="primary" loading={newLoading} onClick={newArticle}>新建文章</Button>
      </Card>
      <br />
      <Card bordered={false} title='草稿箱'>
        <List
          itemLayout="horizontal"
          dataSource={draft}
          renderItem={item => (
            <List.Item
              actions={
                [
                  <Button type="link" onClick={() => { onSetCrurrentArticle(item) }}>发布</Button>,
                  <Button type="link" onClick={() => { editDraft(item.articleId) }}>编辑</Button>,
                  <Popconfirm
                    title="确定删除此草稿,不可恢复"
                    onConfirm={() => { delConfirmHandle(item.articleId) }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="link" >删除</Button>
                  </Popconfirm>
                ]}
            >
              <List.Item.Meta
                title={<span onClick={() => { peiviewDraft(item.articleId) }} style={{ fontWeight: "bold", fontSize: "18px", cursor: 'pointer' }}>{item.title || '无标题'}</span>}
                description={'上次编辑：' + formatDate(item.lastUpdateTime)}
              />
            </List.Item>
          )}
        />
      </Card>
      <Publish visible={pulishVisible} data={currentArticle} successHandle={() => {fetchData();setPulishVisible(false)}} onClose={() => { setPulishVisible(false) }} />
    </div>
  );
};

export default withRouter(Craft);
