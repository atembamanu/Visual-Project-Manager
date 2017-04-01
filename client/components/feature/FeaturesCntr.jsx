import React, { Component } from 'react';
import Feature from './Feature.jsx';

class FeaturesCntr extends Component {
  render() {
    const featureArr = this.props.featuresArray.map((feature, index) => {
      console.log('tite', feature.title);
      console.log('duration', feature.duration);
      return <Feature key={index} index={index} title={feature.title} deadline={feature.duration} timeUpdate={this.props.timeUpdate}/>
    });
    return (
      <div id="features-ctnr">
        {featureArr}
      </div>
    );
  }
}

export default FeaturesCntr;
