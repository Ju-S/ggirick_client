import React, { Component } from "react";

export default class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date()
    };
  }

  componentDidMount() {
    this.timerId = setInterval(() => {
      this.setState({
        time: new Date()
      });
    }, 1000);
  }

  componentWillMount() {
    clearInterval(this.timerId);
  }

  render() {
    return (
      <div className="clock !border-base-content/50">
        <div
          className="hour_hand !bg-base-content/90"
          style={{
            transform: `rotateZ(${this.state.time.getHours() * 30}deg)`
          }}
        />
        <div
          className="min_hand !bg-base-content/70"
          style={{
            transform: `rotateZ(${this.state.time.getMinutes() * 6}deg)`
          }}
        />
        <div
          className="sec_hand !bg-error"
          style={{
            transform: `rotateZ(${this.state.time.getSeconds() * 6}deg)`
          }}
        />
        <span className="twelve text-base-content">12</span>
        <span className="one text-base-content">1</span>
        <span className="two text-base-content">2</span>
        <span className="three text-base-content">3</span>
        <span className="four text-base-content">4</span>
        <span className="five text-base-content">5</span>
        <span className="six text-base-content">6</span>
        <span className="seven text-base-content">7</span>
        <span className="eight text-base-content">8</span>
        <span className="nine text-base-content">9</span>
        <span className="ten text-base-content">10</span>
        <span className="eleven text-base-content">11</span>
      </div>
    );
  }
}
