/**
 * icon:菜单项图标
 * roles:标明当前菜单项在何种角色下可以显示，如果不写此选项，表示该菜单项完全公开，在任何角色下都显示
 */
const menuList = [
  {
    title: "首页",
    path: "/dashboard",
    icon: "home",
    roles: ["admin", "editor", "guest"]
  },
  // {
  //   title: "引导页",
  //   path: "/guide",
  //   icon: "key",
  //   roles: ["admin", "editor"]
  // },
  {
    title: "文章",
    path: "/article",
    icon: "appstore",
    children: [
      {
        title: "文章管理",
        path: "/article/all",
        roles: ["admin", "user"],
      },
      {
        title: "草稿箱",
        path: "/article/write",
        roles: ["admin", "user"],
      },
    ],
  },
  {
    title: "分类管理",
    path: "/label",
    icon: "usergroup-add",
    roles: ["admin"]
  },
  {
    title: "标签管理",
    path: "/tag",
    icon: "usergroup-add",
    roles: ["admin"]
  }
];
export default menuList;
