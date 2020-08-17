

var svg = d3.select("#svg_curve1").append("svg").attr("width", 600).attr("height", 420).append("g").attr("background","#fff");
var texts = svg.append("g");
var points = svg.append("g");
var lines = svg.append("g");
var curve = svg.append("g");

var drag = d3.behavior.drag().on("drag", dragmove);

function dragmove(d) {
    this.setAttribute("cx", d3.event.x);
    this.setAttribute("cy", d3.event.y);
    l1[0][0].setAttribute("x1", p1[0][0].getAttribute("cx"));
    l1[0][0].setAttribute("y1", p1[0][0].getAttribute("cy"));
    l1[0][0].setAttribute("x2", p2[0][0].getAttribute("cx"));
    l1[0][0].setAttribute("y2", p2[0][0].getAttribute("cy"));

    l2[0][0].setAttribute("x1", p2[0][0].getAttribute("cx"));
    l2[0][0].setAttribute("y1", p2[0][0].getAttribute("cy"));
    l2[0][0].setAttribute("x2", p3[0][0].getAttribute("cx"));
    l2[0][0].setAttribute("y2", p3[0][0].getAttribute("cy"));

    l3[0][0].setAttribute("x1", p3[0][0].getAttribute("cx"));
    l3[0][0].setAttribute("y1", p3[0][0].getAttribute("cy"));
    l3[0][0].setAttribute("x2", p4[0][0].getAttribute("cx"));
    l3[0][0].setAttribute("y2", p4[0][0].getAttribute("cy"));
    c[0][0].setAttribute("d", "M" + p1[0][0].getAttribute("cx") + " " + p1[0][0].getAttribute("cy") + "C"
            + p2[0][0].getAttribute("cx") + " " + p2[0][0].getAttribute("cy") + " "
            + p3[0][0].getAttribute("cx") + " " + p3[0][0].getAttribute("cy") + ","
            + p4[0][0].getAttribute("cx") + " " + p4[0][0].getAttribute("cy"));
    text[0][0].innerHTML = "M" + p1[0][0].getAttribute("cx") + " " + p1[0][0].getAttribute("cy") + "C"
    + p2[0][0].getAttribute("cx") + " " + p2[0][0].getAttribute("cy") + " "
    + p3[0][0].getAttribute("cx") + " " + p3[0][0].getAttribute("cy") + ","
    + p4[0][0].getAttribute("cx") + " " + p4[0][0].getAttribute("cy");

}
var p1 = points.append("circle").attr("cx", 100).attr("cy", 100).attr("fill", "black").attr("r", 6).call(drag);
var p2 = points.append("circle").attr("cx", 200).attr("cy", 200).attr("fill", "black").attr("r", 6).call(drag);
var p3 = points.append("circle").attr("cx", 300).attr("cy", 300).attr("fill", "black").attr("r", 6).call(drag);
var p4 = points.append("circle").attr("cx", 400).attr("cy", 400).attr("fill", "black").attr("r", 6).call(drag);

var l1 = lines.append("line").attr("x1", 100).attr("y1", 100).attr("x2", 200).attr("y2", 200)
        .attr("stroke", "red");
var l2 = lines.append("line").attr("x1", 200).attr("y1", 200).attr("x2", 300).attr("y2", 300)
        .attr("stroke", "red");
var l3 = lines.append("line").attr("x1", 300).attr("y1", 300).attr("x2", 400).attr("y2", 400)
        .attr("stroke", "red");

var c = curve.append("path").attr("d", "M" + p1[0][0].getAttribute("cx") + " " + p1[0][0].getAttribute("cy")
        + "C" + p2[0][0].getAttribute("cx") + " " + p2[0][0].getAttribute("cy") + " "
        + p3[0][0].getAttribute("cx") + " " + p3[0][0].getAttribute("cy") + "," + p4[0][0].getAttribute("cx")
        + " " + p4[0][0].getAttribute("cy")).attr("stroke", "red").attr("fill","none");
var text = texts.append("text").attr("x",200).attr("y",400).text("M" + p1[0][0].getAttribute("cx") + " " + p1[0][0].getAttribute("cy")
        + "C" + p2[0][0].getAttribute("cx") + " " + p2[0][0].getAttribute("cy") + " "
        + p3[0][0].getAttribute("cx") + " " + p3[0][0].getAttribute("cy") + "," + p4[0][0].getAttribute("cx")
        + " " + p4[0][0].getAttribute("cy"))