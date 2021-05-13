export default {
  data() {
    return {
      upload_picture: `${process.env.VUE_APP_BASE_API}/main/upload`,
      upload_novfiles: `${process.env.VUE_APP_BASE_API}/common/upload_novfiles`,
      importChapter_upload_url: `${process.env.VUE_APP_BASE_API}/chapter/importChapter`
    }
  },
  computed: {
    token() {
      const token = this.$store.getters.token
      return token
    },
    headers() {
      const token = this.$store.getters.token
      const obj = {
        token
      }
      return obj
    }
  },
  methods: {
    refresh() {
      // const { fullPath } = this.$route
      // this.$router.replace({
      //   path: '/redirect' + fullPath
      // })
      location.reload()
    }
  }
}
