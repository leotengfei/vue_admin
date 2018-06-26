const newslist = {
  state: {
    pageSize: 10,
    currentPage: 1
  },

  mutations: {
    SET_PAGESIZE: (state, pageSize) => {
      state.pageSize = pageSize
    },
    SET_CURRENTPAGE: (state, currentPage) => {
      state.currentPage = currentPage
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
    }
  }
}

export default newslist
