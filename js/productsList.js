export default {
    props: ['data', 'tab'],
    template:`<div class="card-body">
    <table class="table">
      <thead>
        <tr>
          <th>分類</th>
          <th>商品縮圖</th>
          <th>標題</th>
          <th>描述</th>
          <th>售價</th>
          <th>上架</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id" :class="{'table-success': item.is_enabled}">
          <td>{{item.category}}</td>
          <td>
            <img :src="item.imageUrl" :alt="item.title" style="width: 100px;" class="img-thumbnail">
          </td>
          <td>{{item.title}}</td>
          <td class="text-start">{{item.description}}</td>
          <td>{{item.price}}</td>
          <td class="align-middle">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" :id="item.id" :checked="item.is_enabled" @click="putProduct(item, 'isEnabled')">
              <label class="form-check-label" :for="item.id">{{item.is_enabled ? '已啟用' : '未啟用'}}</label>
            </div>
          </td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-warning" :class="{'disabled': item.is_enabled}" data-bs-toggle="modal" :data-bs-target="'#' + tab.enName + 'Modal'" @click="tempData.product = {...item}">
                修改  
              </button>
              <input type="button" value="刪除" class="btn btn-outline-danger" :class="{'disabled': item.is_enabled}" @click="deleteProduct(item.id)">
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>`
}