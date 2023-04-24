<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;text-align: center">
      <el-form :inline="true" :model="query">
        <el-form-item>
          <el-input v-model="query.keyword" placeholder="Keyword" style="width:500px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="search">Search</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">Add</el-button>
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
      <el-table-column prop="uid" label="UID" width="200" sortable>
      </el-table-column>
      <el-table-column prop="household.username" label="用户" width="150" sortable>
      </el-table-column>
      <el-table-column prop="type" label="卡片类型" width="200" sortable>
      </el-table-column>
      <el-table-column prop="state" label="卡片状态" width="240" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.state == 0">未分配</span>
          <span v-if="scope.row.state == 1">正常</span>
          <span v-if="scope.row.state == -1">挂失</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">Batch-Delete</el-button>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="pageInfo.total"
          :current-page="query.currentPage"
          style="float: right">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="新增/修改" :visible.sync="saveFormVisible" :close-on-click-modal="false">
      <el-form :model="saveForm" label-width="80px" :rules="saveFormRules" ref="addForm">
        <el-form-item label="UID" style="width: 300px">
          <el-input type="text" v-model="saveForm.uid"></el-input>
        </el-form-item>
        <el-form-item label="用户">
          <el-input type="text" v-model="saveForm.userId"></el-input>
        </el-form-item>
        <el-form-item label="卡片类型">
          <el-input type="text" v-model="saveForm.type"></el-input>
        </el-form-item>
        <el-form-item label="卡片状态">
          <el-input type="text" v-model="saveForm.state"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="saveFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click.native="saveSubmit" :loading="addLoading">Submit</el-button>
      </div>
    </el-dialog>


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
        pageSize: 20,
        keyword: ""
      },

      listLoading: false,
      sels: [],//列表选中列

      saveFormVisible: false, //编辑界面是否显示
      addLoading: false,
      saveFormRules: {
        name: [
          {required: true, message: '请输入名字', trigger: 'blur'}
        ]
      },

      //编辑界面数据
      saveForm: {
        id: null,
        uid: '',
        userId: '',
        type: '',
        state: ''
      }

    }
  },
  methods: {

    search() {
      // 设置query.currengPage为1,当进行搜索时,从第一页开始重新进行搜索
      this.query.currentPage = 1;
      //调用查询
      this.getICCard();
    },

    handleSizeChange(val) {
      this.query.pageSize = val;
      this.query.currentPage = 1;
      //查询结果
      this.getICCard();
    },

    handleCurrentChange(val) {
      // val为当前页，赋值后重新进行查询
      this.query.currentPage = val;
      // 调用查询方法
      this.getICCard();
    },

    selsChange: function (sels) {
      this.sels = sels;
    },

    //获取进出入人员记录
    getICCard() {
      this.$http.post("/iccard/page", this.query)
          .then(result => {
            result = result.data;
            if (result.success) {
              this.pageInfo = result.resultObj;
            } else {
              this.$message({message: result.message, type: 'error'});
            }
          })
          .catch(result => {

          })
    },

    //批量删除信息
    batchRemove: function () {
      //遍历选中的sels数组的id值给ids
      var ids = this.sels.map(item => item.id);
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        // 调用批量删除接口
        this.$http.patch("/iccard", ids)
            .then(result => {
              result = result.data;
              this.listLoading = false;
              if (result.success) {
                this.$message({message: '批量删除成功!', type: 'success'});
                //删除后回到第一页
                this.query.currentPage = 1;
                this.getICCard();
              } else {
                this.$message({message: result.message, type: 'error'});
              }
            })
      }).catch(() => {
        this.$message({message: "网络错误", type: 'error'});
      });
    },


    //显示新增界面
    handleAdd: function () {
      this.saveFormVisible = true;
      this.saveForm = {
        id: null,
        uid: '',
        userId: '',
        type: '',
        state: ''
      };
    },

    //提交
    saveSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true;
            var para = this.saveForm;
            this.$http.post("/iccard/save", para)
                .then(result => {
                  result = result.data;
                  if (result.success) {
                    //从第一页开始展示
                    this.query.currentPage = 1;
                    this.getICCard();
                    //关闭加载框
                    this.addLoading = false;
                    //关闭弹框
                    this.saveFormVisible = false;
                    this.$message({message: '保存成功', type: 'success'});
                  }
                }).catch(result => {
              this.$message({message: '网络错误', type: 'error'});
            })
          });
        }
      });
    }

  },

  mounted() {
    // 钩子函数，页面加载后，调用此方法，加载部门
    this.getICCard();
  }
}

</script>

<style scoped>

</style>
