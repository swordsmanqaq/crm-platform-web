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
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="name" label="门店名称" width="110" sortable>
      </el-table-column>
      <el-table-column prop="tel" label="电话" width="90" sortable>
      </el-table-column>
      <el-table-column prop="registerTime" label="注册时间" width="120" sortable>
      </el-table-column>
      <el-table-column prop="address" label="门店地址" width="170" sortable>
      </el-table-column>
      <el-table-column prop="manager.nickName" label="店长" width="100" sortable>
      </el-table-column>
      <el-table-column prop="logo" label="商标" width="150" sortable>
        <template slot-scope="scope">
          <div class="demo-image__preview">
            <el-image
                style="width: 120px; height: 100px"
                :src="scope.row.logo"
                :preview-src-list="[scope.row.logo]">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" width="120" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.state === 1" style="color: green;">待审核</span>
          <span v-if="scope.row.state === 2" style="color: red;">审核通过待激活</span>
          <span v-if="scope.row.state === 3" style="color: blue;">激活成功</span>
          <span v-if="scope.row.state === 4" style="color: black;">驳回</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
          <el-button type="success" size="small" @click="handleAudit(scope.$index, scope.row)" v-if="scope.row.state === 1">Audit</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">Batch-Delete</el-button>
      <!--      @size-change 当每页显示条数的值发生改变时会触发-->
      <!--      @current-change 当 当前页的值发生改变时会触发-->
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
        <el-form-item label="门店名称" prop="name">
          <el-input v-model="saveForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input type="text" v-model="saveForm.tel"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="saveForm.address"></el-input>
        </el-form-item>
        <el-form-item label="商标">
          <el-input type="textarea" v-model="saveForm.logo"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <template>
            <el-radio v-model="saveForm.state" label="1">待审核</el-radio>
            <el-radio v-model="saveForm.state" label="2">审核通过待激活</el-radio>
            <el-radio v-model="saveForm.state" label="3">激活成功</el-radio>
            <el-radio v-model="saveForm.state" label="4">驳回</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="saveFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click.native="saveSubmit" :loading="addLoading">Submit</el-button>
      </div>
    </el-dialog>

    <!--手动激活界面-->
    <el-dialog title="手动激活" :visible.sync="saveAuditVisible" :close-on-click-modal="false">
      <el-form :model="saveForm" label-width="80px" :rules="saveFormRules" ref="addForm">
        <el-form-item label="门店名称" prop="name">
          <el-input v-model="saveForm.name" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input type="text" v-model="saveForm.tel" disabled></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="saveForm.address" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="saveAuditVisible = false">Cancel</el-button>
        <el-button type="danger" @click.native="saveReject" :loading="addLoading">Reject</el-button>
        <el-button type="primary" @click.native="saveSuccessful" :loading="addLoading">Successful</el-button>
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
          {required: true, message: '请输入门店名称', trigger: 'blur'}
        ]
      },

      //编辑界面数据
      saveForm: {
        id: null,
        name: '',
        tel: '',
        state: '',
        address: '',
        logo: ''
      },

      //手动激活data
      saveAuditVisible: false,  //手动激活界面显示

    }
  },
  methods: {

    selsChange: function (sels) {
      this.sels = sels;
    },

    search() {
      // 设置query.currengPage为1,当进行搜索时,从第一页开始重新进行搜索
      this.query.currentPage = 1;
      //调用查询
      this.getShops();
    },

    handleSizeChange(val) {
      this.query.pageSize = val;
      this.query.currentPage = 1;
      //查询结果
      this.getShops();
    },

    handleCurrentChange(val) {
      // val为当前页，赋值后重新进行查询
      this.query.currentPage = val;
      // 调用查询方法
      this.getShops();
    },

    //手动审核弹框
    handleAudit: function(index ,row){
      this.saveAuditVisible = true;
      this.saveForm = Object.assign({}, row);
    },

    //驳回
    saveReject:function(){
      this.$confirm('确认提交吗？', '提示', {}).then(() => {
        this.addLoading = true;
        this.$http.get("/shop/reject/" + this.saveForm.id)
            .then(result => {
              result = result.data;
              if (result.success) {
                //从第一页开始展示
                this.query.currentPage = 1;
                this.getShops();
                //关闭加载框
                this.addLoading = false;
                //关闭弹框
                this.saveAuditVisible = false;
                this.$message({message: '驳回成功', type: 'success'});
              }
            }).catch(result => {
              this.$message({message: '网络错误', type: 'error'});
        })
      });
    },

    //审核成功
    saveSuccessful:function(){
      this.$confirm('确认提交吗？', '提示', {}).then(() => {
        this.addLoading = true;
        this.$http.get("/shop/audit/" + this.saveForm.id)
            .then(result => {
              result = result.data;
              if (result.success) {
                //从第一页开始展示
                this.query.currentPage = 1;
                this.getShops();
                //关闭加载框
                this.addLoading = false;
                //关闭弹框
                this.saveAuditVisible = false;
                this.$message({message: '审核成功', type: 'success'});
              }
            }).catch(result => {
              this.$message({message: '网络错误', type: 'error'});
        })
      });
    },

    //获取门店列表
    getShops() {
      this.$http.post("/shop/page", this.query)
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

    //根据id删除数据
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        this.$http.delete("/shop/" + row.id)
            .then(result => {
              result = result.data;
              this.listLoading = false;
              if (result.success) {
                this.$message({message: '删除成功', type: 'success'});
                //删除成功后回到第一页
                this.query.currentPage = 1;
                // 删除成功,要重新刷新该页面，调用方法查询
                this.getShops();
              } else {
                this.$message({message: result.message, type: 'error'});
              }
            })
            .catch(result => {
              this.$message({message: '很抱歉，网络有误', type: 'error'});
            })
      }).catch(() => {
        this.$message({message: '已取消删除', type: 'info'});
      });
    },

    //批量删除数据
    batchRemove: function () {
      //遍历选中的sels数组的id值给ids
      var ids = this.sels.map(item => item.id);
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        // 调用批量删除接口
        this.$http.patch("/shop", ids)
            .then(result => {
              result = result.data;
              this.listLoading = false;
              if (result.success) {
                this.$message({message: '批量删除成功!', type: 'success'});
                //删除后回到第一页
                this.query.currentPage = 1;
                //调用查询
                this.getShops();
              } else {
                this.$message({message: result.message, type: 'error'});
              }
            })
      }).catch(() => {
        this.$message({message: "网络错误", type: 'error'});
      });
    },

    //显示修改界面(回显数据)
    handleEdit: function (index, row) {
      this.saveFormVisible = true;
      this.saveForm = Object.assign({}, row);
    },

    //显示新增界面
    handleAdd: function () {
      this.saveFormVisible = true;
      this.saveForm = {
        id: null,
        name: '',
        tel: '',
        state: '',
        address: '',
        logo: ''
      };
    },

    //提交
    saveSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true;
            var para = this.saveForm;
            this.$http.post("/shop/save", para)
                .then(result => {
                  result = result.data;
                  if (result.success) {
                    //从第一页开始展示
                    this.query.currentPage = 1;
                    this.getShops();
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
    },

  },

  mounted() {
    // 钩子函数，页面加载后，调用此方法，加载部门
    this.getShops();
  }
}

</script>

<style scoped>

</style>
