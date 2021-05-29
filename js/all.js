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
        const {token, expired} = res.data
        // 登入與登出屬性必須一致，才能更新。
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`;
        this.userInfo = {}
        this.$refs.signForm.resetForm();
        if (res.data.success) {
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
        if (res.data.success) {
          window.location.assign('./manage.html')
        }
      })
    },
  },
  created() {
    this.checkLogin();
  }
});
App.component('VForm', VeeValidate.Form);
App.component('VField', VeeValidate.Field);
App.component('ErrorMessage', VeeValidate.ErrorMessage);
Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  // validateOnInput: true, // 調整為輸入字元立即進行驗證
});
App.mount("#app");