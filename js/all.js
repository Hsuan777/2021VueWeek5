const App = Vue.createApp({
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io',
      path: '',
      userInfo: {},
      hasLogin: false,
      tabList: ['商品', '訂單', '優惠券', '文章'],
      selectTabName: '',
      originProductsData: []
    };
  },
  methods: {
    getProduct() {
      axios.get(`${this.url}/api/${this.path}/admin/products?page=1`).then(res => {
        console.log(res.data.products);
        this.originProductsData = res.data.products;
      })
    },
    deleteProduct(itemId) {
      console.log(itemId);
      axios.delete(`${this.url}/api/${this.path}/admin/product/${itemId}`).then(res => {
        console.log(res.data);
        this.getProduct()
      })
    },
    selectTab(item) {
      switch (item) {
        case '商品':
          this.selectTabName = item
          this.getProduct()
          break;
        case '訂單':
          this.selectTabName = item
          break;
        case '優惠券':
          this.selectTabName = item
          break;
        case '文章':
          this.selectTabName = item
          break;
      }
    },
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
    this.checkLogin();
  }
});
App.mount("#app");