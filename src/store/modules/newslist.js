const newslist = {
  state: {
    pageSize: 10,
    currentPage: 1,
    title: '',
    time: '',
    classify: '',
    status: ''
  },

  mutations: {
    SET_PAGESIZE: (state, pageSize) => {
      state.pageSize = pageSize
    },
    SET_CURRENTPAGE: (state, currentPage) => {
      state.currentPage = currentPage
    },
    SET_TITLE: (state, title) => {
      state.title = title
    },
    SET_TIME: (state, time) => {
      state.time = time
    },
    SET_CLASSIFY: (state, classify) => {
      state.classify = classify
    },
    SET_STATUS: (state, status) => {
      state.status = status
    }
  },

  actions: {
    // 获取数据
    GetPage({ commit }, page) {
      return new Promise((resolve) => {
        commit('SET_PAGESIZE', page.pageSize)
        commit('SET_CURRENTPAGE', page.currentPage)
        resolve()
      })
    },
    GetQuery({ commit }, listQuery) {
      return new Promise((resolve) => {
        commit('SET_TITLE', listQuery.title)
        commit('SET_TIME', listQuery.time)
        commit('SET_CLASSIFY', listQuery.classify)
        commit('SET_STATUS', listQuery.status)
        resolve()
      })
    }
  }
}

export default newslist
