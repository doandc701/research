<template>
  <!-- class: page + '-container'
    page: có thể là home, info,...
  -->
  <div class="home-container">
    <h3>Page title</h3>
    <!-- hộp chứa nhiều item
      class: items + '-card-row'
      items: có thể là games, auctions, images,...
      sử dụng '<el-row>'
    -->
    <el-row id="item-card-row" justify="center">
      <!-- class: item + '-card-col'
        items: có thể là game, auction, image,...
        trong item-card-col là image, name,...
        không sử dụng '<el-col>'
      -->
      <div class="item-card-col">
        <div class="item-card-body">
          <!-- class: 'item-card-img' hoặc <el-image>
          -->
          <div class="item-card-img" />
          <div class="item-card-details" />
        </div>
      </div>
    </el-row>
  </div>
</template>

<script lang="ts">
export default {
  name: "Tên trang hoặc component"
  /* ****************************** VUE 3 ******************************
  // ---------- đăng ký các components sử dụng cho template này
  components: {
    Address
  },

  // ****************************** Composition API ******************************
  // xuất hiện ở vue3 có thể dùng thay thế cho 'Options API' ở vue2, cũng có thể sử dụng song song
  // ---------- setup() truy cập được 'props', các Composition API được sử dụng trong setup và return giống như data() ở vue2
  // tìm hiểu thêm: https://vuejs.org/api/composition-api-setup.html
  setup(props) {
    const count = ref(0)

    // Reactivity API: Core: ref(), computed(), reactive(), readonly(), watchEffect(), watchPostEffect(), watchSyncEffect(), watch()
    // tìm hiểu thêm về Reactivity API: Core: https://vuejs.org/api/reactivity-core.html

    // Reactivity API: Utilities: isRef(), unref(), toRef(), toRefs(), isProxy(), isReactive(), isReadonly()
    // tìm hiểu thêm về Reactivity API: Utilities: https://vuejs.org/api/reactivity-utilities.html

    // Reactivity API: Advanced: shallowRef(), triggerRef(), customRef(), shallowReactive(), shallowReadonly(),
      toRaw(), markRaw(), effectScope(), getCurrentScope(), onScopeDispose()
    // tìm hiểu thêm về Reactivity API: Advanced: https://vuejs.org/api/reactivity-advanced.html

    // Composition API: Lifecycle Hooks: onMounted(), onUpdated(), onUnmounted(), onBeforeMount(), onBeforeUpdate(), onBeforeUnmount(),
      onErrorCaptured(), onRenderTracked(), onRenderTriggered(), onActivated(), onDeactivated(), onServerPrefetch()
    // tìm hiểu thêm về Composition API: Lifecycle Hooks: https://vuejs.org/api/composition-api-lifecycle.html

    // Composition API: Dependency Injection: provide(), inject()

    // expose to template and other options API hooks
    return {
      count
    }
  },
  // ****************************** end: Composition API ******************************

  // ****************************** Options API ******************************
  // ---------- Options API: sử dụng giống như vue2
  // ---------- Options: State -> data(): Một hàm trả về 'reactive state' ban đầu cho component instance.
  // reactive state: có khả năng cập nhật DOM khi value thay đổi
  data() {
    return {
      debug: false
    }
  },

  // ---------- Options: State -> props: khai báo props của component, giá trị được truyền vào từ parent component
  props: {
    title: String
  },

  // ---------- Options: State -> computed:
  // Khai báo các computed properties sẽ được hiển thị trên component instance
  computed: {
  },

  // ---------- Options: State -> methods: khai báo các phương thức của component
  methods: {
  }

  // ---------- Options: State -> watch: Khai báo watch callbacks sẽ được gọi khi thay đổi dữ liệu
  watch: {
  }

  // ---------- Options: State -> emits: Khai báo các custom events được phát ra bởi component
  emits: {
  }

  // ---------- Options: State -> expose:
  // Khai báo các public properties được hiển thị khi component instance được truy cập bởi cha mẹ thông qua các ref mẫu
  expose: {
  }

  // dưới đây là các Options: Lifecycle, được gọi theo thứ tự khi instance được khởi tạo
  // ---------- Options: Lifecycle -> beforeCreate(): được gọi khi instance được khởi tạo
  // Được gọi ngay lập tức khi instance được khởi tạo, sau khi phân giải 'props',
  // trước khi xử lý các tùy chọn khác như data() hoặc 'computed'
  // Lưu ý rằng setup() hook của Composition API được gọi trước bất kỳ Options API hooks nào, ngay cả beforeCreate()
  beforeCreate() {
  },

  // ---------- Options: Lifecycle -> created():
  // Được gọi sau khi instance xử lý xong tất cả các tùy chọn liên quan đến trạng thái.
  // Khi hook này được gọi, những thứ sau đã được thiết lập: reactive data, computed properties, methods, and watchers.
  // Tuy nhiên, giai đoạn 'mounting' chưa được bắt đầu và thuộc tính $el sẽ chưa khả dụng.
  created() {
  },

  // ---------- Options: Lifecycle -> beforeMount():
  // Được gọi ngay trước khi component được gắn kết (mounted).
  // Khi hook này được gọi, component đã hoàn tất thiết lập trạng thái phản ứng của nó, nhưng chưa có nút DOM nào được tạo. Nó sắp thực thi hiệu ứng kết xuất DOM lần đầu tiên.
  beforeMount() {
  },

  // ---------- Options: Lifecycle -> mounted():
  // Được gọi sau khi component đã được gắn kết (mounted)
  mounted() {
  },

  // ---------- Options: Lifecycle -> beforeUpdate():
  // Được gọi ngay trước khi component sắp cập nhật cây DOM của nó do thay đổi trạng thái phản ứng (reactive state)
  // Hook này có thể được sử dụng để truy cập trạng thái DOM trước khi Vue cập nhật DOM
  // Nó cũng an toàn để sửa đổi component state bên trong hook này
  beforeUpdate() {
  },

  // ---------- Options: Lifecycle -> updated():
  // Được gọi sau khi component đã cập nhật cây DOM của nó do thay đổi trạng thái phản ứng
  // updated hook của thành phần mẹ (parent component's) được gọi sau hook của các component con của nó
  // Móc này được gọi sau bất kỳ bản cập nhật DOM nào của component, có thể do các thay đổi trạng thái khác nhau gây ra
  // Nếu bạn cần truy cập DOM đã cập nhật sau khi thay đổi trạng thái cụ thể, hãy sử dụng nextTick ()để thay thế
  // CẢNH BÁO: Không thay đổi trạng thái component trong updated hook - điều này có thể dẫn đến vòng lặp cập nhật vô hạn!
  updated() {
  },

  // ---------- Options: Lifecycle -> beforeUnmount():
  // Được gọi ngay trước khi một component instance được ngắt kết nối, thay thế cho beforeDestroy trong vue2
  // Khi hook này được gọi, component instance vẫn hoạt động đầy đủ
  beforeUnmount() {
    this.$emitter.off('walletConnect', this.onConnect)
  },

  // ---------- Options: Lifecycle -> unmounted():
  // Được gọi sau khi component đã được ngắt kết nối, thay thế cho destroy trong vue2
  unmounted() {
    this.$emitter.off('walletConnect', this.onConnect)
  },

  // ---------- Options: Lifecycle -> errorCaptured: Được gọi khi một lỗi lan truyền từ một thành phần con đã được ghi lại
  // ---------- Options: Lifecycle -> renderTracked: (Dev only) ??????????
  // ---------- Options: Lifecycle -> renderTriggered: (Dev only) ??????????
  // ---------- Options: Lifecycle -> activated:
  // Được gọi sau khi component instance được chèn vào DOM như một phần của cây được lưu trong bộ nhớ cache bởi <KeepAlive>

  // ---------- Options: Lifecycle -> deactivated:
  // Được gọi sau khi component instance bị xóa khỏi DOM như một phần của cây được lưu trong bộ nhớ cache bởi <KeepAlive>

  // ---------- Options: Lifecycle -> serverPrefetch: (SSR only) ??????????

  // Options: Composition: chưa note -> https://vuejs.org/api/options-composition.html
  // Options: Misc: chưa note -> https://vuejs.org/api/options-misc.html
  // Component Instance: chưa note -> https://vuejs.org/api/component-instance.html

  // ****************************** end: Options API ******************************
  */
};
</script>
