<template>
  <el-form :model="loginDto" :rules="rules2" ref="loginFrom" label-position="left" label-width="0px"
           class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="loginDto.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="loginDto.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:48%;" @click.native.prevent="loginIn" :loading="logining">登录</el-button>
      <el-button type="primary" style="width:48%;" @click.native.prevent="shopRegister" :loading="shopregister">店铺入住
      </el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>

//import NProgress from 'nprogress'
export default {
  data() {
    return {
      logining: false,
      shopregister: false,
      loginDto: {
        username: '',
        password: '',
        type: 0
      },
      rules2: {
        username: [
          {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ]
      },
      checked: true
    };
  },
  methods: {

    handleReset2() {
      this.$refs.loginFrom.resetFields();
    },

    loginIn(ev) {
      var _this = this;
      this.$refs.loginFrom.validate((valid) => {
        if (valid) {
          //_this.$router.replace('/table');
          this.logining = true;
          this.$http.post("/login/account", this.loginDto)
              .then(result => {
                result = result.data;
                this.logining = false;
                if (result.success) {
                  this.$message({message: "登录成功", type: 'success'});
                  //把后端返回的token和employee存储到localStorage中
                  localStorage.setItem("token", result.resultObj.token);
                  localStorage.setItem("loginUser", JSON.stringify(result.resultObj.loginUser));
                  //跳转首页
                  this.$router.push({path: '/echarts'});
                } else {
                  this.$message({message: result.message, type: "error"});
                }
              }).catch(result => {
            this.$message({message: result.message, type: 'error'});
          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    shopRegister() {
      //跳转首页
      this.$router.push({path: '/shopRegister'});
    }

  }
}

</script>


<style lang="scss" scoped>
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;

  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>