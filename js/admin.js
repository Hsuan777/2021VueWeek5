const App = Vue.createApp({
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io',
      path: 'vs',
      userInfo: {},
      hasLogin: false,
      displayData: {
        products: true,
      },
      tabList: ['商品', '訂單', '優惠券', '文章', '圖檔'],
      currentTab: {
        name: '商品',
        enName:'product'
      },
      originData: {
        products: [],
        orders: [],
        coupons: [],
        articles: [],
        images: [],
      },
      tempData: {
        product: {
          images: []
        },
        coupon: {},
        article: {
          tag:[],
        },
      }
    };
  },
  methods: {
    getProducts(page = 1) {
      axios.get(`${this.url}/api/${this.path}/admin/products?page=${page}`).then(res => {
        if (res.data.success) {
          this.originData.products = res.data.products;
        } else {
          console.log(res.data.message);
        }
      }).catch(res => {
        console.log(res.data);
      })
    },
    getOrders(page = 1) {
      axios.get(`${this.url}/api/${this.path}/admin/orders?page=${page}`,).then(res => {
        if (res.data.success) {
          this.originData.orders = res.data.orders;
        } else {
          console.log(res.data.message);
        }
      }).catch(res => {
        console.log(res.data);
      })
    },
    getCoupons(page = 1) {
      axios.get(`${this.url}/api/${this.path}/admin/coupons?page=${page}`,).then(res => {
        if (res.data.success) {
          this.originData.coupons = res.data.coupons;
        } else {
          console.log(res.data.message);
        }
      }).catch(res => {
        console.log(res.data);
      })
    },
    getArticles(page = 1) {
      axios.get(`${this.url}/api/${this.path}/admin/articles?page=${page}`,).then(res => {
        if (res.data.success) {
          this.originData.articles = res.data.articles;
        } else {
          console.log(res.data.message);
        }
      }).catch(res => {
        console.log(res.data);
      })
    },
    getArticle(itemId, action) {
      axios.get(`${this.url}/api/${this.path}/admin/article/${itemId}`).then(res => {
        if (res.data.success) {
          this.tempData.article = res.data.article;
          if (action === 'isPublic') {
            this.putArticle(res.data.article, action);
          }
        } else {
          console.log(res.data.message);
        }
      }).catch(res => {
        console.log(res.data);
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
          this.getProducts();
        } else {
          console.log(res.data.message);
        }
      }).catch(res => {
        console.log(res.data);
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
        // setDate 會變更現在日期，例如當月 23 號，setDate(30)，會變成當月 30 號
        date.setDate(date.getDate() + num);
        couponObj.data['due_date'] = date.getTime();
      }
      // 暫時設定往後 30 天，之後改成可選日期
      setDueDate(30);
      couponObj.data['is_enabled'] = 0;
      axios.post(`${this.url}/api/${this.path}/admin/coupon`, couponObj).then(res => {
        if (res.data.success) {
          this.tempData.coupon = {};
          this.getCoupons();
        } else {
          console.log(res.data.message);
        }
      }).catch(res => {
        console.log(res.data);
      })
    },
    addArticle() {
      let date = new Date();
      let articleObj = {
        data: {
          ...this.tempData.article
        }
      }
      articleObj.data.create_at = date.getTime();
      articleObj.data.isPublic = false;
      axios.post(`${this.url}/api/${this.path}/admin/article`, articleObj).then(res => {
        if (res.data.success) {
          this.tempData.article = {};
          this.getArticles();
        } else {
          console.log(res.data.message);
        }
      }).catch(res => {
        console.log(res.data);
      })
    },
    addImageToUpload() {
      let tempImageFile = this.$refs.uploadImage.files[0]
      const formData = new FormData();
      formData.append('file', tempImageFile);
      axios.post(`${this.url}/api/${this.path}/admin/upload`, formData).then(res => {
        if (res.data.success) {
          this.getImage();
        } else {
          console.log(res.data.message);
        }
      }).catch(res => {
        console.log(res.data);
      })
    },
    putProduct(item, action) {
      let productObj = {
        data: {
          ...item
        }
      }
      if (action === 'isEnabled' && productObj.data.is_enabled === 0) {
        productObj.data.is_enabled = 1;
      } else {
        productObj.data.is_enabled = 0;
      }
      axios.put(`${this.url}/api/${this.path}/admin/product/${productObj.data.id}`, productObj).then(res => {
        if (res.data.success) {
          this.getProducts();
        } else {
          console.log(res.data.message);
        }
      }).catch(res => {
        console.log(res.data);
      })
    },
    putOrder(item, action) {
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
          this.getOrders();
        } else {
          console.log(res.data.message);
        }
      }).catch(res => {
        console.log(res.data);
      })
    },
    putCoupon(item, action) {
      let couponObj = {
        data: {
          ...item
        }
      }
      if (action === 'isEnabled' && couponObj.data.is_enabled === 0) {
        couponObj.data.is_enabled = 1;
      } else {
        couponObj.data.is_enabled = 0;
      }
      axios.put(`${this.url}/api/${this.path}/admin/coupon/${couponObj.data.id}`, couponObj).then(res => {
        if (res.data.success) {
          this.getCoupons();
        } else {
          console.log(res.data.message);
        }
      }).catch(res => {
        console.log(res.data);
      })
    },
    putArticle(item, action) {
      let articleObj = {
        data: {
          ...item
        }
      }
      if (action === 'isPublic') {
        articleObj.data.isPublic = !articleObj.data.isPublic;
      } 
      axios.put(`${this.url}/api/${this.path}/admin/article/${articleObj.data.id}`, articleObj).then(res => {
        if (res.data.success) {
          this.getArticles();
        } else {
          console.log(res.data.message);
        }
      }).catch(res => {
        console.log(res.data);
      })
    },
    deleteProduct(itemId) {
      axios.delete(`${this.url}/api/${this.path}/admin/product/${itemId}`).then(res => {
        if (res.data.success) {
          this.getProducts();
        } else {
          console.log(res.data.message);
        }
      }).catch(res => {
        console.log(res.data);
      })
    },
    deleteCoupon(itemId) {
      axios.delete(`${this.url}/api/${this.path}/admin/coupon/${itemId}`).then(res => {
        if (res.data.success) {
          this.getCoupons();
        } else {
          console.log(res.data.message);
        }
      }).catch(res => {
        console.log(res.data);
      })
    },
    deleteArticle(itemId) {
      axios.delete(`${this.url}/api/${this.path}/admin/article/${itemId}`).then(res => {
        if (res.data.success) {
          this.getArticles();
        } else {
          console.log(res.data.message);
        }
      }).catch(res => {
        console.log(res.data);
      })
    },
    selectTab(item) {
      if (item !== this.selectTabName) {
        switch (item) {
          case '商品':
            this.currentTab.name = item;
            this.currentTab.enName = 'product';
            this.displayData.products = true;
            this.displayData.orders = false;
            this.displayData.coupons = false;
            this.displayData.articles = false;
            this.displayData.images = false;
            this.getProducts()
            break;
          case '訂單':
            this.currentTab.name = item;
            this.displayData.products = false;
            this.displayData.orders = true;
            this.displayData.coupons = false;
            this.displayData.articles = false;
            this.displayData.images = false;
            this.getOrders()
            break;
          case '優惠券':
            this.currentTab.name = item;
            this.currentTab.enName = 'coupon';
            this.displayData.products = false;
            this.displayData.orders = false;
            this.displayData.coupons = true;
            this.displayData.articles = false;
            this.displayData.images = false;
            this.getCoupons()
            break;
          case '文章':
            this.currentTab.name = item;
            this.currentTab.enName = 'article';
            this.displayData.products = false;
            this.displayData.orders = false;
            this.displayData.coupons = false;
            this.displayData.articles = true;
            this.displayData.images = false;
            this.getArticles()
            break;
          case '圖檔':
            this.currentTab.name = item;
            this.currentTab.enName = 'image';
            this.displayData.products = false;
            this.displayData.orders = false;
            this.displayData.coupons = false;
            this.displayData.articles = false;
            this.displayData.images = true;
            break;
        }
      }
    },
    logOut() {
      axios.post(`${this.url}/logout`).then(res => {
        if (res.data.success) {
          document.cookie = `hexToken=; expires=; path=/`;
          this.hasLogin = false
          window.location.replace('./index.html') ;
        } else {
          console.log(res.data.message);
        }
      }).catch(res => {
        console.log(res.data);
      })
    },
    checkLogin() {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      axios.defaults.headers.common['Authorization'] = token;
      axios.post(`${this.url}/api/user/check`).then(res => {
        if (res.data.success) {
          this.hasLogin = true;
          this.getProducts();
        } else {
          window.location.replace('./index.html');
          console.log(res.data.message);
        }
      }).catch(res => {
        console.log(res.data);
      })
    },
    addProductImage() {
      if (!this.tempData.product.imagesUrl) {
        this.tempData.product.imagesUrl = [];
        this.tempData.product.imagesUrl.push('');
      } else {
        this.tempData.product.imagesUrl.push('');
      }
    },
    addArticleTag() {
      if (!this.tempData.article.tag) {
        this.tempData.article.tag = [];
        this.tempData.article.tag.push('');
      } else {
        this.tempData.article.tag.push('');
      }
    }
  },
  created() {
    this.checkLogin();
  }
});
App.mount("#app");