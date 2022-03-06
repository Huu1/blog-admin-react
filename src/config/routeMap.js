import Loadable from 'react-loadable';
import Loading from '@/components/Loading'
const Dashboard = Loadable({loader: () => import(/*webpackChunkName:'Dashboard'*/'@/views/dashboard'),loading: Loading});
// const Guide = Loadable({loader: () => import(/*webpackChunkName:'Guide'*/'@/views/guide'),loading: Loading});
const Craft = Loadable({loader: () => import(/*webpackChunkName:'Markdown'*/'@/views/article/Craft'),loading: Loading});
const Edit = Loadable({loader: () => import(/*webpackChunkName:'Markdown'*/'@/views/article/Edit'),loading: Loading});
const ArticleAll = Loadable({loader: () => import(/*webpackChunkName:'Markdown'*/'@/views/article/ArticleAll'),loading: Loading});
const ViewArticle = Loadable({loader: () => import(/*webpackChunkName:'Markdown'*/'@/views/audit/viewArticle'),loading: Loading});
const Error404 = Loadable({loader: () => import(/*webpackChunkName:'Error404'*/'@/views/error/404'),loading: Loading});

export default [
  { path: "/dashboard", component: Dashboard, roles: ["admin","user","guest"] },
  { path: "/article/write", component: Craft, roles: ["admin","user"] },
  { path: "/article/all", component: ArticleAll, roles: ["admin","user"] },
  { path: "/article/new/:id", component: Edit, roles: ["admin","user"] },
  { path: "/article/view/:id", component: ViewArticle, roles: ["admin","user"] },
  // { path: "/label", component: ViewArticle, roles: ["admin"] },
  // { path: "/tag", component: ViewArticle, roles: ["admin"] },
  { path: "/error/404", component: Error404 },
];
