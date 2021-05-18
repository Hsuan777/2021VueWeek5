
const App = Vue.createApp({
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io',
      path: 'vs',
      userInfo: {},
      hasLogin: false,
      displayData: {
        products: true,
        orders: false
      },
      tabList: ['商品', '訂單', '優惠券', '文章'],
      selectTabName: '商品',
      originData: {
        products: [],
        orders: []
      },
      tempData: {
        product: {}
      }
    };
  },
  methods: {
    getProduct(page = 1) {
      axios.get(`${this.url}/api/${this.path}/admin/products?page=${page}`).then(res => {
        console.log(res.data.products);
        this.originData.products = res.data.products;
      }).catch(res => {
        console.log(res);
      })
    },
    getOrder(page = 1) {
      axios.get(`${this.url}/api/${this.path}/admin/orders?page=${page}`,).then(res => {
        console.log(res.data.orders);
        this.originData.orders = res.data.orders;
      })
    },
    addProduct() {
      let productObj = {
        data: {
          ...this.tempData.product
        }
      }
      console.log(productObj);
      axios.post(`${this.url}/api/${this.path}/admin/product`, productObj).then(res => {
        console.log(res.data);
        this.getProduct()
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
      // 點自己會錯亂
      switch (item) {
        case '商品':
          this.selectTabName = item
          this.displayData.products = !this.displayData.products
          this.displayData.orders = !this.displayData.orders
          this.getProduct()
          break;
        case '訂單':
          this.selectTabName = item
          this.displayData.products = !this.displayData.products
          this.displayData.orders = !this.displayData.orders
          this.getOrder()
          break;
        case '優惠券':
          this.selectTabName = item
          break;
        case '文章':
          this.selectTabName = item
          break;
      }
    },
    logOut() {
      axios.post(`${this.url}/logout`).then(res => {
        document.cookie = `hexToken=; expires=; path=/`;
        this.hasLogin = false
        window.location.replace('./index.html') ;
        console.log(res.data);
      })
    },
    checkLogin() {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      axios.defaults.headers.common['Authorization'] = token;
      axios.post(`${this.url}/api/user/check`).then(res => {
        if (res.data.success === false) {
          window.location.replace('./index.html') ;
        } else {
          this.hasLogin = true;
          this.getProduct();
        }
      })
    },
  },
  created() {
    this.checkLogin();
  }
});
App.mount("#app");