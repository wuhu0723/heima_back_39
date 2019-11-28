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
export default {
  components: {
    VueEditor
  },
  data () {
    return {
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
  methods: {
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
    pulishPost () {
      // 获取富文本框的内容，当type为1的时候才需要获取
      if (this.postForm.type === 1) {
        this.postForm.content = this.$refs.vueEditor.editor.root.innerHTML
      }
      console.log(this.postForm)
    }
  }
}
</script>

<style>

</style>
