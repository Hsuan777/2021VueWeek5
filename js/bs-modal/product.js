export default {
    data() {
      return {
        url: 'https://vue3-course-api.hexschool.io',
        path: 'vs',
        loading: false,
        requiredProps: ['title', 'origin_price', 'price', 'category', 'unit'],
      }
    },
    props: ['tempData', 'modal'],
    methods:{
      addProduct() {
        const apiUrl = `${this.url}/api/${this.path}/admin/product`;
        let productObj = {
          data: {
            ...this.tempData,
          }
        }
        this.loading = true;
        axios.post(apiUrl, productObj).then(res => {
          if (res.data.success) {
            this.loading = false;
            this.modal.hide();
            this.$emit('update');
          } else {
            alert(res.data.message);
          }
        }).catch(res => {
          alert('無法加入資料喔～快去看什麼問題吧！')
          console.log(res);
        })
      },
      putProduct() {
        let productObj = {
          data: {
            ...this.tempData
          }
        }
        const apiUrl = `${this.url}/api/${this.path}/admin/product/${productObj.data.id}`;
        this.loading = true;
        axios.put(apiUrl, productObj).then(res => {
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
    watch: {
      tempData(newValue) {
        if (!newValue.id) {
          this.$refs['productForm'].resetForm();
        }
      },
    },
    template:`
    <div class="modal fade" ref="productModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
          {{tempData.option}}
            <h5 class="modal-title text-primary" id="productModalLabel" v-if="tempData.id === undefined">新增商品</h5>
            <h5 class="modal-title" id="productModalLabel" v-else>修改商品</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <v-form action="" v-slot="{ errors }" ref="productForm">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-12">
                  <label for="productName" class="form-label">商品名稱<span class="text-danger">*</span></label>
                  <v-field id="productName" name="商品名稱" type="text" class="form-control" :class="{ 'is-invalid': errors['商品名稱'] }" rules="required" v-model="tempData.title"></v-field>
                  <error-message name="商品名稱" class="invalid-feedback"></error-message>
                </div>
                <div class="col-12">
                  <label for="productDescription" class="form-label">描述</label>
                  <input type="text" id="productDescription" class="form-control" placeholder="描述" v-model="tempData.description">
                </div>
                <div class="col-12">
                  <label for="productContent" class="form-label">內容</label>
                  <textarea type="text" rows="3" id="productContent" class="form-control" placeholder="商品內容" v-model="tempData.content"></textarea>
                </div>
                <div class="col">
                  <label for="productOriginPrice" class="form-label">定價<span class="text-danger">*</span></label>
                  <v-field id="productOriginPrice" name="定價" type="number" class="form-control" :class="{ 'is-invalid': errors['定價'] }" rules="min_value:0|required" v-model.number="tempData.origin_price"></v-field>
                  <error-message name="定價" class="invalid-feedback"></error-message>
                </div>
                <div class="col">
                  <label for="productPrice" class="form-label">售價<span class="text-danger">*</span></label>
                  <v-field id="productPrice" name="售價" type="number" class="form-control" :class="{ 'is-invalid': errors['售價'] }" rules="min_value:0|required" v-model.number="tempData.price"></v-field>
                  <error-message name="售價" class="invalid-feedback"></error-message>
                </div>
                <div class="col">
                  <label for="productCategory" class="form-label">類別<span class="text-danger">*</span></label>
                  <v-field id="productCategory" name="類別" type="text" class="form-control" :class="{ 'is-invalid': errors['類別'] }" rules="required" v-model="tempData.category"></v-field>
                  <error-message name="類別" class="invalid-feedback"></error-message>
                </div>
                <div class="col">
                  <label for="productUnit" class="form-label">單位<span class="text-danger">*</span></label>
                  <v-field id="productUnit" name="單位" type="text" class="form-control" :class="{ 'is-invalid': errors['單位'] }" rules="required" v-model="tempData.unit"></v-field>
                  <error-message name="單位" class="invalid-feedback"></error-message>
                </div>
                <template v-if="tempData.category">
                  <div class="col" v-show="tempData.category === '課程'">
                    <label for="productStars" class="form-label">難易度</label>
                    <v-field id="productStars" name="難易度" type="number" class="form-control" :class="{ 'is-invalid': errors['難易度'] }" rules="max_value:5|min_value:1" v-model="tempData.options.stars"></v-field>
                    <error-message name="難易度" class="invalid-feedback"></error-message>
                  </div>
                  <div class="col" v-show="tempData.category === '餐飲'">
                    <label for="productCalorie" class="form-label">卡路里</label>
                    <v-field id="productCalorie" name="卡路里" type="number" class="form-control" :class="{ 'is-invalid': errors['卡路里'] }" rules="min_value:0" v-model="tempData.options.calorie"></v-field>
                    <error-message name="卡路里" class="invalid-feedback"></error-message>
                  </div>
                </template>
                <div class="col-12">
                  <div class="d-flex align-items-center mb-2">
                    <label for="productImageUrl" class="form-label mb-0">主圖網址</label>
                    <!-- 加入額外圖片 -->
                    <input type="button" class="btn btn-primary btn-sm ms-2" value="Add Image" @click="tempData.imagesUrl.push('')">
                  </div>
                  <input type="text" id="productImageUrl" class="form-control mb-3" placeholder="網址" v-model="tempData.imageUrl">
                  <!-- 額外圖片輸入 -->
                  <template v-for="(item, i) in tempData.imagesUrl" :key="'productImageUrl' + i">
                    <label :for="'productImageUrl' + i" class="form-label">其他圖片網址 {{i + 1}}</label>
                    <div class="input-group mb-3">
                      <input type="text" :id="'productImageUrl' + i" class="form-control" placeholder="網址" v-model="tempData.imagesUrl[i]">
                      <button type="button" class="btn btn-outline-secondary" @click="tempData.imagesUrl.splice(i, 1)">Ｘ</button>
                    </div>
                  </template>
                </div>
                <!-- 主圖預覽 -->
                <div class="col-4">
                  <label for="" class="form-label">主圖</label>
                  <img class="img-thumbnail" :src="tempData.imageUrl" :alt="tempData.title">
                </div>
                <!-- 其他圖片預覽 -->
                <template v-if="tempData.imagesUrl">
                  <div class="col-4" v-for="(item, key) in tempData.imagesUrl" :key="item">
                    <label for="" class="form-label">其他圖片 {{key + 1}}</label>
                    <img class="img-thumbnail" :src="tempData.imagesUrl[key]" :alt="tempData.title">
                  </div>
                </template>
              </div>
            </div>
            <div class="modal-footer">
              <!-- 若有錯誤則阻止新增 -->
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary"  @click="addProduct" :disabled="checkProps() || Object.keys(errors).length !== 0" v-if="tempData.id === undefined">
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" v-if="loading"></span>新增</button>
              <button type="button" class="btn btn-warning" @click="putProduct" :disabled="Object.keys(errors).length !== 0" v-else>
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" v-if="loading"></span>修改</button>
            </div>
          </v-form>
        </div>
      </div>
    </div>`
    
}