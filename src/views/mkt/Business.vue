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
      <el-table-column type="index" width="40">
      </el-table-column>
      <el-table-column prop="name" label="商机" width="210" sortable>
      </el-table-column>
      <el-table-column prop="clue.fullName" label="线索人" width="120" sortable>
      </el-table-column>
      <el-table-column prop="product.name" label="产品名称" width="120" sortable>
      </el-table-column>
      <el-table-column prop="productPrice" label="产品价格" width="150" sortable>
      </el-table-column>
      <el-table-column prop="state" label="状态" width="120" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.state === 0" style="color: blue;">跟进中</span>
          <span v-if="scope.row.state === 1" style="color: green;">缴纳定金</span>
          <span v-if="scope.row.state === 2" style="color: red;">成单</span>
          <span v-if="scope.row.state === -1" style="color: black;">商机池</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button v-if="scope.row.state == 0" type="danger" size="small" @click="handleDeposit(scope.$index, scope.row)">Deposit</el-button>
          <el-button v-if="scope.row.state == 0" type="danger" size="small" @click="handleMakeBill(scope.$index, scope.row)">MakeBill</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页工具条-->
    <el-col :span="24" class="toolbar">
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
        <el-form-item label="商机名称">
          <el-input v-model="saveForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="线索">
          <el-input type="text" v-model="saveForm.clueId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品Id">
          <el-input type="number" v-model="saveForm.product.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品价格">
          <el-input type="number" v-model="saveForm.productPrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <template>
            <el-radio v-model="saveForm.state" label="0">跟进中</el-radio>
            <el-radio v-model="saveForm.state" label="1">缴纳定金</el-radio>
            <el-radio v-model="saveForm.state" label="2">成单</el-radio>
            <el-radio v-model="saveForm.state" label="-1">商机池</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="saveFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="saveSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--缴纳定金 编辑界面-->
    <el-dialog title="新增/修改" :visible.sync="depositVisible" :close-on-click-modal="false">
      <el-form :model="saveForm" label-width="80px" :rules="saveFormRules" ref="addForm">
        <el-form-item label="商机名称">
          <el-input v-model="saveForm.name" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input type="text" v-model="saveForm.productName" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品价格">
          <el-input type="number" v-model="saveForm.productPrice" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="订单金额">
          <el-input type="number" v-model="payDeposit.deposit" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="营销活动">
          <el-select v-model="payDeposit.activityIds" value-key="id" multiple placeholder="请选择活动">
            <el-option
                v-for="item in Activitys"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="depositVisible = false">取消</el-button>
        <el-button type="primary" @click.native="saveDeposit" :loading="addLoading">提交</el-button>
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
        clue:{
          id:null,
          fullName:''
        },
        product:{
          id:null,
          name:''
        },
        productName: '',
        productPrice: null,
        state: null
      },

      //缴纳定金data
      depositVisible: false,
      payDeposit:{
        businessId: null,
        deposit:null,
        activityIds:[]
      },
      Activitys: []   //获取营销活动，渲染下拉框
    }
  },

  methods: {

    //缴纳定金弹框
    handleDeposit:function (index,row){
      this.depositVisible = true;
      this.saveForm.name = row.name;
      this.payDeposit.businessId = row.id;
      this.saveForm.productName = row.productName;
      this.saveForm.productPrice = row.productPrice;
      //渲染下拉框
      this.getActivitys()
      console.log(this.payDeposit)
    },

    //缴纳定金提交接口
    saveDeposit(){
      this.$confirm('是否确认提交?', '提示', {}).then(() => {
        this.addLoading = true;
        this.$http.post("/business/saveDeposit",this.payDeposit)
            .then(result => {
              result = result.data;
              if(result.success){
                this.addLoading = false;
                this.depositVisible = false;
                this.getBusiness();
                this.$message({message: '缴纳订金成功', type: 'success'});
              }else{
                this.$message({message: result.message, type: 'error'});
              }
            })
      });
    },

    //获取所有营销活动
    getActivitys() {
      this.$http.get("/activity/type/1")
          .then(result => {
            result = result.data;
            if (result.success) {
              this.Activitys = result.resultObj;
            } else {
              this.$message({message: '获取所有营销活动失败' + result.message, type: 'error'});
            }
          })
          .catch(result => {
            this.$message({message: result.message, type: 'error'});
          })
    },

    search() {
      this.query.currentPage = 1;
      this.getBusiness();
    },

    handleSizeChange(val) {
      this.query.pageSize = val;
      this.query.currentPage = 1;
      this.getBusiness();
    },

    handleCurrentChange(val) {
      this.query.currentPage = val;
      this.getBusiness();
    },

    selsChange: function (sels) {
      this.sels = sels;
    },

    //获取角色列表
    getBusiness() {
      this.$http.post("/business", this.query)
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
        name: '',
        clueId: null,
        productId: null,
        productName: '',
        productPrice: null,
        state: null
      };
    },

    //提交
    saveSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true;

            this.$http.put("/business", this.saveForm)
                .then(result => {
                  result = result.data;
                  if (result.success) {
                    this.query.currentPage = 1;
                    this.getBusiness();
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
    this.getBusiness();
  }
}


</script>

<style scoped>

</style>
