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
      <el-table-column type="index" width="90">
      </el-table-column>
      <el-table-column prop="name" label="活动名称" width="180" sortable>
      </el-table-column>
      <el-table-column prop="discount.title" label="活动优惠" width="160" sortable>
      </el-table-column>
      <el-table-column prop="startDate" label="开始时间" width="180" sortable>
      </el-table-column>
      <el-table-column prop="endDate" label="结束时间" width="180" sortable>
      </el-table-column>
      <el-table-column prop="description" label="描述" width="200" sortable>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页工具条-->
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

    <!--新增/修改 编辑界面-->
    <el-dialog title="新增/修改" :visible.sync="saveFormVisible" :close-on-click-modal="false">
      <el-form :model="saveForm" label-width="80px" :rules="saveFormRules" ref="addForm">
        <el-form-item label="活动名称">
          <el-input v-model="saveForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动优惠">
          <el-select v-model="saveForm.discount" clearable value-key="id" placeholder="请选择活动优惠">
            <el-option
                v-for="item in dictionaryItems"
                :key="item.id"
                :label="item.title"
                :value="item">
              <span style="float: left">{{ item.title }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.intro }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <template>
            <div class="block">
              <span class="demonstration"></span>
              <el-date-picker
                  v-model="saveForm.startDate"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="选择日期">
              </el-date-picker>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="结束时间">
          <template>
            <div class="block">
              <span class="demonstration"></span>
              <el-date-picker
                  v-model="saveForm.endDate"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="date"
                  placeholder="选择日期">
              </el-date-picker>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="创建时间">
          <template>
            <div class="block">
              <span class="demonstration"></span>
              <el-date-picker
                  v-model="saveForm.createTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="date"
                  placeholder="选择日期">
              </el-date-picker>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input type="text" v-model="saveForm.createBy" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="text" v-model="saveForm.description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="saveFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="saveSubmit" :loading="addLoading">提交</el-button>
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
        pageSize: 10,
        keyword: ""
      },

      listLoading: false,
      sels: [],//列表选中列

      saveFormVisible: false, //编辑界面是否显示
      addLoading: false,
      saveFormRules: {
        key: [
          {required: true, message: '请输入Key', trigger: 'blur'}
        ]
      },

      //编辑界面数据
      saveForm: {
        id: null,
        name: '',
        discount:{
          id: null,
          title:''
        },
        startDate: '',
        endDate: '',
        description: '',
        createTime: '',
        createBy: ''
      },

      //从数据字典明细中获取活动优惠
      dictionaryItems:[]

    }
  },

  methods: {

    search() {
      this.query.currentPage = 1;
      this.getActivitys();
    },

    handleSizeChange(val) {
      this.query.pageSize = val;
      this.query.currentPage = 1;
      this.getActivitys();
    },

    handleCurrentChange(val) {
      this.query.currentPage = val;
      this.getActivitys();
    },

    selsChange: function (sels) {
      this.sels = sels;
    },

    //获取产品类型列表
    getActivitys() {
      this.$http.post("/activity", this.query)
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
    },

    //根据id删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        this.$http.delete("/activity/" + row.id)
            .then(result => {
              result = result.data;
              this.listLoading = false;
              if (result.success) {
                this.$message({message: '删除成功', type: 'success'});
                this.query.currentPage = 1;
                this.getActivitys();
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

    //批量删除
    batchRemove: function () {
      //遍历选中的sels数组的id值给ids
      var ids = this.sels.map(item => item.id);
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        // 调用批量删除接口
        this.$http.patch("/activity", ids)
            .then(result => {
              result = result.data;
              this.listLoading = false;
              if (result.success) {
                this.$message({message: '批量删除成功!', type: 'success'});
                this.query.currentPage = 1;
                this.getActivitys();
              } else {
                this.$message({message: result.message, type: 'error'});
              }
            })
      }).catch(() => {
        this.$message({message: result.message, type: 'error'});
      });
    },

    //获取数据字典明细title
    getDictionaryItems(){
      this.$http.get("/dictionaryitem/type/4")
          .then( result => {
            result = result.data;
            if (result.success){
              this.dictionaryItems = result.resultObj;
            }else {
              this.$message({message: result.message, type: 'error'});
            }
          }).catch( result => {
            this.$message({message: result.message, type: 'error'});
      })
    },

    //显示修改界面
    handleEdit: function (index, row) {
      this.saveFormVisible = true;
      this.saveForm = Object.assign({}, row);
      this.getDictionaryItems();
    },

    //显示新增界面
    handleAdd: function () {
      this.saveFormVisible = true;
      this.saveForm = {
        id: null,
        name: '',
        discount:{
          id: null,
          title:''
        },
        endDate: '',
        startDate: '',
        description: '',
        createTime: '',
        createBy: ''
      };
      this.getDictionaryItems();
    },

    //提交
    saveSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true;
            console.log(this.saveForm)
            var para = Object.assign({}, this.saveForm);
            this.$http.put("/activity", para)
                .then(result => {
                  result = result.data;
                  if (result.success) {
                    this.query.currentPage = 1;
                    this.getActivitys();
                    this.addLoading = false;
                    this.saveFormVisible = false;
                    this.$message({message: '保存成功', type: 'success'});
                  }
                }).catch(result => {
              this.$message({message: result.message, type: 'error'});
            })
          });
        }
      });
    }

  },

  mounted() {
    // 钩子函数，页面加载后，调用此方法
    this.getActivitys();
  }
}


</script>

<style scoped>

</style>
