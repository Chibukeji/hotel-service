<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left" v-if="loginFlag">

      <div class="title-container">
        <h3 class="title">服务商登录</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="账号"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <div class="erifycode-wrap-box">
        <el-form-item prop="verifycode" class="verifycode-input-box">
          <el-input v-model="loginForm.verifycode" placeholder="请输入验证码" class="identifyinput" @keyup.enter.native="handleLogin" />
        </el-form-item>
        <el-form-item class="verifycode-btn-box">
          <div class="verifycode-btn" @click="refreshCode">
            <s-identify :identify-code="identifyCode" :content-height="contentHeight"/>
          </div>
        </el-form-item>
      </div>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登陆</el-button>

    </el-form>
    <div v-else class="login-being">登陆中...</div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { getloginInfo } from '@/api/user'
import SIdentify from '../../components/identify/index'
import { setToken } from '@/utils/auth'
export default {
  name: 'Login',
  components: { SIdentify },
  data() {
    // 验证账号
    const validateUsername = (rule, value, callback) => {
      /* if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {  */
      callback()
      // }
    }
    // 验证密码
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    // 验证码
    const validateVerifycode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (value !== this.identifyCode) {
        callback(new Error('验证码不正确!'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        verifycode: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        verifycode: [{ required: true, trigger: 'blur', validator: validateVerifycode }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      identifyCode: '',
      identifyCodes: '1234567890abcdefghijklmnopqrstuvwxyz',
      contentHeight:43,
      loginFlag:true
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {

  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    // 验证码
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
    // disableBrowserBack();
    history.pushState(null, null, document.URL)
	  if (window.history && window.history.pushState) {
      window.addEventListener('popstate', function() {
        window.history.pushState('forward', null, '')
        window.history.forward(1)
      })
      window.history.pushState('forward', null, '') // 在IE中必须得有这两行
      window.history.forward(1)
    }
    this.autoLogin()
  },
  methods: {
    autoLogin() {
      // console.log(this.$route)
      const token = this.$route.query.token
      if (token != undefined) {
        this.loginFlag = false
        this.$store.commit('user/SET_TOKEN', token)
        setToken(token)
        getloginInfo().then(async(res) => {
          if (res.code == 1) {
            this.$alert('您没有权限登录', '提示', {
              showClose: false,
              showConfirmButton: false,
              callback: action => {}
            })
          } else {
            let loginForm = {
              username: res.data.username,
              group_name: res.data.group_name
            }
            loginForm = JSON.stringify(loginForm)
            localStorage.setItem('loginUserName', loginForm)
            if (this.redirect == undefined) {
              const { roles } = await this.$store.dispatch('user/getInfo')
              const accessRoutes = await this.$store.dispatch('permission/generateRoutes', roles)
              this.$router.push({ path:accessRoutes[0].path+'/'+ accessRoutes[0].children[0].path})
              location.reload()
            } else {
              this.$router.push({ path: this.redirect })
            }
          }
        })
      }
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(async() => {
              // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              const { roles } = await this.$store.dispatch('user/getInfo')
              const accessRoutes = await this.$store.dispatch('permission/generateRoutes', roles)
              this.$router.push({ path: accessRoutes[0].path + '/' + accessRoutes[0].children[0].path, query: this.otherQuery })
              location.reload()
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    // 切换验证码
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)]
      }
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
 .erifycode-wrap-box{
   display: flex;

   .verifycode-input-box{
     flex: 1;
     margin-right: 15px;
   }
   .verifycode-btn-box{
     width: 112px;
     height: 43px;
     margin-top: 2px;
   }
 }
  .login-being{
    font-size: 28px;
    color: #fff;
    position: absolute;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
   }
</style>
