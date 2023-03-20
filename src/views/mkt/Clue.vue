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
        <el-form-item>
          <el-upload
              class="upload-demo"
              :action="importUrl"
              :on-success="uploadSuccess"
              accept=".xlsx"
              :show-file-list="false"
              multiple
              :limit="3"
              :on-exceed="handleExceed">
            <el-button type="success" plain icon="el-icon-download" size="small">Import</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" plain icon="el-icon-upload2" @click="exportExcel">Export</el-button>
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
      <el-table-column prop="fullName" label="姓名" width="80" sortable>
      </el-table-column>
      <el-table-column prop="appellation" label="称谓" width="80" sortable>
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="80" sortable>
      </el-table-column>
      <el-table-column prop="dictionaryitem.title" label="客户来源" width="100" sortable>
      </el-table-column>
      <el-table-column prop="employee.username" label="营销人员" width="100" sortable>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="110" sortable>
      </el-table-column>
      <el-table-column prop="state" label="状态" width="120" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.state === 0" style="color: red;">未分配</span>
          <span v-if="scope.row.state === 1" style="color: blue;">跟进中</span>
          <span v-if="scope.row.state === 2" style="color: green;">已转化为商机</span>
          <span v-if="scope.row.state === -1" style="color: black;">放入线索池</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="450">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleActivity(scope.$index, scope.row)">Activity</el-button>
          <el-button type="warning" v-if="scope.row.state == 0" size="small"
                     @click="handleAssign(scope.$index, scope.row)">Assign
          </el-button>
          <el-button type="success" v-if="scope.row.state == 1" size="small"
                     @click="handleFollow(scope.$index, scope.row)">Follow
          </el-button>
          <el-button type="success" v-if="scope.row.state == 1" size="small"
                     @click="handleTransfer(scope.$index, scope.row)">Transfer
          </el-button>
          <el-button type="primary" v-if="scope.row.state == (0 || 1)" size="small" @click="handleBusiness(scope.$index, scope.row)">Business</el-button>
          <el-button type="info" size="small" @click="handleScrap(scope.$index, scope.row)">Scrap</el-button>
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
        <el-form-item label="姓名" prop="">
          <el-input v-model="saveForm.fullName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="称谓">
          <el-input type="text" v-model="saveForm.appellation" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input type="text" v-model="saveForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="客户来源">
          <el-select v-model="saveForm.dictionaryitem" clearable value-key="id" placeholder="请选择活动优惠">
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
        <el-form-item label="地址">
          <el-input type="text" v-model="saveForm.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <template>
            <el-radio v-model="saveForm.state" label="0">未分配</el-radio>
            <el-radio v-model="saveForm.state" label="1">跟进中</el-radio>
            <el-radio v-model="saveForm.state" label="2">已转化为商机</el-radio>
            <el-radio v-model="saveForm.state" label="-1">放入线索池</el-radio>
          </template>
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

    <!-- 关联活动弹框 -->
    <el-dialog title="关联活动" :visible.sync="setActivityVisible" :close-on-click-modal="false">
      <el-form :model="saveForm" label-width="80px" ref="addForm">
        <el-form-item label="姓名">
          <el-input type="text" v-model="saveForm.fullName" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input type="text" v-model="saveForm.phone" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="市场活动">
          <el-select v-model="clueActivity.activityId" value-key="id" multiple placeholder="请选择活动">
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
        <el-button @click.native="setActivityVisible = false">取消</el-button>
        <el-button type="primary" @click.native="saveActivity" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 分配弹框 -->
    <el-dialog title="分配" :visible.sync="clueAssignVisible" :close-on-click-modal="false">
      <el-form :model="assign" label-width="80px" ref="bindActivityForm">
        <el-form-item label="姓名">
          <el-input v-model="assign.fullName" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="assign.phone" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="assign.address" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="营销人员">
          <el-select v-model="assign.employee" clearable value-key="id" placeholder="请选择营销人员">
            <el-option
                v-for="item in employees"
                :key="item.id"
                :label="item.username"
                :value="item">
              <span style="float: left">{{ item.username }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.email }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="clueAssignVisible = false">取消</el-button>
        <el-button type="primary" @click.native="saveClueAssign" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 跟进弹框 -->
    <el-dialog title="跟进" :visible.sync="clueFollowVisible" :close-on-click-modal="false">
      <el-form :model="assign" label-width="120px" ref="bindActivityForm">
        <el-form-item label="姓名">
          <el-input v-model="assign.fullName" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="assign.phone" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="assign.address" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="跟进内容">
          <el-input type="textarea" v-model="assign.contactSummary" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="下次跟进时间">
          <el-date-picker
              v-model="assign.nextContactTime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="clueFollowVisible = false">取消</el-button>
        <el-button type="primary" @click.native="saveClueFollow" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 转交弹框 -->
    <el-dialog title="分配" :visible.sync="clueTransferVisible" :close-on-click-modal="false">
      <el-form :model="assign" label-width="80px" ref="bindActivityForm">
        <el-form-item label="姓名">
          <el-input v-model="assign.fullName" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="assign.phone" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="assign.address" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="营销人员">
          <el-select v-model="assign.employee" clearable value-key="id" placeholder="请选择营销人员">
            <el-option
                v-for="item in employees"
                :key="item.id"
                :label="item.username"
                :value="item">
              <span style="float: left">{{ item.username }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.email }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="clueTransferVisible = false">取消</el-button>
        <el-button type="primary" @click.native="saveClueTransfer" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 转换商机弹框 -->
    <el-dialog title="转换商机" :visible.sync="transformBusinessVisible" :close-on-click-modal="false">
      <el-form :model="business" label-width="120px" ref="bindActivityForm">
        <el-form-item label="姓名">
          <el-input v-model="business.clue.fullName" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="business.clue.phone" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="business.clue.address" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品">
          <el-select v-model="business.product" value-key="id" placeholder="请选择">
            <el-option
                v-for="item in products"
                :key="item.id"
                :label="item.name"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="transformBusinessVisible = false">取消</el-button>
        <el-button type="primary" @click.native="saveClueBusiness" :loading="addLoading">提交</el-button>
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
        employee: {
          id: null,
          username: ''
        },
        dictionaryitem: {
          id: null,
          title: ''
        },
        fullName: '',
        appellation: '',
        phone: '',
        description: '',
        address: '',
        state: null,

      },

      dictionaryItems: [],
      employees: [],

      //设置活动data
      setActivityVisible: false,
      Activitys: [],
      clueActivity: {
        clueId: null,
        activityId: []
      },

      //分配-跟进 按钮data
      clueAssignVisible: false,  //分配弹框
      clueFollowVisible: false,  //跟进弹框
      clueTransferVisible: false, //转交弹框
      assign: {
        id: null,
        employee: {
          id: null,
          username: ''
        },
        fullName: '',
        phone: '',
        address: '',
        contactSummary: '',
        nextContactTime: ''
      },

      //转换商机data
      transformBusinessVisible: false,
      business: {
        clue: {
          id: null,
          fullName: "",
          phone: '',
          address: ""
        },
        product: {
          id: null,
          name: ""
        }
      },
      products: [],

      //导入data
      importUrl: 'http://localhost:8080/clue/importExcel',


    }
  },

  methods: {

    //导出
    exportExcel(){
      // this.$http.post("/clue/exportExcel", this.query)
      //     .then(result => {
      //       result = result.data;
      //       if (result.success) {
      //         this.getClues();
      //       } else {
      //         this.$message({message: '分页查询失败' + result.message, type: 'error'});
      //       }
      //     })
      //     .catch(result => {
      //       this.$message({message: result.message, type: 'error'});
      //     })

      // window.location.href = '/api/clue/exportExcel/' + this.query.keyword

      // if (this.query.keyword){
      //   window.location.href = "/api/clue/exportExcel/" + this.query.keyword
      // }else {
      //   window.location.href = "/api/clue/exportExcel"
      // }

      window.location.href = "http://localhost:8080/clue/exportExcel/" + this.query.keyword

    },
    //导入
    uploadSuccess() {
      this.$message.success("导入成功");
      this.getClues();

    },

    handleExceed(){
    },


    search() {
      this.query.currentPage = 1;
      this.getClues();
    },

    handleSizeChange(val) {
      this.query.pageSize = val;
      this.query.currentPage = 1;
      this.getClues();
    },

    handleCurrentChange(val) {
      this.query.currentPage = val;
      this.getClues();
    },

    selsChange: function (sels) {
      this.sels = sels;
    },

    //获取线索列表
    getClues() {
      this.$http.post("/clue", this.query)
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
        this.$http.delete("/clue/" + row.id)
            .then(result => {
              result = result.data;
              this.listLoading = false;
              if (result.success) {
                this.$message({message: '删除成功', type: 'success'});
                this.query.currentPage = 1;
                this.getClues();
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
        this.$http.patch("/clue", ids)
            .then(result => {
              result = result.data;
              this.listLoading = false;
              if (result.success) {
                this.$message({message: '批量删除成功!', type: 'success'});
                this.query.currentPage = 1;
                this.getClues();
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
      this.getDictionaryItems();
      this.getAllEmployees();
    },

    //显示新增界面
    handleAdd: function () {
      this.saveFormVisible = true;
      this.getDictionaryItems();
      this.getAllEmployees();
      this.saveForm = {
        id: null,
        employee: {
          id: null,
          username: ''
        },
        dictionaryitem: {
          id: null,
          title: ''
        },
        fullName: '',
        appellation: '',
        phone: '',
        description: '',
        state: null,
      };
    },

    //获取数据字典明细
    getDictionaryItems() {
      this.$http.get("/dictionaryitem/type/2")
          .then(result => {
            result = result.data;
            if (result.success) {
              this.dictionaryItems = result.resultObj;
            } else {
              this.$message({message: result.message, type: 'error'});
            }
          }).catch(result => {
        this.$message({message: result.message, type: 'error'});
      })
    },

    //获取所有员工
    getAllEmployees() {
      this.$http.get("/employee")
          .then(result => {
            result = result.data;
            if (result.success) {
              this.employees = result.resultObj;
            } else {
              this.$message({message: '查询失败' + result.message, type: 'error'});
            }
          }).catch(result => {
        this.$message({message: result.message, type: 'error'});
      })
    },

    //提交
    saveSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true;
            console.log(this.saveForm)
            this.$http.put("/clue", this.saveForm)
                .then(result => {
                  result = result.data;
                  if (result.success) {
                    this.query.currentPage = 1;
                    this.getClues();
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
    },


    //显示活动弹框
    handleActivity: function (index, row) {
      this.setActivityVisible = true;
      this.saveForm = Object.assign({}, row);
      this.clueActivity.clueId = row.id;
      this.getActivitys();
    },

    //获取所有活动
    getActivitys() {
      this.$http.get("/clue/type/2")
          .then(result => {
            result = result.data;
            if (result.success) {
              this.Activitys = result.resultObj;
            } else {
              this.$message({message: '分页查询失败' + result.message, type: 'error'});
            }
          })
          .catch(result => {
            this.$message({message: result.message, type: 'error'});
          })
    },

    //设置活动提交
    saveActivity() {
      this.$confirm('确认提交列表吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.$http.post("/clue/activity", this.clueActivity)
            .then(result => {
              result = result.data;
              if (result.success) {
                this.setActivityVisible = false;
                this.$message({message: result.message, type: 'success'});
              } else {
                this.$message({message: "保存失败" + result.message, type: 'error'});
              }
            }).catch(result => {
          this.$message({message: result.message, type: 'error'});
        })
      }).catch(() => {
        this.$message({message: '已取消提交', type: 'info'});
      })
    },


    //显示分配弹框
    handleAssign: function (index, row) {
      this.clueAssignVisible = true;
      this.assign = Object.assign({}, row);
      this.getAllEmployees();
    },

    //分配提交
    saveClueAssign() {
      this.$confirm('确认提交吗？', '提示', {}).then(() => {
        this.addLoading = true;
        this.$http.post("/clue/assign", this.assign)
            .then(result => {
              result = result.data;
              if (result.success) {
                this.addLoading = false;
                this.$message({message: "分配成功", type: 'success'});
                this.clueAssignVisible = false;
                this.getClues();
              } else {
                this.$message({message: result.message, type: 'error'});
              }
            })
            .catch(result => {
              this.$message({message: "网络异常", type: 'error'});
            })
      });
    },


    //跟进弹框
    handleFollow: function (index, row) {
      this.clueFollowVisible = true;
      this.assign = Object.assign({}, row);
    },

    //跟进提交
    saveClueFollow() {
      this.$confirm('确认提交吗？', '提示', {}).then(() => {
        this.addLoading = true;
        this.$http.post("/clue/follow", this.assign)
            .then(result => {
              result = result.data;
              if (result.success) {
                this.addLoading = false;
                this.$message({message: "跟进成功!", type: 'success'});
                this.clueFollowVisible = false;
                this.getClues();
              } else {
                this.$message({message: result.message, type: 'error'});
              }
            })
            .catch(result => {
              this.$message({message: "网络异常!", type: 'error'});
            })
      });
    },

    //转交弹框
    handleTransfer:function (index,row){
      this.clueTransferVisible = true;
      this.assign = Object.assign({}, row);
      this.getAllEmployees();
    },

    //转交提交
    saveClueTransfer() {
      this.$confirm('确认提交吗？', '提示', {}).then(() => {
        this.addLoading = true;
        this.$http.post("/clue/assign", this.assign)
            .then(result => {
              result = result.data;
              if (result.success) {
                this.addLoading = false;
                this.$message({message: "分配成功", type: 'success'});
                this.clueTransferVisible = false;
                this.getClues();
              } else {
                this.$message({message: result.message, type: 'error'});
              }
            })
            .catch(result => {
              this.$message({message: "网络异常", type: 'error'});
            })
      });
    },

    //转换商机弹框
    handleBusiness: function (index, row) {
      this.transformBusinessVisible = true;
      this.business.clue = row;
      //获取产品信息
      this.$http.get("/product")
          .then(result => {
            result = result.data;
            if (result.success) {
              this.products = result.resultObj;
            } else {
              this.$message({message: '分页查询失败' + result.message, type: 'error'});
            }
          })
          .catch(result => {
            this.$message({message: result.message, type: 'error'});
          })
    },

    //转换商机提交
    saveClueBusiness() {
      this.$confirm('确认提交吗？', '提示', {}).then(() => {
        this.addLoading = true;
        this.$http.post("/clue/business", this.business)
            .then(result => {
              result = result.data;
              if (result.success) {
                this.addLoading = false;
                this.transformBusinessVisible = false;
                this.$message({message: "转换商机成功!", type: 'success'});
                this.getClues();
              } else {
                this.$message({message: result.message, type: 'error'});
              }
            })
            .catch(result => {
              this.$message({message: "网络异常", type: 'error'});
            })
      });
    },


    //废弃
    handleScrap: function (index, row) {
      this.$confirm('确认废弃该用户线索吗？', '警告', {}).then(() => {
        this.addLoading = true;
        this.$http.post("/clue/scrap", row)
            .then(result => {
              result = result.data;
              if (result.success) {
                this.addLoading = false;
                this.$message({message: "放入线索池成功!", type: 'success'});
                this.getClues();
              } else {
                this.$message({message: result.message, type: 'error'});
              }
            })
            .catch(result => {
              this.$message({message: "网络异常", type: 'error'});
            })

      });
    }


  },

  mounted() {
    // 钩子函数，页面加载后，调用此方法
    this.getClues();
  }
}


</script>

<style scoped>

</style>
