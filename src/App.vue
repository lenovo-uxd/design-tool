<template>
  <div id="app">
    <div class="select-root-container" v-show="!hasSelectRoot">
      <div class="header">
        <span class="logo">
          <img src="/icon/logo.png" alt="小绘" />
        </span>
        <!-- <span class="right-district">
        <span class="select-ratio">
          <span>背景尺寸：</span>
          <el-select v-model="ratio" @change="setRatio" clearable placeholder="请选择">
            <el-option v-for="item in ratioOptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </span>
        <el-button class="add-button" @click="addText" icon="el-icon-circle-plus" round>添加文本</el-button>
        <el-button class="add-button" @click="addMainImg" icon="el-icon-circle-plus" round>添加主图</el-button>
        </span>-->
      </div>
      <div class="bg" />
      <div class="mask" />
      <div class="select-root-wrapper">
        <div class="select-root-father">
          <div class="select-root">
            <div class="desc">
              <span class="main">选择一张图继续</span>
              <span class="sub">点击图片后对其进行多维度智能拓展</span>
              <!-- <span class="right" @click="onRefresh">
            <img src="./assets/refresh.png" alt="cancel" class="icon" />
            <span>换一批</span>
          </span>-->
            </div>
            <div class="filters-container">
              <div class="filters">
                <div
                  class="filter color-filter"
                  ref="colorFilter"
                  @click="handleColorFilter"
                >
                  <img class="filter-icon" src="/icon/color_filter.png" />
                  <span class="demonstration">色彩筛选</span>
                  <img
                    src="/icon/arrow_down.png"
                    :class="
                      isShowingColorPan ? 'arrow-down showing' : 'arrow-down'
                    "
                  />
                  <!-- <el-color-picker v-model="color"></el-color-picker> -->
                </div>
                <div
                  class="filter style-filter"
                  ref="styleFilter"
                  @click="handleStyleFilter"
                >
                  <img class="filter-icon" src="/icon/style_filter.png" />
                  <span class="demonstration">风格筛选</span>
                  <!-- <i class="el-icon-arrow-down" /> -->
                  <img
                    src="/icon/arrow_down.png"
                    :class="
                      isShowingStylePan ? 'arrow-down showing' : 'arrow-down'
                    "
                  />
                  <!-- <el-color-picker v-model="color"></el-color-picker> -->
                </div>
              </div>
              <!-- <el-button
                class="refresh-button"
                @click="onRefresh"
                icon="el-icon-refresh-left"
                type="text"
                >换一批</el-button
              > -->
              <div class="refresh-button" @click="onRefresh">
                <img src="/icon/btn_refresh.png" />
                <span>换一批</span>
              </div>
            </div>
            <div class="img-container">
              <div class="loading-start" v-if="loadingStart">
                <div class="gif-container">
                  <img src="/icon/loading_bg.png" class="gif-bg" />
                  <img src="/icon/loading_2.gif" class="gif" />
                </div>
              </div>
              <div
                class="img-box"
                v-for="(item, index) in startChoices"
                :key="index"
              >
                <img
                  :src="item.image"
                  @click="onSelectRoot"
                  @mouseover="changeBg"
                  @mouseout="resetZIndex"
                />
              </div>
            </div>
            <div class="color-pan" ref="colorPan" v-show="isShowingColorPan">
              <div class="color-container">
                <div class="recommend-color">
                  <span>推荐色彩</span>
                  <div class="recommend-color-list">
                    <div
                      class="recommend-color-item"
                      v-for="color in recommendColorList"
                      :key="color"
                      :style="
                        'background:' +
                        color +
                        ';' +
                        (checkedColor == color
                          ? 'outline: #FFFFFF solid 2px;'
                          : '')
                      "
                      @click="handleClickRecommendColor"
                    >
                      <img
                        v-show="checkedColor == color"
                        src="/icon/checked.png"
                      />
                    </div>
                  </div>
                </div>
                <div class="whole-color">
                  <span>全部色彩</span>
                  <div class="whole-color-list">
                    <div
                      class="whole-color-item"
                      v-for="color in wholeColorList"
                      :key="color"
                      :style="
                        'background:' +
                        color +
                        ';' +
                        (checkedColor == color
                          ? 'outline: #FFFFFF solid 2px;'
                          : '')
                      "
                      @click="handleClickWholeColor"
                    >
                      <img
                        v-show="checkedColor == color"
                        src="/icon/checked.png"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="style-pan" ref="stylePan" v-show="isShowingStylePan">
              <div class="style-container">
                <div class="style-list">
                  <div
                    class="style-item"
                    v-for="style in styleList"
                    :key="style"
                    :style="
                      'background: transparent url(' +
                      style +
                      ') center center/100% no-repeat;' +
                      (checkedStyle == style
                        ? 'outline: #FFFFFF solid 2px;'
                        : '')
                    "
                    @click="handleClickStyle"
                  >
                    <img
                      v-show="checkedStyle == style"
                      src="/icon/checked.png"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <el-radio-group v-model="ratio">
        <el-radio-button label="1:1"></el-radio-button>
        <el-radio-button label="4:3"></el-radio-button>
        <el-radio-button label="16:9"></el-radio-button>
        <el-radio-button label="2:1"></el-radio-button>
      </el-radio-group>-->
          <el-radio-group
            class="radio-group"
            v-model="ratio"
            @change="setRatio"
          >
            <el-radio label="1:1">
              <img
                class="radio-icon"
                ref="size1"
                src="/icon/btn_size1_n@2x.png"
              />
              <span>1:1</span>
            </el-radio>
            <el-radio label="4:3">
              <img
                class="radio-icon"
                ref="size2"
                src="/icon/btn_size2_n@2x.png"
              />
              <span>4:3</span>
            </el-radio>
            <el-radio label="16:9">
              <img
                class="radio-icon"
                ref="size3"
                src="/icon/btn_size3_n@2x.png"
              />
              <span>16:9</span>
            </el-radio>
            <el-radio label="2:1">
              <img
                class="radio-icon"
                ref="size4"
                src="/icon/btn_size4_n@2x_selected.png"
              />
              <span>2:1</span>
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="footer">
        <p>Designed by Lenovo Research UXD</p>
      </div>
      <div class="example">
        <div class="bubble">
          <span class="text">没灵感？看看应用案例吧！</span>
        </div>
        <!-- <span class="tri"></span> -->
        <div class="circle-face" @click="handleShowExamplePage">
          <img
            :src="circleFaceUrl"
            @mouseover="circleFaceUrl = '/icon/icon_yyal_h.png'"
            @mouseout="circleFaceUrl = '/icon/icon_yyal.png'"
          />
        </div>
      </div>
    </div>
    <div v-if="hasSelectRoot">
      <div class="menu-container">
        <el-dropdown class="menu">
          <span class="el-dropdown-link">
            <!-- <i class="el-icon-more-outline" /> -->
            <img src="/icon/btn_menu_n.png" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="downloadAll()"
              >下载全部图片</el-dropdown-item
            >
            <el-dropdown-item>调整图片比例</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="mask2" />
      <mindmap
        :nodes="nodes"
        :connections="connections"
        :editable="true"
        :clickBlank="onClickSvgBlank"
        :removeBtnNodes="removeBtnNodes"
      />
      <div class="close">
        <img
          id="close-btn"
          @click="onClose"
          src="/icon/btn_close_n@2x.png"
          alt="close"
          class="icon"
        />
      </div>
      <div class="scale">
        <div class="icon-container">
          <img
            id="global-btn"
            @click="resetViewBox"
            src="/icon/btn_global_n@2x.png"
            class="icon"
            alt="global"
          />
          <span class="icon-tooltip">查看全部</span>
        </div>
        <div class="icon-container">
          <img
            id="in-btn"
            @click="zoomIn"
            src="/icon/btn_in_n@2x.png"
            class="icon"
            alt="zoom in"
          />
          <span class="icon-tooltip">放大脑图</span>
        </div>
        <div class="icon-container">
          <img
            id="out-btn"
            @click="zoomOut"
            src="/icon/btn_out_n@2x.png"
            class="icon"
            alt="zoom out"
          />
          <span class="icon-tooltip">缩小脑图</span>
        </div>
      </div>
      <div class="edit">
        <div class="icon-container">
          <img
            :id="undoStack.isEmpty() ? 'disabled' : 'undo-btn'"
            @click="onUndo"
            :src="
              undoStack.isEmpty()
                ? '/icon/btn_undo_d@2x.png'
                : '/icon/btn_undo_n@2x.png'
            "
            alt="undo"
            class="icon"
          />
          <span class="icon-tooltip">撤销</span>
        </div>
        <div class="icon-container">
          <img
            :id="redoStack.isEmpty() ? 'disabled' : 'redo-btn'"
            @click="onRedo"
            :src="
              redoStack.isEmpty()
                ? '/icon/btn_redo_d@2x.png'
                : '/icon/btn_redo_n@2x.png'
            "
            alt="redo"
            class="icon"
            :class="redoStack.isEmpty() ? 'disabled' : ''"
          />
          <span class="icon-tooltip">重做</span>
        </div>
        <div class="icon-container">
          <img
            :id="currentNodeId === -1 ? 'disabled' : 'clear-btn'"
            @click="onDelete"
            :src="
              currentNodeId === -1
                ? '/icon/btn_clear_d@2x.png'
                : '/icon/btn_clear_n@2x.png'
            "
            alt="delete"
            class="icon"
            :class="currentNodeId === -1 ? 'disabled' : ''"
          />
          <span class="icon-tooltip">删除</span>
        </div>
      </div>
      <div class="overlay" v-show="isSelectingExpand"></div>
      <div class="select" v-show="isSelectingExpand">
        <div class="desc">
          <p>
            <span>{{ leftText }}</span>
            <span v-if="rightText != ''">&harr;</span>
            <span>{{ rightText }}</span>
          </p>
          <img
            src="/icon/btn_close_n@2x.png"
            alt="cancel"
            class="icon"
            @click="onCancelSelect"
          />
        </div>
        <div class="img-container">
          <div class="loading-start" v-if="loadingExpand">
            <div class="gif-container">
              <img src="/icon/loading_bg.png" class="gif-bg" />
              <img src="/icon/loading_2.gif" class="gif" />
            </div>
          </div>
          <img
            v-for="(item, index) in expandChoices"
            :key="index"
            :data-index="index"
            :src="item.image"
            @click="onSelectExpand"
            class="expand-item"
          />
        </div>
      </div>
    </div>
    <div class="example-page" v-if="showExamplePage">
      <div class="header">应用案例</div>
      <img
        class="cancel"
        src="/icon/btn_close_n@2x.png"
        @click="showExamplePage = false"
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
    <div class="preview-page" v-if="showPreviewPage">
      <div class="header">效果预览和素材下载</div>
      <img
        class="cancel"
        src="/icon/btn_close_n@2x.png"
        @click="showPreviewPage = false"
      />

      <div class="body">
        <div class="top-container">
          <div class="text1">素材图片预览</div>
          <div class="text2">应用示例</div>
        </div>
        <div class="bottom-container">
          <img
            class="main"
            :src="nodes.find((item) => item.id === currentNodeId).imgSrc"
          />
          <div class="example-list">
            <div
              class="example-item"
              :style="
                'background: transparent url(' +
                nodes.find((item) => item.id === currentNodeId).imgSrc +
                ') center no-repeat; background-size: 60% 95%;'
              "
            >
              <!-- <img :src="nodes.find((item) => item.id === currentNodeId).imgSrc" style="width:60%;height:90%;left:20%;top:5%"/> -->
              <img src="/picture/mockup_1.png" />
            </div>
            <div
              class="example-item"
              :style="
                'background: transparent url(' +
                nodes.find((item) => item.id === currentNodeId).imgSrc +
                ') center center no-repeat; background-size: 50% 90%;'
              "
            >
              <img src="/picture/mockup_2.png" />
            </div>
            <div
              class="example-item"
              :style="
                'background: transparent url(' +
                nodes.find((item) => item.id === currentNodeId).imgSrc +
                ') center center no-repeat; background-size: 90% 90%;'
              "
            >
              <img src="/picture/mockup_3.png" />
            </div>
            <div
              class="example-item"
              :style="
                'background: transparent url(' +
                nodes.find((item) => item.id === currentNodeId).imgSrc +
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
    <div id="right-menu">
      <div class="menu-item first" @click="onClickNode">智能拓展</div>
      <div class="menu-item-separator"></div>
      <div class="menu-item mid" @click="showPreviewPage = true">
        预览并下载
      </div>
      <div class="menu-item-separator"></div>
      <div class="menu-item last" @click="onDelete">删除图片</div>
    </div>
  </div>
