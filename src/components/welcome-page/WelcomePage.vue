<template>
  <div class="select-root-container">
    <div class="header">
      <span class="logo">
        <img src="/icon/logo@2x.png" alt="小绘" />
      </span>
    </div>
    <div class="bg" />
    <div class="mask" />
    <div class="select-root-wrapper">
      <div class="select-root-father">
        <div class="select-root">
          <div class="desc">
            <span class="main">选择一张图继续</span>
            <span class="sub">点击图片后对其进行多维度智能拓展</span>
          </div>
          <div class="filters-container">
            <div class="filters">
              <div
                class="filter color-filter"
                ref="colorFilter"
                @click="handleColorFilter"
              >
                <img class="filter-icon" src="/icon/color_filter@2x.png" />
                <span class="demonstration">色彩筛选</span>
                <img
                  src="/icon/arrow_down.png"
                  :class="
                    showColorPan ? 'arrow-down showing' : 'arrow-down'
                  "
                />
              </div>
              <div
                class="filter style-filter"
                ref="styleFilter"
                @click="handleStyleFilter"
              >
                <img class="filter-icon" src="/icon/style_filter@2x.png" />
                <span class="demonstration">风格筛选</span>
                <img
                  src="/icon/arrow_down.png"
                  :class="
                    showStylePan ? 'arrow-down showing' : 'arrow-down'
                  "
                />
              </div>
            </div>
            <div class="refresh-button" @click="onRefresh">
              <img src="/icon/btn_refresh@2x.png" />
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
          <div
            class="color-pan"
            ref="colorPan"
            @mouseover="showColorPan = true"
            @mouseout="showColorPan = false"
            v-show="showColorPan"
          >
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
          <div class="style-pan" ref="stylePan" v-show="showStylePan">
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
                    (checkedStyle == style ? 'outline: #FFFFFF solid 2px;' : '')
                  "
                  @click="handleClickStyle"
                >
                  <img v-show="checkedStyle == style" src="/icon/checked.png" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-radio-group class="radio-group" v-model="globalState.ratio" @change="setRatio">
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
        <img src="/icon/icon_yyal@2x.png"/>
      </div>
    </div>
  </div>
</template>

<script>
import globalState from "../../store/global";

