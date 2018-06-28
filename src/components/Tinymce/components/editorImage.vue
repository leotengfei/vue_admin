<template>
  <div class="upload-container">
    <el-button icon='el-icon-upload' size="mini" :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="primary">上传图片
    </el-button>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <el-upload 
          class="editor-slide-upload" 
          action="http://up-z1.qiniup.com" 
          :multiple="true" 
          :file-list="fileList" 
          :show-file-list="true"
          list-type="picture-card" 
          :on-remove="handleRemove" 
          :on-success="handleSuccess" 
          :before-upload="beforeUpload"
          :data="postData">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getToken, delFile } from '@/api/qiniu'
export default {
  name: 'editorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
      postData: {
        token: '',
        key: ''
      }
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      console.log('handleSubmit')
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！')
        return
      }
      console.log(arr)
      console.log(this.fileList)
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
      console.log(response)
      console.log('handleSuccess')
      console.log(file)
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = 'http://p9mwnc6fh.bkt.clouddn.com/' + response.key // 拼接七牛云文件路径
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove(file) {
      console.log('handleRemove')
      console.log(file.response.key)
      // 将key值传给七牛云，删除七牛云上的照片
      delFile(file.response.key).then(response => {
        console.log(response)
      })
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload(file) {
      // 为文件名加上 时间戳+随机四位 防止文件名相同
      const rName = function() {
        return new Date().getTime()
      }
      const zimu = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
      const rNum = function() {
        return Math.floor(Math.random() * 25)
      }
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        }
        getToken().then(response => {
          // console.log(response)
          this.postData.token = response.msg
          this.postData.key = rName() + zimu[rNum()] + zimu[rNum()] + zimu[rNum()] + zimu[rNum()] + file.name
          console.log(this.postData.key)
          resolve(true)
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.upload-container {
  .editor-slide-upload {
    margin-bottom: 20px;
  }
}
</style>