</template>

<script>
// import map from "./assets/map";
// import { d3.selectAll } from "d3";
import * as d3 from "d3";
import { getViewBox } from "./components/vue-mindmap/utils/dimensions";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { dateFormat, downloadFile } from "./utils/utils";
// import { filter } from 'vue/types/umd';
// import download from "./components/vue-mindmap/utils/download";

export default {
  name: "App",
  // components: {
  //   MindMap
  // },
  data() {
    return {
      // nodes: map.nodes,
      nodes: [],
      connections: [],
      expandType: "",
      currentNodeId: -1,
      lastNodeId: -1,
      hasSelectRoot: false,
      showExamplePage: false,
      showPreviewPage: false,
      circleFaceUrl: "/icon/icon_yyal.png",
      showExampleDetail: false,
      previewExample: "",
      showPreview: false,
      isSelectingExpand: false,
      leftText: "",
      rightText: "",
      ratio: "2:1",
      ratioOptions: ["2:1", "16:9", "4:3", "3:4", "1:1", "9:16", "1:2"],
      width: 446,
      height: 223,
      scale: 1,
      loadingStart: true,
      loadingExpand: true,
      undoStack: new this.Stack(),
      redoStack: new this.Stack(),
      expandChoices: [],
      startChoices: [],
      nodeRelativeLocations: [
        {
          fx: 299,
          fy: -90,
        },
        {
          fx: 752,
          fy: -63,
        },
        {
          fx: 299,
          fy: 90,
        },
        {
          fx: -299,
          fy: -90,
        },
        {
          fx: -752,
          fy: 63,
        },
        {
          fx: -299,
          fy: 90,
        },
      ],
      color: "#409EFF",
      recommendColorList: [
        "#45C8E1",
        "#3E8DDD",
        "#8246AF",
        "#F04087",
        "#E1130A",
        "#FF6A00",
        "#FEE600",
        "#6AC246",
        "#C4BEB6",
        "#6F7170",
        "#232729",
        "#000000",
      ],
      isShowingColorPan: false,
      isShowingStylePan: false,
      checkedColor: "",
      checkedColorRGB: "",
      wholeColorList: [
        "#CDF3FC",
        "#CEDFFD",
        "#C1BAFC",
        "#D7B9FD",
        "#E9C7DB",
        "#F1CED2",
        "#F4D5CD",
        "#F8E4CB",
        "#F9E7CB",
        "#FEF6D6",
        "#F9F7D5",
        "#E0EACA",
        "#9FE8F7",
        "#A2C1F8",
        "#998DF8",
        "#BD8CF9",
        "#DCA3C5",
        "#E4AAAE",
        "#EBB4A5",
        "#F1CCA2",
        "#F2D2A1",
        "#FBEAA8",
        "#F2EEAB",
        "#CCDBA7",
        "#73DCF4",
        "#77A4F4",
        "#7261F6",
        "#A460F5",
        "#D080B1",
        "#DB838C",
        "#E3947E",
        "#ECB577",
        "#EEBF77",
        "#F5DD7D",
        "#ECE681",
        "#BAD083",
        "#4AD1F0",
        "#4C89F0",
        "#4E38F0",
        "#8A39F0",
        "#C75B9D",
        "#D55C68",
        "#DE7355",
        "#E8A14D",
        "#EBAC4C",
        "#F0D154",
        "#E8E056",
        "#A9C75F",
        "#23C5EB",
        "#256EEB",
        "#2B10EB",
        "#7311EB",
        "#C1358B",
        "#CF3643",
        "#DC532C",
        "#E88B21",
        "#EA9B20",
        "#EBC72E",
        "#E7DC2C",
        "#99C03A",
        "#02B8E3",
        "#0054E5",
        "#1900D3",
        "#5E01D2",
        "#AB2077",
        "#C21727",
        "#D0390B",
        "#DE7800",
        "#DF8802",
        "#E6BA07",
        "#E6D903",
        "#86AD23",
        "#0297BB",
        "#0145BC",
        "#1400A9",
        "#4D00A9",
        "#8E165F",
        "#A2101B",
        "#AF2B04",
        "#B56101",
        "#B66F00",
        "#C49D02",
        "#BFB500",
        "#6D8F18",
        "#007793",
        "#003895",
        "#0F0082",
        "#3A0082",
        "#6E0E4A",
        "#820813",
        "#8B2000",
        "#8F4C00",
        "#8F5701",
        "#9D7F01",
        "#979000",
        "#55710E",
        "#00586D",
        "#00296F",
        "#0A005D",
        "#2B005D",
        "#4F0734",
        "#61030A",
        "#661700",
        "#6A3800",
        "#6A4000",
        "#776001",
        "#716B00",
        "#3D530A",
        "#FFFFFF",
        "#EAEAEA",
        "#D5D5D5",
        "#C0C0C0",
        "#AAAAAA",
        "#959595",
        "#808080",
        "#6B6B6B",
        "#565656",
        "#343434",
        "#242424",
        "#161616",
      ],
      checkedStyle: "",
      styleList: [
        "/picture/style_cd@2x.png",
        "/picture/style_cy@2x.png",
        "/picture/style_ch@2x.png",
        "/picture/style_cj@2x.png",
        "/picture/style_bl@2x.png",
        "/picture/style_bw@2x.png",
        "/picture/style_sd@2x.png",
        "/picture/style_mh@2x.png",
      ],
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
  methods: {
    handleColorFilter() {
      this.isShowingStylePan = false;
      this.isShowingColorPan = !this.isShowingColorPan;
      // this.$refs.stylePan.style.display = "none";
      let cp = this.$refs.colorPan;
      let cf = this.$refs.colorFilter;
      // cp.style.display = cp.style.display == "block" ? "none" : "block";
      cp.style.left = cf.offsetLeft + "px";
      cp.style.top = cf.offsetTop + 6 + cf.offsetHeight + "px";
    },
    handleClickRecommendColor(e) {
      // console.log(e.target.style);
      // e.target.style.outline = "#0000FF dotted thin";
      // e.target.style.outline = "#FFFFFF solid 2px"
      // console.log(e.target.style.background);
      this.checkedColorRGB = e.target.style.background;
      this.checkedColor = e.target.style.background.colorHex().toUpperCase();
      this.loadStartChoices();
      setTimeout(() => {
        // this.$refs.colorPan.style.display = "none";
        this.isShowingColorPan = false;
      }, 300);
    },
    handleClickWholeColor(e) {
      // e.target.style.outline = "#FFFFFF solid 2px"
      this.checkedColorRGB = e.target.style.background;
      this.checkedColor = e.target.style.background.colorHex().toUpperCase();
      this.loadStartChoices();
      setTimeout(() => {
        // this.$refs.colorPan.style.display = "none";
        this.isShowingColorPan = false;
      }, 300);
    },
    handleStyleFilter() {
      this.isShowingColorPan = false;
      this.isShowingStylePan = !this.isShowingStylePan;
      // this.$refs.colorPan.style.display = "none";
      let sp = this.$refs.stylePan;
      let sf = this.$refs.styleFilter;
      // console.log(sp,sf)
      // sp.style.display = sp.style.display == "block" ? "none" : "block";
      sp.style.left = sf.offsetLeft + "px";
      sp.style.top = sf.offsetTop + 6 + sf.offsetHeight + "px";
    },
    handleClickStyle(e) {
      this.checkedStyle = e.target.style.background.substring(5, 29);
      // console.log(e.target.style.background);
      // e.target.style.outline = "#0000FF dotted thin";
      e.target.style.outline = "#FFFFFF solid 2px";
      // console.log(e.target.style.background);
      this.loadStartChoices();
      setTimeout(() => {
        // this.$refs.stylePan.style.display = "none";
        this.isShowingStylePan = false;
      }, 300);
    },
    handleShowExamplePage() {
      this.showExamplePage = true;
      this.$refs.colorPan.style.display = "none";
      this.$refs.stylePan.style.display = "none";
    },
    addText: function () {
      console.log("添加文本");
    },
    changeBg(event) {
      // event.srcElement.style['z-index']=9999;
      let src = event.srcElement.attributes.src.value;
      // console.log(src);
      document.documentElement.style.setProperty(
        "--background",
        "transparent url(" + src + ") center center no-repeat"
      );
      event.target.parentElement.style["z-index"] = 11;
      // console.log(event);
      // console.log(bg)
    },
    resetZIndex(event) {
      event.target.parentElement.style["z-index"] = 10;
    },
    onClickSvgBlank() {
      // console.log(d3.event);
      const event = d3.event;
      if (!event.srcElement.classList.contains("btn-node")) {
        this.isSelectingExpand = false;
        this.expandChoices = [];
      }
      if (event.srcElement._prevClass === "mindmap-svg") {
        this.connections = [];
        this.nodes = this.nodes.filter((item) => !item.isButtonNode);
        this.initialConnections();
        this.currentNodeId = -1;
      }
    },
    removeBtnNodes() {
      this.connections = [];
      this.nodes = this.nodes.filter((item) => !item.isButtonNode);
      this.initialConnections();
      this.currentNodeId = -1;
    },
    onClose() {
      // console.log(this.nodes);
      this.$confirm("此操作会删除全部节点，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loadStartChoices();
          this.hasSelectRoot = false;
          this.isSelectingExpand = false;
          this.expandChoices = [];
          // Object.assign(this.$data, this.$options.data())
          this.connections = [];
          this.nodes = [];
          this.undoStack.clear();
          this.redoStack.clear();
          localStorage.removeItem("transform");
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    resetViewBox() {
      const svg = d3.select(".mindmap-svg");
      const nodes = d3.selectAll("foreignObject");
      let wheelEvent = new WheelEvent("wheel", {
        deltaY: 0 - parseFloat(localStorage.getItem("deltaY")),
        clientX: document.body.clientWidth / 2,
        clientY: document.body.clientHeight / 2,
      });
      document
        .getElementsByClassName("mindmap-svg")[0]
        .dispatchEvent(wheelEvent);
      localStorage.setItem("deltaY", "0");
      d3.zoom().transform(svg, d3.zoomIdentity);
      d3.selectAll("g").attr("transform", "");
      svg.transition().duration(300).attr("viewBox", getViewBox(nodes.data()));
      setTimeout(() => {
        this.resetViewBox2();
      }, 600);
    },
    resetViewBox2() {
      const svg = d3.select(".mindmap-svg");
      const nodes = d3.selectAll("foreignObject");
      let wheelEvent = new WheelEvent("wheel", {
        deltaY: 0 - parseFloat(localStorage.getItem("deltaY")),
        clientX: document.body.clientWidth / 2,
        clientY: document.body.clientHeight / 2,
      });
      document
        .getElementsByClassName("mindmap-svg")[0]
        .dispatchEvent(wheelEvent);
      localStorage.setItem("deltaY", "0");
      d3.zoom().transform(svg, d3.zoomIdentity);
      d3.selectAll("g").attr("transform", "");
      svg.transition().duration(300).attr("viewBox", getViewBox(nodes.data()));
    },
    zoomIn() {
      let wheelEvent = new WheelEvent("wheel", {
        deltaY: -250,
        clientX: document.body.clientWidth / 2,
        clientY: document.body.clientHeight / 2,
      });
      document
        .getElementsByClassName("mindmap-svg")[0]
        .dispatchEvent(wheelEvent);
    },
    zoomOut() {
      let wheelEvent = new WheelEvent("wheel", {
        deltaY: 250,
        clientX: document.body.clientWidth / 2,
        clientY: document.body.clientHeight / 2,
      });
      document
        .getElementsByClassName("mindmap-svg")[0]
        .dispatchEvent(wheelEvent);
    },
    setRatio: function () {
      switch (this.ratio) {
        case "1:1": {
          // this.width = this.height;
          this.$refs.size1.src = "/icon/btn_size1_n@2x_selected.png";
          this.$refs.size2.src = "/icon/btn_size2_n@2x.png";
          this.$refs.size3.src = "/icon/btn_size3_n@2x.png";
          this.$refs.size4.src = "/icon/btn_size4_n@2x.png";
          break;
        }
        case "4:3": {
          // this.width = (this.height * 4) / 3;
          this.$refs.size1.src = "/icon/btn_size1_n@2x.png";
          this.$refs.size2.src = "/icon/btn_size2_n@2x_selected.png";
          this.$refs.size3.src = "/icon/btn_size3_n@2x.png";
          this.$refs.size4.src = "/icon/btn_size4_n@2x.png";
          break;
        }
        case "16:9": {
          // this.width = (this.height * 16) / 9;
          this.$refs.size1.src = "/icon/btn_size1_n@2x.png";
          this.$refs.size2.src = "/icon/btn_size2_n@2x.png";
          this.$refs.size3.src = "/icon/btn_size3_n@2x_selected.png";
          this.$refs.size4.src = "/icon/btn_size4_n@2x.png";
          break;
        }
        case "2:1": {
          // this.width = this.height * 2;
          this.$refs.size1.src = "/icon/btn_size1_n@2x.png";
          this.$refs.size2.src = "/icon/btn_size2_n@2x.png";
          this.$refs.size3.src = "/icon/btn_size3_n@2x.png";
          this.$refs.size4.src = "/icon/btn_size4_n@2x_selected.png";
          break;
        }
      }
      // d3.selectAll("foreignObject").attr("width", this.width).attr("height",this.height);
      let nodes = document.getElementsByTagName("foreignObject");
      // console.log(nodes);
      for (let i = 0; i < nodes.length; i++) {
        let imgDiv = nodes[i].getElementsByClassName("img-div")[0];
        // console.log(imgDiv)
        let nodeId = parseInt(imgDiv.id);
        // let nodeId = parseInt(nodes[i].firstChild.id);
        let node = this.nodes.find((item) => item.id === nodeId);
        if (node.isButtonNode) {
          continue;
        }
        // nodes[i].style.width = this.width;
        // nodes[i].style.height = this.height;
        if (i === 0) {
          nodes[i].children[1].style.width = this.width + "px";
          nodes[i].children[1].style.height = this.height + "px";
          nodes[i].children[1].children[0].style.width = this.width + "px";
          nodes[i].children[1].children[0].style.height = this.height + "px";
        } else {
          nodes[i].children[0].style.width = this.width + "px";
          nodes[i].children[0].style.height = this.height + "px";
          nodes[i].children[0].children[0].style.width = this.width + "px";
          nodes[i].children[0].children[0].style.height = this.height + "px";
        }

        // nodes[i].childNodes[0].childNodes[0].style.width = this.width;
        // nodes[i].childNodes[0].childNodes[0].style.height = this.height;
      }
      // console.log(this.ratio);
    },
    onUndo() {
      if (!this.undoStack.isEmpty()) {
        // 重做操作入栈
        this.redoStack.push(this.nodes.slice());
        // 撤销操作，恢复上一操作前的状态
        this.connections = [];
        this.nodes = this.undoStack.pop();
        this.initialConnections();
      }
      // console.log("undo");
    },
    onRedo() {
      if (!this.redoStack.isEmpty()) {
        // 撤销操作入栈
        this.undoStack.push(this.nodes.slice());
        // 重做操作，恢复上一操作前的状态
        this.connections = [];
        this.nodes = this.redoStack.pop();
        this.initialConnections();
      }
      // console.log("redo");
    },
    onDelete() {
      // console.log("delete");
      if (this.currentNodeId === 0) {
        // console.log(this.nodes);
        this.$confirm("此操作会删除全部节点，是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.loadStartChoices();
            this.isSelectingExpand = false;
            this.expandChoices = [];
            // Object.assign(this.$data, this.$options.data())
            this.hasSelectRoot = false;
            // 删除操作入栈
            this.undoStack.push(this.nodes.slice());
            this.undoStack.clear();
            this.redoStack.clear();
            this.recursionDelete(this.currentNodeId);
            // localStorage.removeItem("transform");
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      } else if (this.currentNodeId !== -1) {
        this.hasSelectRoot = true;
        // 删除操作入栈
        this.undoStack.push(this.nodes.slice());
        this.redoStack.clear();
        this.recursionDelete(this.currentNodeId);
      }
    },
    recursionDelete(nodeId) {
      this.connections = [];
      this.nodes = this.nodes.filter((item) => item.id !== nodeId);
      this.initialConnections();
      let subNodes = this.nodes.filter((item) => item.parentId === nodeId);
      if (subNodes.length === 0) return;
      subNodes.forEach((node) => {
        this.recursionDelete(node.id);
      });
    },
    onExpand() {
      let currentNodeData = this.nodes.find(
        (item) => item.id === this.currentNodeId
      );
      let parentNodeData = this.nodes.find(
        (item) => item.id === currentNodeData.parentId
      );
      // console.log(currentNodeData.text)
      this.loadExpandChoices(currentNodeData.text, parentNodeData);
      this.leftText = currentNodeData.text.slice(0, 2);
      this.rightText =
        this.leftText !== "相似" ? currentNodeData.text.slice(2, 4) : "";
      // if (
      //   currentNodeData.text === "淡雅多彩" ||
      //   currentNodeData.text === "简单复杂" ||
      //   currentNodeData.text === "模糊清晰"
      // ) {
      //   let tmp = this.leftText;
      //   this.leftText = this.rightText;
      //   this.rightText = tmp;
      // }
      this.isSelectingExpand = true;
      // console.log(this.nodes.filter(item=>(item.id === this.currentNodeId || !item.isButtonNode)))

      this.connections = [];
      this.nodes = this.nodes.filter(
        (item) => item.id === this.currentNodeId || !item.isButtonNode
      );
      this.initialConnections();
    },
    onSelectExpand(event) {
      // console.log(event);
      this.isSelectingExpand = false;

      let currentButtonNode = this.nodes.find(
        (item) => this.currentNodeId === item.id
      );
      // 根据点击的图片相对于原图的位置设置不同的pathText，左边的设置(0,2)，右边的设置(2,4)
      let pathText =
        parseInt(event.srcElement.dataset["index"]) <
        this.expandChoices.length / 2
          ? currentButtonNode.text.substring(0, 2)
          : currentButtonNode.text.substring(2, 4);
      if (currentButtonNode.text === "相似图片") {
        pathText = "相似";
      }
      // console.log(event.target.src)
      // 获取被点击的拓展图片在nodes中的数据
      let expandItem = this.expandChoices.find(
        (item) => item.image === event.target.src
      );

      let randomDis = Math.random() * Math.random() * 150;
      let node = {
        id: this.nodes[this.nodes.length - 1].id + 1,
        parentId: currentButtonNode.parentId,
        text: currentButtonNode.text,
        pathText: pathText,
        url: "",
        imgSrc: expandItem.image,
        dlatent: expandItem.dlatent,
        fx:
          currentButtonNode.fx +
          this.nodeRelativeLocations[currentButtonNode.locationIndex].fx +
          randomDis,
        fy:
          currentButtonNode.fy +
          this.nodeRelativeLocations[currentButtonNode.locationIndex].fy +
          randomDis,
      };
      this.expandChoices = [];
      this.connections = [];
      this.addNode(node);
      // console.log(this.nodes);
      this.nodes = this.nodes.filter((item) => !item.isButtonNode);
      this.initialConnections();
      this.currentNodeId = -1;
      setTimeout(() => {
        this.moveNodeToCenter(node.id);
      }, 200);
    },
    onCancelSelect() {
      this.isSelectingExpand = false;
      this.expandChoices = [];
      // console.log("cancel select");
    },
    onClickNode(event) {
      // console.log("click node");
      // console.log(event);
      let lastNodeId = this.currentNodeId;
      if (event.srcElement.innerText === "智能拓展") {
        lastNodeId = this.lastNodeId;
        event = this.event;
        if (event.target.nodeName !== "foreignObject") {
          return;
        }
        // if(event.target)
      } else {
        let imgDiv = event.target.getElementsByClassName("img-div")[0];
        this.currentNodeId = parseInt(imgDiv.id);
      }
      let lastNode = document.getElementById(lastNodeId);
      let currentNode = document.getElementById(this.currentNodeId);
      // eslint-disable-next-line no-unused-vars
      let isButtonNode = this.nodes.find(
        (item) => item.id === this.currentNodeId
      ).isButtonNode;
      // 如果当前节点已被选中
      if (this.currentNodeId === lastNodeId) {
        currentNode.classList.remove("active");
        this.currentNodeId = -1;
        this.isSelectingExpand = false;
        this.expandChoices = [];
        this.connections = [];
        this.nodes = this.nodes.filter((item) => !item.isButtonNode);
        this.initialConnections();
        // this.$refs.downloadButtonText.innerHTML = "下载脑图";
      } else {
        // 如果当前节点没有被选中
        // 把之前选中的node的active类名去掉
        if (lastNodeId !== -1) {
          lastNode.classList.remove("active");

          if (!isButtonNode) {
            this.connections = [];
            this.nodes = this.nodes.filter((item) => !item.isButtonNode);
            this.initialConnections();
          }
        }
        // 把当前选中的node变为active
        currentNode.classList.add("active");

        // let isButtonNode = this.nodes.find(
        //   item => item.id === this.currentNodeId
        // ).isButtonNode;
        if (isButtonNode) {
          this.onExpand();
        } else {
          this.connections = [];
          this.addButtonNode(event);
          this.initialConnections();
          setTimeout(() => {
            this.moveNodeToCenter(this.currentNodeId);
          }, 200);
          // this.moveNodeToCenter(this.currentNodeId);
          // this.currentNodeId = -1;
        }
      }
    },
    addButtonNode(event) {
      // 新增6个Button节点
      let nodeX = parseInt(event.target.attributes["x"].value);
      let nodeY = parseInt(event.target.attributes["y"].value);
      let nodeWidth = parseInt(event.target.attributes["width"].value);
      let nodeHeight = parseInt(event.target.attributes["height"].value);

      let currentNode = this.nodes.find(
        (item) => item.id === this.currentNodeId
      );
      nodeX = currentNode.fx;
      nodeY = currentNode.fy;

      this.undoStack.push(this.nodes.slice());
      this.redoStack.clear();
      this.nodes.push({
        id: this.nodes[this.nodes.length - 1].id + 1,
        parentId: this.currentNodeId,
        text: "柔和尖锐",
        url: "",
        width: 64,
        height: 64,
        imgSrc: "/icon/icon_rouhe.png",
        fx: nodeX + (nodeWidth * 0.5 + 117),
        fy: nodeY - (nodeHeight * 0.25 + 79),
        isButtonNode: true,
        locationIndex: 0,
      });
      this.nodes.push({
        id: this.nodes[this.nodes.length - 1].id + 1,
        parentId: this.currentNodeId,
        text: "冷色暖色",
        url: "",
        width: 64,
        height: 64,
        imgSrc: "/icon/icon_lengse.png",
        fx: nodeX + (nodeWidth * 0.5 + 117),
        fy: nodeY,
        isButtonNode: true,
        locationIndex: 1,
      });
      this.nodes.push({
        id: this.nodes[this.nodes.length - 1].id + 1,
        parentId: this.currentNodeId,
        text: "淡雅多彩",
        url: "",
        width: 64,
        height: 64,
        imgSrc: "/icon/icon_danya.png",
        fx: nodeX + (nodeWidth * 0.5 + 117),
        fy: nodeY + (nodeHeight * 0.25 + 79),
        isButtonNode: true,
        locationIndex: 2,
      });
      this.nodes.push({
        id: this.nodes[this.nodes.length - 1].id + 1,
        parentId: this.currentNodeId,
        text: "相似图片",
        url: "",
        width: 64,
        height: 64,
        imgSrc: "/icon/icon_xiangsi.png",
        fx: nodeX - (nodeWidth * 0.5 + 117),
        fy: nodeY - (nodeHeight * 0.25 + 79),
        isButtonNode: true,
        locationIndex: 3,
      });
      this.nodes.push({
        id: this.nodes[this.nodes.length - 1].id + 1,
        parentId: this.currentNodeId,
        text: "简单复杂",
        url: "",
        width: 64,
        height: 64,
        imgSrc: "/icon/icon_jiandan.png",
        fx: nodeX - (nodeWidth * 0.5 + 117),
        fy: nodeY,
        isButtonNode: true,
        locationIndex: 4,
      });
      this.nodes.push({
        id: this.nodes[this.nodes.length - 1].id + 1,
        parentId: this.currentNodeId,
        text: "模糊清晰",
        url: "",
        width: 64,
        height: 64,
        imgSrc: "/icon/icon_mohu.png",
        fx: nodeX - (nodeWidth * 0.5 + 117),
        fy: nodeY + (nodeHeight * 0.25 + 79),
        isButtonNode: true,
        locationIndex: 5,
      });
    },
    moveNodeToCenter(nodeId) {
      let ratio = this.getRatio();
      let currentNode = document.getElementById(nodeId);
      let rect = currentNode.getBoundingClientRect();
      let x = rect.left;
      let y = rect.top;
      let nodeWidth = rect.width;
      let nodeHeight = rect.height;
      if (this.detectOS() != "Mac") {
        x /= ratio;
        y /= ratio;
        nodeWidth /= ratio;
        nodeHeight /= ratio;
      }
      let svg = document.getElementsByClassName("mindmap-svg")[0];

      let windowWidth = document.body.clientWidth;
      let windowHeight = document.body.clientHeight;

      let finalX = windowWidth / 2 - nodeWidth / 2;
      let finalY = windowHeight / 2 - nodeHeight / 2;

      // finalX = Math.floor(finalX);
      // finalY = Math.floor(finalY);
      // x = Math.floor(x);
      // y = Math.floor(y);
      // console.log("os:",this.detectOS(),navigator.platform)
      // console.log("window.width,height:",window.screen.availWidth,window.screen.availHeight)
      // console.log("document.body.width,height:",document.body.clientWidth,document.body.clientHeight)
      // console.log("node rect",rect)
      // console.log("nodeWidth,height:",nodeWidth,nodeHeight);
      // console.log("finalX,Y",finalX,finalY)
      // console.log("ratio:",ratio)
      // console.log("x,y",x,y)
      // // console.log("disX,Y:",disX,disY)
      // console.log(" ")
      // console.log(" ")
      let mousedown = document.createEvent("MouseEvents");
      mousedown.initMouseEvent(
        "mousedown",
        true,
        true,
        window,
        0,
        0,
        0,
        x,
        y,
        false,
        false,
        false,
        false,
        0,
        null
      );
      let mousemove1 = document.createEvent("MouseEvents");
      mousemove1.initMouseEvent(
        "mousemove",
        true,
        true,
        window,
        0,
        0,
        0,
        x,
        y,
        false,
        false,
        false,
        false,
        0,
        null
      );
      let mousemove2 = document.createEvent("MouseEvents");
      mousemove2.initMouseEvent(
        "mousemove",
        true,
        true,
        window,
        0,
        0,
        0,
        (x + finalX) / 2,
        (y + finalY) / 2,
        false,
        false,
        false,
        false,
        0,
        null
      );
      let mousemove3 = document.createEvent("MouseEvents");
      mousemove3.initMouseEvent(
        "mousemove",
        true,
        true,
        window,
        0,
        0,
        0,
        finalX,
        finalY,
        false,
        false,
        false,
        false,
        0,
        null
      );
      let mouseup = document.createEvent("MouseEvents");
      mouseup.initMouseEvent(
        "mouseup",
        true,
        true,
        window,
        0,
        0,
        0,
        finalX,
        finalY,
        false,
        false,
        false,
        false,
        0,
        null
      );

      svg.dispatchEvent(mousedown);
      svg.dispatchEvent(mousemove1);
      svg.dispatchEvent(mousemove2);
      svg.dispatchEvent(mousemove3);
      svg.dispatchEvent(mouseup);
    },
    //获取浏览器显示比例
    getRatio() {
      var ratio = 0;
      var screen = window.screen;
      var ua = navigator.userAgent.toLowerCase();
      // console.log(window.screen)
      // console.log(navigator.userAgent.toLowerCase())
      // console.log(window.devicePixelRatio)
      // console.log(screen.deviceXDP)
      // console.log(screen.logicalXDPI)
      // console.log(window.outerWidth)
      // console.log(window.innerWidth)
      if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
      } else if (~ua.indexOf("msie")) {
        if (screen.deviceXDPI && screen.logicalXDPI) {
          ratio = screen.deviceXDPI / screen.logicalXDPI;
        }
      } else if (
        window.outerWidth !== undefined &&
        window.innerWidth !== undefined
      ) {
        ratio = window.outerWidth / window.innerWidth;
      }
      return ratio;
    },
    detectOS() {
      var sUserAgent = navigator.userAgent;

      var isWin =
        navigator.platform == "Win32" || navigator.platform == "Windows";

      if (isWin) return "Win";

      var isMac =
        navigator.platform == "Mac68K" ||
        navigator.platform == "MacPPC" ||
        navigator.platform == "Macintosh" ||
        navigator.platform == "MacIntel";
      if (isMac) return "Mac";

      var isUnix = navigator.platform == "X11" && !isWin && !isMac;
      if (isUnix) return "Unix";

      var isLinux = String(navigator.platform).indexOf("Linux") > -1;

      var bIsAndroid = sUserAgent.toLowerCase().match(/android/i) == "android";
      if (isLinux) {
        if (bIsAndroid) return "Android";
        else return "Linux";
      }
    },
    onSelectRoot(event) {
      // console.log(event);
      this.hasSelectRoot = true;
      let expandItem = this.startChoices.find(
        (item) => item.image === event.target.src
      );
      this.addNode({
        id: 0,
        parentId: -1,
        text: "",
        url: "",
        imgSrc: expandItem.image,
        dlatent: expandItem.dlatent,
        fx: window.screen.availWidth / 2,
        fy: window.innerHeight / 2,
      });
      setTimeout(() => {
        this.moveNodeToCenter(0);
      }, 100);
    },
    onRefresh() {
      // this.loadStartChoices("", "");
      this.loadStartChoices();
      // console.log("click refresh");
    },

    initialConnections() {
      for (let i in this.nodes) {
        if (this.nodes[i].parentId < 0) continue;

        this.connections.push({
          source: this.nodes[i].parentId,
          target: this.nodes[i].id,
          text: this.nodes[i].isButtonNode ? "" : this.nodes[i].text,
          pathText: this.nodes[i].isButtonNode ? "" : this.nodes[i].pathText,
          curve: {
            x: 10,
            y: 200,
          },
        });
      }
      // console.log(this.connections);
    },
    // 给所有node添加click事件
    addNodeClick() {
      let nodes = document.getElementsByTagName("foreignObject");
      // console.log(nodes);
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].onclick = this.onClickNode;
        let imgDiv = nodes[i].getElementsByClassName("img-div")[0];
        // console.log(imgDiv)
        let nodeId = parseInt(imgDiv.id);
        let node = this.nodes.find((item) => item.id === nodeId);
        let nodeWidth = this.width;
        let nodeHeight = this.height;
        if (node.isButtonNode) {
          nodeWidth = 64;
          nodeHeight = 64;
          // foreignObject style
          // nodes[i].style.width = nodeWidth;
          // nodes[i].style.height = nodeHeight;
          // nodes[i].style["border-radius"] = "32px";
          // node div style
          nodes[i].children[0].style.width = nodeWidth + "px";
          nodes[i].children[0].style.height = nodeHeight + "px";
          nodes[i].children[0].style["border-radius"] = "32px";
          // node img style
          // nodes[i].children[0].children[0].style.width = "36px";
          // nodes[i].children[0].children[0].style.height = "36px";
          // nodes[i].children[0].children[0].style.margin = "14px";
          continue;
        }
        // nodes[i].style.width = nodeWidth;
        // nodes[i].style.height = nodeHeight;
        if (i === 0) {
          // console.log(nodes[i])
          nodes[i].children[1].style.width = nodeWidth + "px";
          // console.log(nodes[i].children[0].style.width)
          nodes[i].children[1].style.height = nodeHeight + "px";
          nodes[i].children[1].children[0].style.width = nodeWidth + "px";
          nodes[i].children[1].children[0].style.height = nodeHeight + "px";
        } else {
          nodes[i].children[0].style.width = nodeWidth + "px";
          // console.log(nodes[i].children[0].style.width)
          nodes[i].children[0].style.height = nodeHeight + "px";
          nodes[i].children[0].children[0].style.width = nodeWidth + "px";
          nodes[i].children[0].children[0].style.height = nodeHeight + "px";
        }
      }
      // console.log(nodes);
    },
    addConnectionHover() {
      let connections = document.getElementsByTagName("path");
      for (let i = 0; i < connections.length; i++) {
        connections[i].onmouseover = this.mouseoverPath;
        connections[i].onmouseout = this.mouseoutPath;
      }
    },
    mouseoverPath(event) {
      let pathId = event.target.id;
      let pathLabelId = pathId.substring(0, 4) + "Label" + pathId.substring(4);
      // console.log(pathLabelId);
      document.getElementById(pathLabelId).style.visibility = "visible";
    },
    mouseoutPath(event) {
      let pathId = event.target.id;
      let pathLabelId = pathId.substring(0, 4) + "Label" + pathId.substring(4);
      document.getElementById(pathLabelId).style.visibility = "hidden";
    },
    // 新增node
    addNode(node) {
      node.width = this.width;
      node.height = this.height;
      this.undoStack.push(this.nodes.slice());
      this.redoStack.clear();
      this.nodes.push(node);

      // if (node.parentId !== -1) {
      //   this.connections.push({
      //     source: node.parentId,
      //     target: node.id,
      //     text: node.text
      //   });
      // }
      // console.log(nodeDOM)
      // setTimeout()
    },

    //下载图片
    downloadSingle() {
      let currentNodeData = this.nodes.find(
        (item) => this.currentNodeId === item.id
      );
      downloadFile(
        "xiaohui_" +
          dateFormat(new Date()) +
          "_" +
          this.nodes.indexOf(currentNodeData) +
          ".png",
        currentNodeData.imgSrc
      );
    },
    downloadAll() {
      let zip = new JSZip();

      // zip.file("Hello.txt", "Hello World\n");
      // console.log(zip)
      // console.log("downloadAll")
      let img = zip.folder("xiaohui-images");
      for (let i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].isButtonNode) continue;
        img.file(
          "xiaohui_" + dateFormat(new Date()) + "_" + i + ".png",
          this.nodes[i].imgSrc.slice(22),
          {
            base64: true,
          }
        );
      }
      // console.log(zip)
      // console.log("downloadAll")
      // img.file("smile.gif", imgData, { base64: true });

      zip.generateAsync({ type: "blob" }).then(function (content) {
        // see FileSaver.js
        saveAs(content, "xiaohui-images.zip");
      });
    },
    Stack() {
      let items = [];
      // 向栈添加新元素
      this.push = function (element) {
        items.push(element);
      };

      // 从栈内弹出一个元素
      this.pop = function () {
        return items.pop();
      };

      // 返回栈顶的元素
      this.peek = function () {
        return items[items.length - 1];
      };

      // 判断栈是否为空
      this.isEmpty = function () {
        return items.length === 0;
      };

      // 返回栈的长度
      this.size = function () {
        return items.length;
      };

      // 清空栈
      this.clear = function () {
        items = [];
      };

      // 打印栈内的所有元素
      this.print = function () {
        console.log(items.toString());
      };
    },
    clearLocalStorage() {
      localStorage.removeItem("deltaY");
    },
    loadStartChoices() {
      let styleMap = {
        "/picture/style_cd@2x.png": 1,
        "/picture/style_cy@2x.png": 2,
        "/picture/style_ch@2x.png": 3,
        "/picture/style_cj@2x.png": 4,
        "/picture/style_bl@2x.png": 5,
        "/picture/style_bw@2x.png": 6,
        "/picture/style_sd@2x.png": 7,
        "/picture/style_mh@2x.png": 0,
      };
      let color =
        this.checkedColorRGB == ""
          ? ""
          : "[" +
            this.checkedColorRGB
              .substring(4, this.checkedColorRGB.length - 1)
              .split(",")
              .toString() +
            "]";
      console.log(this.checkedColorRGB, color);
      let style = this.checkedStyle == "" ? "" : styleMap[this.checkedStyle];
      console.log(color, style);
      this.loadingStart = true;
      // eslint-disable-next-line no-unused-vars
      var reqData = {
        number: 10,
        size: "small",
        ifDlatents: true,
        ratio: "(2:1)",
      };
      if (color != "") {
        reqData.color = color;
      }
      if (style != "") {
        reqData.style = style;
      }
      console.log(reqData);
      this.$ajax
        //.get("/json/random.json")
        // .post("http://10.110.146.100:11354/apicore/art/style-gan-random/1.0.0",reqData)
        //.post("http://10.120.16.111:3002/style-gan-random",reqData)
        .post(
          "https://api.brain.lenovo.com/lenovo/ad/abstract-art-service/1.0?token=ae30c4cd-6a9b-4a03-8448-d30ce2ba56c6",
          reqData
        )
        .then((res) => {
          // console.log(res);
          this.startChoices = res.data.result;
          for (let i = 0; i < this.startChoices.length; i++) {
            this.startChoices[i].image =
              "data:image/png;base64," + this.startChoices[i].image;
          }
          this.loadingStart = false;
        })
        .catch((res) => {
          console.log(res);
          console.log("加载失败");
          this.loadingStart = false;
        });
    },
    loadExpandChoices(expandType, parentNodeData) {
      this.loadingExpand = true;
      const expandTypeMap = {
        柔和尖锐: "sharpness",
        冷色暖色: "temperature",
        淡雅多彩: "colorful",
        相似图片: "similarity",
        简单复杂: "complexity",
        模糊清晰: "clearness",
      };

      var reqData = {
        dlatentsData: parentNodeData.dlatent,
        style: expandTypeMap[expandType],
        number: 4,
        size: "small",
        styleScale: 2,
        ifDlatents: true,
        ratio: "(2:1)",
      };

      if (reqData.style == "similarity") reqData.number = reqData.number * 2;

      this.$ajax
        //.get("/json/" + expandTypeMap[expandType] + ".json")
        //.post("http://10.110.146.100:11354/apicore/art/style-gan-withtag/1.0.0",reqData)
        //.post("http://10.120.16.111:3002/style-gan-extend",reqData)
        .post(
          "https://api.brain.lenovo.com/lenovo/ad/semantic-art-design/1.0?token=ae30c4cd-6a9b-4a03-8448-d30ce2ba56c6",
          reqData
        )
        .then((res) => {
          this.expandChoices = res.data.result;
          for (let i = 0; i < this.expandChoices.length; i++) {
            this.expandChoices[i].image =
              "data:image/png;base64," + this.expandChoices[i].image;
          }
          if (
            expandType === "淡雅多彩" ||
            expandType === "简单复杂" ||
            expandType === "模糊清晰"
          ) {
            this.expandChoices.reverse();
          }
          this.expandChoices.splice(this.expandChoices.length / 2, 0, {
            image: parentNodeData.imgSrc,
          });
          this.loadingExpand = false;
        })
        .catch((res) => {
          console.log("加载失败", res);
          this.loadingExpand = false;
        });
    },
  },
  created: function () {
    this.initialConnections();
    localStorage.setItem("deltaY", "0");
    this.loadStartChoices();
    // window.addEventListener("beforeunload", this.clearLocalStorage);
    String.prototype.colorHex = function () {
      // RGB颜色值的正则
      var reg = /^(rgb|RGB)/;
      var color = this;
      if (reg.test(color)) {
        var strHex = "#";
        // 把RGB的3个数值变成数组
        var colorArr = color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        // 转成16进制
        for (var i = 0; i < colorArr.length; i++) {
          var hex = Number(colorArr[i]).toString(16);
          if (hex === "0") {
            hex += hex;
          } else if (hex.length === 1) {
            hex = "0" + hex;
          }
          strHex += hex;
        }
        return strHex;
      } else {
        return String(color);
      }
    };
  },
  mounted: function () {
    window.oncontextmenu = (event) => {
      this.lastNodeId = this.currentNodeId;
      let imgDiv = event.target.getElementsByClassName("img-div")[0];
      this.currentNodeId = parseInt(imgDiv.id);
      this.event = event;
      // console.log(this.currentNodeId)
      event.preventDefault(); //阻止浏览器自带的右键菜单显示
      let menu = document.getElementById("right-menu");
      menu.style.display = "block"; //将自定义的“右键菜单”显示出来
      menu.style.left = event.clientX + "px"; //设置位置，跟随鼠标
      menu.style.top = event.clientY + "px";
    };
    // eslint-disable-next-line no-unused-vars
    window.onclick = function (e) {
      //点击窗口，右键菜单隐藏
      let menu = document.getElementById("right-menu");
      menu.style.display = "none";
    };
    this.addNodeClick();
    this.addConnectionHover();
  },
  updated: function () {
    // console.log("updated");
    // 给新加的node节点添加点击事件,并设置宽高
    this.addNodeClick();
    this.addConnectionHover();
    if (this.currentNodeId >= 0) {
      let currentNode = document.getElementById(this.currentNodeId);
      if (!currentNode) {
        this.currentNodeId = -1;
      } else if (currentNode.className.indexOf("active") < 0) {
        currentNode.classList.add("active");
      }
    }
  },
  destroyed: function () {
    // window.removeEventListener("beforeunload", this.clearLocalStorage);
  },
};
</script>

