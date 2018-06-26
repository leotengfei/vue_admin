<template>
  <div class="app-container xinwen">
    <!-- 顶部操作按钮区域 -->
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="标题" v-model="listQuery.title">
      </el-input>
      <el-date-picker
      class="filter-item"
      v-model="listQuery.nDate"
      align="right"
      type="date"
      placeholder="选择日期"
      :picker-options="pickerOptions1">
    </el-date-picker>
    <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="分类">
        <el-option v-for="item in  fenleiTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
        </el-option>
    </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search">搜索</el-button>
      <router-link to="/xinwen/x_tianjia">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" v-waves icon="el-icon-edit">添加</el-button>
      </router-link>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download">导出</el-button>
      <el-checkbox class="filter-item" style='margin-left:15px;'>已审核</el-checkbox>
    </div>
    <!-- 表格内容区域 -->
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="日期">
        <template slot-scope="scope">
          <span>{{scope.row.time}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" label="标题">
        <template slot-scope="scope">
          <span class="link-type" @click="handleViewContent(scope.row.id)">{{scope.row.title}}</span>
          <el-tag>{{scope.row.classify}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="50px" label="等级">
        <template slot-scope="scope">
          <!-- <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span> -->
          <el-rate
            disabled
            :max=4
            v-model="scope.row.weight"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            :texts="['普通', '优先', '热点', '置顶']"
            show-text >
          </el-rate>
        </template>
      </el-table-column>
      <el-table-column min-width="50px" align="center" label="标签">
        <template slot-scope="scope">
          <el-tag v-for="(item,key) in scope.row.name" :key='key' style="marginRight:8px;">{{item}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusReFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="toBianji(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="success" v-if="showfabu(scope.row.status)" @click="handleFabu(scope.row.id)">发布</el-button>
          <el-button size="mini" type="info" v-if="scope.row.status !== 1" @click="handleCaogao(scope.row.id)">草稿</el-button>
          <el-button size="mini" type="danger" v-if="scope.row.status !== 3" @click="handleDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
  <!-- 分页插件区域 -->
  <div class="fenye">
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
    </div>
    <!-- 弹窗内容区域 -->
      <el-dialog
        title="预览文章内容"
        :visible.sync="centerDialogVisible"
        width="45%"
        center>
        <div v-html="centerDialogContent" v-loading="dialogLoading" class="mydialog"></div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="centerDialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { getList, getNewsContent, audit, delNews, draftNews } from '@/api/xinwen'
import waves from '@/directive/waves' // 水波纹指令
import nopic from '@/assets/nopic.jpg'

const fenleiTypeOptions = [
  { key: 'POL', display_name: '政策' },
  { key: 'EXA', display_name: '考试' },
  { key: 'FUN', display_name: '娱乐' }
]

const fenleiTypeKeyValue = fenleiTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  directives: {
    waves
  },
  data() {
    return {
      centerDialogVisible: false,
      dialogLoading: false,
      centerDialogContent: '',
      page: {
        currentPage: 1,
        pageSize: 10
      },
      total: 10,
      tableKey: 0,
      list: [
        {
          id: 0,
          time: '2018/4/24',
          title: '这是第一条新闻标题',
          weight: 4,
          type: 'POL',
          status: '0',
          name: ['高考', '政策', '数学']
        }
      ],
      listQuery: {
        title: '',
        nDate: '',
        type: ''
      },
      downloadLoading: false,
      fenleiTypeOptions: fenleiTypeOptions,
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      listLoading: false
    }
  },
  methods: {
    handleFabu(nid) {
      audit(nid).then(response => {
        // 发布文章
        this.fetchData(this.page.pageSize, this.page.currentPage)
        this.$notify({
          title: '成功',
          message: '发布文章成功！',
          type: 'success',
          duration: 2000
        })
      }, error => {
        console.log(error)
        this.$notify({
          title: '失败',
          message: '请完成填写文章内容！',
          type: 'warning',
          duration: 2000
        })
      })
    },
    handleCaogao(nid) {
      // 草稿状态
      draftNews(nid).then(response => {
        this.fetchData(this.page.pageSize, this.page.currentPage)
        this.$notify({
          title: '成功',
          message: '修改为草稿状态成功！',
          type: 'success',
          duration: 2000
        })
      }, error => {
        console.log(error)
        this.$notify({
          title: '失败',
          message: '修改为草稿状态失败！',
          type: 'warning',
          duration: 2000
        })
      })
    },
    handleDel(nid) {
      // 删除按钮
      this.$confirm('此操作将会删除该条新闻，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancleButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delNews(nid).then(response => {
          this.fetchData(this.page.pageSize, this.page.currentPage)
          this.$notify({
            title: '成功',
            message: '删除文章成功！',
            type: 'success',
            duration: 2000
          })
        }, error => {
          console.log(error)
          this.$notify({
            title: '失败',
            message: '删除文章失败！',
            type: 'warning',
            duration: 2000
          })
        })
      }).catch(() => {
        this.$notify({
          title: '取消',
          message: '已取消删除！',
          type: 'success',
          duration: 2000
        })
      })
    },
    toBianji(id) {
      this.$router.push('/xinwen/x_bianji/' + id)
    },
    showfabu(status) {
      // 显示发布按钮的情况
      if (status === 0) {
        return false
      } else if (status === 2) {
        return false
      } else {
        return true
      }
    },
    handleSizeChange(val) {
      const that = this
      this.listLoading = true
      // console.log(`每页 ${val} 条`) 改变分页大小
      this.page.pageSize = val
      this.$store.dispatch('GetPage', that.page).then(() => {
        console.log('更新分页大小成功')
        that.fetchData(that.page.pageSize, that.page.currentPage)
      }).catch(() => {
        console.log('更新分页大小失败')
      })
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`) // 分页改变当前页
      const that = this
      this.listLoading = true
      this.page.currentPage = val
      this.$store.dispatch('GetPage', that.page).then(() => {
        console.log('更新页码成功')
        that.fetchData(that.page.pageSize, that.page.currentPage)
      }).catch(() => {
        console.log('更新页码失败')
      })
    },
    fetchData(pageSize, currentPage) {
      // 加载数据
      getList(pageSize, currentPage).then(response => {
        // console.log(response.data)
        this.listLoading = false
        this.list = response.data
        this.total = response.count
      }).catch(err => {
        this.fetchSuccess = false
        console.log(err)
      })
    },
    handleViewContent(nid) {
      // 查看文章内容
      this.dialogLoading = true
      this.centerDialogVisible = true
      getNewsContent(nid).then(response => {
        this.dialogLoading = false
        var poster = ''
        if (response.image) {
          poster = `<img src='${response.image}'></img>`
        } else {
          poster = `<img src='${nopic}'></img>`
          // 没有图的时候加载占位图
        }
        this.centerDialogContent = poster + response.content
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created() {
    this.listLoading = true
    this.fetchData(this.$store.getters.pageSize, this.$store.getters.currentPage)
    this.page.pageSize = this.$store.getters.pageSize
    this.page.currentPage = this.$store.getters.currentPage
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'success',
        2: 'default',
        3: 'danger'
      }
      return statusMap[status]
    },
    statusReFilter(status) {
      const statusMap = ['未审核', '草稿', '已发布', '删除']
      return statusMap[status]
    },
    typeFilter(type) {
      return fenleiTypeKeyValue[type]
    }
  }
}
</script>

<style lang="scss">
.xinwen{
  .fenye{
  margin-top:30px;
  }
  .mydialog img{
    width: 100% !important;
    height:auto;
  }
  h1{
    line-height: 1.2em;
  }
}
</style>

