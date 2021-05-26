<template>
  <div class="edit-mindmap-page">
    <div class="menu-container">
      <el-dropdown class="menu">
        <span class="el-dropdown-link">
          <img src="/icon/btn_menu_n@2x.png" />
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
      :nodes="globalState.nodes"
      :connections="globalState.connections"
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
          :id="globalState.undoStack.isEmpty() ? 'disabled' : 'undo-btn'"
          @click="onUndo"
          :src="
            globalState.undoStack.isEmpty()
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
          :id="globalState.redoStack.isEmpty() ? 'disabled' : 'redo-btn'"
          @click="onRedo"
          :src="
            globalState.redoStack.isEmpty()
              ? '/icon/btn_redo_d@2x.png'
              : '/icon/btn_redo_n@2x.png'
          "
          alt="redo"
          class="icon"
          :class="globalState.redoStack.isEmpty() ? 'disabled' : ''"
        />
        <span class="icon-tooltip">重做</span>
      </div>
      <div class="icon-container">
        <img
          :id="globalState.currentNodeId === -1 ? 'disabled' : 'clear-btn'"
          @click="onDelete"
          :src="
            globalState.currentNodeId === -1
              ? '/icon/btn_clear_d@2x.png'
              : '/icon/btn_clear_n@2x.png'
          "
          alt="delete"
          class="icon"
          :class="globalState.currentNodeId === -1 ? 'disabled' : ''"
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
    <div id="right-menu">
      <div class="menu-item first" @click="onClickNode">智能拓展</div>
      <div class="menu-item-separator"></div>
      <div class="menu-item mid" @click="globalState.showPreviewPage = true">
        预览并下载
      </div>
      <div class="menu-item-separator"></div>
      <div class="menu-item last" @click="onDelete">删除图片</div>
    </div>
  </div>
</template>

<script>
import globalState from "../../store/global";

import * as d3 from "d3";
import { getViewBox } from "./vue-mindmap/utils/dimensions";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { dateFormat } from "../../utils/utils";

