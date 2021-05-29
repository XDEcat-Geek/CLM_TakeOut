import { createApp} from 'vue'
import router from './router/index'
import App from './App.vue'
import toast from "@comps/Toast/index.js"
import showGoodsDetails from "@comps/GoodsDetails/index.js"

const app = createApp(App);  // 创建应用实例，下面的组件树将共享这一个实例
app.use(router);
// app组件树下面提供toast方法
app.provide("toast", toast);
app.provide("showGoodsDetails",showGoodsDetails);
const vm = app.mount("#app");