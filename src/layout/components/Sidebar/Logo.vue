<template>
  <div class="sidebar-logo-container">
    <el-avatar v-if="logo" :src="logo" class="sidebar-logo" />
    <transition name="sidebarLogoFade">
      <el-dropdown class="sidebar-logo-link" trigger="click">
        <div style="width:80px;margin-top:10px;margin-left:6px;cursor: pointer;">
          <h1 class="sidebar-title">{{ user }} </h1>
          <div class="sidebar-title2">{{ role }} </div>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/dashboard/password">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>联系我们</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">安全退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    // collapse: {
    //   type: Boolean,
    //   required: true
    // }
  },
  data() {
    return {
      user: '',
      role: '',
      logo: require('../../../assets/images/head_default.gif')
    }
  },
  mounted() {
    const loginForm = JSON.parse(localStorage.getItem('loginUserName'))
    this.user = loginForm.username
    this.role = loginForm.group_name
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
.el-dropdown-menu{
  top: 135px!important;
  left: 80px!important;
}
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 150px;
  line-height: 20px;
 // background: #2b2f3a;
  // text-align: center;
  overflow: hidden;
  margin-left: 25px;
  & .sidebar-logo {
    width: 60px;
    height: 60px;
    vertical-align: middle;
    margin-top: 32px;
  }
  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    & .sidebar-title {
      // display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
     // line-height: 50px;
      font-size: 14px;
      margin-right: 10px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }

    & .sidebar-title2 {
      display: inline-block;
      margin: 0;
      color: #8095a8;
      font-weight: 600;
     // line-height: 50px;
      font-size: 12px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
    & .el-icon-caret-bottom {
          cursor: pointer;
          // position: relative;
          // top: -5px;
          font-size: 12px;
          color: #fff;
        }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
