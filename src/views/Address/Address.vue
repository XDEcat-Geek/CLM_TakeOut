<template>
  <div class="address-box" ref="addressBox">
    <div class="box-header">
      <span @click="goBack">
        <svg class="icon-back" aria-hidden="true">
          <use xlink:href="#icon-fanhui"></use>
        </svg>
        返回
      </span>
      <a @click="goToIncreAddress">添加收货地址</a>
    </div>
    <!-- 地址列表 -->
    <ul class="address-list">
      <li v-for="item in state.addressList" :key="item.addressId">
        <svg
          class="icon"
          aria-hidden="true"
          :class="[item.using === 1 ? 'active-icon' : '']"
          @click="clickSelect(item)"
        >
          <use xlink:href="#icon-gouxuanzhong"></use>
        </svg>
        <div class="address-info">
          <span v-show="item.using === 1">当前使用</span>
          <span>{{ item.name }}</span>
          <span>{{ item.telephone }}</span>
          <div>{{ item.address }}</div>
        </div>
        <a @click="handleDelete(item)">删除</a>
      </li>
    </ul>
    <button @click="saveAddress" v-show="state.addressList.length !== 0">保存</button>
    <div class="prompt-box" v-show="state.addressList.length === 0">
      <img src="@svg/address-icon.svg" alt="" />
      <h2>暂无添加地址噢~</h2>
    </div>
  </div>
</template>

<script>
import { reactive, inject } from "vue";
import { useRouter } from "vue-router";
import { selectAddress, getAddressList, deleteAddress } from "../../request/api/address";
export default {
  data() {
    return {};
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    goToIncreAddress() {
      this.$router.replace("/app/personal/increAddress");
    },
  },
  mounted() {
    // 页面加载,改变页面高度
    this.$refs.addressBox.style.height = document.body.clientHeight - (32 + 72) + "px";
  },
  created() {
    // 加载地址列表
    let uid = sessionStorage["uid"];
    if (uid) {
      getAddressList(uid).then((res) => {
        console.log(res);
        // console.log(res.data.addressList);
        this.state.addressList = res.data.addressList;
      });
    }
  },
  setup(props) {
    const toast = inject(["toast"]);
    const confirm = inject(["confirm"]);
    const router = useRouter();
    const state = reactive({
      addressList: [
        // {
        //   address_id: "001",
        //   customer_id: "1",
        //   name: "XDEcat",
        //   telephone: "4564675765",
        //   address: "重庆市",
        //   using: 1,
        // },
      ],
    });
    // 点击勾选框
    function clickSelect(item) {
      state.addressList.forEach((address) => {
        address.using = 0;
      });
      item.using = 1;
    }

    // 点击删除
    function handleDelete(item) {
      const { addressId, using } = item;
      confirm({
        title: "确定要删除吗?",
        message: "删除这个收货地址",
      }).then(() => {
        // 确定
        // 判断是不是当前使用的地址
        if (using === 1) {
          toast({
            text: "不能删除正在使用的地址!",
            type: "warning",
          });
        } else {
          deleteAddress(addressId).then((res) => {
            console.log(res);
            if (res.statusCode === "200") {
              // 删除地址列表中的指定地址
              state.addressList = state.addressList.filter((address) => {
                return address.addressId != addressId;
              });
              toast({
                text: "删除成功!",
                type: "success",
              });
            }
          });
        }
      });
    }
    // 点击保存，发起请求，改变当前选择的地址
    function saveAddress() {
      const address = state.addressList.filter((address) => {
        return address.using !== 0;
      });
      const { customerId, addressId } = address[0];
      console.log(addressId, customerId);
      // 发送请求
      selectAddress({
        customerId,
        addressId,
      }).then((res) => {
        console.log(res);
        if (res.statusCode === "200") {
          toast({
            text: "保存成功!",
            type: "success",
          });
          setTimeout(() => {
            router.push("/app/personal");
          }, 200);
        }
      });
    }
    return {
      state,
      clickSelect,
      saveAddress,
      handleDelete,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
