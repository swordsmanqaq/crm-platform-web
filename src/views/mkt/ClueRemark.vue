<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;text-align: center">
      <el-form :inline="true" :model="query">
        <el-form-item>
          <el-input v-model="query.keyword" placeholder="Keyword" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="search">Search</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="pageInfo.rows" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
              style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="100">
      </el-table-column>
      <el-table-column prop="noteContent" label="线索记录内容" width="260" sortable>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="200" sortable>
      </el-table-column>
      <el-table-column prop="createBy" label="创建人" width="180" sortable>
      </el-table-column>
      <el-table-column prop="editTime" label="编辑时间" width="200" sortable>
      </el-table-column>
      <el-table-column prop="editBy" label="编辑人" width="180" sortable>
      </el-table-column>
    </el-table>



  </section>
</template>

<script>


export default {
  data() {
    return {
      pageInfo: {
        rows: [],
        total: 0
      },
      query: {
        currentPage: 1,
        pageSize: 10,
        keyword: ""
      },

      listLoading: false,

    }
  },

  methods: {

    search() {
      this.query.currentPage = 1;
      this.getclueRemarks();
    },

    handleSizeChange(val) {
      this.query.pageSize = val;
      this.query.currentPage = 1;
      this.getclueRemarks();
    },

    handleCurrentChange(val) {
      this.query.currentPage = val;
      this.getclueRemarks();
    },


    //获取角色列表
    getclueRemarks() {
      this.$http.post("/clueRemark", this.query)
          .then(result => {
            result = result.data;
            if (result.success) {
              this.pageInfo = result.resultObj;
            } else {
              this.$message({message: '分页查询失败' + result.message, type: 'error'});
            }
          })
          .catch(result => {
            this.$message({message: result.message, type: 'error'});
          })
    }

  },

  mounted() {
    // 钩子函数，页面加载后，调用此方法
    this.getclueRemarks();
  }
}


</script>

<style scoped>

</style>
