<template>
  <div class="shopList-box">
    <!-- 搜索框 -->
    <div class="search-box">
      <img src="@icons/search.png" alt="" />
      <input type="text" placeholder="搜索附近的店铺吧" />
    </div>
    <!-- 店铺分类 -->
    <ul class="shop-category">
      <li
        v-for="menu in menus"
        :key="menu.id"
        @click="handelClickMenu(menu)"
        :class="[menu.isActive ? 'active' : '']"
      >
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="menu.icon"></use>
        </svg>
        <span>{{ menu.name }}</span>
      </li>
    </ul>
    <!-- 标题 -->
    <h2 class="title">店铺列表</h2>
    <!-- 列表盒子 -->
    <div class="shop-list-box">
      <!-- 显示排序 -->
      <div class="sort-box">
        <label>综合排序</label>
        <span>销量</span>
        <span>评分</span>
      </div>
      <!-- 标签 -->
      <div class="tag-box">
        <span>买不了吃亏</span>
        <span>50年老司机</span>
        <span>火箭速度</span>
        <span>老父亲服务</span>
      </div>
      <!-- 店铺列表 -->
      <ul>
        <li
          :key="shop.shopId"
          v-for="shop in state.shopList"
          @click="goToCategory(shop.shopId, shop.shopName)"
        >
          <img :src="shopImgUrl + '/getShopLogo/' + shop.shopId" alt="" />
          <div class="shop-info-box">
            <!-- 店铺名 -->
            <div>
              <label>品牌</label>
              <h3>{{ shop.shopName }}</h3>
            </div>
            <!-- 评分和销量 -->
            <div>
              <span>{{ shop.grade }}</span
              ><span>月售{{ shop.salesVolume }}单</span>
            </div>
            <!-- 配送方式和地址 -->
            <div>
              <span>起送￥0 / 配送费3元,满20元免</span>
              <span>{{ shop.shopAddress }}</span>
            </div>
            <!-- 优惠 -->
            <div class="discounts-box">
              <span>满30减5、满50减10、满60减16</span>
              <span>五折优惠</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { reactive, onBeforeMount } from "vue";
import { getShopList, shopImgUrl } from "../../request/api/shop";
export default {
  data() {
    return {
      shopImgUrl,
      menus: [
        { icon: "#icon-zhongcan", name: "中餐厅", isActive: false },
        { icon: "#icon-hanbaodian", name: "汉堡店", isActive: false },
        { icon: "#icon-xiuxian", name: "饮品店", isActive: false },
        { icon: "#icon-xiaochikuaican", name: "小吃店", isActive: false },
      ],
    };
  },
  methods: {
    // 前往店铺的商品分类界面
    goToCategory(shopId, shopName) {
      console.log("触发了shopId:", shopId);
      this.$router.push({
        path: "/app/shopList/category",
        query: {
          shopId: shopId,
          shopName: shopName,
        },
      });
    },
    // 点击每个店铺分类图标
    handelClickMenu(menu) {
      // 将其他的meun的active设置false
      this.menus.forEach((menu) => {
        menu.isActive = false;
      });
      // 改变当前选中的样式
      menu.isActive = true;
    },
  },
  setup(props) {
    // 响应式数据
    const state = reactive({
      shopList: [
        {
          id: "001",
          shopName: "吃得流泪饭店",
          grade: "4.5", //评分
          salesVolume: 700, //销售量
          address: "重庆大学城", // 地址
        },
      ],
    });
    onBeforeMount(() => {
      getShopList().then((res) => {
        state.shopList = res.data.shopList;
      });
    });

    return {
      state,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
