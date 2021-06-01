export default {
    // 元件自有變數
    data() {
      return {
        url: 'https://vue3-course-api.hexschool.io',
        path: 'vs',
        loading: false,
        requiredProps: ['title', 'percent', 'code'],
      }
    },
    // 外面傳遞資料進來，再用 $emit('自訂名稱', 要送的資料)傳出去
    props: ['tempData', 'modal'],
    // 元件自有方法
    methods:{
      addCoupon(item) {
        const apiUrl = `${this.url}/api/${this.path}/admin/coupon`;
        let date = new Date();
        let couponObj = {
          data: {
            ...item
          }
        }
        const setDueDate = (num) => {
          // setDate 會變更現在日期，例如當月 23 號，setDate(30)，會變成當月 30 號
          date.setDate(date.getDate() + num);
          couponObj.data['due_date'] = date.getTime();
        }
        this.loading = true;
        // 暫時設定往後 30 天，之後改成可選日期
        setDueDate(30);
        couponObj.data['is_enabled'] = 0;
        axios.post(apiUrl, couponObj).then(res => {
          if (res.data.success) {
            this.loading = false;
            this.modal.hide();
            this.$emit('update');
          } else {
            alert(res.data.message);
          }
        }).catch(res => {
          alert('無法加入資料喔～快去看什麼問題吧！')
          console.log(res.data);
        })
      },
      putCoupon(item) {
        let couponObj = {
          data: {
            ...item
          }
        }
        const apiUrl = `${this.url}/api/${this.path}/admin/coupon/${couponObj.data.id}`;
        this.loading = true;
        axios.put(apiUrl, couponObj).then(res => {
          if (res.data.success) {
            this.loading = false;
            this.modal.hide();
            this.$emit('update');
          } else {
            alert(res.data.message);
          }
        }).catch(res => {
          alert('無法修改資料喔～快去看什麼問題吧！')
          console.log(res);
        })
      },
      checkProps() {
        let hasAll = this.requiredProps.every(prop => this.tempData.hasOwnProperty(prop));
        return !hasAll
      },
    },
    // 監聽單一變數，變數名稱(新值, 舊值)，預設第一個參數為新值
    watch: {
      tempData(newValue) {
        if (!newValue.id) {
          this.$refs['couponForm'].resetForm();
        }
      },
    },
    template:`
    <div class="modal fade" id="couponForm" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="couponModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title text-primary" id="couponModalLabel" v-if="!tempData.id">新增優惠券</h5>
              <h5 class="modal-title" id="couponModalLabel" v-else>修改優惠券</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <v-form action="" v-slot="{ errors }" ref="couponForm">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-12">
                  <label for="couponName" class="form-label">名稱<span class="text-danger">*</span></label>
                  <v-field id="couponName" name="名稱" type="text" class="form-control" :class="{ 'is-invalid': errors['名稱'] }" rules="required" v-model="tempData.title"></v-field>
                  <error-message name="名稱" class="invalid-feedback"></error-message>
                </div>
                <div class="col">
                  <label for="couponPercent" class="form-label">折扣率<span class="text-danger">*</span></label>
                  <v-field id="couponPercent" name="折扣率" type="number" class="form-control" placeholder="80 為 8 折" :class="{ 'is-invalid': errors['折扣率'] }" rules="min_value:0|max_value:99|required" v-model.number="tempData.percent"></v-field>
                  <error-message name="折扣率" class="invalid-feedback"></error-message>
                </div>
                <div class="col">
                  <label for="couponCode" class="form-label">代碼<span class="text-danger">*</span></label>
                  <v-field id="couponCode" name="代碼" type="text" class="form-control" placeholder="英數較佳 e.g. VS777" :class="{ 'is-invalid': errors['代碼'] }" rules="min:4|required" v-model="tempData.code"></v-field>
                  <error-message name="代碼" class="invalid-feedback"></error-message>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="addCoupon(tempData)" :disabled="checkProps() || Object.keys(errors).length !== 0" v-if="tempData.id === undefined">
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" v-if="loading"></span>新增</button>
              <button type="button" class="btn btn-warning" @click="putCoupon(tempData)" :disabled="Object.keys(errors).length !== 0" v-else>
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" v-if="loading"></span>修改</button>
            </div>
          </v-form>
        </div>
      </div>
    </div>`
}