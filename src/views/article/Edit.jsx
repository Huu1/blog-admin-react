import React from "react";
import Markdown from "@/components/Markdown";
import { Card } from "antd";
import { withRouter } from "react-router-dom";
const Edit = (props) => {
  const { history } = props;
  return (
    <div className="app-container">
      <Card title="新建文章"  >
        
      </Card>
      <br />
      <Markdown />
    </div>
  );
};

export default withRouter(Edit);