<style>
:root {
  --background: transparent url(/test2.png) center center no-repeat;
}
body {
  margin: 0;
  overflow: hidden;
  background: rgba(43, 42, 47, 1);
}
.bg {
  /* width: 1920px;
  height: 1080px; */
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  /* bottom: 0;
  right: 0; */
  position: absolute;
  text-align: center;
  z-index: -2;
  /* line-height:300px; */
  /* background-color: rgba(0, 0, 0, 0.74); */
}
.bg::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  /* bottom: 0;
  right: 0; */
  /* width: 1920px;
  height: 1080px; */
  width: 100%;
  height: 100%;
  /* background-color: rgba(0, 0, 0, 0.74); */
  background: var(--background);
  filter: blur(150px);
  z-index: -2;
  background-size: cover;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.74);
  z-index: -1;
}
.mask2 {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.74);
  z-index: -1;
}
.header {
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  height: 50px;
  width: 100%;
  /* background: #efefef; */
}
.header .logo {
  position: absolute;
  left: 0;
  font-size: 20px;
  margin: 5.6% 0 0 6%;
}
.select-root-container {
  width: 100%;
}
.select-root-wrapper {
  position: absolute;
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
}
.select-root-father {
  width: 100%;
}
.select-root {
  /* display: none; */
  /* margin-top: 8%; */
  /* margin-top: 20%; */
  /* background: #efefef; */
}
.select-root .desc {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.select-root .desc .main {
  /* left: 0;
  font-size: 20px;
  margin-left: 20px; */
  /* width:314px; */
  height: 55px;
  font-size: 46px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  line-height: 55px;
}
.select-root .desc .sub {
  height: 28px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 28px;
}
.select-root .filters-container {
  display: flex;
  height: 4.4%;
  justify-content: space-between;
  width: 88%;
  margin-left: 6%;
  margin-top: 3%;
  margin-bottom: 1.5%;
}
.select-root .filters {
  display: flex;
  /* position: absolute;
  left: 6%; */
  align-items: center;
  /* width: 20.1%; */
  /* height: 4.4%; */
  /* margin: 10px 20px 10px 20px; */
}
.select-root .filter-icon {
  width: 24px;
  height: 24px;
  margin: 0 8px;
}
.select-root .filter {
  display: flex;
  height: 150%;
  width: 180px;
  height: 40px;
  /* justify-content: center; */
  align-items: center;
  /* opacity: 0.8; */
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.56);
  cursor: pointer;
}
.select-root .filter .focus {
  /* display: inline; */
  border-radius: 8px;
  border: 2px solid #918eff;
}
.select-root .filter span {
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 25px;
  margin: 0 30px 0 4px;
}
.select-root .filter i {
  margin-left: 27px;
}
.select-root .color-pan {
  position: fixed;
  width: 30%;
  height: 441px;
  background: #3f3e46;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  top: 0;
  left: 0;
  /* display: none; */
  z-index: 1000;

  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  line-height: 25px;
}
.select-root .color-pan .color-container {
  margin: 5%;
  width: 90%;
  height: 90%;
}
.select-root .color-pan .color-container .recommend-color {
  width: 100%;
  height: 87px;
}
.select-root .color-pan .color-container .recommend-color-list {
  width: 100%;
  height: 26px;
  font-size: 0;
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}
.select-root .color-pan .color-container .recommend-color-item {
  width: 8.33%;
  /* height: 50%; */
  outline-offset: -2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin: 4% 0;
  display: inline-block; */
}
.select-root .color-pan .color-container .recommend-color-item img {
  /* margin: 5% 20%; */
  /* width: 60%;
  height: 75%; */
  width: auto;
  height: auto;
  /* max-width: 60%; */
  /* max-height: 75%; */
}

