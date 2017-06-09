import React from 'react';
import h from '../helpers';
import Catalyst from 'react-catalyst';
import Rebase from 're-base';
import firebase from 'firebase/app';
import database from 'firebase/database';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';

import Order from './Order';
import Inventory from './Inventory';
import Headers from './Headers';
import Fish from './Fish';

var app = firebase.initializeApp({
  apiKey: "AIzaSyBPypzfEqozIxQBgcdfAgV0rD2T2QOq4tc",
  authDomain: " catch-of-day-1a9a8.firebaseapp.com",
  databaseURL: 'https://catch-of-day-1a9a8.firebaseio.com/',
  storageBucket: "gs://catch-of-day-1a9a8.appspot.com/",
  messagingSenderId: '44810916212'
});

var base = Rebase.createClass(app.database());

@autobind
class App extends React.Component {

  constructor() {
    super();
    this.state = {
      fishes: {},
      order: {}
    }
  }
  
  componentDidMount() {
    base.syncState(this.props.routeParams.storeId + '/fishes', {
      context: this,
      state: 'fishes'
    });
    var loadStorageRef = localStorage.getItem('order' + this
      .props.params.storeId)

    if (loadStorageRef) {
      this.setState({
        order: JSON.parse(loadStorageRef)
      })
    }
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem('order' + this.props.params.storeId, JSON.stringify(nextState.order));
  }

  addToOrder(key) {
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({ order: this.state.order });
  }

  removeFromOrder(key) {
    delete (this.state.order[key]);
    this.setState({ order: this.state.order });
  }

  addFish(fish) {
    var timeStamp = new Date().getTime();
    this.state.fishes["fish-" + timeStamp] = fish;
    //use this.setState({ this.state); check what is happing
    this.setState({ fishes: this.state.fishes });
  }

  removeFish(key) {
    if (confirm('Are you sure you want to delete it?')) {
      this.state.fishes[key] = null;
      this.setState({ fishes: this.state.fishes });
    }
  }

  loadSamples() {
    this.setState({
      fishes: require("../sample-fishes")
    });
  }

  renderFish(key) {
    return (
      <Fish
        key={key}
        index={key}
        details={this.state.fishes[key]}
        addToOrder={this.addToOrder}
      />
    );
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Headers tagline="fresh sea food market" />
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder} />
        <Inventory addFish={this.addFish}
          loadSamples={this.loadSamples} fishes={this.state.fishes}
          linkState={this.linkState.bind(this)} removeFish={this.removeFish} />
      </div>
    );
  }
}

reactMixin.onClass(App, Catalyst.LinkedStateMixin);

export default App;