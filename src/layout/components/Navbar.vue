<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template >
        <!-- <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->
        <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
          <div class="avatar-container right-menu-item">
            <div class="role-name-box">
              <span class="name">欢迎您，{{ user }}</span>
              <span class="role">[{{ role }}]</span>
              <i class="el-icon-caret-bottom" />
            </div>
          </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/change-password">
              <span class="logout-btn">修改密码</span>
            </router-link>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="avatar-container right-menu-item">
        <span class="logout-btn" @click="logout">
          <svg-icon icon-class="logout" />
          退出
        </span>  
      </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    Search
  },
  data() {
    return {
      user: '',
      role: '',
      merchName:'',
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  mounted() {
    const loginForm = JSON.parse(localStorage.getItem('loginUserName'))
    // let merchName = localStorage.getItem('merchName')
    this.user = loginForm.username
    this.role = loginForm.group_name
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 4px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 62px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }

      }
      .role-name-box{
          margin-top: -7px;
          margin-left: 10px;
          .name{
            font-size: 14px;
            font-family: Microsoft YaHei;
            color: #333333;
          }
          .role{
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: red;
          }
        }
    }
    .logout-btn{
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      margin-left: -40px;
      cursor: pointer;
      position: relative;
      top: -15%;
    }
  }
}
</style>
