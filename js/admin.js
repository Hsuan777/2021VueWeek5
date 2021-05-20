
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
        orders: []
      },
      tempData: {
        product: {},
        coupon: {}
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
    putProduct(item, action) {
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
      axios.put(`${this.url}/api/${this.path}/admin/product/${couponObj.data.id}`, couponObj).then(res => {
        if (res.data.success) {
          this.getProduct();
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
            this.getProduct()
            break;
          case '訂單':
            this.selectTabName = item
            this.displayData.products = false
            this.displayData.orders = true
            this.displayData.coupons = false
            this.getOrder()
            break;
          case '優惠券':
            this.selectTabName = item
            this.selectTabNameEn = 'coupon'
            this.displayData.products = false
            this.displayData.orders = false
            this.displayData.coupons = true
            this.getCoupon()
            break;
          case '文章':
            this.selectTabName = item
            this.selectTabNameEn = 'article'
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