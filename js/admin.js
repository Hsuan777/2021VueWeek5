const App = Vue.createApp({
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io',
      path: 'vs',
      userInfo: {},
      hasLogin: false,
      displayData: {
        products: true,
        orders: false,
        coupons: false
      },
      tabList: ['商品', '訂單', '優惠券', '文章'],
      selectTabName: '商品',
      selectTabNameEn: 'product',
      originData: {
        products: [],
        orders: [],
        coupons: [],
        articles: [],
      },
      tempData: {
        product: {},
        coupon: {},
        article: {
          tag:[],
        }
      }
    };
  },
  methods: {
    getProduct(page = 1) {
      axios.get(`${this.url}/api/${this.path}/admin/products?page=${page}`).then(res => {
        this.originData.products = res.data.products;
      }).catch(res => {
        console.log(res);
      })
    },
    getOrder(page = 1) {
      axios.get(`${this.url}/api/${this.path}/admin/orders?page=${page}`,).then(res => {
        this.originData.orders = res.data.orders;
      })
    },
    getCoupon(page = 1) {
      axios.get(`${this.url}/api/${this.path}/admin/coupons?page=${page}`,).then(res => {
        this.originData.coupons = res.data.coupons;
      })
    },
    getArticle(page = 1) {
      axios.get(`${this.url}/api/${this.path}/admin/articles?page=${page}`,).then(res => {
        console.log(res.data.articles);
        this.originData.articles = res.data.articles;
      })
    },
    addProduct() {
      let productObj = {
        data: {
          ...this.tempData.product
        }
      }
      axios.post(`${this.url}/api/${this.path}/admin/product`, productObj).then(res => {
        if (res.data.success) {
          this.getProduct()
        } else {
          console.log(res.data.message);
        }
      })
    },
    addCoupon() {
      let date = new Date();
      let couponObj = {
        data: {
          ...this.tempData.coupon
        }
      }
      const setDueDate = (num) => {
        date.setDate(num)
        couponObj.data['due_date'] = date.getTime();
      }
      setDueDate(couponObj.data['due_date']);
      couponObj.data['is_enabled'] = 0
      axios.post(`${this.url}/api/${this.path}/admin/coupon`, couponObj).then(res => {
        if (res.data.success) {
          this.tempData.coupon = {};
          this.getCoupon();
        } else {
          console.log(res.data.message);
        }
      })
    },
    addArticle() {
      let date = new Date();
      let articleObj = {
        data: {
          ...this.tempData.article
        }
      }
      articleObj.data.create_at = date.getTime()
      articleObj.data.isPublic = false
      axios.post(`${this.url}/api/${this.path}/admin/article`, articleObj).then(res => {
        if (res.data.success) {
          this.tempData.article = {};
          this.getArticle();
        } else {
          console.log(res.data.message);
        }
      })
    },
    putProduct(item, action) {
      let productObj = {
        data: {
          ...item
        }
      }
      if (action === 'isEnabled' && couponObj.data.is_enabled === 0) {
        couponObj.data.is_enabled = 1
      } else {
        couponObj.data.is_enabled = 0
      }
      axios.put(`${this.url}/api/${this.path}/admin/product/${couponObj.data.id}`, productObj).then(res => {
        if (res.data.success) {
          this.getProduct();
        } else {
          console.log(res.data.message);
        }
      })
    },
    putOrder(item, action) {
      console.log(item);
      let orderObj = {
        data: {
          ...item
        }
      }
      if (action === 'isPaid') {
        orderObj.data.is_paid = !orderObj.data.is_paid
      }
      axios.put(`${this.url}/api/${this.path}/admin/order/${orderObj.data.id}`, orderObj).then(res => {
        if (res.data.success) {
          this.getOrder();
        } else {
          console.log(res.data.message);
        }
      })
    },
    putCoupon(item, action) {
      let couponObj = {
        data: {
          ...item
        }
      }
      if (action === 'isEnabled' && couponObj.data.is_enabled === 0) {
        couponObj.data.is_enabled = 1
      } else {
        couponObj.data.is_enabled = 0
      }
      axios.put(`${this.url}/api/${this.path}/admin/coupon/${couponObj.data.id}`, couponObj).then(res => {
        if (res.data.success) {
          this.getCoupon();
        } else {
          console.log(res.data.message);
        }
      })
    },
    putArticle(item, action) {
      let articleObj = {
        data: {
          ...item
        }
      }
      if (action === 'isPublic' && articleObj.data.is_enabled === 0) {
        articleObj.data.is_enabled = 1
      } else {
        articleObj.data.is_enabled = 0
      }
      axios.put(`${this.url}/api/${this.path}/admin/article/${articleObj.data.id}`, articleObj).then(res => {
        if (res.data.success) {
          this.getCoupon();
        } else {
          console.log(res.data.message);
        }
      })
    },
    deleteProduct(itemId) {
      axios.delete(`${this.url}/api/${this.path}/admin/product/${itemId}`).then(res => {
        if (res.data.success) {
          this.getProduct();
        } else {
          console.log(res.data.message);
        }
      })
    },
    deleteCoupon(itemId) {
      axios.delete(`${this.url}/api/${this.path}/admin/coupon/${itemId}`).then(res => {
        if (res.data.success) {
          this.getCoupon();
        } else {
          console.log(res.data.message);
        }
      })
    },
    selectTab(item) {
      if (item !== this.selectTabName) {
        switch (item) {
          case '商品':
            this.selectTabName = item
            this.selectTabNameEn = 'product'
            this.displayData.products = true
            this.displayData.orders = false
            this.displayData.coupons = false
            this.displayData.articles = false
            this.getProduct()
            break;
          case '訂單':
            this.selectTabName = item
            this.displayData.products = false
            this.displayData.orders = true
            this.displayData.coupons = false
            this.displayData.articles = false
            this.getOrder()
            break;
          case '優惠券':
            this.selectTabName = item
            this.selectTabNameEn = 'coupon'
            this.displayData.products = false
            this.displayData.orders = false
            this.displayData.coupons = true
            this.displayData.articles = false
            this.getCoupon()
            break;
          case '文章':
            this.selectTabName = item
            this.selectTabNameEn = 'article'
            this.displayData.products = false
            this.displayData.orders = false
            this.displayData.coupons = false
            this.displayData.articles = true
            this.getArticle()
            break;
        }
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