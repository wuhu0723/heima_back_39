<template>
  <div class="list">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <!-- :data:指定数据源 -->
    <el-table border :data="postList" style="width: 100%;margin-top:20px">
      <el-table-column type="index" width="50"></el-table-column>
        <!-- prop:指定当前列所展示的数据属性 -->
      <el-table-column prop="title" label="标题" width="480"></el-table-column>
      <el-table-column prop="create_date" label="日期" width="280"></el-table-column>
      <el-table-column prop="type" label="类型"></el-table-column>
      <el-table-column prop="user.nickname" label="作者" width="150"></el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分享" placement="top">
            <el-button type="success " icon="el-icon-share"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning " icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { getPostList } from '@/api/posts.js'
export default {
  data () {
    return {
      postList: [],
      pageIndex: 1,
      pageSize: 2,
      total: 0
    }
  },
  methods: {
    edit (row) {
      console.log(row)
    },
    // 切换每页显示记录数时触发
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      // 重置pageSize
      this.pageSize = val
      // 使用重置后的pageSize重新获取数据
      this.init()
    },
    // 切换当前页码时触发
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      // 重置pageIndex
      this.pageIndex = val
      // 使用重置后的pageIndex重新获取数据
      this.init()
    },
    // 数据初始化
    async init () {
      let res = await getPostList({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
      console.log(res)
      this.postList = res.data.data
      // 获取总记录数
      this.total = res.data.total
    }
  },
  async mounted () {
    this.init()
  }
}
</script>

<style>
</style>