.select-root .color-pan .color-container .whole-color {
  width: 100%;
  height: 75%;
}
.select-root .color-pan .color-container .whole-color-list {
  width: 100%;
  height: 270px;
  margin-top: 10px;
  font-size: 0;
  display: flex;
  flex-wrap: wrap;
}
.select-root .color-pan .color-container .whole-color-item {
  width: 8.33%;
  height: 10%;
  outline-offset: -2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin: 4% 0; */
  /* display: inline-block; */
}
.select-root .color-pan .color-container .whole-color-item img {
  /* margin: 10% 20%; */
  /* width: 60%; */
  width: auto;
  height: auto;
  /* max-width: 60%; */
  /* height: 75%; */
}
.arrow-down {
  width: 16px;
  height: 16px;
  transition: all 0.5s;
}
.showing {
  width: 16px;
  height: 16px;
  transform: rotate(180deg);
  transition: all 0.5s;
}
.select-root .style-filter {
  margin-left: 24px;
}
.select-root .style-pan {
  position: fixed;
  width: 34%;
  height: 18%;
  background: #3f3e46;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  top: 0;
  left: 0;
  /* display: none; */
  z-index: 1000;
  color: #ffffff;
}
.select-root .style-pan .style-container {
  margin: 2%;
  /* width: 92.66%; */
  height: 80%;
}
.select-root .style-pan .style-container .style-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  /* margin-top: 4%; */
}
.select-root .style-pan .style-container .style-item {
  width: 24%;
  height: 50%;
  outline-offset: -2px;
  margin: 0.5%;
  cursor: pointer;
  /* margin: 4% 0;
  display: inline-block; */
}
.select-root .style-pan .style-container .style-item img {
  margin: 3%;
  float: right;
}
.select-root .refresh-button {
  /* position: absolute;
  right: 6%; */
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  opacity: 0.7;
  /* margin-right: 20px; */
  padding: 0;
  display: flex;
  align-items: center;
  line-height: 29px;
  cursor: pointer;
  /* margin: 10px 20px 10px 20px; */
}
.select-root .refresh-button img {
  width: 29px;
  height: 26px;
  margin-right: 12px;
}
.select-root .refresh-button:hover img {
  content: url("/icon/btn_refresh_h.png");
}
.select-root .refresh-button:hover {
  /* position: absolute;
  right: 6%; */
  font-size: 16px;
  color: #aa6eff;
  opacity: 0.7;
  /* margin-right: 20px; */
  padding: 0;
  display: flex;
  align-items: center;
  /* margin: 10px 20px 10px 20px; */
}
.select-root .img-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  /* margin: 30px; */
  width: 100%;
  min-height: 20%;
  /* margin-top: 30px; */
  position: relative;
}
.select-root .img-container .img-box {
  width: 17.6%;
  position: relative;
  transition: transform 0.5s;
}
.select-root .img-container .img-box:hover {
  position: relative;
  z-index: 10;
  transform: scale(1.32);
}
.select-root .img-container .img-box::before {
  content: "";
  display: inline-block;
  padding-bottom: 48%;
  width: 0.01px; /*必须要有数值，否则无法把高度撑起来*/
}
.select-root .img-container img {
  /* width: 17.6%;
  transition: transform 0.5s; */
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  margin: auto;
  /* height: 300px; */
  /* margin: 2px; */
  /* padding: 5px; */
}
.select-root .img-container .loading-start {
  position: absolute;
  z-index: 20;
  background-color: rgba(43, 42, 47, 0);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: opacity 0.3s;
  display: flex;
  align-items: center;
}
.select-root .img-container .loading-start .gif-container {
  /* top: 50%;
  margin-top: -68px; */
  width: 100%;
  text-align: center;
  position: absolute;
}
.select-root .img-container .loading-start .gif-bg {
  width: 4.05%;
  height: 4.05%;
  /* z-index: 20; */
  /* right: -5.03%; */
  left: 2.02%;
  position: relative;
}
.select-root .img-container .loading-start .gif {
  width: 3.57%;
  height: 3.57%;
  /* margin-left: -64px; */
  margin-bottom: 0.24%;
  left: -1.905%;
  position: relative;
  z-index: 21;
}
img[src=""],
img:not([src]) {
  opacity: 0;
}

