import React, { Component } from "react";
import "d3";
import * as d3Z from "d3-zoom";
import * as d3 from "d3-selection";
//import d3Scale from 'd3-scale'
import { geoMercator, geoPath } from "d3-geo";
import "./WorldMap.css";
import countries from "../resources/world-countries.json";

//
export default class WorldMap extends Component {
  constructor(props) {
    super(props);

    this.width = 1300; //document.body.clientWidth,
    this.height = 600; //document.body.clientHeight;
    this.circleRadius = 2;
    this.lstRadius = [7, this.circleRadius];
    this.lstColor = ["green", "white"];
    this.duration = parseInt(this.props.pulseDuration, 10); //500
    this.visibilityHours=parseInt(this.props.maxVisibilityHours,10);
    this.historicData=parseInt(this.props.historicData,10);
    this.lstShots = [];
    this.projection = geoMercator();
    this.path = geoPath().projection(this.projection);

    this.d3Zoom = d3Z.zoom();

    this.getCirclePos = d => {
      return "translate(" + this.projection([d.long, d.lat]) + ")";
    };
    this.svgObj = null;
    this.feature = null;
    this.circle = null;

    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }

  componentDidMount() {

    this.duration = parseInt(this.props.pulseDuration, 10); //500
    this.visibilityHours==parseInt(this.props.maxVisibilityHours,10);
    this.historicData=parseInt(this.props.historicData,10)


    for (var i = 0; i < this.props.data.length; i++) {
      this.lstShots.push(JSON.parse(JSON.stringify(this.props.data[i])));
    }
    this.svgObj = d3.select("#svgMap")
   //responsive SVG needs these 2 attributes and no width and height attr
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 1280 720")
   //class to make it responsive
   .classed("svg-content-responsive", true);

    this.feature = this.svgObj
      .selectAll("path.feature")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("class", "feature");

    this.projection
      .scale(this.width / 6.5)
      .translate([this.width / 2, this.height / 1.6]);

    this.feature.attr("d", this.path);

    const proj = this.projection;
    const feat = this.feature;
    const p = this.path;

    this.zoom = this.d3Zoom.on("zoom", function() {
      proj
        .translate([d3.event.transform.x, d3.event.transform.y])
        .scale(d3.event.transform.k);
      feat.attr("d", p);
    });

    this.svgObj.call(this.zoom);
    this.svgObj.call(
      this.zoom.transform,
      d3Z.zoomIdentity
        .translate(
          this.projection.translate()[0],
          this.projection.translate()[1]
        )
        .scale(this.projection.scale())
    );
  }

  componentDidUpdate() {
console.log(this.props.pulseDuration);
console.log("pulse value"+this.duration);
    this.duration = parseInt(this.props.pulseDuration, 10); //500
    this.visibilityHours==parseInt(this.props.maxVisibilityHours,10);
    this.historicData=parseInt(this.props.historicData,10)

    this.lstShots = [];

    for (var i = 0; i < this.props.data.length; i++) {
      this.lstShots.push(JSON.parse(JSON.stringify(this.props.data[i])));
    }

    this.svgObj.selectAll("circle").remove();
    this.circle = this.svgObj
      .selectAll("circle")
      .data(this.lstShots)
      .enter()
      .append("circle")
      .attr("r", this.circleRadius)
      .attr("fill", "white")
      //.attr("transform", this.getCirclePos)
      .attr("node", function(d) {
        return JSON.stringify(d);
      })
      .style("cursor", "pointer")
      .on("click", function(d) {
        var url =
          "https://www.google.com/maps?t=k&q=loc:" + d.lat + "+" + d.long;
        var win = window.open(url, "_blank");
        win.focus();
      });

    this.lstRadius.forEach(function(d, i) {
      this.svgObj
        .selectAll("circle")
        .filter(function(d) {
          return d.isNew;
        })
        .transition()
        .duration(this.duration)
        .delay(i * this.duration)
        .attr("r", d)
        .attr("fill", this.lstColor[i]);
    }, this);

    const proj = this.projection;
    const feat = this.feature;
    const p = this.path;
    const cir = this.circle;
    const gcp = this.getCirclePos;

    this.zoom = this.d3Zoom.on("zoom", function() {
      proj
        .translate([d3.event.transform.x, d3.event.transform.y])
        .scale(d3.event.transform.k);
      feat.attr("d", p);
      cir.attr("transform", gcp);
    });

    this.svgObj.call(this.zoom);
    this.svgObj.call(
      this.zoom.transform,
      d3Z.zoomIdentity
        .translate(
          this.projection.translate()[0],
          this.projection.translate()[1]
        )
        .scale(this.projection.scale())
    );
  }

  render() {
    return (
      <div className="svgMap svg-container">
        <h1>{this.props.duration}</h1>
        <svg id="svgMap" />
      </div>
    );
  }
}
