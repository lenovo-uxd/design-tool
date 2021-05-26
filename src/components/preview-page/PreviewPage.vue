<template>
  <div class="preview-page">
    <div class="header">效果预览和素材下载</div>
    <img
      class="cancel"
      src="/icon/btn_close_n@2x.png"
      @click="globalState.showPreviewPage = false"
    />

    <div class="body">
      <div class="top-container">
        <div class="text1">素材图片预览</div>
        <div class="text2">应用示例</div>
      </div>
      <div class="bottom-container">
        <img
          class="main"
          :src="
            globalState.nodes.find(
              (item) => item.id === globalState.currentNodeId
            ).imgSrc
          "
        />
        <div class="example-list">
          <div
            class="example-item"
            :style="
              'background: transparent url(' +
              globalState.nodes.find(
                (item) => item.id === globalState.currentNodeId
              ).imgSrc +
              ') center no-repeat; background-size: 60% 95%;'
            "
          >
            <img src="/picture/mockup_1.png" />
          </div>
          <div
            class="example-item"
            :style="
              'background: transparent url(' +
              globalState.nodes.find(
                (item) => item.id === globalState.currentNodeId
              ).imgSrc +
              ') center center no-repeat; background-size: 50% 90%;'
            "
          >
            <img src="/picture/mockup_2.png" />
          </div>
          <div
            class="example-item"
            :style="
              'background: transparent url(' +
              globalState.nodes.find(
                (item) => item.id === globalState.currentNodeId
              ).imgSrc +
              ') center center no-repeat; background-size: 90% 90%;'
            "
          >
            <img src="/picture/mockup_3.png" />
          </div>
          <div
            class="example-item"
            :style="
              'background: transparent url(' +
              globalState.nodes.find(
                (item) => item.id === globalState.currentNodeId
              ).imgSrc +
              ') center center no-repeat; background-size: 50% 90%;'
            "
          >
            <img src="/picture/mockup_4.png" />
          </div>
        </div>
      </div>
      <button @click="downloadSingle">下载素材图片</button>
    </div>
  </div>
</template>

<script>
import globalState from "../../store/global";
import { dateFormat, downloadFile } from "../../utils/utils";

export default {
  name: "PreviewPage",
  data() {
    return {
      globalState: globalState,
    };
  },
  methods: {
    //下载图片
    downloadSingle() {
      let currentNodeData = this.globalState.nodes.find(
        (item) => this.globalState.currentNodeId === item.id
      );
      downloadFile(
        "xiaohui_" +
          dateFormat(new Date()) +
          "_" +
          this.globalState.nodes.indexOf(currentNodeData) +
          ".png",
        currentNodeData.imgSrc
      );
      this.globalState.testData.end2 = new Date().getTime();
      this.globalState.testData.download = this.globalState.testExtendPath.indexOf(
        this.globalState.currentNodeId
      );
      this.postTestData();
    },
    postTestData() {
      this.$ajax
        .post("http://xiaohui.ai:3004/addRecord", this.globalState.testData)
        .then((res) => {
          console.log("发送测试数据成功", res);
        })
        .catch((res) => {
          console.log("发送测试数据失败", res);
        });
    },
  },
  created: function () {},
  mounted: function () {},
  updated: function () {},
  destroyed: function () {},
};
</script>

<style>
.preview-page {
  width: 100%;
  height: 100%;
  background: #2b2a2f;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
}
.preview-page .header {
  font-size: 24px;
  font-weight: 400;
  color: #ffffff;
  line-height: 33px;
  width: 100%;
  display: flex;
  justify-content: center;
}
.preview-page .cancel {
  position: fixed;
  width: 18px;
  height: 18px;
  left: 1.61%;
  top: 2.78%;
  cursor: pointer;
}
.preview-page .body {
  width: 92%;
}
.preview-page .body button {
  width: 10%;
  height: 40px;
  border: 0;
  background: #6d69e5;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
  line-height: 22px;
  margin-top: 13px;
}
.preview-page .body .top-container {
  width: 100%;
  height: 9%;
  margin-bottom: 10px;
  display: flex;
  align-items: flex-end;
}
.preview-page .body .top-container .text1 {
  width: 20%;
  font-size: 15px;
  font-weight: 400;
  color: #ffffff;
  line-height: 25px;
}
.preview-page .body .top-container .text2 {
  font-size: 15px;
  font-weight: 400;
  color: #ffffff;
  line-height: 25px;
  margin-left: 41%;
}
.preview-page .body .bottom-container {
  width: 100%;
  height: 90%;
  display: flex;
}
.preview-page .body .bottom-container .main {
  width: 59%;
}
.preview-page .body .bottom-container .example-list {
  width: 39%;
  display: flex;
  flex-wrap: wrap;
  margin-left: 2%;
}
.preview-page .body .bottom-container .example-item {
  width: 49%;
  height: 49%;
  margin: 0 1% 1% 0;
}
.preview-page .body .bottom-container .example-item img {
  width: 100%;
  height: 100%;
}
</style>
