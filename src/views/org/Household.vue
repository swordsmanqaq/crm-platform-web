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
      <el-table-column prop="username" label="姓名" width="150" sortable>
      </el-table-column>
      <el-table-column prop="age" label="年龄" width="110" sortable>
      </el-table-column>
      <el-table-column prop="checkTime" label="入住时间" width="240" sortable>
      </el-table-column>
      <el-table-column prop="leaveTime" label="离开时间" width="240" sortable>
      </el-table-column>
      <el-table-column label="操作" width="28 0">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
          <el-button type="success" size="small" @click="handleRole(scope.$index, scope.row)">Set-Role</el-button>
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
        <el-form-item label="姓名" prop="username">
          <el-input type="text" v-model="saveForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="text" v-model="saveForm.password"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input type="number" v-model="saveForm.age" style="width: 100px"></el-input>
        </el-form-item>
        <el-form-item label="入住时间">
          <template>
            <div class="block">
              <span class="demonstration"></span>
              <el-date-picker
                  v-model="saveForm.checkTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="选择日期">
              </el-date-picker>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="离开时间">
          <template>
            <div class="block">
              <span class="demonstration"></span>
              <el-date-picker
                  v-model="saveForm.leaveTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="选择日期">
              </el-date-picker>
            </div>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="saveFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click.native="saveSubmit" :loading="addLoading">Submit</el-button>
      </div>
    </el-dialog>

    <!-- 设置权限 编辑页面 -->
    <el-dialog title="设置角色" :visible.sync="setRoleVisible" :close-on-click-modal="false">
      <el-form :model="EmployeeRole" label-width="80px" ref="saveForm">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div class="checkbox-table" v-for="(p,indexkey) in Roles" :key="p.id">
          <!--
          label:就是当前复选框的值
          -->
          <el-checkbox class="check1" style="font-weight: 600;margin-bottom: 15px "
                       v-model='EmployeeRole.roleId' :label="p.id"
                       @change='handleCheck(1,indexkey)'>
            {{ p.name }}
          </el-checkbox>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="setRoleVisible = false">Cancel</el-button>
        <el-button type="primary" @click.native="saveEmployeeRole" :loading="addLoading">Submit</el-button>
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
        username: [
          {required: true, message: '请输入名字', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      },

      //编辑界面数据
      saveForm: {
        id: null,
        username: '',
        password: '',
        age: null,
        checkTime: '',
        leaveTime: ''
      },

      //设置角色相关data
      setRoleVisible: false,  //弹框控制
      EmployeeRole: {
        householdId: null,
        roleId: []
      },
      isIndeterminate: false,   //多选的状态
      checkAll: false,
      Roles: [],       //用来显示数据
      allRoleIds: []     //用来装所有角色的id

    }
  },
  methods: {

    //全选按钮
    handleCheckAllChange(val) {
      this.EmployeeRole.roleId = val ? this.allRoleIds : []
      this.isIndeterminate = false;
    },

    //角色弹框设置
    handleRole(index, row) {
      this.setRoleVisible = true;
      this.getRoles();
      this.getAllRoleIds();
      this.EmployeeRole.householdId = row.id;
      //传当前对象的id做数据回显
      this.getRoleByRoleId(row.id);
    },

    //获取所有角色
    getRoles() {
      this.$http.get("/role")
          .then(result => {
            result = result.data;
            if (result.success) {
              this.Roles = result.resultObj
            }
          }).catch(result => {
        this.$message({message: '网络错误', type: 'error'});
      })
    },

    //获取所有角色的id
    getAllRoleIds() {
      this.$http.get("/role/ids")
          .then(result => {
            result = result.data;
            if (result.success) {
              this.allRoleIds = result.resultObj;
            }
          }).catch(result => {
        this.$message({message: '网络错误', type: 'error'});
      })
    },

    //根据householdId做回显
    getRoleByRoleId(householdId) {
      this.$http.get("/household/role/" + householdId)
          .then(result => {
            result = result.data;
            if (result.success) {
              this.EmployeeRole.roleId = result.resultObj;
              // 获取已选中的长度
              let checkedLength = this.EmployeeRole.roleId.length;
              // 如果已选中的长度==所有权限的长度，则checkAll=true，也就是全选框被选中
              this.checkAll = checkedLength === this.allRoleIds.length;
              // 如果已选中的长度>0并且已选中的长度<所有权限的长度，则全选框是一个横杠
              this.isIndeterminate = checkedLength > 0 && checkedLength < this.allRoleIds.length;
            }
          }).catch(result => {
        this.$message({message: '网络错误', type: 'error'});
      })
    },

    //设置角色保存
    saveEmployeeRole() {
      this.$confirm('确认提交菜单选择吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.$http.post("/household/role", this.EmployeeRole)
            .then(result => {
              result = result.data;
              if (result.success) {
                this.setRoleVisible = false;
                this.$message({message: result.message, type: 'success'});
              } else {
                this.$message({message: result.message, type: 'error'});
              }
            }).catch(result => {
          this.$message({message: '网络错误', type: 'error'});
        })
      })
    },

    //处理选择事件
    handleCheck() {
      // 获取已选中的长度
      let checkedLength = this.EmployeeRole.roleId.length;
      // 如果已选中的长度==所有权限的长度，则checkAll=true，也就是全选框被选中
      this.checkAll = checkedLength === this.allRoleIds.length;
      // 如果已选中的长度>0并且已选中的长度<所有权限的长度，则全选框是一个横杠
      this.isIndeterminate = checkedLength > 0 && checkedLength < this.allRoleIds.length;
    },

    search() {
      // 设置query.currengPage为1,当进行搜索时,从第一页开始重新进行搜索
      this.query.currentPage = 1;
      //调用查询
      this.getHouseholds();
    },

    handleSizeChange(val) {
      this.query.pageSize = val;
      this.query.currentPage = 1;
      //查询结果
      this.getHouseholds();
    },

    handleCurrentChange(val) {
      // val为当前页，赋值后重新进行查询
      this.query.currentPage = val;
      // 调用查询方法
      this.getHouseholds();
    },

    selsChange: function (sels) {
      this.sels = sels;
    },

    //获取住户列表
    getHouseholds() {
      this.$http.post("/household/page", this.query)
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

    //住户删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        this.$http.delete("/household/" + row.id)
            .then(result => {
              result = result.data;
              this.listLoading = false;
              if (result.success) {
                this.$message({message: '删除成功', type: 'success'});
                //删除成功后回到第一页
                this.query.currentPage = 1;
                // 删除成功,要重新刷新该页面，调用方法查询
                this.getHouseholds();
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

    //批量删除住户
    batchRemove: function () {
      //遍历选中的sels数组的id值给ids
      var ids = this.sels.map(item => item.id);
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        // 调用批量删除接口
        this.$http.patch("/household", ids)
            .then(result => {
              result = result.data;
              this.listLoading = false;
              if (result.success) {
                this.$message({message: '批量删除成功!', type: 'success'});
                //删除后回到第一页
                this.query.currentPage = 1;
                //调用查询
                this.getHouseholds();
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
        username: '',
        password: '',
        age: null,
        checkTime: '',
        leaveTime: ''
      };
    },

    //提交
    saveSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true;
            var para = this.saveForm;
            this.$http.post("/household/save", para)
                .then(result => {
                  result = result.data;
                  if (result.success) {
                    //从第一页开始展示
                    this.query.currentPage = 1;
                    this.getHouseholds();
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
    this.getHouseholds();
  }
}

</script>

<style scoped>

</style>
