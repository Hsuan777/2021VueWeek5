import modalDelete from "./bs-modal/delete.js";
import modalCoupon from "./bs-modal/coupon.js";
import modalArticle from "./bs-modal/article.js";
import modalProduct from "./bs-modal/product.js";
import page from "./tool/pagination.js";
const App = Vue.createApp({
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io',
      path: 'vs',
      hasLogin: false,
      displayData: {
        products: true,
      },
      tabList: ['商品', '訂單', '優惠券', '文章'],
      currentTab: {
        name: '商品',
        enName:'product'
      },
      originData: {
        products: [],
        orders: [],
        coupons: [],
        articles: [],
      },
      tempData: {
        product: {
          imagesUrl: [],
          options:[]
        },
        coupon: {},
        article: {
          tag:[],
        },
        productPages: 0,
        currentPage: 1,
        modal: ''
      },
      loading: false
    };
  },
  methods: {
    getProducts(page = this.tempData.currentPage) {
      const apiUrl = `${this.url}/api/${this.path}/admin/products?page=${page}`;
      this.tempData.currentPage = page;
      axios.get(apiUrl).then(res => {
        if (res.data.success) {
          this.originData.products = res.data.products;
        } else {
          alert(res.data.message);
        }
      }).catch(res => {
        alert('無法取得資料喔～快去看什麼問題吧！')
        console.log(res.data);
      })
    },
    getProductsAll() {
      const apiUrl = `${this.url}/api/${this.path}/admin/products/all`;
      axios.get(apiUrl).then(res => {
        if (res.data.success) {
          this.tempData.productPages = Math.ceil(Object.keys(res.data.products).length / 10) 
        } else {
          alert('取得資料錯誤，快去看什麼問題吧！')
        }
      }).catch(res => {
        alert('無法取得資料喔～快去看什麼問題吧！')
        console.log(res);
      })
    },
    getOrders(page = 1) {
      const apiUrl = `${this.url}/api/${this.path}/admin/orders?page=${page}`;
      axios.get(apiUrl).then(res => {
        if (res.data.success) {
          this.originData.orders = res.data.orders;
        } else {
          alert(res.data.message);
        }
      }).catch(res => {
        console.log(res.data);
      })
    },
    getCoupons(page = 1) {
      const apiUrl = `${this.url}/api/${this.path}/admin/coupons?page=${page}`;
      axios.get(apiUrl).then(res => {
        if (res.data.success) {
          this.originData.coupons = res.data.coupons;
        } else {
          alert(res.data.message);
        }
      }).catch(res => {
        alert('無法取得資料喔～快去看什麼問題吧！')
        console.log(res.data);
      })
    },
    getArticles(page = 1) {
      const apiUrl = `${this.url}/api/${this.path}/admin/articles?page=${page}`;
      axios.get(apiUrl).then(res => {
        if (res.data.success) {
          this.originData.articles = res.data.articles;
        } else {
          alert(res.data.message);
        }
      }).catch(res => {
        alert('無法取得資料喔～快去看什麼問題吧！')
        console.log(res.data);
      })
    },
    getArticle(itemId, action) {
      const apiUrl = `${this.url}/api/${this.path}/admin/article/${itemId}`;
      axios.get(apiUrl).then(res => {
        if (res.data.success) {
          if (action === 'isPublic') {
            this.putArticle(res.data.article, action);
          } else if (action === 'edit') {
            this.editTempData(res.data.article);
          }
        } else {
          alert(res.data.message);
        }
      }).catch(res => {
        alert('無法取得資料喔～快去看什麼問題吧！')
        console.log(res.data);
      })
    },
    addImageToUpload() {
      const apiUrl = `${this.url}/api/${this.path}/admin/upload`;
      let tempImageFile = this.$refs.uploadImage.files[0]
      const formData = new FormData();
      formData.append('file', tempImageFile);
      axios.post(apiUrl, formData).then(res => {
        if (res.data.success) {
          this.getImage();
        } else {
          alert(res.data.message);
        }
      }).catch(res => {
        alert('無法加入資料喔～快去看什麼問題吧！')
        console.log(res.data);
      })
    },
    // 更新是否啟用
    putProduct(item) {
      let productObj = {
        data: {
          ...item
        }
      }
      const apiUrl = `${this.url}/api/${this.path}/admin/product/${productObj.data.id}`;
      this.loading = true;
      this.tempData[this.currentTab.enName].id = item.id
      productObj.data.is_enabled = !productObj.data.is_enabled;
      axios.put(apiUrl, productObj).then(res => {
        if (res.data.success) {
          this.loading = false;
          this.tempData[this.currentTab.enName] = {}
          this.getProducts();
        } else {
          alert(res.data.message);
        }
      }).catch(res => {
        alert('無法修改資料喔～快去看什麼問題吧！')
        console.log(res);
      })
    },
    putOrder(item, action) {
      let orderObj = {
        data: {
          ...item
        }
      }
      const apiUrl = `${this.url}/api/${this.path}/admin/order/${orderObj.data.id}`;
      if (action === 'isPaid') {
        orderObj.data.is_paid = !orderObj.data.is_paid
      }
      axios.put(apiUrl, orderObj).then(res => {
        if (res.data.success) {
          this.getOrders();
        } else {
          alert(res.data.message);
        }
      }).catch(res => {
        alert('無法修改資料喔～快去看什麼問題吧！')
        console.log(res.data);
      })
    },
    // 更新是否啟用
    putCoupon(item) {
      let couponObj = {
        data: {
          ...item
        }
      }
      const apiUrl = `${this.url}/api/${this.path}/admin/coupon/${couponObj.data.id}`;
      this.loading = true;
      this.tempData[this.currentTab.enName].id = item.id
      if (couponObj.data.is_enabled === 0) {
        couponObj.data.is_enabled = 1;
      } else {
        couponObj.data.is_enabled = 0;
      }
      axios.put(apiUrl, couponObj).then(res => {
        if (res.data.success) {
          this.loading = false;
          this.tempData[this.currentTab.enName] = {}
          this.getCoupons();
        } else {
          alert(res.data.message);
        }
      }).catch(res => {
        alert('無法修改資料喔～快去看什麼問題吧！')
        console.log(res.data);
      })
    },
    // 更新是否啟用
    putArticle(item, action) {
      let articleObj = {
        data: {
          ...item
        }
      }
      const apiUrl = `${this.url}/api/${this.path}/admin/article/${articleObj.data.id}`;
      this.loading = true;
      this.tempData[this.currentTab.enName].id = item.id
      if (action === 'isPublic') {
        this.tempData[this.currentTab.enName] = {...item}
        articleObj.data.isPublic = !articleObj.data.isPublic;
      } 
      axios.put(apiUrl, articleObj).then(res => {
        if (res.data.success) {
          this.loading = false;
          this.tempData[this.currentTab.enName] = {}
          this.getArticles();
        } else {
          alert(res.data.message);
        }
      }).catch(res => {
        alert('無法修改資料喔～快去看什麼問題吧！')
        console.log(res.data);
      })
    },
    deleteProduct(itemId) {
      const apiUrl = `${this.url}/api/${this.path}/admin/product/${itemId}`;
      this.loading = true;
      axios.delete(apiUrl).then(res => {
        if (res.data.success) {
          this.loading = false;
          this.tempData.modal.hide();
          this.getProducts();
        } else {
          alert(res.data.message);
        }
      }).catch(res => {
        alert('無法刪除資料喔～快去看什麼問題吧！')
        console.log(res.data);
      })
    },
    deleteCoupon(itemId) {
      const apiUrl = `${this.url}/api/${this.path}/admin/coupon/${itemId}`;
      this.loading = true;
      axios.delete(apiUrl).then(res => {
        if (res.data.success) {
          this.loading = false;
          this.tempData.modal.hide();
          this.getCoupons();
        } else {
          alert(res.data.message);
        }
      }).catch(res => {
        alert('無法刪除資料喔～快去看什麼問題吧！')
        console.log(res.data);
      })
    },
    deleteArticle(itemId) {
      const apiUrl = `${this.url}/api/${this.path}/admin/article/${itemId}`;
      this.loading = true;
      axios.delete(apiUrl).then(res => {
        if (res.data.success) {
          this.loading = false;
          this.tempData.modal.hide();
          this.getArticles();
        } else {
          alert(res.data.message);
        }
      }).catch(res => {
        alert('無法刪除資料喔～快去看什麼問題吧！')
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
            this.getProducts()
            break;
          case '訂單':
            this.currentTab.name = item;
            // 加進去會有問題
            // this.currentTab.enName = 'order';
            this.displayData.products = false;
            this.displayData.orders = true;
            this.displayData.coupons = false;
            this.displayData.articles = false;
            this.getOrders()
            break;
          case '優惠券':
            this.currentTab.name = item;
            this.currentTab.enName = 'coupon';
            this.displayData.products = false;
            this.displayData.orders = false;
            this.displayData.coupons = true;
            this.displayData.articles = false;
            this.getCoupons()
            break;
          case '文章':
            this.currentTab.name = item;
            this.currentTab.enName = 'article';
            this.displayData.products = false;
            this.displayData.orders = false;
            this.displayData.coupons = false;
            this.displayData.articles = true;
            this.getArticles()
            break;
        }
      }
    },
    logOut() {
      const apiUrl = `${this.url}/logout`;
      axios.post(apiUrl).then(res => {
        if (res.data.success) {
          document.cookie = `hexToken=; expires=; path=/`;
          this.hasLogin = false
          window.location.replace('./index.html') ;
        } else {
          alert(res.data.message);
        }
      }).catch(res => {
        alert('無法登出喔～快去看什麼問題吧！')
        console.log(res.data);
      })
    },
    checkLogin() {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      const apiUrl = `${this.url}/api/user/check`;
      axios.defaults.headers.common['Authorization'] = token;
      axios.post(apiUrl).then(res => {
        if (res.data.success) {
          this.hasLogin = true;
          this.getProducts();
          this.getProductsAll();
        } else {
          window.location.replace('./index.html');
          alert(res.data.message);
        }
      }).catch(res => {
        alert('無法登入喔～快去看什麼問題吧！')
        console.log(res.data);
      })
    },
    addTempData() {
      this.tempData[this.currentTab.enName] = {};
      this.tempData.article = {tag:[]}; 
      this.tempData.product = {imagesUrl:[], options: {}};
      this.tempData.modal = new bootstrap.Modal(document.getElementById(this.currentTab.enName+'Modal'));
      this.tempData.modal.show();
      return {...this.tempData[this.currentTab.enName]}
    },
    editTempData(item) {
      this.tempData[this.currentTab.enName] = {...item};
      // 避免傳入時元件內新增的屬性 proxy 抓不到，在這邊先建立好
      if (!this.tempData.article.tag) {
        this.tempData.article.tag = [];
      } 
      if (!this.tempData.product.imagesUrl) {
        this.tempData.product.imagesUrl = [];
      }
      if (!this.tempData.product.options) {
        this.tempData.product.options = {}
      }
      console.log(this.tempData.product.options);
      this.tempData.modal = new bootstrap.Modal(document.getElementById(this.currentTab.enName+'Modal'));
      this.tempData.modal.show();
    },
    openDeleteModal(item) {
      this.tempData[this.currentTab.enName] = {...item};
      this.tempData.modal = new bootstrap.Modal(document.getElementById('deleteModal'));
      this.tempData.modal.show();
    },
    deleteData() {
      switch (this.currentTab.name) {
        case '商品':
          this.deleteProduct(this.tempData[this.currentTab.enName].id);
          break;
        case '優惠券':
          this.deleteCoupon(this.tempData[this.currentTab.enName].id);
          break;
        case '文章':
          this.deleteArticle(this.tempData[this.currentTab.enName].id);
          break;
      }
    },
  },
  components:{
    modalDelete,
    modalCoupon,
    modalArticle,
    modalProduct,
    page
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