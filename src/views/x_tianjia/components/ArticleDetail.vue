<template>
  <div class="createPost-container">
    <el-form class="form-container" label-position="left" :model="postForm" :rules="rules" ref="postForm" v-loading='pageDataLoading' element-loading-text="拼命加载中">

      <sticky :className="'sub-navbar state'+postForm.status">
        <template v-if="fetchSuccess">

          <router-link style="margin-right:15px;" v-show='isEdit' to="/xinwen/x_tianjia">
            <el-button type="info">添加新闻</el-button>
          </router-link>

          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm()">发布
          </el-button>
          <el-button v-loading="loading" type="warning" @click="draftForm">草稿</el-button>

        </template>
        <template v-else>
          <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
        </template>

      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput name="name" v-model="postForm.title" required :maxlength="100">
                标题
              </MDinput>
              <span v-show="postForm.title.length>=26" class='title-prompt'>app可能会显示不全</span>
              <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="80px" label="发布时间:" class="postInfo-container-item">
                    <el-date-picker 
                      v-model="postForm.time" 
                      type="date" 
                      format="yyyy-MM-dd" 
                      placeholder="选择日期时间"
                      value-format="yyyy-MM-dd"
                      >
                    </el-date-picker>
                  </el-form-item>
                </el-col>


                <el-col :span="8">
                  <el-form-item label-width="80px" label="文章等级:">
                    <el-rate
                    style="line-height:2.5;"
                    :max=4
                    v-model="postForm.weight"
                    :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                    :texts="['普通', '优先', '热点', '置顶']"
                    show-text 
                    >
                    </el-rate>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="80px" label="文章来源:" class="postInfo-container-item">
                    <el-input
                      placeholder="请输入文章来源"
                      v-model="postForm.source"
                      clearable>
                      </el-input>
                  </el-form-item>
                </el-col>


                <el-col :span="8">
                  <el-form-item label-width="80px" label="文章分类:">
                    <el-select v-model="postForm.classify" clearable placeholder="请选择">
                      <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-form-item style="margin-bottom: 40px;" label-width="80px" label="标签:">
            <!-- 预留 -->
            <tags-input element-id="tags"
            v-model="postForm.name"
            placeholder="输入后按回车键添加"
            :existing-tags="{ 
            'web-development': 'Web Development',
            'php': 'PHP',
            'javascript': 'JavaScript',
            }"
            :typeahead="true"></tags-input>
        </el-form-item>
        <div style="margin-bottom: 20px;">
        <el-row>
          <el-col :span="8" v-if="isEdit&&!isClickedUpload">
            <div>
            <img :src="postForm.image" style="width:150px;height:150px;" alt="">
          </div>
          </el-col>
          <el-col :span="8">
              <el-upload
            action="http://up-z1.qiniup.com"
            :multiple="false"
            :limit=1
            :before-upload="beforeAvatarUpload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :data="postData">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          </el-col>
        </el-row>
        </div>
        <div class="editor-container">
          <tinymce :height=400 ref="editor" v-model="postForm.content"></tinymce>
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import tagsInput from '@voerro/vue-tagsinput'
import '@voerro/vue-tagsinput/dist/style.css'// 多选框组件css
import { getToken, delFile } from '@/api/qiniu'
import { addOneNews, draftNews, editNews, editNewsData } from '@/api/artical' // 提交文章
import { formatHTML, getImgList, diffArr, star, toStar } from '@/utils/index' // 获取富文本编辑器body中的内容
// import { validateURL } from '@/utils/validate'
// import { fetchArticle } from '@/api/article'
// import { userSearch } from '@/api/remoteSearch'

const defaultForm = {
  status: 0,
  title: '', // 文章题目
  content: '', // 文章内容
  image: '', // 文章图片
  time: '', // 前台展示时间
  weight: 0, // 文章等级
  name: [], // 文章标签
  source: '原创', // 来源
  classify: '' // 分类
}

let oldImgList = []
let newImgList = []

