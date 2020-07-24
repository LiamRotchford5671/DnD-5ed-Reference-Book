class Races extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: true,
      raceUrl: "",
      name: "",
      data: [],
    };
    this.buttonClickEvent = this.buttonClickEvent.bind(this);
  }

  //On click, toggles between nav and info section.
  //If state is set for info section, run asynchronous function to get and set api data.
  buttonClickEvent(name) {
    this.setState((state) => ({
      toggle: !state.toggle,
    }));

    if (this.state.toggle === true) {
      const raceInfoRequest = async () => {
        await this.setState({
          raceUrl: name,
        });
        const results = await doAPIrequest(`races/` + this.state.raceUrl + "/");
        console.log(results);

        this.setState({
          name: results.name,
          data: results.alignment,
        });
      };
      raceInfoRequest();
    } else {
      //Clear previous info.
      this.setState({
        name: "",
        data: [],
      });
    }
  }

  //Render elements to DOM.
  render() {
    if (this.state.toggle) {
      return this.renderRaceNav();
    } else if (!this.state.toggle) {
      return this.renderRaceInfo();
    }
  }

  //Structure for rendered DOM elements.
  renderRaceNav() {
    return (
      <div id="race-grid" className="row">
        {this.props.racesArray.map((current, i) => (
          <div className="col-4 col-md-4 col-lg-1 col-spacing" key={i}>
            <button
              className={"race-btns " + `${current}` + "-icon"}
              onClick={() => this.buttonClickEvent(current)}
            ></button>
            {current.charAt(0).toUpperCase() + current.slice(1)}
          </div>
        ))}
      </div>
    );
  }

  renderRaceInfo() {
    return (
      <div>
        <div>
          <h4>{this.state.name}</h4>
          <img
            src={"./images/Race-Images/" + `${this.state.raceUrl}` + ".png"}
            alt={this.state.raceUrl}
          />
          <p>{this.state.data}</p>
        </div>
        <button onClick={this.buttonClickEvent}>Back to grid</button>
      </div>
    );
  }
}
