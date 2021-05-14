const App = Vue.createApp({
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io',
      path: '',
      userInfo: {},
      hasLogin: false
    };
  },
  methods: {
    signIn() {
      axios.post(`${this.url}/admin/signin`, this.userInfo).then(res => {
        const token = res.data.token;
        const expired = res.data.expired;
        document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
        this.hasLogin = true
        console.log(res.data.message);
        this.checkLogin()
      }).catch(() => {
        this.hasLogin = false
      })
    },
    logOut() {
      axios.post(`${this.url}/logout`).then(res => {
        document.cookie = `hexToken=; expires=; path=/`;
        this.hasLogin = false
        console.log(res.data);
      })
    },
    checkLogin() {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      axios.defaults.headers.common['Authorization'] = token;
      axios.post(`${this.url}/api/user/check`).then(res => {
        if (res.data.success === false) {
          this.hasLogin = false
        } else {
          this.hasLogin = true;
        }
      })
    },
    formReset() {
      this.userInfo = {};
    }
  },
  created() {
    this.checkLogin()
  }
});
App.mount("#app");