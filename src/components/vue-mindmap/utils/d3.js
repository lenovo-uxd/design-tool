import { drag, event, zoom, easeExpOut, easeLinear } from 'd3'
// import { getViewBox } from './dimensions'

/**
 * Bind data to a <TAG>, inside a G element, inside the given root element.
 * Root is a D3 selection, data is an object or array, tag is a string.
 */
// const bindData = (root, data, tag) => (
//   root.append('g')
//     .selectAll(tag)
//     .data(data)
//     .enter()
//     .append(tag)
// )

/**
 * Bind connections to PATH tags on the given SVG
 */
export const d3Connections = (svg, connections) => (
  // bindData(svg, connections, 'path')
  svg.append('g')
    .attr("id", "mindmap-connections-container")
    .selectAll('path')
    .data(connections)
    .enter()
    .append('path')
    .attr('class', 'mindmap-connection')
    .attr('id', (d, i) => ('path' + i))
)

/* eslint-disable no-param-reassign */
/**
 * Bind nodes to FOREIGNOBJECT tags on the given SVG,
 * and set dimensions and html.
 */
export const d3Nodes = (svg, nodes) => {
  const selection = svg.append('g')
    .selectAll('foreignObject')
    .data(nodes)
    .enter()

  const d3nodes = selection
    .append('foreignObject')
    // .attr('class', 'mindmap-node')
    .attr('width', node => {
      if (!node.isButtonNode)
        return (node.width + 6)
      else
        return node.width})
    .attr('height', node => {
      if (node.isButtonNode)
        return (node.height + 22)
      else if(node.parentId === -1)
        return (node.height + 30)
      else
        return node.height+6
    })
    .attr('class', node => {
      if (node.isButtonNode)
        return "mindmap-node btn-node"
      else
        return "mindmap-node img-node"
    })
    .html(node => node.html)

  // const d3subnodes = selection
  //   .append('foreignObject')
  //   .attr('class', 'mindmap-subnodes')
  //   .attr('width', node => node.nodesWidth + 4)
  //   .attr('height', node => node.nodesHeight)
  //   .html(node => node.nodesHTML)

  return {
    nodes: d3nodes,
    // subnodes: d3subnodes
  }
}

/**
 * Callback for forceSimulation tick event.
 */
// export const onTick = (conns, nodes, subnodes) => {
export const onTick = (conns, nodes, pathLabels) => {
  const d = conn => {
    let startX = conn.source.x;
    let startY = conn.source.y;
    let endX = conn.target.x;
    let endY = conn.target.y;
    // let dx = (conn.curve && conn.curve.x ? conn.curve.x : 0)
    // let dy = (conn.curve && conn.curve.y ? conn.curve.y : 0)
    let dx = (endX - startX) / 2;
    let dy = (endY - startY) / 2;
    let cpx1 = startX + dx;
    let cpy1 = startY - dy;
    let cpx2 = endX - dx;
    let cpy2 = endY + dy;

    return ('M' +
      startX +
      ',' +
      startY +
      'C' +
      cpx1 +
      ',' +
      cpy1 +
      ',' +
      cpx2 +
      ',' +
      cpy2 +
      ',' +
      endX +
      ',' +
      endY)
  }

  // Set the connections path.
  conns.attr('d', d)

  // Set nodes position.
  nodes
    .attr('x', node => node.x - (node.width / 2))
    .attr('y', node => node.y - (node.height / 2))

  pathLabels.attr('transform', function (d) {
    if (d.target.x < d.source.x) {
      let bbox = this.getBBox();
      let rx = bbox.x + bbox.width / 2;
      let ry = bbox.y + bbox.height / 2;
      return 'rotate(180 ' + rx + ' ' + ry + ')';
      // return 'rotate(180)';
    }
    else {
      return 'rotate(0)';
    }
  });
  // console.log(nodes)
  // nodes
  //   .attr('x', node => node.x)
  //   .attr('y', node => node.y)

  // nodes
  //   .attr('x', node => node.x + (node.width / 2))
  //   .attr('y', node => node.y + (node.height / 2))

  // Set subnodes groups color and position.
  // subnodes
  //   .attr('x', node => node.x + (node.width / 2))
  //   .attr('y', node => node.y - (node.nodesHeight / 2))
}

/*
 * Return drag behavior to use on d3.selection.call().
 */
// eslint-disable-next-line no-unused-vars
export const d3Drag = (simulation, svg, nodes, removeBtnNodes,nodesData) => {
  // eslint-disable-next-line no-unused-vars
  let flag = 0
  // let oldEvent=null
  // if(nodesData[nodesData.length-1].isButtonNode && event.type == 'drag'){
  //   console.log("remove")
  //   removeBtnNodes()
  // }
  // if(event != null){
  //   console.log(event.type)
  // }
  const dragStart = (node) => {
    if (!event.active) {
      simulation.alphaTarget(0.2).restart()
    }
    // console.log(event)
    // console.log("drag start")
    node.fx = node.x
    node.fy = node.y
    
  }

  const dragged = (node) => {
    // console.log(event)
    if(nodesData[nodesData.length-1].isButtonNode && flag==0){
      console.log("draging")
      flag = 1
      removeBtnNodes()
      return;
    }
    // node.fx = event.x
    // node.fy = event.y
    if(Math.abs(event.dx) <= 20 && Math.abs(event.dy) <= 20){
      node.fx += event.dx
      node.fy += event.dy
    }
  }

  const dragEnd = () => {
    if (!event.active) {
      simulation.alphaTarget(0)
    }
    // console.log(event) 
    // console.log("drag end")
    // svg.attr('viewBox', getViewBox(nodes.data()))
  }
  // svg.selectAll('.btn-node').remove();
  return drag()
    .on('start', dragStart)
    .on('drag', dragged)
    .on('end', dragEnd)
}

/* eslint-enable no-param-reassign */

/*
 * Return pan and zoom behavior to use on d3.selection.call().
 */
export const d3PanZoom = el => {

  return (
    zoom().scaleExtent([0.3, 5])
      .on('zoom', () => {
        // console.log(event)
        // console.log(event.transform)

        if (event.sourceEvent && event.sourceEvent.deltaY) {
          let deltaY = parseFloat(localStorage.getItem("deltaY"));
          deltaY += event.sourceEvent.deltaY
          localStorage.setItem("deltaY", deltaY)
        }
        if(event.sourceEvent && event.sourceEvent.type == "wheel"){
          return el.selectAll('svg > g').transition()
          .duration(500).ease(easeExpOut).attr('transform', event.transform)
        }
        
        return el.selectAll('svg > g').transition()
        .duration(300).ease(easeLinear).attr('transform', event.transform)
      })
  )
} 