/* .select-root .img-container img:active {
  box-shadow: inset 0 0 1000px rgba(252, 1, 1, 0.5);
} */
.select-root-container .radio-group {
  margin: 8% 0 0 6%;
}
.select-root-container .radio-group .el-radio__label {
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  line-height: 25px;
  margin-left: 4px;
}
.select-root-container
  .radio-group
  .el-radio__input.is-checked
  + .el-radio__label {
  color: #aa6eff;
  opacity: 0.7;
}
.select-root-container .radio-group img {
  margin-right: 4px;
  line-height: 25px;
  height: 14px;
}
.select-root-container .el-radio__input {
  display: none;
}

.select-root-container .example {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 24px;
  bottom: 24px;
}
.select-root-container .example .bubble {
  width: 200px;
  height: 40px;
  /* background: #808390; */
  background: transparent url(/picture/bubble.png) center center/100% no-repeat;
  /* background: url(/picture/bubble.png); */
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border-width: 0;
}
.select-root-container .example .tri {
  margin-right: -6px;
  width: 0;
  height: 0;
  border: solid;
  border-width: 8px 15px;
  border-color: rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0)
    rgba(128, 131, 144, 0.7);
}
.select-root-container .example .bubble .text {
  width: 170px;
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 20px;
}
.select-root-container .example .circle-face {
  /* width: 64px;
  height: 64px;
  border-radius: 32px;
  border-width: 0;
  background: #3c3a53;
  display: flex;
  align-items: center;
  justify-content: center; */
  cursor: pointer;
}
.select-root-container .example .circle-face img {
  width: 60px;
}
.footer {
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 15px;
  width: 100%;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 17px;
}
.example-page {
  width: 100%;
  height: 100%;
  background: #2b2a2f;
  position: fixed;
  z-index: 20;
}
.example-page .header {
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
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
  /* outline: 2px solid rgba(255, 255, 255, 0.8); */
  /* border: 1px solid rgba(255, 255, 255, 0.8); */
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
  /* width: 54.17%; */
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.example-page .example-detail-page .detail-header .text {
  font-size: 18px;
  font-family: PingFangSC-Regular, PingFang SC;
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
  font-family: PingFangSC-Regular, PingFang SC;
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
  /* display: flex; */
  width: 92%;
  /* height: 54%; */
}
.preview-page .body button {
  width: 10%;
  height: 40px;
  /* margin-bottom: 10px; */
  border: 0;
  background: #6d69e5;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
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
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 25px;
  /* margin-left: 51%; */
}
.preview-page .body .top-container .text2 {
  font-size: 15px;
  font-family: PingFangSC-Regular, PingFang SC;
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
  /* height: 100%; */
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
.menu-container {
  position: fixed;
  top: 1.4%;
  right: 2.6%;
}
.menu-container .menu .el-dropdown-link img:hover {
  content: url("/icon/btn_menu_h.png");
}
/* body .el-dropdown-menu .el-popper {
  background: rgba(63, 62, 100, 1);
  color: rgba(255, 255, 255, 1);
  line-height: 20px;
} */
.download-button-container .el-button {
  position: fixed;
  bottom: 50px;
  left: 50%;
  width: 130px;
  margin: 0 0 0 -65px;
}
.icon {
  width: 22px;
  height: 22px;
  padding: 5px;
}
/* .icon:active {
  box-shadow: inset 0 0 1000px rgba(0, 0, 0, 0.5);
} */

.close {
  position: fixed;
  left: 1.77%;
  top: 1.56%;
}
.close .icon {
  display: block;
  cursor: pointer;
  margin-top: 5px;
  padding: 11px;
}
.close #close-btn:hover {
  content: url("/icon/btn_close_h@2x.png");
}
.scale {
  width: 43px;
  position: fixed;
  left: 1.77%;
  top: 10%;
  background: rgba(74, 73, 83, 1);
  border-radius: 25px;
  opacity: 0.8;
  padding: 20px 0;
}
.scale .icon {
  display: block;
  cursor: pointer;
  margin-top: 5px;
  padding: 11px;
}
.scale #global-btn:hover {
  content: url("/icon/btn_global_h@2x.png");
}
.scale #in-btn:hover {
  content: url("/icon/btn_in_h@2x.png");
}
.scale #out-btn:hover {
  content: url("/icon/btn_out_h@2x.png");
}
.icon-container {
  position: relative;
}
.scale .icon-container:hover .icon-tooltip {
  display: inline;
}
.scale .icon-container .icon-tooltip {
  position: absolute;
  right: -94px;
  bottom: 6px;
  background: #f5f5f5;
  padding: 5px 15px;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  display: none;

  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #2b2a2f;
  line-height: 20px;

  opacity: 1;
}
.edit .icon-container:hover .icon-tooltip {
  display: inline;
}
.edit .icon-container .icon-tooltip {
  position: absolute;
  right: -62px;
  bottom: 5.5px;
  background: #f5f5f5;
  padding: 5px 15px;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  display: none;

  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #2b2a2f;
  line-height: 20px;
}
.edit {
  position: fixed;
  left: 1.77%;
  bottom: 2%;
  /* background: #fff; */
}
.edit .icon {
  display: block;
  cursor: pointer;
  margin-top: 5px;
  padding: 11px;
}
.edit #undo-btn:hover {
  content: url("/icon/btn_undo_h@2x.png");
}
.edit .icon #disabled:hover {
  display: block;
  margin-top: 5px;
  padding: 11px;
  cursor: not-allowed;
  /* margin: 5px; */
}
.edit #redo-btn:hover {
  content: url("/icon/btn_redo_h@2x.png");
}
.edit #clear-btn:hover {
  content: url("/icon/btn_clear_h@2x.png");
}
.select {
  /* display: none; */
  position: fixed;
  bottom: 70%;
  left: 0;
  width: 100%;
  /* height: 158px; */
  background: rgba(63, 62, 70, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(151, 151, 151, 0.49);
}
.overlay {
  /* display: none; */
  position: absolute;
  bottom: 0;
  left: 0;
  top: 0;
  right: 0;
  /* width: 100%; */
  /* height: 158px; */
  background: rgba(0, 0, 0, 0.7);
  /* box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(151, 151, 151, 0.49); */
}
.select .loading-start {
  position: absolute;
  width: 100%;
  text-align: center;
}
.select .loading-start .gif {
  width: 3.57%;
  height: 3.57%;
  /* margin-left: -64px; */
  margin-bottom: 0.24%;
  left: -1.78%;
  position: relative;
}
.select .loading-start .gif-bg {
  width: 4.05%;
  height: 4.05%;
  /* z-index: 20; */
  /* right: -5.03%; */
  left: 2.02%;
  position: relative;
}
.select .desc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 37px;
  color: rgba(255, 255, 255, 0.8);
  /* margin: 6px; */
  margin-block-start: 0;
  margin-block-end: 0;
}
.select .desc p {
  margin: 0 1%;
  margin-block-start: 0;
  margin-block-end: 0;
}
.select .desc p span {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  line-height: 20px;
  text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.6);
}
.select .desc img {
  margin: 0 1%;
  cursor: pointer;
}
.select .img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  /* position: absolute; */
  margin: 3px;
  margin-bottom: 10px;
  min-height: 80px;
  align-items: center;
  /* transition: transform 10s; */
  /* bottom: 0; */
}
.select .img-container .expand-item {
  width: 10.5%;
  /* height: 103px; */
  margin: 4px;
  /* transition: transform 10s; */
  /* padding: 5px; */
}
.select .img-container .expand-item:hover {
  width: 10.5%;
  /* height: 103px; */
  /* margin: 3px; */
  /* border: 2px solid rgba(255, 255, 255, 0.5); */
  outline: 2px solid rgba(255, 255, 255, 0.5);
  /* padding: 5px; */
}
.select .img-container .expand-item:active {
  box-shadow: inset 0 0 1000px rgba(252, 1, 1, 0.5);
}

.node-img {
  /* object-fit: cover; */
}

#right-menu {
  position: absolute;
  width: 112px;
  height: auto;
  display: none;
  background: #3f3e46;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
.menu-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38.5px;
  cursor: pointer;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 20px;
}
.menu-item.first:hover {
  border-radius: 4px 4px 0 0;
  background: #595860;
}
.menu-item.mid:hover {
  background: #595860;
}
.menu-item.last:hover {
  border-radius: 0 0 4px 4px;
  background: #595860;
}
.menu-item-separator {
  border-top: 1px #525158 solid;
  /* height: 1px; */
}
</style>
