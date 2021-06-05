const App = Vue.createApp({
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io',
      path:'vs',
      originData: {
        products: {},
        cartsData: {}
      },
      tempData: {
        cartTotal: 0
      }
    };
  },
  methods: {
    getProductsAll() {
      const apiUrl = `${this.url}/api/${this.path}/products/all`;
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
    getCartList() {
      const apiUrl = `${this.url}/api/${this.path}/cart`;
      // let count = 0;
      axios.get(apiUrl).then(res => {
        if (res.data.success) {
          this.originData.cartsData = res.data.data;
          // 從 computed 取得該變數所 return 的值
          this.tempData.cartTotal = this.cartCount;
        } else {
          alert(res.data.message);
        }
      }).catch(res => {
        alert('無法取得資料喔～快去看什麼問題吧！')
        console.log(res);
      })
    },
    addCart(itemID) {
      const apiUrl = `${this.url}/api/${this.path}/cart`;
      let productData = {data: {product_id: itemID, qty: 1}}
      axios.post(apiUrl, productData).then(res => {
        if (res.data.success) {
          this.getCartList();
        } else {
          alert(res.data.message);
        }
      }).catch(res => {
        alert('無法取得資料喔～快去看什麼問題吧！')
        console.log(res.data);
      })
    },
    deleteCart(itemID) {
      const apiUrl = `${this.url}/api/${this.path}/cart/${itemID}`;
      axios.delete(apiUrl).then(res => {
        if (res.data.success) {
          this.getCartList();
        } else {
          alert(res.data.message);
        }
      }).catch(res => {
        alert('無法取得資料喔～快去看什麼問題吧！')
        console.log(res.data);
      })
    },
  },
  created() {
    this.getProductsAll();
    this.getCartList();
  },
  computed: {
    // 這裡的取用方式不用加()，像預先定義的變數取用即可
    cartCount() {
      let count = 0
      this.originData.cartsData.carts.forEach(item => {
        count += item.qty
      })
      return count
    }
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