export default {
  name: "EditMindmapPage",
  data() {
    return {
      globalState: globalState,
      expandType: "",
      isSelectingExpand: false,
      leftText: "",
      rightText: "",
      scale: 1,
      loadingExpand: true,
      expandChoices: [],
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
    // 点击空白处收起btn-node和拓展选择框
    onClickSvgBlank() {
      const event = d3.event;
      if (!event.srcElement.classList.contains("btn-node")) {
        // 收起拓展选择框
        this.isSelectingExpand = false;
        this.expandChoices = [];
      }
      if (event.srcElement._prevClass === "mindmap-svg") {
        // 收起btn-node
        this.removeBtnNodes()
      }
    },
    // 收起btn-node
    removeBtnNodes() {
      this.globalState.connections = [];
      this.globalState.nodes = this.globalState.nodes.filter(
        (item) => !item.isButtonNode
      );
      this.initialConnections();
      this.globalState.currentNodeId = -1;
    },
    onClose() {
      this.$confirm("此操作会删除全部节点，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // this.loadStartChoices();
          this.globalState.hasSelectRoot = false;
          this.isSelectingExpand = false;
          this.expandChoices = [];
          // Object.assign(this.$data, this.$options.data())
          this.globalState.connections = [];
          this.globalState.nodes = [];
          this.globalState.undoStack.clear();
          this.globalState.redoStack.clear();
          Object.assign(this.$data, this.$options.data());
          localStorage.removeItem("transform");
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch((e) => {
          console.log(e);
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
        // trick, reset一次会闪烁，不知原因
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
      // 模拟鼠标事件进行放大
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
      // 模拟鼠标事件进行放大
      let wheelEvent = new WheelEvent("wheel", {
        deltaY: 250,
        clientX: document.body.clientWidth / 2,
        clientY: document.body.clientHeight / 2,
      });
      document
        .getElementsByClassName("mindmap-svg")[0]
        .dispatchEvent(wheelEvent);
    },
    onUndo() {
      if (!this.globalState.undoStack.isEmpty()) {
        // 重做操作入栈
        this.globalState.redoStack.push(this.globalState.nodes.slice());
        // 撤销操作，恢复上一操作前的状态
        this.globalState.connections = [];
        this.globalState.nodes = this.globalState.undoStack.pop();
        this.initialConnections();
      }
    },
    onRedo() {
      if (!this.globalState.redoStack.isEmpty()) {
        // 撤销操作入栈
        this.globalState.undoStack.push(this.globalState.nodes.slice());
        // 重做操作，恢复上一操作前的状态
        this.globalState.connections = [];
        this.globalState.nodes = this.globalState.redoStack.pop();
        this.initialConnections();
      }
    },
    // 删除当前节点及其子节点
    onDelete() {
      if (this.globalState.currentNodeId === this.globalState.nodes[0].id) {// 如果当前节点是根节点
        this.$confirm("此操作会删除全部节点，是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            // 收起拓展选择框
            this.isSelectingExpand = false;
            this.expandChoices = [];
            this.globalState.hasSelectRoot = false;
            // 删除操作入栈
            this.globalState.undoStack.push(this.globalState.nodes.slice());
            this.globalState.undoStack.clear();
            this.globalState.redoStack.clear();
            this.recursionDelete(this.globalState.currentNodeId);
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
      } else if (this.globalState.currentNodeId !== -1) {// 如果是非根节点且有节点被选中
        this.globalState.hasSelectRoot = true;
        // 删除操作入栈
        this.globalState.undoStack.push(this.globalState.nodes.slice());
        this.globalState.redoStack.clear();
        this.recursionDelete(this.globalState.currentNodeId);
      }
    },
    // 递归删除子节点
    recursionDelete(nodeId) {
      this.globalState.connections = [];
      this.globalState.nodes = this.globalState.nodes.filter(
        (item) => item.id !== nodeId
      );
      this.initialConnections();
      let subNodes = this.globalState.nodes.filter(
        (item) => item.parentId === nodeId
      );
      if (subNodes.length === 0) return;
      subNodes.forEach((node) => {
        this.recursionDelete(node.id);
      });
    },
    onExpand() {
      let currentNodeData = this.globalState.nodes.find(
        (item) => item.id === this.globalState.currentNodeId
      );
      let parentNodeData = this.globalState.nodes.find(
        (item) => item.id === currentNodeData.parentId
      );
      this.loadExpandChoices(currentNodeData.text, parentNodeData);
      this.leftText = currentNodeData.text.slice(0, 2);
      this.rightText =
        this.leftText !== "相似" ? currentNodeData.text.slice(2, 4) : "";
      this.isSelectingExpand = true;

      this.globalState.connections = [];
      this.globalState.nodes = this.globalState.nodes.filter(
        (item) =>
          item.id === this.globalState.currentNodeId || !item.isButtonNode
      );
      this.initialConnections();
    },
    onSelectExpand(event) {
      this.isSelectingExpand = false;

      let currentButtonNode = this.globalState.nodes.find(
        (item) => this.globalState.currentNodeId === item.id
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
      // 获取被点击的拓展图片在globalState.nodes中的数据
      let expandItem = this.expandChoices.find(
        (item) => item.image === event.target.src
      );

      let randomDis = Math.random() * Math.random() * 150;
      let node = {
        id: this.globalState.nodes[this.globalState.nodes.length - 1].id + 1,
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
      this.globalState.connections = [];
      this.globalState.addNode(node);
      this.globalState.nodes = this.globalState.nodes.filter(
        (item) => !item.isButtonNode
      );
      this.initialConnections();
      this.globalState.currentNodeId = -1;
      setTimeout(() => {
        this.moveNodeToCenter(node.id);
      }, 200);
      // 测试数据点，加入拓展路径
      this.globalState.curExtendItem.index = parseInt(
        event.srcElement.dataset["index"]
      );
      const item = {
        style: this.globalState.curExtendItem.style,
        index: this.globalState.curExtendItem.index,
      };
      this.globalState.testData.extend.push(item);
      this.globalState.testExtendPath.push(node.id);
    },
    onCancelSelect() {
      this.isSelectingExpand = false;
      this.expandChoices = [];
    },
    onClickNode(event) {
      const styleList = [
        "柔和尖锐",
        "冷色暖色",
        "淡雅多彩",
        "相似图片",
        "简单复杂",
        "模糊清晰",
      ];
      // 记录上一个被点击的节点
      let lastNodeId = this.globalState.currentNodeId;
      if (event.srcElement.innerText === "智能拓展") {
        lastNodeId = this.globalState.lastNodeId;
        event = this.event;
        if (event.target.nodeName !== "foreignObject") {
          return;
        }
        // if(event.target)
      } else {
        let imgDiv = event.target.getElementsByClassName("img-div")[0];
        this.globalState.currentNodeId = parseInt(imgDiv.id);
      }
      // eslint-disable-next-line no-unused-vars
      let isButtonNode = this.globalState.nodes.find(
        (item) => item.id === this.globalState.currentNodeId
      ).isButtonNode;
      // 如果当前节点已被选中
      if (this.globalState.currentNodeId === lastNodeId) {
        this.globalState.currentNodeId = -1;
        this.isSelectingExpand = false;
        this.expandChoices = [];
        this.globalState.connections = [];
        this.globalState.nodes = this.globalState.nodes.filter(
          (item) => !item.isButtonNode
        );
        this.initialConnections();
      } else {
        // 如果当前节点没有被选中
        if (lastNodeId !== -1) {
          if (!isButtonNode) {
            this.globalState.connections = [];
            this.globalState.nodes = this.globalState.nodes.filter(
              (item) => !item.isButtonNode
            );
            this.initialConnections();
          }
        }
        if (isButtonNode) {
          this.onExpand();
          this.globalState.curExtendItem.style = styleList.indexOf(
            this.globalState.nodes.find(
              (item) => item.id === this.globalState.currentNodeId
            ).text
          );
        } else {
          this.globalState.connections = [];
          this.addButtonNode(event);
          this.initialConnections();
          setTimeout(() => {
            this.moveNodeToCenter(this.globalState.currentNodeId);
          }, 10);
        }
      }
    },
    addButtonNode(event) {
      // 新增6个Button节点
      let nodeX = parseInt(event.target.attributes["x"].value);
      let nodeY = parseInt(event.target.attributes["y"].value);
      let nodeWidth = parseInt(event.target.attributes["width"].value);
      let nodeHeight = parseInt(event.target.attributes["height"].value);

      let currentNode = this.globalState.nodes.find(
        (item) => item.id === this.globalState.currentNodeId
      );
      nodeX = currentNode.fx;
      nodeY = currentNode.fy;

      this.globalState.undoStack.push(this.globalState.nodes.slice());
      this.globalState.redoStack.clear();
      this.globalState.nodes.push({
        id: this.globalState.nodes[this.globalState.nodes.length - 1].id + 1,
        parentId: this.globalState.currentNodeId,
        text: "柔和尖锐",
        url: "",
        width: 64,
        height: 64,
        imgSrc: "/icon/icon_rouhe@2x.png",
        fx: nodeX + (nodeWidth * 0.5 + 117),
        fy: nodeY - (nodeHeight * 0.25 + 79),
        isButtonNode: true,
        locationIndex: 0,
      });
      this.globalState.nodes.push({
        id: this.globalState.nodes[this.globalState.nodes.length - 1].id + 1,
        parentId: this.globalState.currentNodeId,
        text: "冷色暖色",
        url: "",
        width: 64,
        height: 64,
        imgSrc: "/icon/icon_lengse@2x.png",
        fx: nodeX + (nodeWidth * 0.5 + 117),
        fy: nodeY,
        isButtonNode: true,
        locationIndex: 1,
      });
      this.globalState.nodes.push({
        id: this.globalState.nodes[this.globalState.nodes.length - 1].id + 1,
        parentId: this.globalState.currentNodeId,
        text: "淡雅多彩",
        url: "",
        width: 64,
        height: 64,
        imgSrc: "/icon/icon_danya@2x.png",
        fx: nodeX + (nodeWidth * 0.5 + 117),
        fy: nodeY + (nodeHeight * 0.25 + 79),
        isButtonNode: true,
        locationIndex: 2,
      });
      this.globalState.nodes.push({
        id: this.globalState.nodes[this.globalState.nodes.length - 1].id + 1,
        parentId: this.globalState.currentNodeId,
        text: "相似图片",
        url: "",
        width: 64,
        height: 64,
        imgSrc: "/icon/icon_xiangsi@2x.png",
        fx: nodeX - (nodeWidth * 0.5 + 117),
        fy: nodeY - (nodeHeight * 0.25 + 79),
        isButtonNode: true,
        locationIndex: 3,
      });
      this.globalState.nodes.push({
        id: this.globalState.nodes[this.globalState.nodes.length - 1].id + 1,
        parentId: this.globalState.currentNodeId,
        text: "简单复杂",
        url: "",
        width: 64,
        height: 64,
        imgSrc: "/icon/icon_jiandan@2x.png",
        fx: nodeX - (nodeWidth * 0.5 + 117),
        fy: nodeY,
        isButtonNode: true,
        locationIndex: 4,
      });
      this.globalState.nodes.push({
        id: this.globalState.nodes[this.globalState.nodes.length - 1].id + 1,
        parentId: this.globalState.currentNodeId,
        text: "模糊清晰",
        url: "",
        width: 64,
        height: 64,
        imgSrc: "/icon/icon_mohu@2x.png",
        fx: nodeX - (nodeWidth * 0.5 + 117),
        fy: nodeY + (nodeHeight * 0.25 + 79),
        isButtonNode: true,
        locationIndex: 5,
      });
    },
    // 移动整个脑图，把当前节点移到屏幕中央
    moveNodeToCenter(nodeId) {
      let ratio = this.getRatio();
      let currentNode = document.getElementById(nodeId);
      let rect = currentNode.getBoundingClientRect();
      let x = rect.left;
      let y = rect.top;
      let nodeWidth = rect.width;
      let nodeHeight = rect.height;
      // mac系统与windows系统对ratio接口的实现不同
      if (this.detectOS() != "Mac") {
        nodeWidth /= ratio;
        nodeHeight /= ratio;
      }
      let svg = document.getElementsByClassName("mindmap-svg")[0];

      let windowWidth = document.body.clientWidth;
      let windowHeight = document.body.clientHeight;

      let finalX = windowWidth / 2 - nodeWidth / 2;
      let finalY = windowHeight / 2 - nodeHeight / 2;

      finalX = Math.round(finalX);
      finalY = Math.round(finalY);
      x = Math.round(x);
      y = Math.round(y);

      // 模拟鼠标事件，整体移动脑图
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
    // 获取浏览器显示比例
    getRatio() {
      var ratio = 0;
      var screen = window.screen;
      var ua = navigator.userAgent.toLowerCase();
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
    // 检测系统
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
    // 根据nodes生成connections
    initialConnections() {
      for (let i in this.globalState.nodes) {
        if (this.globalState.nodes[i].parentId < 0) continue;

        this.globalState.connections.push({
          source: this.globalState.nodes[i].parentId,
          target: this.globalState.nodes[i].id,
          text: this.globalState.nodes[i].isButtonNode
            ? ""
            : this.globalState.nodes[i].text,
          pathText: this.globalState.nodes[i].isButtonNode
            ? ""
            : this.globalState.nodes[i].pathText,
          curve: {
            x: 10,
            y: 200,
          },
        });
      }
    },
    // 给所有node添加click事件
    addNodeClick() {
      let nodes = document.getElementsByTagName("foreignObject");
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].onclick = this.onClickNode;
        let imgDiv = nodes[i].getElementsByClassName("img-div")[0];
        let nodeId = parseInt(imgDiv.id);
        let node = this.globalState.nodes.find((item) => item.id === nodeId);
        let nodeWidth = this.globalState.width;
        let nodeHeight = this.globalState.height;
        if (node.isButtonNode) {
          nodeWidth = 64;
          nodeHeight = 64;

          // node div style
          nodes[i].children[0].style.width = nodeWidth + "px";
          nodes[i].children[0].style.height = nodeHeight + "px";
          nodes[i].children[0].style["border-radius"] = "32px";

          continue;
        }
        if (i === 0) {
          nodes[i].children[1].style.width = nodeWidth + "px";
          nodes[i].children[1].style.height = nodeHeight + "px";
          nodes[i].children[1].children[0].style.width = nodeWidth + "px";
          nodes[i].children[1].children[0].style.height = nodeHeight + "px";
        } else {
          nodes[i].children[0].style.width = nodeWidth + "px";
          nodes[i].children[0].style.height = nodeHeight + "px";
          nodes[i].children[0].children[0].style.width = nodeWidth + "px";
          nodes[i].children[0].children[0].style.height = nodeHeight + "px";
        }
      }
    },
    // 给所有连接线添加悬浮事件
    addConnectionHover() {
      let connections = document.getElementsByTagName("path");
      for (let i = 0; i < connections.length; i++) {
        connections[i].onmouseover = this.mouseoverPath;
        connections[i].onmouseout = this.mouseoutPath;
      }
    },
    // 连接线的悬浮事件
    mouseoverPath(event) {
      let pathId = event.target.id;
      let pathLabelId = pathId.substring(0, 4) + "Label" + pathId.substring(4);
      document.getElementById(pathLabelId).style.visibility = "visible";
    },
    // 连接线的悬浮离开事件
    mouseoutPath(event) {
      let pathId = event.target.id;
      let pathLabelId = pathId.substring(0, 4) + "Label" + pathId.substring(4);
      document.getElementById(pathLabelId).style.visibility = "hidden";
    },
    downloadAll() {
      let zip = new JSZip();

      let img = zip.folder("xiaohui-images");
      for (let i = 0; i < this.globalState.nodes.length; i++) {
        if (this.globalState.nodes[i].isButtonNode) continue;
        img.file(
          "xiaohui_" + dateFormat(new Date()) + "_" + i + ".png",
          this.globalState.nodes[i].imgSrc.slice(22),
          {
            base64: true,
          }
        );
      }

      zip.generateAsync({ type: "blob" }).then(function (content) {
        // see FileSaver.js
        saveAs(content, "xiaohui-images.zip");
      });
    },
    clearLocalStorage() {
      localStorage.removeItem("deltaY");
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
        // size: "small",
        size: "large",
        styleScale: 2,
        ifDlatents: true,
        ratio: '('+this.globalState.ratio+')',
      };

      if (reqData.style == "similarity") reqData.number = reqData.number * 2;

      this.$ajax
        // .get("/json/" + expandTypeMap[expandType] + ".json")
        .post(
          "http://10.110.146.100:11354/apicore/art/style-gan-withtag/1.0.0",
          reqData
        )
        // .post(
        //   "https://api.brain.lenovo.com/lenovo/ad/semantic-art-design/1.0?token=33c08eba-d207-48ca-921b-fae10b22bbac",
        //   reqData
        // )
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
  },
  mounted: function () {
    // 移动根节点到中心
    setTimeout(() => {
      this.moveNodeToCenter(this.globalState.nodes[0].id);
    }, 100);
    this.addNodeClick();
    this.addConnectionHover();
  },
  updated: function () {
    // 给新加的node节点添加点击事件,并设置宽高
    this.addNodeClick();
    this.addConnectionHover();
    if (this.globalState.currentNodeId >= 0) {
      let currentNode = document.getElementById(this.globalState.currentNodeId);
      if (!currentNode) {
        this.globalState.currentNodeId = -1;
      }
    }

    // 自定义右键菜单
    window.oncontextmenu = (event) => {
      this.globalState.lastNodeId = this.globalState.currentNodeId;
      let imgDiv = event.target.getElementsByClassName("img-div")[0];
      this.globalState.currentNodeId = parseInt(imgDiv.id);
      this.event = event;
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
  },
  destroyed: function () {
    // window.removeEventListener("beforeunload", this.clearLocalStorage);
  },
};
</script>

<style>
.mask2 {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.74);
  z-index: -1;
}
.menu-container {
  position: fixed;
  top: 1.4%;
  right: 2.6%;
}
.menu-container .menu .el-dropdown-link img:hover {
  content: url("/icon/btn_menu_h@2x.png");
}
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
  font-weight: 400;
  color: #2b2a2f;
  line-height: 20px;
}
.edit {
  position: fixed;
  left: 1.77%;
  bottom: 2%;
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
}
.edit #redo-btn:hover {
  content: url("/icon/btn_redo_h@2x.png");
}
.edit #clear-btn:hover {
  content: url("/icon/btn_clear_h@2x.png");
}
.select {
  position: fixed;
  bottom: 70%;
  left: 0;
  width: 100%;
  background: rgba(63, 62, 70, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(151, 151, 151, 0.49);
}
.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
}
.select .loading-start {
  position: absolute;
  width: 100%;
  text-align: center;
}
.select .loading-start .gif {
  width: 3.57%;
  height: 3.57%;
  margin-bottom: 0.24%;
  left: -1.78%;
  position: relative;
}
.select .loading-start .gif-bg {
  width: 4.05%;
  height: 4.05%;
  left: 2.02%;
  position: relative;
}
.select .desc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 37px;
  color: rgba(255, 255, 255, 0.8);
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
  margin: 3px;
  margin-bottom: 10px;
  min-height: 80px;
  align-items: center;
}
.select .img-container .expand-item {
  width: 10.5%;
  margin: 4px;
}
.select .img-container .expand-item:hover {
  width: 10.5%;
  outline: 2px solid rgba(255, 255, 255, 0.5);
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
}
</style>
