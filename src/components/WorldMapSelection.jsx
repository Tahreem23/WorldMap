import React, { Component } from "react";
import WorldMap from "./WorldMap";
//I am going to stateu[p] code
class WorldMapSelection extends Component {
  constructor(props) {
    super(props);  //  reloadMap: false
  }



  render() {
//console.log(this.state.settings)
    return (
      <React.Fragment>

        <div id="map">
          <WorldMap
            pulseDuration={this.props.pulseDuration}
            maxVisibilityHours={this.props.MaxVisibilityHours}
            historicData={this.props.historicData}
            data={this.props.shots}
          />
        </div>


      </React.Fragment>
    );
  }
}

export default WorldMapSelection;