export default {
  name: "WelcomePage",
  data() {
    return {
      // 全局状态
      globalState: globalState,
      // 图像宽高比例
      ratioOptions: ["2:1", "16:9", "4:3", "3:4", "1:1", "9:16", "1:2"],
      loadingStart: true,
      // 随机初始图像
      startChoices: [],
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
      // 控制下拉框显示
      showColorPan: false,
      showStylePan: false,
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
    };
  },
  methods: {
    handleColorFilter() {
      this.showStylePan = false;
      this.showColorPan = !this.showColorPan;
      // 设置colorPan位置
      let cp = this.$refs.colorPan;
      let cf = this.$refs.colorFilter;
      cp.style.left = cf.offsetLeft + "px";
      cp.style.top = cf.offsetTop + 6 + cf.offsetHeight + "px";
    },
    handleClickRecommendColor(e) {
      this.checkedColorRGB = e.target.style.background;
      this.checkedColor = this.rgb2hex(e.target.style.background).toUpperCase();
      this.loadStartChoices();
      // 避免消失的太突兀
      setTimeout(() => {
        this.showColorPan = false;
      }, 300);
      // 记录测试数据
      globalState.testData.color.push(
        12 + this.recommendColorList.indexOf(this.checkedColor)
      );
    },
    handleClickWholeColor(e) {
      this.checkedColorRGB = e.target.style.background;
      this.checkedColor = this.rgb2hex(e.target.style.background).toUpperCase();
      this.loadStartChoices();
      // 避免消失的太突兀
      setTimeout(() => {
        this.showColorPan = false;
      }, 300);
      // 记录测试数据
      globalState.testData.color.push(
        this.wholeColorList.indexOf(this.checkedColor)
      );
    },
    handleStyleFilter() {
      this.showColorPan = false;
      this.showStylePan = !this.showStylePan;
      // 设置stylePan位置
      let sp = this.$refs.stylePan;
      let sf = this.$refs.styleFilter;
      sp.style.left = sf.offsetLeft + "px";
      sp.style.top = sf.offsetTop + 6 + sf.offsetHeight + "px";
    },
    handleClickStyle(e) {
      this.checkedStyle = e.target.style.background.substring(5, 29);
      e.target.style.outline = "#FFFFFF solid 2px";
      this.loadStartChoices();
      // 避免消失的太突兀
      setTimeout(() => {
        this.showStylePan = false;
      }, 300);
      // 记录测试数据
      globalState.testData.style.push(
        this.styleList.indexOf(this.checkedStyle)
      );
    },
    handleShowExamplePage() {
      globalState.showExamplePage = true;
      this.showColorPan = false;
      this.showStylePan = false;
    },
    // 根据鼠标悬停图像更换背景
    changeBg(event) {
      let src = event.srcElement.attributes.src.value;
      document.documentElement.style.setProperty(
        "--background",
        "transparent url(" + src + ") center center no-repeat"
      );
      // 提高悬浮图片的z-index，避免被其他图片遮挡
      event.target.parentElement.style["z-index"] = 11;
    },
    resetZIndex(event) {
      event.target.parentElement.style["z-index"] = 10;
    },
    setRatio() {
      // 根据ratio修改图标以及宽高
      switch (this.globalState.ratio) {
        case "1:1": {
          // this.globalState.width = this.globalState.height;
          this.$refs.size1.src = "/icon/btn_size1_n@2x_selected.png";
          this.$refs.size2.src = "/icon/btn_size2_n@2x.png";
          this.$refs.size3.src = "/icon/btn_size3_n@2x.png";
          this.$refs.size4.src = "/icon/btn_size4_n@2x.png";
          break;
        }
        case "4:3": {
          // this.globalState.width = (this.globalState.height * 4) / 3;
          this.$refs.size1.src = "/icon/btn_size1_n@2x.png";
          this.$refs.size2.src = "/icon/btn_size2_n@2x_selected.png";
          this.$refs.size3.src = "/icon/btn_size3_n@2x.png";
          this.$refs.size4.src = "/icon/btn_size4_n@2x.png";
          break;
        }
        case "16:9": {
          // this.globalState.width = (this.globalState.height * 16) / 9;
          this.$refs.size1.src = "/icon/btn_size1_n@2x.png";
          this.$refs.size2.src = "/icon/btn_size2_n@2x.png";
          this.$refs.size3.src = "/icon/btn_size3_n@2x_selected.png";
          this.$refs.size4.src = "/icon/btn_size4_n@2x.png";
          break;
        }
        case "2:1": {
          // this.globalState.width = this.globalState.height * 2;
          this.$refs.size1.src = "/icon/btn_size1_n@2x.png";
          this.$refs.size2.src = "/icon/btn_size2_n@2x.png";
          this.$refs.size3.src = "/icon/btn_size3_n@2x.png";
          this.$refs.size4.src = "/icon/btn_size4_n@2x_selected.png";
          break;
        }
      }
      // 根据更新后的宽高比例重新获取图像
      this.loadStartChoices()
    },
    onSelectRoot(event) {
      globalState.hasSelectRoot = true;
      let expandItem = this.startChoices.find(
        (item) => item.image === event.target.src
      );
      globalState.addNode({
        id: 0,
        parentId: -1,
        text: "",
        url: "",
        imgSrc: expandItem.image,
        dlatent: expandItem.dlatent,
        fx: window.screen.availWidth / 2,
        fy: window.innerHeight / 2,
      });
      globalState.testData.end1 = new Date().getTime();
      globalState.testData.start2 = new Date().getTime();
    },
    onRefresh() {
      globalState.testData.next++;
      this.loadStartChoices();
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
      let style = this.checkedStyle == "" ? "" : styleMap[this.checkedStyle];
      this.loadingStart = true;
      // eslint-disable-next-line no-unused-vars
      var reqData = {
        number: 10,
        // size: "small",
        size: "large",
        ifDlatents: true,
        ratio: '('+this.globalState.ratio+')',
      };
      if (color != "") {
        reqData.color = color;
      }
      if (style != "") {
        reqData.style = style;
      }
      this.$ajax
        // .get("/json/random.json")
        .post(
          "http://10.110.146.100:11354/apicore/art/style-gan-random/1.0.0",
          reqData
        )
        // .post(
        //   "https://api.brain.lenovo.com/lenovo/ad/abstract-art-service/1.0?token=33c08eba-d207-48ca-921b-fae10b22bbac",
        //   reqData
        // )
        .then((res) => {
          // console.log(res);
          this.startChoices = res.data.result;
          // 逐个拼上base64头
          for (let i = 0; i < this.startChoices.length; i++) {
            this.startChoices[i].image =
              "data:image/png;base64," + this.startChoices[i].image;
          }
          this.loadingStart = false;
          this.showColorPan = false;
          this.showStylePan = false;
        })
        .catch((res) => {
          console.log(res);
          console.log("加载失败");
          this.loadingStart = false;
        });
    },
    inputITCode() {
      // 弹出测试用输入框
      this.$prompt(
        "<p>你现在需要为公司新发布的手机做一张宣传海报的背景，请挑选一张你喜爱的图片进行创作编辑，直到你满意为止。</p><img src='/picture/phone.jpg'><p>请输入ITcode:</p> ",
        "提示",
        {
          confirmButtonText: "确定",
          inputPlaceholder: "请输入ITcode",
          inputPattern: /([a-z]|[A-Z]|[0-9])+/,
          inputErrorMessage: "格式不正确",
          customClass: "test-msg",
          showCancelButton: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          closeOnHashChange: false,
          showClose: false,
          dangerouslyUseHTMLString: true,
        }
      ).then(({ value }) => {
        this.globalState.testData.name = value;
      });
    },
    // rgb颜色格式转十六进制格式
    rgb2hex(rgbStr) {
      // RGB颜色值的正则
      var reg = /^(rgb|RGB)/;
      var color = rgbStr;
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
    },
  },
  created: function () {
    // 加载随机开始图像
    this.loadStartChoices();

    // 弹出测试用输入框
    this.inputITCode();

    // 记录测试开始时间
    this.globalState.testData.start1 = new Date().getTime();
  },
  mounted: function () {
  },
  updated: function () {},
  destroyed: function () {},
};
</script>

