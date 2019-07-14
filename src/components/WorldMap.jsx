import React, { Component } from 'react';
import { select as d3Select, d3Event } from 'd3-selection';
import { scaleLinear } from 'd3';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { geoMercator, geoPath } from 'd3-geo';
//import { behavior } from 'd3-zoom';
//
//
import './WorldMap.css';
import countries from '../resources/world-countries.json';

import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';

//
export default class WorldMap extends Component {

  constructor(props) {
        super(props);
      
  }

  componentWillMount() {

     const socket = io('https://api.arccosgolf.com?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIwOTNkZGY4MDRiMGYxMWU0YTE1OWFmMDIyZGY1ZWU5MiIsImlhdCI6MTUzNDMzODg1NSwiZXhwIjoxNTM0MzgyMDU1LCJhdWQiOiJhcGkiLCJpc3MiOiJhcmNjb3MifQ.qWL1S4lFIxCWKWZrzGj2bCKa8Hk7byyFpZmdgIm7nAw', connectionOptions);

        socket.on('shotTaken', function(msg){
            
            console.log(msg);
          
        });

        socket.on('invalidToken', function(msg){
          
        });

     const connectionOptions =  {
            "force new connection" : true,
            "reconnectionAttempts": "Infinity", //this should probably not be Infinity
            "timeout" : 10000, //before connect_error and connect_timeout are emitted.
            "transports" : ["websocket"],
            "path":'/worldShotMap/listen', //the path the server is accepting requests on,
         origin: 'http://localhost:3000'
        };
  }

  componentDidMount() {
      
      
    
//      const layer,
//        zoomScale,
//        setting
//        ;
//      
//      const vis.runShow = function(data, dom, w, h, asetting) {
//          
//          
//      }
      
      const projection = geoMercator();
      
      const path = geoPath()
        .projection(projection);
      
      const ctr = (d) => {
            return "translate(" + projection([d.longitude, d.latitude]) + ")";
        }
      
      const w = document.body.clientWidth, h = document.body.clientHeight;


      const fsvg = select(this.refs.svgMap);
      
      const data = countries;

      const feature = fsvg
            .selectAll("path.feature")
            .data(data.features)
            .enter().append("path")
            .attr("class", "feature")
        ;
      
      projection
            .scale(w/6.5)
            .translate([w / 2, h / 1.6])
        ;
      
      feature.attr("d", path);
      
      const needPaintCapital = [];
        
        needPaintCapital.push({type:"1", color:"yellow", "longitude":"67.0011", "latitude":"24.8607"});
        needPaintCapital.push({type:"1", color:"red", "longitude":"90.4113","latitude":"23.7055"});
        needPaintCapital.push({type:"2", color:"red", "longitude":"35.5134","latitude":"33.8872"});
        needPaintCapital.push({type:"1", color:"red", "longitude":"-119.4179","latitude":"36.7783"});
        needPaintCapital.push({type:"1", color:"red", "longitude":"-0.126236","latitude":"51.5002"});
        needPaintCapital.push({type:"1", color:"red", "longitude":"21.02","latitude":"52.26"});
        needPaintCapital.push({type:"2", color:"red", "longitude":"32.5713","latitude":"-25.9664"});
        needPaintCapital.push({type:"1", color:"red", "longitude":"23.7166","latitude":"37.9792"});
        needPaintCapital.push({type:"1", color:"red", "longitude":"13.4115","latitude":"52.5235"});
        needPaintCapital.push({type:"2", color:"red", "longitude":"74.0060","latitude":"40.7128"});
        needPaintCapital.push({type:"1", color:"red", "longitude":"47.9218","latitude":"15.8267"});
        needPaintCapital.push({type:"1", color:"red", "longitude":"151.2093","latitude":"-33.8688"});
        needPaintCapital.push({type:"1", color:"red", "longitude":"-51.9253","latitude":"-14.2350"});
      
     const circle = fsvg.selectAll("circle")
            .data(needPaintCapital)
            .enter()
            .append("circle")
            .attr("r", 3)
            .attr("fill", function(d){
            
                if(d.type == "1")
                    return "red";
                else return "yellow";
            
            })
            .attr("transform", ctr);
   }

   componentDidUpdate(){

       
   }

   render() {
       
      
       
        return (
            
            <svg ref="svgMap"></svg>
          
        );

    }
}