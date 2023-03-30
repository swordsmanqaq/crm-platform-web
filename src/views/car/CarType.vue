<template id="carType">
  <div>
    <el-row style="height: 100%;border: 1px solid #DCDFE6;margin-top: 10px">
      <el-col :span="6" style="border-right: 1px solid #DCDFE6; min-height:500px;">
        <div class="grid-content bg-purple">
          <el-tree :data="carTypes" :props="defaultProps" @node-click="handleNodeClick">
          </el-tree>
        </div>
      </el-col>
      <el-col :span="17" style="margin-left: 10px;padding-top: 10px">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;text-align: center">
          <el-form :inline="true" :model="filters">
            <el-form-item>
              <el-input v-model="filters.keyword" placeholder="关键字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" v-on:click="getList">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleAdd">新增</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="datas" highlight-current-row @selection-change="selsChange" style="width: 100%;">
          <el-table-column type="selection">
          </el-table-column>
          <el-table-column prop="name" label="标题" width="180" sortable>
          </el-table-column>
          <!--          <el-table-column prop="icon" label="LOGO" width="180" sortable>-->
          <!--          </el-table-column>-->
          <el-table-column prop="description" label="描述" width="180" sortable>
          </el-table-column>
          <el-table-column prop="icon" label="LOGO" width="180" sortable>
            <template slot-scope="scope">
              <div class="demo-image__preview">
                <el-image
                    style="width: 80px; height: 60px"
                    :src="scope.row.icon"
                    :preview-src-list="[scope.row.icon]">
                </el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240">
            <template scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
        </el-col>

      </el-col>
    </el-row>

    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" ref="addForm">
        <el-form-item label="分类标题" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
<!--        <el-form-item label="LOGO" prop="icon">-->
<!--          <el-input v-model="addForm.icon" auto-complete="off"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item prop="icon" label="车标">
          <el-upload
              class="upload-demo"
              action="http://localhost:8081/fastDfs/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="排序" prop="sortIndex">
          <el-input v-model="addForm.index" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="addForm.description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style>
.el-row {
  margin-bottom: 20px;
  height: 100%;
}

:last-child {
  margin-bottom: 0;
}

#carType el-col {
  border: 1px solid red;
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>

<script>
export default {
  data() {
    return {
      fileList: [],
      addForm: {
        name: "",
        icon: "",
        index: "",
        description: "",
        pid: 0
      },
      addFormVisible: false,
      sels: [],
      filters: {
        keyword: ""
      },
      datas: [],
      carTypes: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {

    //图片预览
    handlePreview(file) {
      console.log(file);
    },

    //文件删除
    handleRemove(file, fileList) {
      var filePath = file.response.resultObj;
      this.$http.delete("/fastDfs/delete?path="+filePath)
          .then(res => {
            if (res.data.success) {
              this.$message({
                message: '删除文件成功!',
                type: 'success'
              });
              this.shop.logo = "";  //置空，避免删除文件后logo里面仍有值会导致数据库还是可以存到url地址
            } else {
              this.$message({
                message: '删除文件失败!',
                type: 'error'
              });
            }
          })
    },

    //文件上传成功回调
    handleSuccess(response, file, fileList) {
      this.addForm.icon = response.resultObj;
    },

    handleAdd() {
      this.addFormVisible = true;
      this.addForm.name = "";
      this.addForm.index = "";
      this.addForm.icon = "";
      this.addForm.description = "";
    },

    addSubmit() {
      //提交
      this.$http.put("/carType", this.addForm).then(res => {
        var ajaxResult = res.data;
        if (ajaxResult.success) {
          this.addFormVisible = false;
          this.$message({
            message: '提交成功',
            type: 'success'
          });
          this.getTreeData();
        } else {
          this.$message({
            message: ajaxResult.message,
            type: 'error'
          });
        }
      });
    },

    handleCurrentChange() {

    },

    batchRemove() {
      //遍历选中的sels数组的id值给ids
      var ids = this.sels.map(item => item.id);
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        // 调用批量删除接口
        this.$http.patch("/carType", ids)
            .then(result => {
              result = result.data;
              this.listLoading = false;
              if (result.success) {
                this.$message({message: '批量删除成功!', type: 'success'});

                //调用查询
                this.getTreeData();
              } else {
                this.$message({message: result.message, type: 'error'});
              }
            })
      }).catch(() => {
        this.$message({message: "网络错误", type: 'error'});
      });
    },

    handleEdit: function(index ,row){
      this.addFormVisible = true;
      this.addForm = Object.assign({}, row);
    },

    handleDel(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;//加载框
        this.$http.delete("/carType/" + row.id).then(result => {
          result = result.data
          this.listLoading = false
          if (result.success) {
            this.$message({message: '删除成功!', type: 'success'});
            this.getTreeData()
          } else {
            this.$message({message: result.message, type: 'error'});
          }
        }).catch(result => {
          this.$message({message: '网络错误!', type: 'error'});
        })


      }).catch(() => {
        this.$message({message: '已取消删除', type: 'info'});

      });

    },

    selsChange: function (sels) {
      this.sels = sels;
    },

    getList() {

    },

    handleNodeClick(row) {
      this.datas = row.children;
      this.addForm.pid = row.id;
    },

    getTreeData() {
      // 发送一个异步请求: get请求 /product/carType/treeData
      this.$http.get("/carType/tree")
          .then(res => {
            console.log(this);
            this.carTypes = res.data.resultObj;
            this.datas = this.carTypes;
          });
    }
  },
  mounted() {
    //对carTypes数据赋值
    this.getTreeData();
  }
};
</script>