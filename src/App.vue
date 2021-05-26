<template>
  <div id="app">
    <div v-if="!globalState.hasSelectRoot">
      <WelcomePage/>
    </div>
    <div v-if="globalState.hasSelectRoot">
      <EditMindmapPage/>
    </div>
    <div v-if="globalState.showExamplePage">
      <ExamplePage />
    </div>
    <div v-if="globalState.showPreviewPage">
      <PreviewPage />
    </div>
  </div>
</template>

<script>
// 全局状态
import globalState from './store/global'

import WelcomePage from "./components/welcome-page/WelcomePage"
import ExamplePage from "./components/example-page/ExamplePage"
import PreviewPage from "./components/preview-page/PreviewPage"
import EditMindmapPage from "./components/edit-mindmap-page/EditMindmapPage"

export default {
  name: "App",
  components: {
    WelcomePage,
    ExamplePage,
    PreviewPage,
    EditMindmapPage
  },
  data() {
    return {
      globalState: globalState,
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
body {
  margin: 0;
  overflow: hidden;
  background: rgba(43, 42, 47, 1);
  font-family: PingFangSC-Regular, PingFang SC，Arial, Helvetica,
    sans-serif, "微软雅黑";
}
</style>
