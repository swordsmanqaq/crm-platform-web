<template>
  <section>
    <!--工具条 - 高级查询框-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px; text-align: center">
      <el-form :inline="true" :model="query">
        <el-form-item>
          <el-input v-model="query.keyword" placeholder="please input keyword" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onsale" plain>批量上架</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="offsale" plain>批量下架</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="pageInfo.rows" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
              style="width: 100%;" height="600">
      <el-table-column type="selection" width="55" fixed>
      </el-table-column>
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="title" label="名称" width="100" sortable>
      </el-table-column>
      <el-table-column prop="cover" label="封面图" width="100" sortable>
        <template slot-scope="scope">
          <div class="demo-image__preview">
            <el-image
                style="width: 60px; height: 60px"
                :src="scope.row.cover"
                :preview-src-list="[scope.row.cover]">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="saleprice" label="原价" width="100" sortable>
      </el-table-column>
      <el-table-column prop="costprice" label="折扣价" width="100" sortable>
      </el-table-column>
      <el-table-column prop="isnew" label="是否新车" width="100" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.isnew == 1">新车</span>
          <span v-if="scope.row.isnew == 0">二手车</span>
        </template>
      </el-table-column>
      <el-table-column prop="reigstertime" label="上牌时间" width="100" sortable>
      </el-table-column>
      <el-table-column prop="mileage" label="里程数" width="90" sortable>
      </el-table-column>
      <el-table-column prop="shopname" label="店铺名称" width="100" sortable>
      </el-table-column>
      <el-table-column prop="onsaletime" label="上架时间" width="100" sortable>
      </el-table-column>
      <el-table-column prop="offsaletime" label="下架时间" width="100" sortable>
      </el-table-column>
      <el-table-column prop="state" label="状态" min-width="80" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.state == 1" style="color: blue">上架</span>
          <span v-if="scope.row.state == 0" style="color: black">下架</span>
        </template>
      </el-table-column>
      <el-table-column prop="costeffective" label="超值" min-width="80" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.costeffective == 1">是</span>
          <span v-if="scope.row.costeffective == 0">否</span>
        </template>
      </el-table-column>
      <el-table-column prop="rushsale" label="急售" min-width="80" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.rushsale == 1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="quasinewcar" label="准新车" min-width="90" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.quasinewcar == 1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="transitivecountry" label="可提全国" min-width="100" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.transitivecountry == 1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="type.name" label="类型" width="100" sortable>
      </el-table-column>
      <el-table-column prop="seller.nickName" label="营销人员" width="100" sortable>
      </el-table-column>
      <el-table-column prop="auditstate" label="审核状态" width="100" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.auditstate == 1">审核通过</span>
          <span v-if="scope.row.auditstate == 0">驳回</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" v-if="scope.row.state == 0" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          <br>
          <el-button type="danger" size="small" style="margin-top:10px;" v-if="scope.row.state == 0 && scope.row.auditstate == 1"
                     @click="handleOnsale(scope.$index, scope.row)" round>上架
          </el-button>
          <el-button type="warning" size="small" style="margin-top:10px;" v-if="scope.row.state == 1"
                     @click="handleOffsale(scope.$index, scope.row)" round>下架
          </el-button>
          <br>
          <el-button type="primary" size="small" style="margin-top:10px;"
                     @click="handleResource(scope.$index, scope.row)">资源维护
          </el-button>
          <br>
          <el-button type="success" size="small" style="margin-top:10px;"
                     @click="handleReport(scope.$index, scope.row)">
            上传检测报告
          </el-button>
          <br>
          <el-button type="info" size="small" style="margin-top:10px;" @click="handleAudit(scope.$index, scope.row)">
            手动审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条 - 批量删除&分页条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination
          layout="prev, pager, next"
          :current-page="query.currentPage"
          @current-change="handleCurrentChange"
          :page-size="query.pageSize"
          :total="pageInfo.total"
          style="float:right;">
      </el-pagination>
    </el-col>

    <!--新增/修改界面-->
    <el-dialog title="新增/修改" :visible.sync="carFormVisible" :close-on-click-modal="false">
      <el-form :model="carForm" label-width="80px" :rules="carFormRules" ref="carForm">
        <el-form-item label="标题">
          <el-input v-model="carForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="封面">
          <el-upload
              class="upload-demo"
              action="http://localhost:8081/fastDfs/upload"
              :on-remove="coverHandleRemove"
              :on-success="coverHandleSuccess"
              :file-list="coverFileList"
              list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="原价">
          <el-input v-model="carForm.saleprice" style="width:220px;" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="售价">
          <el-input v-model="carForm.costprice" style="width:220px;" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否新车">
          <el-radio-group v-model="carForm.isnew">
            <el-radio class="radio" :label="1">是</el-radio>
            <el-radio class="radio" :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上牌时间" v-if="carForm.isnew != 1">
          <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="carForm.reigstertime"
              type="date"
              placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="里程数" v-if="carForm.isnew != 1">
          <el-input v-model="carForm.mileage" style="width:220px;" type="number" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="超值">
          <el-radio-group v-model="carForm.costeffective">
            <el-radio class="radio" :label="1">是</el-radio>
            <el-radio class="radio" :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="急售">
          <el-radio-group v-model="carForm.rushsale">
            <el-radio class="radio" :label="1">是</el-radio>
            <el-radio class="radio" :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="准新车">
          <el-radio-group v-model="carForm.quasinewcar">
            <el-radio class="radio" :label="1">是</el-radio>
            <el-radio class="radio" :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="可迁全国">
          <el-radio-group v-model="carForm.transitivecountry">
            <el-radio class="radio" :label="1">是</el-radio>
            <el-radio class="radio" :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="车辆类型">
          <el-cascader v-model="carForm.type"
                       :options="carTypeTrees"
                       :props="{
							   checkStrictly: true,
							   label:'name',
							   value:'id'
							}"
                       clearable></el-cascader>
        </el-form-item>
        <el-form-item label="基本信息">
          <quill-editor v-model="carForm.carDetail.info" :options="quillOptions">
          </quill-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="carFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click.native="saveCars" :loading="carFormLoading">Submit</el-button>
      </div>
    </el-dialog>

    <!-- 资源维护界面 -->
    <el-dialog title="资源维护" :visible.sync="carResourceVisible" :close-on-click-modal="false">
      <el-form :model="carResource" label-width="80px" ref="carResourceForm">
        <el-form-item label="主图">
          <el-upload
              class="upload-demo"
              action="http://localhost:8081/fastDfs/upload"
              :on-remove="imgHandleRemove"
              :on-success="imgHandleSuccess"
              :file-list="imgFileList"
              list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="副图">
          <el-upload
              class="upload-demo"
              action="http://localhost:8081/fastDfs/upload"
              :on-remove="viceimgHandleRemove"
              :on-success="viceimgHandleSuccess"
              :file-list="viceimgFileList"
              list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="更多图片">
          <el-upload
              class="upload-demo"
              action="http://localhost:8081/fastDfs/upload"
              :on-remove="moreimgHandleRemove"
              :on-success="moreimgHandleSuccess"
              :file-list="moreimgFileList"
              list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="carResourceVisible = false">Cancel</el-button>
        <el-button type="primary" @click.native="saveCarResource" :loading="carFormLoading">Submit</el-button>
      </div>
    </el-dialog>

    <!-- 上传检测报告界面 -->
    <el-dialog title="资源维护" :visible.sync="carReportVisible" :close-on-click-modal="false">
      <el-form :model="carReport" label-width="80px" ref="carResourceForm">
        <el-form-item label="检测时间">
          <template>
            <div class="block">
              <span class="demonstration"></span>
              <el-date-picker
                  v-model="carReport.detectiontime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="选择日期">
              </el-date-picker>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="事故排查">
          <el-upload
              class="upload-demo"
              action="http://localhost:8081/fastDfs/upload"
              :on-remove="accidentHandleRemove"
              :on-success="accidentHandleSuccess"
              :file-list="accidentFileList"
              list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="核心部件检测">
          <el-upload
              class="upload-demo"
              action="http://localhost:8081/fastDfs/upload"
              :on-remove="coreHandleRemove"
              :on-success="coreHandleSuccess"
              :file-list="coreFileList"
              list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="常用功能检测">
          <el-upload
              class="upload-demo"
              action="http://localhost:8081/fastDfs/upload"
              :on-remove="commonHandleRemove"
              :on-success="commonHandleSuccess"
              :file-list="commonFileList"
              list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="外观内饰检测">
          <el-upload
              class="upload-demo"
              action="http://localhost:8081/fastDfs/upload"
              :on-remove="appearanceHandleRemove"
              :on-success="appearanceHandleSuccess"
              :file-list="appearanceFileList"
              list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="carReportVisible = false">Cancel</el-button>
        <el-button type="primary" @click.native="saveCarReport" :loading="carFormLoading">Submit</el-button>
      </div>
    </el-dialog>

    <!--手动审核界面-->
    <el-dialog title="手动激活" :visible.sync="saveAuditVisible" :close-on-click-modal="false">
      <el-form :model="carForm" label-width="80px" :rules="carFormRules" ref="addForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="carForm.title" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="审核选择">
          <el-radio-group v-model="carAudit.auditstate">
            <el-radio :label="1">审核通过</el-radio>
            <el-radio :label="0">审核驳回</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="saveAuditVisible = false">Cancel</el-button>
        <el-button type="primary" @click.native="saveAuditCommit" :loading="carFormLoading">Commit</el-button>
      </div>
    </el-dialog>


  </section>
