const App = Vue.createApp({
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io',
      userInfo: {},
    };
  },
  methods: {
    signIn() {
      axios.post(`${this.url}/admin/signin`, this.userInfo).then(res => {
        const token = res.data.token;
        const expired = res.data.expired;
        document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
        this.userInfo = {}
        if (res.data.success === true) {
          window.location.assign('./manage.html');
        } else {
          console.log(res.data.message);
        }
      }).catch(() => {
        console.log('登入失敗!');
      })
    },
    logOut() {
      axios.post(`${this.url}/logout`).then(res => {
        document.cookie = `hexToken=; expires=; path=/`;
        console.log(res.data);
      })
    },
    checkLogin() {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      axios.defaults.headers.common['Authorization'] = token;
      axios.post(`${this.url}/api/user/check`).then(res => {
        if (res.data.success === true) {
          window.location.assign('./manage.html')
        }
      })
    },
  },
  created() {
    this.checkLogin();
  }
});
App.mount("#app");