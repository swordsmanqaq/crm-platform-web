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
      <el-table-column type="index" width="100">
      </el-table-column>
      <el-table-column prop="name" label="名称" width="180" sortable>
      </el-table-column>
      <el-table-column prop="price" label="价格" width="150" sortable>
      </el-table-column>
      <el-table-column prop="source" label="资源" width="150" sortable>
      </el-table-column>
      <el-table-column prop="type.name" label="产品类型" width="150" sortable>
      </el-table-column>
      <el-table-column prop="description" label="描述" width="230" sortable>
      </el-table-column>
      <el-table-column label="操作" width="200">
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
        <el-form-item label="名称">
          <el-input v-model="saveForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input type="number" v-model="saveForm.price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源">
          <el-input type="text" v-model="saveForm.resource" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="text" v-model="saveForm.description" auto-complete="off"></el-input>
        </el-form-item>
<!--        <el-form-item label="产品类型">-->
<!--          <el-select v-model="saveForm.type" clearable value-key="id" placeholder="请选择父产品">-->
<!--            <el-option-->
<!--                v-for="item in products"-->
<!--                :key="item.id"-->
<!--                :label="item.name"-->
<!--                :value="item">-->
<!--              <span style="float: left">{{ item.id }}</span>-->
<!--              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.description }}</span>-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="产品类型">
          <el-cascader v-model="saveForm.type" placeholder="请选择"
                       :options="prodTree"
                       :props="{
                                checkStrictly: true,
                                label: 'name',
                                value: 'id'
                              }"
                       clearable>
          </el-cascader>
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
        price: null,
        description: '',
        resource: '',
        type: {
          id: null,
          name: ''
        }
      },

      prodTree:[]

    }
  },

  methods: {

    search() {
      this.query.currentPage = 1;
      this.getProducts();
    },

    handleSizeChange(val) {
      this.query.pageSize = val;
      this.query.currentPage = 1;
      this.getProducts();
    },

    handleCurrentChange(val) {
      this.query.currentPage = val;
      this.getProducts();
    },

    selsChange: function (sels) {
      this.sels = sels;
    },

    //获取产品类型列表
    getProducts() {
      this.$http.post("/product", this.query)
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
        this.$http.delete("/product/" + row.id)
            .then(result => {
              result = result.data;
              this.listLoading = false;
              if (result.success) {
                this.$message({message: '删除成功', type: 'success'});
                this.query.currentPage = 1;
                this.getProducts();
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
        this.$http.patch("/product", ids)
            .then(result => {
              result = result.data;
              this.listLoading = false;
              if (result.success) {
                this.$message({message: '批量删除成功!', type: 'success'});
                this.query.currentPage = 1;
                this.getProducts();
              } else {
                this.$message({message: result.message, type: 'error'});
              }
            })
      }).catch(() => {
        this.$message({message: result.message, type: 'error'});
      });
    },

    //获取产品类型
    getProdTree(){
      this.$http.get("/productType/tree")
          .then(result => {
            result = result.data;
            if (result.success){
              this.prodTree = result.resultObj;
            }else {
              this.$message({message: '查询失败' + result.message, type: 'error'});
            }
          }).catch( request => {
        this.$message({message: result.message, type: 'error'});
      })
    },

    //显示修改界面
    handleEdit: function (index, row) {
      this.saveFormVisible = true;
      this.saveForm = Object.assign({}, row);
      if (!row.type){
        this.saveForm.type = {
          id: null,
          name: ''
        }
      }
      this.getProdTree();
    },

    //显示新增界面
    handleAdd: function () {
      this.saveFormVisible = true;
      this.getProdTree();
      this.saveForm = {
        id: null,
        name: '',
        price: null,
        description: '',
        resource: '',
        type: {
          id: null,
          name: ''
        }
      };
    },

    //提交
    saveSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true;
            var para = this.saveForm
            var array = para.type
            if (array && array.length){
              para.type = {id:array[array.length - 1]};
            }else {
              para.type = {id: null};
            }
            this.$http.put("/product", this.saveForm)
                .then(result => {
                  result = result.data;
                  if (result.success) {
                    this.query.currentPage = 1;
                    this.getProducts();
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
    this.getProducts();
  }
}


</script>

<style scoped>

</style>