</template>

<script>
import {quillEditor} from "vue-quill-editor"; //调用编辑器
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import quillConfig from "../../common/js/quill-config";

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      quillOptions: quillConfig,

      query: {
        currentPage: 1,  // 当前页
        pageSize: 10,  // 每页显示条数
        keyword: ""  // 关键字
      },
      pageInfo: {
        total: 0,
        rows: []
      },
      listLoading: false,
      sels: [],//列表选中列
      carFormRules: {
        name: [
          {required: true, message: '请输入标题', trigger: 'blur'}
        ]
      },

      //新增修改界面数据
      carFormVisible: false,//新增修改界面是否显示
      carFormLoading: false,
      coverFileList: [],  //封面图片数组
      carForm: {
        id: null,
        title: "",
        cover: "",
        saleprice: null,
        costprice: null,
        isnew: null,
        reigstertime: "",
        mileage: null,
        costeffective: null,
        rushsale: null,
        quasinewcar: null,
        transitivecountry: null,
        type: {
          id: null,
          name: ""
        },
        typeId: null,
        carDetail: {
          info: ""
        }
      },
      carTypeTrees: [],

      //资源维护data
      carResourceVisible: false,
      carResource: {
        carId: null,
        img: "",
        viceimg: "",
        moreimg: ""
      },
      imgFileList: [],
      viceimgFileList: [],
      moreimgFileList: [],

      //上传检测报告data
      carReportVisible: false,
      carReport: {
        carId: null,
        detectiontime: "",
        detectorId: null,
        detectorname: "",
        accidentInvestigation: "",
        coreComponentsInvestigation: "",
        commonFunctionsInvestigation: "",
        appearanceInspection: ""
      },
      accidentFileList: [],
      coreFileList: [],
      commonFileList: [],
      appearanceFileList: [],

      //手动审核data
      saveAuditVisible: false,  //手动激活界面显示
      carAudit: {
        id: null,
        auditstate: null
      }

    }
  },
  methods: {

    //批量上架
    onsale() {
      var ids = this.sels.map(item => item.id);
      //获取选中的行
      if (!this.sels || this.sels.length < 1) {
        this.$message({message: '老铁，你不选中数据，臣妾上架不了啊....', type: 'error'});
        return;
      }
      this.$confirm('确认上架选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        this.$http.post('/car/onsale', ids).then((res) => {
          this.listLoading = false;
          res = res.data;
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            });
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            });
          }
          this.getCars();
        });
      }).catch(() => {

      });
    },

    //批量下架
    offsale() {
      var ids = this.sels.map(item => item.id);
      //获取选中的行
      if (!this.sels || this.sels.length < 1) {
        this.$message({message: '老铁，你不选中数据，臣妾下架不了啊....', type: 'error'});
        return;
      }
      this.$confirm('确认下架选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        this.$http.post('/car/offsale', ids).then((res) => {
          this.listLoading = false;
          res = res.data
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            });
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            });
          }
          this.getCars();
        });
      }).catch(() => {

      });
    },


    //封面图删除
    coverHandleRemove(file, fileList) {
      var filePath = file.response.resultObj;
      this.$http.delete("/fastDfs/delete?path=" + filePath)
          .then(result => {
            result = result.data;
            if (result.success) {
              this.$message({message: '删除成功!', type: 'success'});
              //置空
              this.carForm.cover = "";
            } else {
              this.$message({message: result.message, type: 'error'});
            }
          })
    },

    //封面图上传成功回调函数
    coverHandleSuccess(response, file, fileList) {
      this.carForm.cover = response.resultObj;
    },

    //主图删除
    imgHandleRemove(file, fileList) {
      this.carResource.img = "";
      var filePath = file.response ? file.response.resultObj : file.url;
      this.$http.delete("/fastDfs/delete?path=" + filePath)
          .then(result => {
            result = result.data;
            if (result.success) {
              this.$message({message: '删除成功!', type: 'success'});
              if (fileList && fileList.length > 0) {
                for (var i = 0; i < fileList.length; i++) {
                  var url = fileList[i].response ? fileList[i].response.resultObj : fileList[i].url;
                  this.carResource.img += url + ",";
                }
                if (this.carResource.img.endsWith(",")) {
                  this.carResource.img = this.carResource.img.substring(0, this.carResource.img.length - 1);
                }
              }
              console.log(this.carResource)
            } else {
              this.$message({message: result.message, type: 'error'});
            }
          })
    },

    //主图上传成功回调函数
    imgHandleSuccess(response, file, fileList) {
      this.carResource.img = "";
      if (fileList && fileList.length > 0) {
        for (var i = 0; i < fileList.length; i++) {
          var url = fileList[i].response ? fileList[i].response.resultObj : fileList[i].url;
          this.carResource.img += url + ",";
        }
        if (this.carResource.img.endsWith(",")) {
          this.carResource.img = this.carResource.img.substring(0, this.carResource.img.length - 1);
        }
      }
    },

    //副图删除
    viceimgHandleRemove(file, fileList) {
      this.carResource.viceimg = "";
      var filePath = file.response.resultObj;
      this.$http.delete("/fastDfs/delete?path=" + filePath)
          .then(result => {
            result = result.data;
            if (result.success) {
              this.$message({message: '删除成功!', type: 'success'});
              if (fileList && fileList.length > 0) {
                for (var i = 0; i < fileList.length; i++) {
                  this.carResource.viceimg += fileList[i].response.resultObj + ",";
                }
                if (this.carResource.viceimg.endsWith(",")) {
                  this.carResource.viceimg = this.carResource.viceimg.substring(0, this.carResource.viceimg.length - 1);
                }
              }
              console.log(this.carResource)
            } else {
              this.$message({message: result.message, type: 'error'});
            }
          })
    },

    //副图上传成功回调函数
    viceimgHandleSuccess(response, file, fileList) {
      if (this.carResource.viceimg) {
        this.carResource.viceimg = this.carResource.viceimg + "," + response.resultObj;
      } else {
        this.carResource.viceimg = response.resultObj;
      }
      console.log(this.carResource.viceimg)
    },

    //更多图片删除
    moreimgHandleRemove(file, fileList) {
      this.carResource.moreimg = "";
      var filePath = file.response.resultObj;
      this.$http.delete("/fastDfs/delete?path=" + filePath)
          .then(result => {
            result = result.data;
            if (result.success) {
              this.$message({message: '删除成功!', type: 'success'});
              if (fileList && fileList.length > 0) {
                for (var i = 0; i < fileList.length; i++) {
                  this.carResource.moreimg += fileList[i].response.resultObj + ",";
                }
                if (this.carResource.moreimg.endsWith(",")) {
                  this.carResource.moreimg = this.carResource.moreimg.substring(0, this.carResource.moreimg.length - 1);
                }
              }
              console.log(this.carResource)
            } else {
              this.$message({message: result.message, type: 'error'});
            }
          })
    },

    //更多图片上传成功回调函数
    moreimgHandleSuccess(response, file, fileList) {
      if (this.carResource.moreimg) {
        this.carResource.moreimg = this.carResource.moreimg + "," + response.resultObj;
      } else {
        this.carResource.moreimg = response.resultObj;
      }
    },

    //资源维护提交按钮
    saveCarResource() {
      this.$confirm('确认提交吗？', '提示', {}).then(() => {
        this.carFormLoading = true;
        this.$http.put("/carResources", this.carResource)
            .then(result => {
              result = result.data;
              if (result.success) {
                this.carFormLoading = false;
                // 关闭弹框
                this.carResourceVisible = false;
                this.$message({message: '保存成功', type: 'success'});
              } else {
                this.$message({message: result.message, type: 'error'});
              }
            })
      });
    },

    //根据carId获取carResource做数据回显
    getCarResourcesByCarId(carId) {
      this.$http.get("/carResources/carId/" + carId)
          .then(result => {
            result = result.data;
            if (result.success) {
              // {carId:null,img:"",viceimg:"",moreimg:""}
              if (result.resultObj) {
                if (result.resultObj.img) {
                  var imgs = result.resultObj.img.split(",");
                  for (var i = 0; i < imgs.length; i++) {
                    var imgurl = imgs[i];
                    var name = imgurl.substring(imgurl.lastIndexOf("/") + 1);
                    this.imgFileList.push({name: name, url: imgurl, response: {resultObj: imgurl}})
                    // 给carResource对象中的img拼接字符串
                    this.carResource.img = result.resultObj.img;
                  }
                }
                if (result.resultObj.viceimg) {
                  var imgs = result.resultObj.viceimg.split(",");
                  for (var i = 0; i < imgs.length; i++) {
                    var imgurl = imgs[i];
                    var name = imgurl.substring(imgurl.lastIndexOf("/") + 1);
                    this.viceimgFileList.push({name: name, url: imgurl, response: {resultObj: imgurl}})
                    this.carResource.viceimg = result.resultObj.viceimg;
                  }
                }
                if (result.resultObj.moreimg) {
                  var imgs = result.resultObj.moreimg.split(",");
                  for (var i = 0; i < imgs.length; i++) {
                    var imgurl = imgs[i];
                    var name = imgurl.substring(imgurl.lastIndexOf("/") + 1);
                    this.moreimgFileList.push({name: name, url: imgurl, response: {resultObj: imgurl}})
                    this.carResource.moreimg = result.resultObj.moreimg;
                  }
                }
              }
            }
          })
    },

    //资源维护按钮函数
    handleResource: function (index, row) {
      //防止将上一次的内容带到下一次
      this.imgFileList = [];
      this.viceimgFileList = [];
      this.moreimgFileList = [];
      //弹款
      this.carResourceVisible = true;
      this.carResource.carId = row.id;
      //做回显
      this.getCarResourcesByCarId(row.id);
    },


    //上传检测报告按钮函数
    handleReport: function (index, row) {
      //置空，防止数据留到下一次
      this.accidentFileList = [];
      this.coreFileList = [];
      this.commonFileList = [];
      this.appearanceFileList = [];
      //弹框
      this.carReportVisible = true;
      this.carReport.carId = row.id;
      //回显
      this.getCarReportByCarId(row.id);
    },

    //根据carId获取carReport做数据回显
    getCarReportByCarId(carId) {
      this.$http.get("/carDetail/carId/" + carId)
          .then(result => {
            result = result.data;
            if (result.success) {
              this.carReport.detectiontime = result.resultObj.detectiontime;
              // {carId:null,img:"",viceimg:"",moreimg:""}
              if (result.resultObj) {
                if (result.resultObj.accidentInvestigation) {
                  var imgurl1 = result.resultObj.accidentInvestigation
                  this.accidentFileList.push({name: name, url: imgurl1, response: {resultObj: imgurl1}})
                  this.carReport.accidentInvestigation = result.resultObj.accidentInvestigation;
                }
                if (result.resultObj.coreComponentsInvestigation) {
                  var imgurl2 = result.resultObj.coreComponentsInvestigation
                  this.coreFileList.push({name: name, url: imgurl2, response: {resultObj: imgurl2}})
                  this.carReport.coreComponentsInvestigation = result.resultObj.coreComponentsInvestigation;
                }
                if (result.resultObj.commonFunctionsInvestigation) {
                  var imgurl3 = result.resultObj.commonFunctionsInvestigation
                  this.commonFileList.push({name: name, url: imgurl3, response: {resultObj: imgurl3}})
                  this.carReport.commonFunctionsInvestigation = result.resultObj.commonFunctionsInvestigation;
                }
                if (result.resultObj.appearanceInspection) {
                  var imgurl4 = result.resultObj.appearanceInspection
                  this.appearanceFileList.push({name: name, url: imgurl4, response: {resultObj: imgurl4}})
                  this.carReport.appearanceInspection = result.resultObj.appearanceInspection;
                }
              }
            }
          })
    },

    //事故排查图删除
    accidentHandleRemove(file, fileList) {
      var filePath = file.response.resultObj;
      this.$http.delete("/fastDfs/delete?path=" + filePath)
          .then(result => {
            result = result.data;
            if (result.success) {
              this.$message({message: '删除成功!', type: 'success'});
              //置空
              this.carReport.accidentInvestigation = "";
            } else {
              this.$message({message: result.message, type: 'error'});
            }
          })
    },

    //事故排查图上传成功回调函数
    accidentHandleSuccess(response, file, fileList) {
      this.carReport.accidentInvestigation = response.resultObj;
    },

    //核心部件检测图删除
    coreHandleRemove(file, fileList) {
      var filePath = file.response.resultObj;
      this.$http.delete("/fastDfs/delete?path=" + filePath)
          .then(result => {
            result = result.data;
            if (result.success) {
              this.$message({message: '删除成功!', type: 'success'});
              //置空
              this.carReport.coreComponentsInvestigation = "";
            } else {
              this.$message({message: result.message, type: 'error'});
            }
          })
    },

    //核心部件检测图上传成功回调函数
    coreHandleSuccess(response, file, fileList) {
      this.carReport.coreComponentsInvestigation = response.resultObj;
    },

    //常用功能检测图删除
    commonHandleRemove(file, fileList) {
      var filePath = file.response.resultObj;
      this.$http.delete("/fastDfs/delete?path=" + filePath)
          .then(result => {
            result = result.data;
            if (result.success) {
              this.$message({message: '删除成功!', type: 'success'});
              //置空
              this.carReport.commonFunctionsInvestigation = "";
            } else {
              this.$message({message: result.message, type: 'error'});
            }
          })
    },

    //常用功能检测图上传成功回调函数
    commonHandleSuccess(response, file, fileList) {
      this.carReport.commonFunctionsInvestigation = response.resultObj;
    },

    //外观内饰检测图删除
    appearanceHandleRemove(file, fileList) {
      var filePath = file.response.resultObj;
      this.$http.delete("/fastDfs/delete?path=" + filePath)
          .then(result => {
            result = result.data;
            if (result.success) {
              this.$message({message: '删除成功!', type: 'success'});
              //置空
              this.carReport.appearanceInspection = "";
            } else {
              this.$message({message: result.message, type: 'error'});
            }
          })
    },

    //外观内饰检测图上传成功回调函数
    appearanceHandleSuccess(response, file, fileList) {
      this.carReport.appearanceInspection = response.resultObj;
    },

    //上传检测报告提交
    saveCarReport: function () {
      this.$confirm('确认提交吗？', '提示', {}).then(() => {
        this.carFormLoading = true;
        this.$http.put("/carDetail", this.carReport)
            .then(result => {
              result = result.data;
              if (result.success) {
                this.carFormLoading = false;
                // 关闭弹框
                this.carReportVisible = false;
                this.$message({message: '保存成功', type: 'success'});
              } else {
                this.$message({message: result.message, type: 'error'});
              }
            })
      });
    },


    //手动审核弹框
    handleAudit: function (index, row) {
      this.saveAuditVisible = true;
      this.carForm.title = row.title;
      this.carAudit.id = row.id;
      this.carAudit.auditstate = null;
    },

    //手动审核提交
    saveAuditCommit() {
      this.$confirm('确认提交吗？', '提示', {}).then(() => {
        this.carFormLoading = true;
        this.$http.put("/car/audit", this.carAudit)
            .then(result => {
              result = result.data;
              if (result.success) {
                // 操作成功:要关闭加载框 刷新当前数据  提示删除成功
                this.carFormLoading = false;
                // 关闭弹框
                this.saveAuditVisible = false;
                this.getCars();
                this.$message({message: '保存成功', type: 'success'});
              } else {
                this.$message({message: result.message, type: 'error'});
              }
            })
      });
    },


    selsChange: function (sels) {
      this.sels = sels;
    },

    search() {
      this.query.currentPage = 1;
      this.getCars();
    },

    handleCurrentChange(val) {  // val是当前页
      this.query.currentPage = val;
      this.getCars();
    },

    //获取车辆列表
    getCars() {
      this.listLoading = true;  // 弹出加载框
      this.$http.post("/car", this.query)
          .then(result => {
            result = result.data;
            if (result.success) {
              this.pageInfo = result.resultObj;
              console.log(this.pageInfo.rows);
              this.listLoading = false;  // 关闭加载框
            } else {
              this.$message({message: '查询分页失败!' + result.message, type: 'error'});
            }
          })
          .catch(result => {
            this.$message({message: "查询分页失败!", type: 'error'});
          })
    },

    //删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        this.$http.delete("/car/" + row.id)
            .then(result => {
              result = result.data;
              if (result.success) {
                this.$message({message: '删除成功', type: 'success'});
                // 刷新列表
                this.query.currentPage = 1;
                this.getCars();
                this.listLoading = false;  // 关闭弹出框
              } else {
                this.$message({message: '删除失败!' + result.message, type: 'error'});
              }
            })
      }).catch(() => {
        this.$message({message: '已取消删除', type: 'info'});
      });
    },

    //批量删除
    batchRemove: function () {
      var ids = this.sels.map(item => item.id);
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        // 调用批量删除接口
        this.$http.patch("/car", ids)
            .then(result => {
              result = result.data;
              this.listLoading = false;
              if (result.success) {
                this.$message({message: '批量删除成功!', type: 'success'});
                //调用查询
                this.search();
              } else {
                this.$message({message: result.message, type: 'error'});
              }
            })
      }).catch(() => {

      });
    },

    //获取车辆类型树
    getCarTypeTree() {
      this.$http.get("/carType/tree")
          .then(result => {
            result = result.data; // result => {successs:true,message:"",result:[]}
            if (result.success) {
              this.carTypeTrees = result.resultObj;
            } else {
              this.$message({message: '获取部门树失败!' + result.message, type: 'error'});
            }
          }).catch(result => {
        this.$message({message: '获取部门树失败!', type: 'error'});
      })
    },

    //显示编辑界面
    handleEdit: function (index, row) {
      this.carFormVisible = true;
      // this.carForm = Object.assign({}, row);
      this.carForm.id = row.id;
      this.carForm.title = row.title;
      this.carForm.saleprice = row.saleprice;
      this.carForm.costprice = row.costprice;
      this.carForm.isnew = row.isnew;
      this.carForm.reigstertime = row.reigstertime;
      this.carForm.mileage = row.mileage;
      this.carForm.costeffective = row.costeffective;
      this.carForm.rushsale = row.rushsale;
      this.carForm.quasinewcar = row.quasinewcar;
      this.carForm.transitivecountry = row.transitivecountry;

      this.getCarTypeTree();
    },

    //显示新增界面
    handleAdd: function () {
      this.carFormVisible = true;
      this.carForm = {
        id: null,
        title: "",
        cover: "",
        saleprice: null,
        costprice: null,
        isnew: null,
        reigstertime: "",
        mileage: null,
        costeffective: null,
        rushsale: null,
        quasinewcar: null,
        transitivecountry: null,
        type: {
          id: null,
          name: ""
        },
        typeId: null,
        carDetail: {
          info: ""
        }
      }
      this.getCarTypeTree();
    },

    //保存
    saveCars: function () {
      this.$confirm('确认提交吗？', '提示', {}).then(() => {
        var array = this.carForm.type;
        if (array && array.length > 0) {
          this.carForm.type = {id: array[array.length - 1]}
        }
        this.carFormLoading = true;
        this.$http.put("/car", this.carForm)
            .then(result => {
              result = result.data;
              if (result.success) {
                // 操作成功:要关闭加载框 刷新当前数据  提示删除成功
                this.carFormLoading = false;
                // 关闭弹框
                this.carFormVisible = false;
                this.getCars();
                this.$message({message: '保存成功', type: 'success'});
              } else {
                this.$message({message: result.message, type: 'error'});
              }
            })

      });
    },


  },
  mounted() {
    this.getCars();
  }
}

</script>

<style scoped>

</style>