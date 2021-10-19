/**
 * icon:菜单项图标
 * roles:标明当前菜单项在何种角色下可以显示，如果不写此选项，表示该菜单项完全公开，在任何角色下都显示
 */
const menuList = [
  {
    title: "首页",
    path: "/dashboard",
    icon: "home",
    roles:["admin","editor","guest"]
  },
  {
    title: "引导页",
    path: "/guide",
    icon: "key",
    roles:["admin","editor"]
  },
  {
    title: "权限测试",
    path: "/permission",
    icon: "lock",
    children: [
      {
        title: "权限说明",
        path: "/permission/explanation",
        roles:["admin"]
      },
      {
        title: "admin页面",
        path: "/permission/adminPage",
        roles:["admin"]
      },
      {
        title: "guest页面",
        path: "/permission/guestPage",
        roles:["guest"]
      },
      {
        title: "user页面",
        path: "/permission/editorPage",
        roles:["user"]
      },
    ],
  },
  {
    title: "文章",
    path: "/article",
    icon: "appstore",
    roles:["admin","user"],
    children: [
      // {
      //   title: "富文本",
      //   path: "/components/richTextEditor",
      //   roles:["admin","editor"],
      // },
      {
        title: "草稿箱",
        path: "/article/write",
        roles:["admin","user"],
      },
      // {
      //   title: "草稿箱",
      //   path: "/article/new/:id",
      //   roles:["admin","editor"],
      // },
      // {
      //   title: "拖拽列表",
      //   path: "/components/draggable",
      //   roles:["admin","editor"],
      // },
    ],
  },
  // {
  //   title: "路由嵌套",
  //   path: "/nested",
  //   icon: "cluster",
  //   roles:["admin","editor"],
  //   children: [
  //     {
  //       title: "菜单1",
  //       path: "/nested/menu1",
  //       children: [
  //         {
  //           title: "菜单1-1",
  //           path: "/nested/menu1/menu1-1",
  //           roles:["admin","editor"],
  //         },
  //         {
  //           title: "菜单1-2",
  //           path: "/nested/menu1/menu1-2",
  //           children: [
  //             {
  //               title: "菜单1-2-1",
  //               path: "/nested/menu1/menu1-2/menu1-2-1",
  //               roles:["admin","editor"],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    title: "用户管理",
    path: "/user",
    icon: "usergroup-add",
    roles:["admin"]
  },
  {
    title: "关于作者",
    path: "/about",
    icon: "user",
    roles:["admin","user","guest"]
  },
  {
    title: "Bug收集",
    path: "/bug",
    icon: "bug",
    roles:["admin"]
  },
];
export default menuList;
