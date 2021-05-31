export default {
    // 元件自有變數
    data() {
      return {
        currentPage: 1, 
      }
    },
    // 外面傳遞資料進來，再用 $emit('自訂名稱', 要送的資料)傳出去
    props: ['pages'],
    // 元件自有方法
    methods:{
      clickPage(num){
        this.$emit('page-num', num) ;
        this.currentPage = num ;
      },
    },
    template:`
    <nav aria-label="Page navigation example">
      <ul class="pagination mb-0">
        <li class="page-item" :class="{'disabled': currentPage === 1}">
          <a class="page-link" href="#" @click.prevent="clickPage(currentPage - 1)"><i class="fas fa-chevron-left"></i></a>
      </li>
        <li v-for="item in pages" class="page-item" :class="{'active': currentPage === item}">
          <a class="page-link d-flex flex-column" :class="{'px-3': item < 10}" href="#" @click.prevent="clickPage(item)">
            {{item}}
          </a>
      </li>
        <li class="page-item" :class="{'disabled' : currentPage === pages}">
          <a class="page-link" href="#" @click.prevent="clickPage(currentPage + 1)"><i class="fas fa-chevron-right"></i></a>
      </li>
      </ul>
    </nav>`
}