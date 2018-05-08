<template>
  <div class="app-container">
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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" v-waves icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download">导出</el-button>
      <el-checkbox class="filter-item" style='margin-left:15px;'>已审核</el-checkbox>
    </div>
    <!-- 表格内容区域 -->
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.nid}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="日期">
        <template slot-scope="scope">
          <span>{{scope.row.nDate}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" label="标题">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
          <el-tag>{{scope.row.type | typeFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="50px" align="center" label="标签">
        <template slot-scope="scope">
          <el-tag v-for="(item,key) in scope.row.tags" :key='key' style="marginRight:8px;">{{item}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusReFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini">编辑</el-button>
          <el-button size="mini" type="success">发布</el-button>
          <!-- <el-button size="mini">草稿</el-button> -->
          <el-button size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页插件区域 -->
    <div></div>
    <!-- 弹窗内容区域 -->
  </div>
</template>

<script>
// import { fetchList } from '@/api/xinwen'
import waves from '@/directive/waves' // 水波纹指令

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
      tableKey: 0,
      list: [
        {
          nid: 0,
          nDate: '2018/4/24',
          title: '这是第一条新闻标题',
          type: 'POL',
          status: 'unview',
          tags: ['高考', '政策', '数学']
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
  filters: {
    statusFilter(status) {
      const statusMap = {
        unview: 'info',
        published: 'success',
        draft: 'default',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    statusReFilter(status) {
      const statusMap = {
        unview: '未审核',
        published: '发表',
        draft: '暂存',
        deleted: '删除'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return fenleiTypeKeyValue[type]
    }
  }
}
</script>

<style scoped>

</style>