export default {
  name: 'articleDetail',
  components: { Tinymce, MDinput, Sticky, tagsInput },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      view: {
        path: this.$route.path,
        name: this.$route.name
      },
      pageDataLoading: false,
      isClickedUpload: false,
      postForm: Object.assign({}, defaultForm),
      options: [{
        value: '政策法规',
        label: '政策法规'
      }, {
        value: '升学考试',
        label: '升学考试'
      }, {
        value: '亲子教育',
        label: '亲子教育'
      }, {
        value: '轻松一刻',
        label: '轻松一刻'
      }],
      dialogImageUrl: '',
      listObj: {},
      dialogVisible: false,
      fetchSuccess: true,
      loading: false,
      rules: {
      },
      selectedTags: [],
      postData: {
        token: '',
        key: ''
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.title.length
    }
  },
  created() {
    if (this.isEdit) {
      // 编辑新闻页面进来后
      console.log(this.$route.params.id)
      this.pageDataLoading = true
      this.fetchData()
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
  },
  methods: {
    delImg() {
      const that = this
      // console.log(that.$refs.editor.newUploadList)
      // console.log(oldImgList)
      var oldTotalImg = that.$refs.editor.newUploadList.concat(oldImgList)
      // console.log(oldTotalImg)
      newImgList = getImgList(that.postForm.content)
      // console.log(newImgList)
      // console.log(diffArr(oldTotalImg, newImgList))
      var delImgList = diffArr(oldTotalImg, newImgList)
      // console.log(delImgList)
      if (delImgList) {
        for (var i = 0; i < delImgList.length; i++) {
        // 将图片路径中的文件名取出来
          delImgList[i] = delImgList[i].split('/')[delImgList[i].split('/').length - 1]
          delFile(delImgList[i]).then(response => {
            console.log(response)
          })
        }
      }
    },
    fetchData() {
      console.log('请求数据')
      const that = this
      const nid = this.$route.params.id
      editNews(nid).then(response => {
        console.log(response)
        // 防止工具函数formatHTML抓body中的内容为空
        response.content = '<!DOCTYPE html><html><head></head><body>' + response.content + '</body></html>'
        response.weight = toStar(response.weight)
        that.postForm = response
        // 获取原先文章中的图片，转换为数组
        oldImgList = getImgList(that.postForm.content)
        console.log(oldImgList)
        that.pageDataLoading = false
        console.log(that.postForm)
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      // 将key值传给七牛云，删除七牛云上的照片
      delFile(file.response.key).then(response => {
        console.log(response)
        if (response.code === 200) {
          this.$notify({
            title: '成功',
            message: '删除图片成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '删除图片失败',
            type: 'error',
            duration: 2000
          })
        }
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
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleAvatarSuccess(res, file) {
      if (file.status === 'success') {
        this.postForm.image = 'http://p9mwnc6fh.bkt.clouddn.com/' + res.key
        this.isClickedUpload = true
        this.$notify({
          title: '成功',
          message: '上传图片成功',
          type: 'success',
          duration: 2000
        })
      }
    },
    beforeAvatarUpload(file) {
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
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      // console.log(!isJPG)
      if (isJPG && isLt2M) {
        this.listObj[fileName] = {}
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.src = _URL.createObjectURL(file)
          img.onload = function() {
            _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
          }
          getToken().then(response => {
          // console.log(response)
            _self.postData.token = response.msg
            _self.postData.key = rName() + zimu[rNum()] + zimu[rNum()] + zimu[rNum()] + zimu[rNum()] + file.name
            resolve(true)
          })
        })
      } else {
        // 当图片不是jpeg时，清除token 提示警告
        this.postData.token = ''
        this.$notify({
          title: '警告',
          message: '图片只能是jpg格式并且大小小于2M',
          type: 'warning',
          duration: 2000
        })
        return false
      }
    },
    submitForm() {
      const that = this
      this.postForm.status = 2
      let str = this.postForm.content
      str = formatHTML(str) // 去body中的文本
      this.loading = true
      if (this.isEdit) {
        // 编辑新闻路由下提交
        const nid = this.$route.params.id
        editNewsData(nid, this.postForm.status, this.postForm.title, str, this.postForm.image, this.postForm.time, star(that.postForm.weight), this.postForm.name, this.postForm.source, this.postForm.classify).then(response => {
          console.log(response)
          if (response.code === 200) {
            that.loading = false
            // 检查是否删除了富文本编辑器中的文章，如果删除了，删除七牛云上的文件
            that.delImg()
            that.$notify({
              title: '成功',
              message: '发布文章成功,1s后跳转',
              type: 'success',
              duration: 2000
            })
            setTimeout(() => {
              that.$store.dispatch('delVisitedViews', that.view).then((views) => {
                that.$router.push('/xinwen/x_guanli')
              })
            }, 1000)
          }
        }, error => {
          console.log(error)
          that.loading = false
          this.postForm.status = 0
          that.$notify({
            title: '失败',
            message: '发布文章失败，请检查信息是否填写完整！',
            type: 'warning',
            duration: 2000
          })
        })
      } else {
        // 添加新闻路由下提交
        addOneNews(this.postForm.status, this.postForm.title, str, this.postForm.image, this.postForm.time, star(that.postForm.weight), this.postForm.name, this.postForm.source, this.postForm.classify).then(response => {
          console.log(response)
          if (response.code === 200) {
            that.loading = false
            // 检查是否删除了富文本编辑器中的文章，如果删除了，删除七牛云上的文件
            that.delImg()
            that.$notify({
              title: '成功',
              message: '发布文章成功',
              type: 'success',
              duration: 2000
            })
            setTimeout(() => {
              that.$store.dispatch('delVisitedViews', that.view).then((views) => {
                that.$router.push('/xinwen/x_guanli')
              })
            }, 2000)
          }
        }, error => {
          console.log(error)
          that.loading = false
          this.postForm.status = 0
          that.$notify({
            title: '失败',
            message: '发布文章失败，请检查信息是否填写完整！',
            type: 'warning',
            duration: 2000
          })
        })
      }

      // this.$refs.postForm.validate(valid => {
      //   if (valid) {
      //     this.loading = true
      //     this.$notify({
      //       title: '成功',
      //       message: '发布文章成功',
      //       type: 'success',
      //       duration: 2000
      //     })
      //     this.postForm.status = 2
      //     // 2发布状态
      //     this.loading = false
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    },
    draftForm() {
      if (this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题',
          type: 'warning'
        })
        return
      }
      const that = this
      this.postForm.status = 1 // 保存为草稿状态
      let str = this.postForm.content
      str = formatHTML(str) // 去body中的文本
      console.log(str)
      this.loading = true
      let nid = ''
      console.log(this.isEdit)
      if (this.isEdit) {
        // 编辑路由下存为草稿
        nid = this.$route.params.id
      }
      // 编辑新闻路由下
      draftNews(nid, this.postForm.status, this.postForm.title, str, this.postForm.image, this.postForm.time, star(that.postForm.weight), this.postForm.name, this.postForm.source, this.postForm.classify).then(response => {
        console.log(response)
        if (response.code === 200) {
          that.loading = false
          // 检查是否删除了富文本编辑器中的文章，如果删除了，删除七牛云上的文件
          that.delImg()
          that.$notify({
            title: '成功',
            message: '文章保存为草稿成功',
            type: 'success',
            duration: 2000
          })
        }
      }, error => {
        console.log(error)
        that.loading = false
        this.postForm.status = 0
        that.$notify({
          title: '失败',
          message: '文章保存为草稿失败，请检查是否填写标题！',
          type: 'warning',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .title-prompt{
    position: absolute;
    right: 0px;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
            text-align: right;
            margin-right: 10px;
            .editor-upload-btn {
                display: inline-block;
            }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
</style>

