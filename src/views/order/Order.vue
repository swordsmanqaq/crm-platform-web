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
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="sn" label="唯一标识" width="300" sortable>
      </el-table-column>
      <el-table-column prop="productName" label="产品名称" width="150" sortable>
      </el-table-column>
      <el-table-column prop="price" label="商品价格" width="120" sortable>
      </el-table-column>
      <el-table-column prop="customerName" label="用户名称" width="100" sortable>
      </el-table-column>
      <el-table-column prop="state" label="状态" width="100" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.state === 0" style="color: blue;">代付款</span>
          <span v-if="scope.row.state === 1" style="color: green;">已付定金</span>
          <span v-if="scope.row.state === 2" style="color: red;">已付尾款</span>
          <span v-if="scope.row.state === 3" style="color: black;">已完成</span>
          <span v-if="scope.row.state === -1" style="color: black;">取消</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="350">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
          <el-button type="danger" v-if="scope.row.state == 1" size="small"
                     @click="handlePayBalance(scope.$index, scope.row)">Pay-Balance
          </el-button>
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
        <el-form-item label="Key-值" prop="key">
          <el-input v-model="saveForm.key" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Value-值">
          <el-input type="text" v-model="saveForm.value" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-input type="text" v-model="saveForm.type" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="介绍">
          <el-input type="text" v-model="saveForm.intro" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="saveFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="saveSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--付尾款 编辑页面-->
    <el-dialog title="付尾款" :visible.sync="payBalanceVisible" :close-on-click-modal="false">
      <el-form :model="payBalance" label-width="100px" ref="saveForm">
        <el-form-item label="订单标识">
          <el-input v-model="payBalance.sn" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="payBalance.productName" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="payBalance.price" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="订金金额">
          <el-input v-model="payBalance.deposit" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="未支付金额">
          <el-input v-model="payBalance.unPaid" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付模式">
          <el-select v-model="payBalance.payModel" placeholder="请选择">
            <el-option
                v-for="item in payModels"
                :key="item.id"
                :label="item.title"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="payBalanceVisible = false">取消</el-button>
        <el-button type="primary" @click.native="orderPayBalance" :loading="addLoading">提交</el-button>
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
        key: '',
        value: '',
        type: null,
        intro: ''
      },

      // 付尾款的data
      payBalanceVisible: false,
      payBalance: {
        id: null,
        sn: '',
        productName: '',
        price: null,
        deposit: null,
        unPaid: null,
        payModel: {
          id: null,
          title: '',
          value: ''
        }
      },
      payModels: []
    }
  },

  methods: {

    //订单提交
    orderPayBalance() {
      this.$confirm('是否确认提交?', '提示', {}).then(() => {
        this.addLoading = true;
        this.$http.post("/order/paybalance",this.payBalance)
            .then(result => {
              result = result.data;
              if(result.success){
                this.addLoading = false;
                this.getOrders()
                this.payBalanceVisible = false;
                this.$message({message: '支付成功', type: 'success'});
              }else{
                this.$message({message: result.message, type: 'error'});
              }
            })
      });
    },

    //付尾款弹框
    handlePayBalance: function (index, row) {
      this.payBalanceVisible = true;
      this.payBalance.id = row.id;
      this.payBalance.sn = row.sn;
      this.payBalance.productName = row.productName;
      this.payBalance.price = row.price;
      this.getOrderDeposit(row.id)
      this.getPayModel();
    },

    //获取支付方式
    getPayModel() {
      this.$http.get("/dictionaryitem/sn/payModel")
          .then(result => {
            result = result.data;
            if (result.success) {
              this.payModels = result.resultObj;
            }else {

            }
          }).catch( result => {

      })
    },

    // 获取订金金额
    getOrderDeposit(id) {
      this.$http.get("/deposit/id/" + id)
          .then(result => {
            result = result.data;
            if (result.success) {
              this.payBalance.deposit = result.resultObj.deposit;
              this.payBalance.unPaid = this.payBalance.price - this.payBalance.deposit;
            }
          })
    },


    search() {
      this.query.currentPage = 1;
      this.getOrders();
    },

    handleSizeChange(val) {
      this.query.pageSize = val;
      this.query.currentPage = 1;
      this.getOrders();
    },

    handleCurrentChange(val) {
      this.query.currentPage = val;
      this.getOrders();
    },

    selsChange: function (sels) {
      this.sels = sels;
    },

    //获取角色列表
    getOrders() {
      this.$http.post("/order", this.query)
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
        this.$http.delete("/order/" + row.id)
            .then(result => {
              result = result.data;
              this.listLoading = false;
              if (result.success) {
                this.$message({message: '删除成功', type: 'success'});
                this.query.currentPage = 1;
                this.getOrders();
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
        this.$http.patch("/order", ids)
            .then(result => {
              result = result.data;
              this.listLoading = false;
              if (result.success) {
                this.$message({message: '批量删除成功!', type: 'success'});
                this.query.currentPage = 1;
                this.getOrders();
              } else {
                this.$message({message: result.message, type: 'error'});
              }
            })
      }).catch(() => {
        this.$message({message: result.message, type: 'error'});
      });
    },

    //显示修改界面
    handleEdit: function (index, row) {
      this.saveFormVisible = true;
      this.saveForm = Object.assign({}, row);
    },

    //显示新增界面
    handleAdd: function () {
      this.saveFormVisible = true;
      this.saveForm = {
        id: null,
        key: '',
        value: '',
        type: null,
        intro: ''
      };
    },

    //提交
    saveSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true;

            this.$http.put("/order", this.saveForm)
                .then(result => {
                  result = result.data;
                  if (result.success) {
                    this.query.currentPage = 1;
                    this.getOrders();
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
    this.getOrders();
  }
}


</script>

<style scoped>

</style>
