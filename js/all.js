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
      this.tempData.product = {
        data: {
          title: "[賣]動物園造型衣服3", 
          category: "衣服2",
          origin_price: 100,
          price: 300,
          unit: "個",
          description: "Sit down please 名設計師設計",
          content: "這是內容",
          is_enabled: 0,
          imageUrl : "主圖網址",
          imagesUrl: [
            "圖片網址一",
          ]
        }
      }
      axios.post(`${this.url}/api/${this.path}/admin/product`, this.tempData.product).then(res => {
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
    signIn() {
      axios.post(`${this.url}/admin/signin`, this.userInfo).then(res => {
        const token = res.data.token;
        const expired = res.data.expired;
        document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
        this.hasLogin = true
        console.log(res.data.message);
        this.userInfo = {}
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
          this.getProduct();
          this.hasLogin = true;
        }
      })
    },
  },
  created() {
    this.checkLogin();
  }
});
App.mount("#app");