import React, { Component } from "react";
import { Card, Button, Table, message, Divider, Switch } from "antd";
import { getUsers, deleteUser, editUser, addUser } from "@/api/user";
import TypingCard from '@/components/TypingCard'
import EditUserForm from "./forms/edit-user-form"
import AddUserForm from "./forms/add-user-form"
import { setUserStatus } from "../../api/user";
const { Column } = Table;
class User extends Component {
  state = {
    users: [],
    editUserModalVisible: false,
    editUserModalLoading: false,
    currentRowData: {},
    addUserModalVisible: false,
    addUserModalLoading: false,
  };
  getUsers = async () => {
    const result = await getUsers();
    const { code, data, msg } = result
    if (code === 0) {
      this.setState({
        users: data
      })
    } else {
      message.error(msg)
    }
  }
  handleEditUser = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editUserModalVisible: true,
    });
  };

  handleDeleteUser = (row) => {
    const { id } = row
    if (id === "admin") {
      message.error("不能删除管理员用户！")
      return
    }
    deleteUser({ id }).then(res => {
      message.success("删除成功")
      this.getUsers();
    })
  }

  handleEditUserOk = _ => {
    const { form } = this.editUserFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true, });
      editUser(values).then((response) => {
        form.resetFields();
        this.setState({ editUserModalVisible: false, editUserModalLoading: false });
        message.success("编辑成功!")
        this.getUsers()
      }).catch(e => {
        message.success("编辑失败,请重试!")
      })

    });
  };

  handleCancel = _ => {
    this.setState({
      editUserModalVisible: false,
      addUserModalVisible: false,
    });
  };

  handleAddUser = (row) => {
    this.setState({
      addUserModalVisible: true,
    });
  };

  handleAddUserOk = _ => {
    const { form } = this.addUserFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addUserModalLoading: true, });
      addUser(values).then(({ code, msg }) => {
        if (code === 0) {
          form.resetFields();
          this.setState({ addUserModalVisible: false, addUserModalLoading: false });
          message.success("添加成功!")
          this.getUsers();
          return
        }
        message.info(msg)
        this.setState({ addUserModalLoading: false });
      }).catch(e => {
        message.success("添加失败,请重试!")
      })
    });
  };
  componentDidMount() {
    this.getUsers()
  }

  async statusOnChange(val, userId) {
    const result = await setUserStatus({ uid: userId });
    if (result.code === 0) {
      message.success(result.msg);
    } else {
      message.error(result.msg);
    }
  }
  render() {
    const { users } = this.state
    const title = (
      <span>
        <Button type='primary' onClick={this.handleAddUser}>添加用户</Button>
      </span>
    )
    const cardContent = `在这里，你可以对系统中的用户进行管理，例如添加一个新用户，或者修改系统中已经存在的用户。`
    return (
      <div className="app-container">
        <TypingCard title='用户管理' source={cardContent} />
        <br />
        <Card title={title}>
          {/* avatar: "public/avatar/avatar(6).png"
            createTime: 1635429470659
            email: ""
            name: ""
            role: "user"
            userId: "1234567"
            username: "1" 
          */}
          <Table bordered rowKey="id" dataSource={users} pagination={false} rowKey={(i) => i.userId}>
            <Column title="用户ID" dataIndex="userId" key="userId" align="center" />
            <Column title="用户名称" dataIndex="name" key="name" align="center" />
            <Column title="用户角色" dataIndex="role" key="role" align="center" />
            <Column title="是否启用" key="action" width={195} align="center" render={(text, row) => (
              <Switch disabled={row.role === 'admin'} defaultChecked={row.status === 0 ? false : true} onChange={(val) => this.statusOnChange(val, row.userId)} />
            )} />
          </Table>
        </Card>
        <EditUserForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={formRef => this.editUserFormRef = formRef}
          visible={this.state.editUserModalVisible}
          confirmLoading={this.state.editUserModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditUserOk}
        />
        <AddUserForm
          wrappedComponentRef={formRef => this.addUserFormRef = formRef}
          visible={this.state.addUserModalVisible}
          confirmLoading={this.state.addUserModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddUserOk}
        />
      </div>
    );
  }
}

export default User;
