export default {
    data() {
      return {
        url: 'https://vue3-course-api.hexschool.io',
        path: 'vs',
        loading: false,
        requiredProps: ['title', 'author', 'content'],
      }
    },
    props: ['tempData', 'modal'],
    methods:{
      addArticle() {
        const apiUrl = `${this.url}/api/${this.path}/admin/article`;
        let date = new Date();
        let articleObj = {
          data: {
            ...this.tempData
          }
        }
        articleObj.data.create_at = date.getTime();
        articleObj.data.isPublic = false;
        this.loading = true;
        axios.post(apiUrl, articleObj).then(res => {
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
      putArticle() {
        let articleObj = {
          data: {
            ...this.tempData
          }
        }
        const apiUrl = `${this.url}/api/${this.path}/admin/article/${articleObj.data.id}`;
        this.loading = true;
        axios.put(apiUrl, articleObj).then(res => {
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
          this.$refs['articleForm'].resetForm();
        }
      },
    },
    template:`
    <div class="modal fade" ref="articleModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="articleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-primary" id="articleModalLabel" v-if="tempData.id === undefined">新增文章</h5>
            <h5 class="modal-title" id="articleModalLabel" v-else>修改文章</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <v-form action="" v-slot="{ errors }" ref="articleForm">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-12">
                  <label for="articleTitle" class="form-label">標題<span class="text-danger">*</span></label>
                  <v-field id="articleTitle" name="標題" type="text" class="form-control" :class="{ 'is-invalid': errors['標題'] }" rules="required" v-model="tempData.title"></v-field>
                  <error-message name="標題" class="invalid-feedback"></error-message>
                </div>
                <div class="col-12">
                  <label for="articleDescription" class="form-label">描述</label>
                  <input type="text" id="articleDescription" class="form-control" placeholder="簡單描述" v-model.number="tempData.description">
                </div>
                <div class="col-12">
                  <label for="articleContent" class="form-label">內容<span class="text-danger">*</span></label>
                  <v-field id="articleContent" rows="3" name="內容" type="text" class="form-control" :class="{ 'is-invalid': errors['內容'] }" rules="required" v-model="tempData.content" as="textarea"></v-field>
                  <error-message name="內容" class="invalid-feedback"></error-message>
                </div>
                <div class="col-12">
                  <div class="d-flex align-items-center mb-2">
                    <label for="articleTag" class="form-label mb-0">Tag</label>
                    <!-- 加入 tag -->
                    <input type="button" class="btn btn-primary btn-sm ms-2" value="Add Tag" @click="tempData.tag.push('')">
                  </div>
                </div>
                <template v-if="tempData.tag">
                  <div class="col-4" v-for="(item, i) in tempData.tag" :key="item+i">
                    <div class="input-group mb-3">
                      <input type="text" :id="'articleTag' + i" class="form-control" placeholder="新標籤" v-model.lazy="tempData.tag[i]">
                      <button type="button" class="btn btn-outline-secondary" @click="tempData.tag.splice(i, 1)">Ｘ</button>
                    </div>
                  </div>
                </template>
                <div class="col-12">
                  <label for="articleAuthor" class="form-label">作者<span class="text-danger">*</span></label>
                  <v-field id="articleAuthor" name="作者" type="text" class="form-control" :class="{ 'is-invalid': errors['作者'] }" rules="required" v-model="tempData.author"></v-field>
                  <error-message name="作者" class="invalid-feedback"></error-message>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="addArticle" :disabled="checkProps() || Object.keys(errors).length !== 0" v-if="tempData.id === undefined">
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" v-if="loading"></span>新增</button>
              <button type="button" class="btn btn-warning" @click="putArticle" :disabled="Object.keys(errors).length !== 0" v-else>
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" v-if="loading"></span>修改</button>
            </div>
          </v-form>
        </div>
      </div>
    </div>`
    
}