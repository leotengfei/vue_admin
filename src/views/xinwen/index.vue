<template>
  <div class="app-container">
    <!-- 顶部操作按钮区域 -->
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="标题">
      </el-input>
      <el-date-picker
      class="filter-item"
      v-model="value2"
      align="right"
      type="date"
      placeholder="选择日期"
      :picker-options="pickerOptions1">
    </el-date-picker>
    <el-select clearable class="filter-item" style="width: 130px" placeholder="选择分类">
        <el-option>
        </el-option>
    </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download">导出</el-button>
      <el-checkbox class="filter-item" style='margin-left:15px;'>审核人</el-checkbox>
    </div>
    <!-- 表格内容区域 -->
    <div>

    </div>
    <!-- 分页插件区域 -->
    <div></div>
    <!-- 弹窗内容区域 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
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
      value2: ''
    }
  }
}
</script>

<style scoped>

</style>

