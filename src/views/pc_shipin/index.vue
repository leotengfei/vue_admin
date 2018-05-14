<template>
  <div class="app-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm" label-width="80px">
        <el-row>
            <el-col :span="21">
              <el-form-item style="margin-bottom: 40px;">
              <MDinput name="name" v-model="postForm.cname" required :maxlength="100">
                视频标题
              </MDinput>
              <span v-show="postForm.cname.length>=26" class='title-prompt'>app可能会显示不全</span>
              <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
            </el-form-item>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label="课程价格">
                <el-input-number v-model="postForm.cPrice" controls-position="right" :min="0"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label="年级">
                    <el-select v-model="postForm.grade" placeholder="请选择年级">
                      <el-option label="高三" value="高三"></el-option>
                      <el-option label="高二" value="高二"></el-option>
                      <el-option label="高一" value="高一"></el-option>
                      <el-option label="初三" value="初三"></el-option>
                      <el-option label="初二" value="初二"></el-option>
                      <el-option label="初一" value="初一"></el-option>
                    </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label="科目">
                    <el-select v-model="postForm.project" placeholder="请选择科目">
                      <el-option label="数学" value="数学"></el-option>
                      <el-option label="语文" value="语文"></el-option>
                      <el-option label="英语" value="英语"></el-option>
                      <el-option label="物理" value="物理"></el-option>
                      <el-option label="化学" value="化学"></el-option>
                      <el-option label="生物" value="生物"></el-option>
                      <el-option label="政治" value="政治"></el-option>
                      <el-option label="历史" value="历史"></el-option>
                      <el-option label="地理" value="地理"></el-option>
                      <el-option label="理综" value="理综"></el-option>
                      <el-option label="文综" value="文综"></el-option>
                    </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item style="margin-bottom: 40px;" label="教师">
                    <tags-input element-id="tags"
                    v-model="postForm.teacher"
                    placeholder="输入后按回车键添加"
                    :existing-tags="{ 
                    1: '邓亚磊',
                    2: '李强',
                    3: '王明',
                    }"
                  :typeahead="true"></tags-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item style="margin-bottom: 40px;" label="课程封面">
                <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :multiple="false"
                  :limit=1
                  :before-upload="beforeAvatarUpload"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <p style="color:#aaa">jpg视频封面大小一般为374X260px</p>
              <p style="color:#aaa">svg为每日一题的图标</p>
            </el-col>
            <el-col :span="20">
              <el-form-item style="margin-bottom: 60px;" label="课程标签">
                <el-input v-model="postForm.tag" placeholder="eg.每日一题（1）"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item style="margin-bottom: 60px;" label="课程简介">
                <el-input type="textarea" v-model="postForm.intro" placeholder="每日一题系列课程中，简介必须包含（每日一题）"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item style="margin-bottom: 60px;" label="视频文件">
                <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreviewList"
                  :on-remove="handleRemoveList"
                  :before-remove="beforeRemoveList"
                  multiple
                  :on-exceed="handleExceed"
                  :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">上传格式为mp4的视频文件</div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item style="margin-bottom: 60px;" label="课程简介">
                <h1>添加视频input</h1>
              </el-form-item>
            </el-col>
        </el-row>
    </el-form>
  </div>
</template>

<script>

import MDinput from '@/components/MDinput'
import tagsInput from '@voerro/vue-tagsinput'
import '@voerro/vue-tagsinput/dist/style.css'// 多选框组件css

const defaultForm = {
  cname: '', // 视频名称
  total: 0, // 视频总集数
  grade: '', // 年级
  project: '', // 科目
  teacher: '', // 老师
  cPrice: 0, // 课程价格
  image_uri: '', // 课程封面
  tag: '', // 视频的标签
  intro: '' // 视频简介
}

export default {
  components: {
    MDinput,
    tagsInput
  },
  data() {
    return {
      dialogImageUrl: '',
      postForm: Object.assign({}, defaultForm),
      dialogVisible: false,
      fileList: [{
        name: 'sdf',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      },
      {
        name: 'sdf',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }
      ],
      rules: {
      }
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      console.log(file.type)
      const isJPG = file.type === 'image/jpeg'
      const isSVG = file.type === 'image/svg+xml'
      const isLt2M = file.size / 1024 / 1024 < 2
      console.log((isJPG || isSVG) && isLt2M)

      if (!isJPG && !isSVG) {
        this.$message.error('上传头像图片只能是 JPG或SVG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isSVG) && isLt2M
    }
  },
  handleRemoveList(file, fileList) {
    console.log(file, fileList)
  },
  handlePreviewList(file) {
    console.log(file)
  },
  handleExceedList(files, fileList) {
    this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
  },
  beforeRemoveList(file, fileList) {
    return this.$confirm(`确定移除 $ { file.name }？`)
  },
  computed: {
    contentShortLength() {
      return this.postForm.cname.length
    }
  }
}
</script>

<style scoped>
  .title-prompt{
    position: absolute;
    right: 0px;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }

</style>

