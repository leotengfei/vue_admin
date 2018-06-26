const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  errorLogs: state => state.errorLog.logs,
  currentPage: state => state.newslist.currentPage,
  pageSize: state => state.newslist.pageSize

}
export default getters
