<template>
  <div class="addpost">
      <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章发布</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card" style='margin-top:30px'>
        <el-form :model='postForm' label-width="100px">
             <el-form-item label="标题:">
                <el-input v-model="postForm.title"></el-input>
            </el-form-item>
            <el-form-item label="类型:">
                <el-radio-group v-model="postForm.type">
                    <el-radio :label="1">文章</el-radio>
                    <el-radio :label="2">视频</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="内容" v-if='postForm.type === 1'>
                <VueEditor :config="config" ref="vueEditor"/>
            </el-form-item>
            <el-form-item label="内容" v-if='postForm.type === 2'>
                <el-upload
                    class="upload-demo"
                    :headers='getToken()'
                    action="http://localhost:3000/upload"
                    :on-success='onsuccess'
                    :file-list="fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传视频文件</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="栏目">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="checkedCate" @change="handleCheckedCateChange">
                    <!-- :label:就是当前所绑定的实际值，当复选框被选中之后，这个值会默认的添加到v-model所指定的数组中 -->
                    <el-checkbox v-for="cate in cateList" :label="cate.id" :key="cate.id">{{cate.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="封面">
                <el-upload
                    action="http://localhost:3000/upload"
                    :headers='getToken()'
                    :on-success='imgSuccess'
                    :on-remove='imgRemove'
                    list-type="picture-card">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-button type="primary" @click='pulishPost'>发布文章</el-button>
        </el-form>
    </el-card>
  </div>
</template>

<script>
import VueEditor from 'vue-word-editor'
import 'quill/dist/quill.snow.css'
import { getCateList, addPost } from '@/api/posts.js'
export default {
  components: {
    VueEditor
  },
  data () {
    return {
      isIndeterminate: false,
      // 标记是否全选，默认为非全选状态
      checkAll: false,
      // 当前被选中的复选框--里面是存储？值
      checkedCate: [],
      cateList: [],
      fileList: [],
      postForm: {
        title: '',
        content: '',
        categories: [],
        cover: [],
        type: 1
      },
      //   富文本框的配置
      config: {
        // 上传图片的配置
        uploadImage: {
          // 处理文件上传的服务器地址
          url: 'http://localhost:3000/upload',
          // 后台需要的参数名称
          name: 'file',
          // 设置headers,传递token
          headers: this.getToken(),
          // res是结果，insert方法会把内容注入到编辑器中，res.data.url是资源地址
          uploadSuccess (res, insert) {
            console.log(res)
            insert('http://localhost:3000' + res.data.data.url)
          }
        },

        // 上传视频的配置
        uploadVideo: {
          url: 'http://localhost:3000/upload',
          name: 'file',
          // 设置headers,传递token
          headers: this.getToken(),
          uploadSuccess (res, insert) {
            insert('http://localhost:3000' + res.data.data.url)
          }
        }
      }
    }
  },
  async mounted () {
    let res = await getCateList()
    this.cateList = res.data.data.splice(2)
  },
  methods: {
    //   单击单复选框所触发的事件
    handleCheckedCateChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cateList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cateList.length
    },
    //   实现全选和全不选
    // val：标记是否是全选状态，true为全选
    handleCheckAllChange (val) {
      console.log(val)
      // 由于this.checkedCate只是包含了id号的数组，所以我们需要对this.cateList进行改造
      this.checkedCate = val ? this.cateList.map(value => {
        return value.id
      }) : []
      this.isIndeterminate = false
    },
    // 封面图片移除时的钩子
    // file是本次移除的图片
    // fileList：剩余的图片
    imgRemove (file, fileList) {
      console.log(file)
      console.log(fileList)
      // 根据本次移除的图片信息去删除postForm的cover中的图片存储信息
      for (let i = 0; i < this.postForm.cover.length; i++) {
        if (this.postForm.cover[i].id === file.response.data.id) {
          this.postForm.cover.splice(i, 1)
        }
      }
    },
    // 封面图片上传成功后的钩子
    imgSuccess (response, file, fileList) {
      console.log(response)
      if (response.message === '文件上传成功') {
        this.postForm.cover.push({
          id: response.data.id
        })
      }
    },
    // 文件上传成功之后的钩子
    onsuccess (response, file, fileList) {
    //   console.log(response)
    //   console.log(file)
    //   console.log(fileList)
      if (response.message === '文件上传成功') {
        this.postForm.content = 'http://localhost:3000' + response.data.url
        this.$message.success(response.message)
      }
    },
    // 返回设置token的对象
    getToken () {
      return {
        Authorization: localStorage.getItem('heima_back_39_token')
      }
    },
    // 发布文章
    async pulishPost () {
      // 获取富文本框的内容，当type为1的时候才需要获取
      if (this.postForm.type === 1) {
        this.postForm.content = this.$refs.vueEditor.editor.root.innerHTML
      }
      console.log(this.checkedCate)
      for (let i = 0; i < this.checkedCate.length; i++) {
        this.postForm.categories.push({
          id: this.checkedCate[i]
        })
      }
      //   获取栏目数据
      console.log(this.postForm)
      let res = await addPost(this.postForm)
      console.log(res)
      if (res.data.message === '文章发布成功') {
        this.$router.push({ name: 'PostList' })
      }
    }
  }
}
</script>

<style>

</style>