<style>
:root {
  --background: transparent url(/test.png) center center no-repeat;
}

.bg {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  text-align: center;
  z-index: -2;
}
.bg::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
.header {
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  height: 50px;
  width: 100%;
}
.header .logo {
  position: absolute;
  left: 0;
  font-size: 20px;
  margin: 5.6% 0 0 6%;
  width: 160px;
  height: 41px;
}
.header .logo img {
  width: 160px;
  height: 41px;
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

.select-root .desc {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.select-root .desc .main {
  height: 55px;
  font-size: 46px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  line-height: 55px;
}
.select-root .desc .sub {
  height: 28px;
  font-size: 16px;
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
  align-items: center;
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
  align-items: center;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.56);
  cursor: pointer;
}
.select-root .filter .focus {
  border-radius: 8px;
  border: 2px solid #918eff;
}
.select-root .filter span {
  font-size: 16px;
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
  z-index: 1000;

  font-size: 16px;
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
  outline-offset: -2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.select-root .color-pan .color-container .recommend-color-item img {
  width: auto;
  height: auto;
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
}
.select-root .color-pan .color-container .whole-color-item img {
  width: auto;
  height: auto;
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
  z-index: 1000;
  color: #ffffff;
}
.select-root .style-pan .style-container {
  margin: 2%;
  height: 80%;
}
.select-root .style-pan .style-container .style-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}
.select-root .style-pan .style-container .style-item {
  width: 24%;
  height: 50%;
  outline-offset: -2px;
  margin: 0.5%;
  cursor: pointer;
}
.select-root .style-pan .style-container .style-item img {
  margin: 3%;
  float: right;
}
.select-root .refresh-button {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  opacity: 0.7;
  padding: 0;
  display: flex;
  align-items: center;
  line-height: 29px;
  cursor: pointer;
}
.select-root .refresh-button img {
  width: 29px;
  height: 26px;
  margin-right: 12px;
}
.select-root .refresh-button:hover img {
  content: url("/icon/btn_refresh_h@2x.png");
}
.select-root .refresh-button:hover {
  font-size: 16px;
  color: #aa6eff;
  opacity: 0.7;
  padding: 0;
  display: flex;
  align-items: center;
}
.select-root .img-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  min-height: 20%;
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
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  margin: auto;
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
  width: 100%;
  text-align: center;
  position: absolute;
}
.select-root .img-container .loading-start .gif-bg {
  width: 4.05%;
  height: 4.05%;
  left: 2.02%;
  position: relative;
}
.select-root .img-container .loading-start .gif {
  width: 3.57%;
  height: 3.57%;
  margin-bottom: 0.24%;
  left: -1.905%;
  position: relative;
  z-index: 21;
}
img[src=""],
img:not([src]) {
  opacity: 0;
}
.select-root-container .radio-group {
  margin: 8% 0 0 6%;
}
.select-root-container .radio-group .el-radio__label {
  font-size: 16px;
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
  background: transparent url(/picture/bubble.png) center center/100% no-repeat;
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
  font-weight: 400;
  color: #ffffff;
  line-height: 20px;
}
.select-root-container .example .circle-face {
  cursor: pointer;
}
.select-root-container .example .circle-face img {
  width: 60px;
}
.select-root-container .example .circle-face img:hover {
  width: 60px;
  content: url('/icon/icon_yyal_h@2x.png');
}
.footer {
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 15px;
  width: 100%;
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 17px;
}
</style>
