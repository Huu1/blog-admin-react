import React from "react";
import { Card, Button, List } from "antd";
import Markdown from "@/components/Markdown";
import TypingCard from "@/components/TypingCard";

import { withRouter } from "react-router-dom";

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
  const newArticle = () => {
    history.push('/article/new/123213')
  }
  return (
    <div className="app-container">
      <Card>
        <Button type="primary" onClick={newArticle}>新建文章</Button>
      </Card>
      <br />
      <Card bordered={false}>

        {/* <Markdown /> */}
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
