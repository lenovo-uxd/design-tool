import { Stack } from "../utils/utils";
// 简单store模式管理暂存数据 使各个组件共用一个数据模块
var globalState = {
  nodes: [],
  connections: [],
  width: 446,
  height: 223,
  ratio: "2:1",
  currentNodeId: -1,
  lastNodeId: -1,    
  hasSelectRoot: false,
  showExamplePage: false,
  showPreviewPage: false,
  testData: {
    name: "",
    start1: "",
    end1: "",
    style: [],
    color: [],
    next: 0,
    start2: "",
    end2: "",
    extend: [],
    download: 1,
  },
  testExtendPath:[],
  curExtendItem: {
    style: 0,
    index: 0,
  },
  undoStack: new Stack(),
  redoStack: new Stack(),
  addNode(node){
    node.width = this.width;
    node.height = this.height;
    this.undoStack.push(this.nodes.slice());
    this.redoStack.clear();
    this.nodes.push(node);
  }
}
export default globalState