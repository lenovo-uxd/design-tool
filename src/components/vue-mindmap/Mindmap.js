import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  select,
  // zoom,
  // zoomIdentity
} from 'd3'

import {
  d3Connections,
  d3Nodes,
  d3Drag,
  d3PanZoom,
  onTick
} from './utils/d3'

// import { getDimensions, getViewBox } from './utils/dimensions'
// import subnodesToHTML from './utils/subnodesToHTML'
import nodeToHTML from './utils/nodeToHTML'

export default {
  props: {
    nodes: {
      type: Array,
      default: () => ([])
    },
    connections: {
      type: Array,
      default: () => ([])
    },
    editable: {
      type: Boolean,
      default: false
    },
    clickBlank: {
      type: Function,
      default() { }
    },
    removeBtnNodes:{
      type: Function,
      default() {}
    }
  },
  data() {
    return {
      simulation: null,
      nodesNum: this.nodes.length
    }
  },
  watch: {
    connections() {
      // 与updated函数一致
      // zoom().transform(select(this.$refs.mountPoint), zoomIdentity)
      this.renderMap()
      // console.log(this.connections)
    },
    nodes() {
      // 与updated函数一致
      // console.log(this.connections)
      // zoom().transform(select(this.$refs.mountPoint), zoomIdentity)
      this.renderMap()
    },
  },
  methods: {
    prepareNodes() {
      const render = (node) => {
        node.html = nodeToHTML(node)
        // node.nodesHTML = subnodesToHTML(node.nodes)

        // const dimensions = getDimensions(node.html, {}, 'mindmap-node')
        // console.log(dimensions)
        // node.width = dimensions.width
        // node.height = dimensions.height

        // const nodesDimensions = getDimensions(node.nodesHTML, {}, 'mindmap-subnodes-text')
        // node.nodesWidth = nodesDimensions.width
        // node.nodesHeight = nodesDimensions.height
      }
      // eslint-disable-next-line no-debugger
      this.nodes.forEach(node => render(node))
    },
    /**
     * Add new class to nodes, attach drag behevior,
     * and start simulation.
     */
    // prepareEditor(svg, conns, nodes, subnodes) {
    prepareEditor(svg, conns, nodes, pathLabels) {
      nodes
        // .attr('class', 'mindmap-node mindmap-node--editable')
        .attr('class', node => {
          if (node.isButtonNode)
            return "mindmap-node mindmap-node--editable btn-node"
          else
            return "mindmap-node mindmap-node--editable img-node"
        })
        .on('dbclick', (node) => {
          node.fx = null
          node.fy = null
        })

      nodes.call(d3Drag(this.simulation, svg, nodes, this.removeBtnNodes,this.nodes))

      // Tick the simulation 100 times
      for (let i = 0; i < 100; i += 1) {
        this.simulation.tick()
      }

      // setTimeout(() => {
      //   this.simulation
      //     .alphaTarget(0.5).on('tick', () => (
      //       onTick(conns, nodes, subnodes)
      //     ))
      // }, 200)
      setTimeout(() => {
        this.simulation
          .alphaTarget(0.5).on('tick', () => (
            onTick(conns, nodes, pathLabels)
          ))
      }, 200)
    },
    /**
     * Render mind map unsing D3
     */
    renderMap() {
      const svg = select(this.$refs.mountPoint)

      let transform = "";

      if (svg.selectAll('g').node() != null) {
        // console.log(svg.selectAll('g'))
        // console.log(svg.selectAll('g').attr("transform"))
        transform = svg.selectAll('g').attr("transform");
      }

      // Clear the SVG in case there's stuff already there.
      svg.selectAll('*').remove()

      // Add subnode group
      // svg.append('g').attr('id', 'mindmap-subnodes')
      this.prepareNodes()

      // Bind data to SVG elements and set all the properties to render them
      const connections = d3Connections(svg, this.connections)
      const { nodes } = d3Nodes(svg, this.nodes)

      var pathLabels = svg.append('g').selectAll(".pathLabel")
        .data(this.connections)
        .enter()
        .append('text')
        .style("pointer-events", "none")
        .attr("class", "pathLabel")
        .attr("id", (d, i) => ('pathLabel' + i))
        .attr("dx", d => {
          // 在d3对source和target的转换结束前，source和target只是节点id，而不是节点坐标
          if(d.source.x === undefined){
            return 0
          }
          const dis = Math.sqrt(Math.pow((d.target.x - d.source.x),2)+Math.pow((d.target.y - d.source.y),2)) 
          return Math.floor(dis*0.6)
        })
        .attr("dy", 20)
        .attr("font-size", 20)
        .attr("fill", "rgba(255,255,255,0.7)")
        .attr('text-anchor', "middle")


      pathLabels.append('textPath')
        .attr('xlink:href', function (d, i) { return '#path' + i })
        .style("pointer-events", "none")
        .text(function (d) { return d.pathText });


      // Bind nodes and connections to the simulation
      this.simulation
        .nodes(this.nodes)
        .force('link').links(this.connections)


      if (this.editable) {
        // this.prepareEditor(svg, connections, nodes, subnodes)
        this.prepareEditor(svg, connections, nodes, pathLabels)
      }



      // Tick the simulation 100 times
      for (let i = 0; i < 100; i += 1) {
        this.simulation.tick()
      }

      // onTick(connections, nodes, subnodes)
      onTick(connections, nodes, pathLabels)


      svg.selectAll('g').attr("transform", transform);
      // svg.attr('viewBox', getViewBox(nodes.data()))
      //   .call(d3PanZoom(svg))
      //   .on('dbClick.zoom', null)
      svg.call(d3PanZoom(svg))
        .on('dbClick.zoom', null)
        .on('click', this.clickBlank)
      // svg.selectAll('g').attr("transform", localStorage.getItem("transform"))
    },
  },
  mounted() {
    this.renderMap()
  },
  updated() {
    // this.simulation = forceSimulation()
    //   .force('link', forceLink().id(node => node.id))
    //   // .force('link', forceLink())
    //   .force('charge', forceManyBody())
    //   .force('collide', forceCollide().radius(100))
    // zoom().transform(select(this.$refs.mountPoint), zoomIdentity)
    // eslint-disable-next-line no-debugger
    // debugger;
    this.renderMap()
  },
  created() {
    // Create force simulation to position nodes that have
    // no coordinate, and add it to the component state
    this.simulation = forceSimulation()
      // .force('link', forceLink().id(node => node.id))
      .force('link', forceLink().id((node) => (node.id)))
      .force('charge', forceManyBody())
      .force('collide', forceCollide().radius(100))
  },
  render() {
    return (
      <div id="mindmap-container">
        <svg class='mindmap-svg' ref='mountPoint' />
      </div>
    )
  }
}
