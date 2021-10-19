import React, { useState } from "react";
import { Card, Button, List, message } from "antd";
import { withRouter } from "react-router-dom";
import request from '@/utils/request'
const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];

const Craft = (props) => {
  const { history } = props;
  const [newLoading, setNewLoading] = useState(false);
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
  return (
    <div className="app-container">
      <Card>
        <Button type="primary" loading={newLoading} onClick={newArticle}>新建文章</Button>
      </Card>
      <br />
      <Card bordered={false} title='草稿箱'>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item
              actions={[<a key="list-loadmore-edit">编辑</a>, <a key="list-loadmore-more">删除</a>]}
            >
              <List.Item.Meta
                title={<a >{item.title}</a>}
                description="2020-12-1"
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default withRouter(Craft);
