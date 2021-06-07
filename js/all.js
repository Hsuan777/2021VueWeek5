const App = Vue.createApp({
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io',
      path:'vs',
      originData: {
        products: {},
        cartsData: {
          carts: []
        }
      },
      order: {
        user: {
          name: '',
          email: '',
          tel: '',
          address:''  
        },
        message: ''
      },
      tempData: {
        cartTotal: 0,
        couponString: 'test777',
        order: {}
      },
      addLoadingItem: {
        id: ''
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
        console.log(res);
      })
    },
    getCartList() {
      const apiUrl = `${this.url}/api/${this.path}/cart`;
      axios.get(apiUrl).then(res => {
        if (res.data.success) {
          this.originData.cartsData = res.data.data;
          // cli 時重新拆開
          if (!this.originData.cartsData.carts[0] && window.location.pathname === '/checkout.html') {
            window.location.replace('./productList.html');
          }
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
      this.addLoadingItem.id = itemID;
      const apiUrl = `${this.url}/api/${this.path}/cart`;
      let productData = {data: {product_id: itemID, qty: 1}}
      axios.post(apiUrl, productData).then(res => {
        if (res.data.success) {
          this.addLoadingItem.id = '';
          this.getCartList();
        } else {
          alert(res.data.message);
        }
      }).catch(res => {
        alert('無法取得資料喔～快去看什麼問題吧！')
        console.log(res.data);
      })
    },
    // cli 時拆開
    putCart(item, num) {
      const apiUrl = `${this.url}/api/${this.path}/cart/${item.id}`;
      let productData = {data: {product_id: item.product_id, qty: num}}
      this.addLoadingItem.id = item.id;
      axios.put(apiUrl, productData).then(res => {
        if (res.data.success) {
          this.addLoadingItem.id = ''
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
    deleteCartAll() {
      const apiUrl = `${this.url}/api/${this.path}/carts`;
      axios.delete(apiUrl).then(res => {
        if (res.data.success) {
          alert('已無商品囉！')
          this.getCartList();
        } else {
          alert(res.data.message);
        }
      }).catch(res => {
        alert('無法取得資料喔～快去看什麼問題吧！')
        console.log(res.data);
      })
    },
    postCoupon() {
      const apiUrl = `${this.url}/api/${this.path}/coupon`;
      axios.post(apiUrl, {data: {code:this.tempData.couponString}}).then(res => {
        if (res.data.success) {
          console.log(res.data);
          this.getCartList();
        } else {
          alert(res.data.message);
        }
      }).catch(res => {
        alert('無法取得資料喔～快去看什麼問題吧！')
        console.log(res.data);
      }) 
    },
    postOrder() {
      const apiUrl = `${this.url}/api/${this.path}/order`;
      axios.post(apiUrl, {data:this.tempData.order}).then(res => {
        if (res.data.success) {
          //  暫時用 alert
          alert('感謝您的選購，還請確認付款資訊，謝謝。');
          this.$refs.orderForm.resetForm();
          this.getCartList();
          window.location.replace(`./order.html?id=${res.data.orderId}`);
          console.log(res.data.orderId);
        } else {
          alert(res.data.message);
        }
      }).catch(res => {
        alert('無法取得資料喔～快去看什麼問題吧！')
        console.log(res);
      }) 
    },
    checkPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : '需要正確的電話號碼'
    }
  },
  created() {
    this.getProductsAll();
    this.getCartList();
    this.tempData.order = {...this.order};
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
  },
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
