<template>
  <div class="example-page">
    <div class="header">应用案例</div>
    <img
      class="cancel"
      src="/icon/btn_close_n@2x.png"
      @click="globalState.showExamplePage = false"
    />
    <div class="gallery">
      <img
        v-for="item in exampleList"
        :src="item"
        :key="item"
        class="gallery-item"
        @click="
          previewExample = item;
          showExampleDetail = true;
        "
      />
    </div>
    <div class="example-detail-page" v-show="showExampleDetail">
      <div class="example-detail-container">
        <div class="detail-header">
          <span class="text">热心网友 <span>2020.04.01</span></span>
          <img
            class="detail-cancel"
            src="/icon/btn_close_n@2x.png"
            @click="showExampleDetail = false"
          />
        </div>
        <img class="example-detail" :src="previewExample" />
      </div>
    </div>
  </div>
</template>

<script>
import globalState from '../../store/global'

export default {
  name: "ExamplePage",
  data() {
    return {
      globalState: globalState,
      showExampleDetail: false,
      previewExample: "",
      exampleList: [
        "/picture/example1@2x.png",
        "/picture/example2@2x.png",
        "/picture/example3@2x.png",
        "/picture/example4@2x.png",
        "/picture/example5@2x.png",
        "/picture/example6@2x.png",
        "/picture/example7@2x.png",
        "/picture/example8@2x.png",
      ],
    };
  },
  methods: {},
  created: function () {
  },
  mounted: function () {
  },
  updated: function () {
  },
  destroyed: function () {
  },
};
</script>

<style>
.example-page {
  width: 100%;
  height: 100%;
  background: #2b2a2f;
  position: fixed;
  z-index: 20;
}
.example-page .header {
  font-size: 24px;
  font-weight: 400;
  color: #ffffff;
  line-height: 33px;
  width: 100%;
  display: flex;
  justify-content: center;
}
.example-page .cancel {
  position: fixed;
  width: 18px;
  height: 18px;
  left: 1.61%;
  top: 2.78%;
  cursor: pointer;
}
.example-page .gallery {
  position: absolute;
  left: 15%;
  width: 70%;
  top: 26.67%;
}
.example-page .gallery .gallery-item {
  width: 24.9%;
  vertical-align: top;
}
.example-page .gallery .gallery-item:hover {
  width: 24.9%;
  vertical-align: top;
  outline: 4px solid rgba(255, 255, 255, 1);
  outline-offset: -4px;
}
.example-page .example-detail-page {
  background: rgba(0, 0, 0, 0.9);
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
}
.example-page .example-detail-page .example-detail-container {
  width: 54.17%;
}
.example-page .example-detail-page .detail-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.example-page .example-detail-page .detail-header .text {
  font-size: 18px;
  font-weight: 400;
  color: #ffffff;
  line-height: 25px;
  opacity: 0.8;
}
.example-page .example-detail-page .detail-header .text span {
  opacity: 0.4;
}
.example-page .example-detail-page .detail-cancel {
  width: 18px;
  height: 18px;
  cursor: pointer;
}
.example-page .example-detail-page .example-detail {
  width: 100%;
}
</style>
