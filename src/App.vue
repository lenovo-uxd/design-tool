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
        <el-button
          class="refresh-button"
          @click="onRefresh"
          icon="el-icon-refresh-left"
          type="text"
        >换一批</el-button>

        <div
          class="img-container"
        >
          <div class="loading-start" v-if="loadingStart">
            <div class="gif-container">
              <img src="/icon/loading_bg.png" class="gif-bg"/>
              <img src="/icon/loading_2.gif" class="gif"/>
            </div>
          </div>
          <div class="img-box"
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
      </div>
      <!-- <el-radio-group v-model="ratio">
        <el-radio-button label="1:1"></el-radio-button>
        <el-radio-button label="4:3"></el-radio-button>
        <el-radio-button label="16:9"></el-radio-button>
        <el-radio-button label="2:1"></el-radio-button>
      </el-radio-group>-->
      <el-radio-group class="radio-group" v-model="ratio" @change="setRatio">
        <el-radio label="1:1">
          <img class="radio-icon" ref="size1" src="/icon/btn_size1_n.png" />
          <span>1:1</span>
        </el-radio>
        <el-radio label="4:3">
          <img class="radio-icon" ref="size2" src="/icon/btn_size2_n.png" />
          <span>4:3</span>
        </el-radio>
        <el-radio label="16:9">
          <img class="radio-icon" ref="size3" src="/icon/btn_size3_n.png" />
          <span>16:9</span>
        </el-radio>
        <el-radio label="2:1">
          <img class="radio-icon" ref="size4" src="/icon/btn_size4_n_selected.png" />
          <span>2:1</span>
        </el-radio>
      </el-radio-group>
      </div>
      </div>
      <div class="footer">
        <p>Designed by Lenovo Research UXD</p>
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
            <el-dropdown-item @click.native="downloadAll()">下载全部图片</el-dropdown-item>
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
        <img id="close-btn" @click="onClose" src="/icon/btn_close_n.png" alt="close" class="icon" />
      </div>
      <div class="scale">
        <div class="icon-container">
          <img
            id="global-btn"
            @click="resetViewBox"
            src="/icon/btn_global_n.png"
            class="icon"
            alt="global"
          />
          <span class="icon-tooltip">查看全部</span>
        </div>
        <div class="icon-container">
          <img id="in-btn" @click="zoomIn" src="/icon/btn_in_n.png" class="icon" alt="zoom in" />
          <span class="icon-tooltip">放大脑图</span>
        </div>
        <div class="icon-container">
          <img id="out-btn" @click="zoomOut" src="/icon/btn_out_n.png" class="icon" alt="zoom out" />
          <span class="icon-tooltip">缩小脑图</span>
        </div>
      </div>
      <div class="edit">
        <div class="icon-container">
          <img
            :id="undoStack.isEmpty()?'disabled':'undo-btn'"
            @click="onUndo"
            :src="undoStack.isEmpty()?'/icon/btn_undo_d.png':'/icon/btn_undo_n.png'"
            alt="undo"
            class="icon"
          />
          <span class="icon-tooltip">撤销</span>
        </div>
        <div class="icon-container">
          <img
            :id="redoStack.isEmpty()?'disabled':'redo-btn'"
            @click="onRedo"
            :src="redoStack.isEmpty()?'/icon/btn_redo_d.png':'/icon/btn_redo_n.png'"
            alt="redo"
            class="icon"
            :class="redoStack.isEmpty()?'disabled':''"
          />
          <span class="icon-tooltip">重做</span>
        </div>
        <div class="icon-container">
          <img
            :id="currentNodeId===-1?'disabled':'clear-btn'"
            @click="onDelete"
            :src="currentNodeId===-1?'/icon/btn_clear_d.png':'/icon/btn_clear_n.png'"
            alt="delete"
            class="icon"
            :class="currentNodeId===-1?'disabled':''"
          />
          <span class="icon-tooltip">删除</span>
        </div>
      </div>
      <div class="select" v-show="isSelectingExpand">
        <div class="desc">
          <p>
            <span>{{leftText}}</span>
            <span v-if="rightText!=''">&harr;</span>
            <span>{{rightText}}</span>
          </p>
          <img src="/icon/btn_close_n.png" alt="cancel" class="icon" @click="onCancelSelect" />
        </div>
        <div
          class="img-container"
          v-loading="loadingExpand"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(43, 42, 47, 0.8)"
        >
          <img
            v-for="(item, index) in expandChoices"
            :key="index"
            :data-index="index"
            :src="item.image"
            @click="onSelectExpand"
          />
        </div>
      </div>
    </div>

    <div id="right-menu">
      <div class="menu-item" @click="onClickNode">智能拓展</div>
      <div class="menu-item-separator"></div>
      <div class="menu-item" @click="downloadSingle">下载图片</div>
      <div class="menu-item-separator"></div>
      <div class="menu-item" @click="onDelete">删除图片</div>
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
      expandChoices: [
        {
          src: "/test.png",
        },
        {
          src: "/test2.png",
        },
        {
          src: "/test2.png",
        },
        {
          src: "/test.png",
        },
        {
          src: "/test2.png",
        },
        {
          src: "/test2.png",
        },
        {
          src: "/test.png",
        },
        {
          src: "/test2.png",
        },
        {
          src: "/test.png",
        },
      ],
      startChoices: [
        {
          src: "/test.png",
        },
        {
          src: "/test2.png",
        },
        {
          src: "/test.png",
        },
        {
          src: "/test2.png",
        },
        {
          src: "/test.png",
        },
        {
          src: "/test2.png",
        },
        {
          src: "/test.png",
        },
        {
          src: "/test2.png",
        },
        {
          src: "/test.png",
        },
        {
          src: "/test2.png",
        },
      ],
      curves: [
        {
          x: 0,
          y: -200,
        },
        {
          x: 0,
          y: -200,
        },
        {
          x: 0,
          y: -200,
        },
        {
          x: 0,
          y: -200,
        },
        {
          x: 0,
          y: -200,
        },
        {
          x: 0,
          y: -200,
        },
      ],
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
    };
  },
  methods: {
    addText: function () {
      console.log("添加文本");
    },
    addMainImg: function () {
      console.log("添加主图");
      console.log(this.nodes);
      if (this.nodes.length > 0) {
        console.log(this.nodes);
        this.$confirm("此操作会删除全部节点，是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.loadStartChoices();
            this.hasSelectRoot = false;
            this.connections = [];
            this.nodes = [];
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
      } else {
        this.loadStartChoices();
        this.hasSelectRoot = false;
      }
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
      console.log(event);
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
      }
      if (event.srcElement._prevClass === "mindmap-svg") {
        this.connections = [];
        this.nodes = this.nodes.filter((item) => !item.isButtonNode);
        this.initialConnections();
        this.currentNodeId = -1;
      }
    },
    removeBtnNodes(){
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
          this.connections = [];
          this.nodes = [];
          this.undoStack.clear();
          this.redoStack.clear();
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
      setTimeout(()=>{
        this.resetViewBox2()
      },600)
      
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
          this.$refs.size1.src = "/icon/btn_size1_n_selected.png";
          this.$refs.size2.src = "/icon/btn_size2_n.png";
          this.$refs.size3.src = "/icon/btn_size3_n.png";
          this.$refs.size4.src = "/icon/btn_size4_n.png";
          break;
        }
        case "4:3": {
          // this.width = (this.height * 4) / 3;
          this.$refs.size1.src = "/icon/btn_size1_n.png";
          this.$refs.size2.src = "/icon/btn_size2_n_selected.png";
          this.$refs.size3.src = "/icon/btn_size3_n.png";
          this.$refs.size4.src = "/icon/btn_size4_n.png";
          break;
        }
        case "16:9": {
          // this.width = (this.height * 16) / 9;
          this.$refs.size1.src = "/icon/btn_size1_n.png";
          this.$refs.size2.src = "/icon/btn_size2_n.png";
          this.$refs.size3.src = "/icon/btn_size3_n_selected.png";
          this.$refs.size4.src = "/icon/btn_size4_n.png";
          break;
        }
        case "2:1": {
          // this.width = this.height * 2;
          this.$refs.size1.src = "/icon/btn_size1_n.png";
          this.$refs.size2.src = "/icon/btn_size2_n.png";
          this.$refs.size3.src = "/icon/btn_size3_n.png";
          this.$refs.size4.src = "/icon/btn_size4_n_selected.png";
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
            this.hasSelectRoot = false;
            // 删除操作入栈
            // this.undoStack.push(this.nodes.slice());
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
      this.isSelectingExpand = true;
      // console.log(this.nodes.filter(item=>(item.id === this.currentNodeId || !item.isButtonNode)))

      this.connections = [];
      this.nodes = this.nodes.filter(
        (item) => item.id === this.currentNodeId || !item.isButtonNode
      );
      this.initialConnections();

      // console.log(d3.select(""))

      let g = d3.select("#mindmap-connections-container");
      // console.log(g);
      let dx = 10,
        dy = 100,
        x1 = document.body.clientWidth / 2,
        y1 = document.body.clientHeight / 2,
        x2 = x1 + 299,
        y2 = y1 + 90;
      let path = d3.path();
      let cpx1 = x1 - dx;
      let cpy1 = y1 + dy;
      let cpx2 = x2 + dx;
      let cpy2 = y2 - dy;
      path.moveTo(x1, y1);
      path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2);

      g.append("path")
        .attr("d", path.toString())
        .style("fill", "none")
        .style("stroke", "red")
        .style("stroke-width", "1");
      // console.log(g);
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
          ? currentButtonNode.text.substring(2, 4)
          : currentButtonNode.text.substring(0, 2);
      if (currentButtonNode.text === "相似图片") {
        pathText = "相似";
      }
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
      this.connections = [];
      this.addNode(node);
      console.log(this.nodes);
      this.nodes = this.nodes.filter((item) => !item.isButtonNode);
      this.initialConnections();
      this.currentNodeId = -1;
      setTimeout(()=>{
        this.moveNodeToCenter(node.id)
      }, 100)
    },
    onCancelSelect() {
      this.isSelectingExpand = false;
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
          this.moveNodeToCenter(this.currentNodeId);
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
      let currentNode = document.getElementById(nodeId);
      let rect = currentNode.getBoundingClientRect();
      let x = rect.x;
      let y = rect.y;
      // console.log(rect);
      let svg = document.getElementsByClassName("mindmap-svg")[0];
      let mousedown = document.createEvent("MouseEvents");
      // let x = currentNodeData.fx;
      // let y = currentNodeData.fy;
      // console.log(x,y)
      mousedown.initMouseEvent(
        "mousedown",
        true,
        true,
        window,
        0,
        x,
        y,
        x,
        y,
        false,
        false,
        false,
        false,
        0,
        null
      );
      svg.dispatchEvent(mousedown);

      let finalX = document.body.clientWidth / 2 - rect.width / 2;
      let finalY = document.body.clientHeight / 2 - rect.height / 2;
      // finalX *= 1.5;
      // finalY *= 1.5;
      // x*=1.5;
      // y*=1.5;
      const disX = finalX - x;
      const disY = finalY - y;
      let _x = x;
      let _y = y;
      // console.log(finalX, finalY);
      let interval = setInterval(function () {
        // console.log(d3.event)
        let mousemove = document.createEvent("MouseEvents");
        mousemove.initMouseEvent(
          "mousemove",
          true,
          true,
          window,
          0,
          _x,
          _y,
          _x,
          _y,
          false,
          false,
          false,
          false,
          0,
          null
        );
        _x += disX / 20;
        _y += disY / 20;
        svg.dispatchEvent(mousemove);
        // console.log(_x, _y);
        // svg.dispatchEvent(mousemove);
        if (Math.abs(finalX - _x) < 3) {
          clearInterval(interval);
          let mouseup = document.createEvent("MouseEvents");
          mouseup.initMouseEvent(
            "mouseup",
            true,
            true,
            window,
            0,
            finalX,
            finalY,
            finalX,
            finalY,
            false,
            false,
            false,
            false,
            0,
            null
          );
          svg.dispatchEvent(mouseup);

          // setTimeout(function () {
          //   if (svg.className.indexOf("btn_ok") > -1) {
          //     console.log(svg.className);
          //     document.getElementById("verify").click();
          //   }
          // }, 1000);
        }
      }, 5);
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
    },
    onRefresh() {
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
      console.log(pathLabelId);
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
      this.loadingStart = true;
      // eslint-disable-next-line no-unused-vars
      var reqData = {
        number: 10,
        size: "small",
        ifDlatents: true,
      };
      this.$ajax
        .get("/json/random.json")
        // .post("http://10.110.146.100:11354/apicore/art/style-gan-random/1.0.0",reqData)
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
      };

      if (reqData.style == "similarity") reqData.number = reqData.number * 2;

      this.$ajax
        .get("/json/" + expandTypeMap[expandType] + ".json")
        // .post("http://10.110.146.100:11354/apicore/art/style-gan-withtag/1.0.0",reqData)
        .then((res) => {
          this.expandChoices = res.data.result;
          for (let i = 0; i < this.expandChoices.length; i++) {
            this.expandChoices[i].image =
              "data:image/png;base64," + this.expandChoices[i].image;
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
.select-root-wrapper{
  position: absolute;
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
}
.select-root-father{
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
  font-size: 39px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.69);
  line-height: 55px;
}
.select-root .desc .sub {
  height: 28px;
  font-size: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 28px;
}
.select-root .refresh-button {
  position: absolute;
  right: 6%;
  font-size: 17px;
  color: #ffffff;
  opacity: 0.7;
  /* margin-right: 20px; */
  padding: 0;
  display: flex;
  align-items: center;
  /* margin: 10px 20px 10px 20px; */
}
.select-root .refresh-button:hover {
  position: absolute;
  right: 6%;
  font-size: 17px;
  /* color: #ffffff; */
  /* opacity: 0.7; */
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
  /* min-height: 200px; */
  margin-top: 30px;
}
.select-root .img-container .img-box{
  width: 17.6%;
  position:relative;
  transition: transform 0.5s;
}
.select-root .img-container .img-box:hover {
  position: relative;
  z-index: 10;
  transform: scale(1.32);
}
.select-root .img-container .img-box::before{
  content: "";
  display: inline-block;
  padding-bottom: 50%;
  width: 0.01px;    /*必须要有数值，否则无法把高度撑起来*/
}
.select-root .img-container img {
  /* width: 17.6%;
  transition: transform 0.5s; */
  position:absolute;
  top:0;
  bottom:0;
  left:0;
  right:0;
  width:100%;
  margin:auto;
  /* height: 300px; */
  /* margin: 2px; */
  /* padding: 5px; */
}
.select-root .img-container .loading-start {
  position: absolute;
  z-index: 2000;
  background-color: rgba(43, 42, 47, 0);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: opacity .3s;
}
.select-root .img-container .loading-start .gif-container {
  top: 50%;
  margin-top: -34px;
  width: 100%;
  text-align: center;
  position: absolute;
}
.select-root .img-container .loading-start .gif-bg {
  width: 68px;
  height: 68px;
}
.select-root .img-container .loading-start .gif {
  width: 60px;
  height: 60px;
  margin-left: -64px;
  margin-top: -4px;
}
img[src=""], img:not([src]){
  opacity: 0;
}

/* .select-root .img-container img:active {
  box-shadow: inset 0 0 1000px rgba(252, 1, 1, 0.5);
} */
.select-root-container .radio-group {
  margin: 8% 0 0 6%;
}
.select-root-container .radio-group .el-radio__label {
  font-size: 18px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 25px;
  margin-left: 4px;
}
.select-root-container
  .radio-group
  .el-radio__input.is-checked
  + .el-radio__label {
  color: #7bbbff;
  opacity: 0.5;
}
.select-root-container .radio-group img {
  margin-right: 4px;
  line-height: 25px;
}
.select-root-container .el-radio__input {
  display: none;
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
  color: rgba(255, 255, 255, 0.74);
  line-height: 17px;
}
.menu-container {
  position: fixed;
  top: 1.4%;
  right: 2.6%;
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
  content: url("/icon/btn_close_h.png");
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
  content: url("/icon/btn_global_h.png");
}
.scale #in-btn:hover {
  content: url("/icon/btn_in_h.png");
}
.scale #out-btn:hover {
  content: url("/icon/btn_out_h.png");
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
  content: url("/icon/btn_undo_h.png");
}
.edit .icon #disabled:hover {
  display: block;
  margin-top: 5px;
  padding: 11px;
  cursor: not-allowed;
  /* margin: 5px; */
}
.edit #redo-btn:hover {
  content: url("/icon/btn_redo_h.png");
}
.edit #clear-btn:hover {
  content: url("/icon/btn_clear_h.png");
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
  margin: 10px;
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
  margin: 10px;
  cursor: pointer;
}
.select .img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  /* position: absolute; */
  margin: 3px;
  margin-bottom: 10px;
  /* transition: transform 10s; */
  /* bottom: 0; */
}
.select .img-container img {
  width: 10.5%;
  /* height: 103px; */
  margin: 4px;
  /* transition: transform 10s; */
  /* padding: 5px; */
}
.select .img-container img:hover {
  width: 10.5%;
  /* height: 103px; */
  /* margin: 3px; */
  /* border: 2px solid rgba(255, 255, 255, 0.5); */
  outline: 2px solid rgba(255, 255, 255, 0.5);
  /* padding: 5px; */
}
.select .img-container img:active {
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
  background: #3F3E46;
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
.menu-item:hover {
  border-radius: 4px;
  background: #595860;
}
.menu-item-separator {
  border-top: 1px #525158 solid;
  height: 1px;
}
</style>
