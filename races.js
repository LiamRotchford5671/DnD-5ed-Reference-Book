class Races extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: true,
      raceUrl: "",
      name: "",
      abilityOptions: [],
      age: "",
      alignment: "",
      languageDesc: "",
      languages: [],
      languageOptions: [],
      size: "",
      size_desc: "",
      speed: "",
      profs: [],
      profOptions: [],
      subraces: [],
      traits: [],
      trait_options: [],
    };
    this.buttonClickEvent = this.buttonClickEvent.bind(this);
    this.raceDataHandler = this.raceDataHandler.bind(this);
  }

  //On click, toggles between nav and info section.
  //If state is set for info section, run asynchronous function to get and set api data.
  buttonClickEvent(name) {
    this.setState((state) => ({
      toggle: !state.toggle,
    }));

    this.raceDataHandler(name);
  }

  raceDataHandler(name) {
    if (this.state.toggle === true) {
      const raceInfoRequest = async () => {
        await this.setState({
          raceUrl: name,
        });
        const results = await doAPIrequest(`races/` + this.state.raceUrl + "/");
        console.log(results);

        //Ability Bonuses

        // let abilityBonusNames = results.ability_bonuses.map(current => current.name);
        // let abilityBonuses = results.ability_bonuses.map(current => current.bonus);

        let abilityBonusNames = ["STR", "DEX", "CON", "CHA", "INT", "WIS"];
        let abilityBonuses = ["", "", "", "", "", ""];

        results.ability_bonuses.map((current) => {
          if (current.name === "STR") {
            abilityBonuses[0] = current.bonus;
          } else if (current.name === "DEX") {
            abilityBonuses[1] = current.bonus;
          } else if (current.name === "CON") {
            abilityBonuses[2] = current.bonus;
          } else if (current.name === "CHA") {
            abilityBonuses[3] = current.bonus;
          } else if (current.name === "INT") {
            abilityBonuses[4] = current.bonus;
          } else if (current.name === "WIS") {
            abilityBonuses[5] = current.bonus;
          }
        });

        var ctx = document.querySelector(".statsChart");
        var myBarChart = new Chart(ctx, {
          type: "horizontalBar",
          data: {
            labels: abilityBonusNames,
            datasets: [
              {
                data: abilityBonuses,
                backgroundColor: "rgba(255,46,46,0.8)",
              },
            ],
          },
          options: {
            legend: {
              display: false,
            },
            scales: {
              xAxes: [
                {
                  ticks: {
                    min: 0,
                    max: 4,
                  },
                },
              ],
            },
          },
        });

        if (results.ability_bonus_options) {
          let abilityOptions = (
            <div className="dropdown dropright">
              <h5>Ability Bonus Options</h5>
              <button
                type="button"
                className="btn btn-danger dropdown-toggle"
                data-toggle="dropdown"
              >
                Choose: {results.ability_bonus_options.choose}
              </button>
              <div className="dropdown-menu">
                {results.ability_bonus_options.from.map((current, i) => (
                  <button type="button" className="dropdown-item" key={i}>
                    {current.name}: {current.bonus}
                  </button>
                ))}
              </div>
            </div>
          );

          this.setState({
            abilityOptions: abilityOptions,
          });
        }

        //Language Bonuses
        if (results.language_options) {
          let languageOptions = (
            <div className="dropdown dropright">
              <button
                type="button"
                className="btn btn-danger dropdown-toggle"
                data-toggle="dropdown"
              >
                Choose 1:{" "}
              </button>
              <div className="dropdown-menu">
                {results.language_options.from.map((current, i) => (
                  <button type="button" className="dropdown-item" key={i}>
                    {current.name}
                  </button>
                ))}
              </div>
            </div>
          );

          this.setState({
            languageOptions: languageOptions,
          });
        }

        //Proficiencies
        if (results.starting_proficiencies != "") {
          let profs = (
            <div>
              <h5>Proficiencies</h5>
              {results.starting_proficiencies.map((current, i) => (
                <p key={i}>{current.name}</p>
              ))}
            </div>
          );
          if (results.starting_proficiency_options) {
            let profOptions = (
              <div className="dropdown dropright">
                <h5>Proficiency Options</h5>
                <button
                  type="button"
                  className="btn btn-danger dropdown-toggle"
                  data-toggle="dropdown"
                >
                  Choose 1:
                </button>
                <div className="dropdown-menu">
                  {results.starting_proficiency_options.from.map(
                    (current, i) => (
                      <button type="button" className="dropdown-item" key={i}>
                        {current.name}
                      </button>
                    )
                  )}
                </div>
              </div>
            );

            this.setState({
              profOptions: profOptions,
            });
          }

          this.setState({
            profs: profs,
          });
        }

        //Subraces
        if (results.subraces != "") {
          let subraces = (
            <div className="race-subs">
              <h5>Subraces</h5>
              {results.subraces.map((current, i) => (
                <p key={i}>{current.name}</p>
              ))}
            </div>
          );
          this.setState({
            subraces: subraces,
          });
        }

        //Traits Data
        if (results.traits != "") {
          let traitsInfo = (
            <div>
              <h5>Traits</h5>
              {results.traits.map((current, i) => (
                <p key={i}>{current.name}</p>
              ))}
            </div>
          );

          this.setState({
            traits: traitsInfo,
          });
        }

        if (results.trait_options) {
          let trait_options = (
            <div className="dropdown dropright">
              <h5>Trait Options</h5>
              <button
                type="button"
                className="btn btn-danger dropdown-toggle"
                data-toggle="dropdown"
              >
                Choose 1:
              </button>
              <div className="dropdown-menu">
                {results.trait_options.from.map((current, i) => (
                  <button type="button" className="dropdown-item" key={i}>
                    {current.name}
                  </button>
                ))}
              </div>
            </div>
          );

          this.setState({
            trait_options: trait_options,
          });
        }

        //Set Data
        this.setState({
          name: results.name,
          age: results.age,
          alignment: results.alignment,
          languageDesc: results.language_desc,
          languages: results.languages.map((current, i) => (
            <p key={i}>{current.name}</p>
          )),
          size: results.size,
          size_desc: results.size_description,
          speed: results.speed,
        });
      };
      raceInfoRequest();
    } else {
      //Clear previous info.
      this.setState({
        name: "",
        abilityOptions: [],
        age: "",
        alignment: "",
        languageDesc: "",
        languages: [],
        languageOptions: [],
        size: "",
        size_desc: "",
        speed: "",
        profs: [],
        profOptions: [],
        subraces: [],
        traits: [],
        trait_options: [],
      });
    }
  }

  //Render elements to DOM.
  render() {
    return (
      <div id="race-grid" className="row">
        {this.state.toggle && (
          <div className="row">
            {this.props.racesArray.map((current, i) => (
              <div className="col-3 col-md-2 col-lg-1 col-spacing" key={i}>
                <button
                  className={"race-btns " + `${current}` + "-icon"}
                  onClick={() => this.buttonClickEvent(current)}
                ></button>
                {current.charAt(0).toUpperCase() + current.slice(1)}
              </div>
            ))}
          </div>
        )}

        <ReactTransitionGroup.CSSTransition
          in={!this.state.toggle}
          timeout={500}
          classNames="rTrans"
          unmountOnExit
        >
          <div className="race-section">
            <div className="race-img">
              <h4>{this.state.name}</h4>
              <button
                className="race-section-btn"
                onClick={this.buttonClickEvent}
              >
                <img
                  src={
                    "./images/Race-Images/" + `${this.state.raceUrl}` + ".png"
                  }
                  alt={this.state.raceUrl}
                />
              </button>
              {this.state.subraces}
            </div>
            <div className="race-info">
              <div className="race-specs">
                <h5>Size</h5>
                <p>{this.state.size}</p>
                <p>{this.state.size_desc}</p>
                <h5>Age</h5>
                <p>{this.state.age}</p>
                <h5>Alignment</h5>
                <p>{this.state.alignment}</p>
                <h5>Language</h5>
                <p>{this.state.languageDesc}</p>
                <h5>Languages</h5>
                {this.state.languages}
                {this.state.languageOptions}
              </div>
              <div className="race-stats">
                <h5>Speed</h5>
                <p>{this.state.speed}</p>
                <h5>Ability Bonuses</h5>
                <div className="canvas-container">
                  <canvas
                    className="statsChart"
                    aria-label="bar chart"
                    role="img"
                  ></canvas>
                </div>
                {this.state.abilityOptions}
                {this.state.profs}
                {this.state.profOptions}
                {this.state.traits}
                {this.state.trait_options}
              </div>
            </div>
          </div>
        </ReactTransitionGroup.CSSTransition>
      </div>
    );
  }
}
