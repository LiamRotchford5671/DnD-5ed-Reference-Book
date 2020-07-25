class Races extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toggle: true,
            raceUrl: '',
            name: '',
            age: '',
            alignment: '',
            language: '',
            languages: [],
            size: '',
            size_desc: '',
            speed: ''
        };
        this.buttonClickEvent = this.buttonClickEvent.bind(this);
    }

    //On click, toggles between nav and info section.
    //If state is set for info section, run asynchronous function to get and set api data.
    buttonClickEvent(name) {
        this.setState(state => ({
            toggle: !state.toggle
        }));

        if (this.state.toggle === true) {
            const raceInfoRequest = async () => {
                await this.setState({
                    raceUrl: name
                })
                const results = await doAPIrequest(`races/` + this.state.raceUrl + '/');
                console.log(results);

                this.setState({
                    name: results.name,
                    age: results.age,
                    alignment: results.alignment,
                    language: results.language_desc,
                    languages: results.languages.map((current, i) => <p key={i}>{current.name}</p>),
                    size: results.size,
                    size_desc: results.size_description,
                    speed: results.speed
                    // trait_options: results.trait_options.from.map((current, i) => <p key={i}>{current.name}</p>),
                    // traits: results.traits.map((current, i) => <p key={i}>{current.name}</p>)
                });
            };
            raceInfoRequest();
        } else {

            //Clear previous info.
            this.setState({
                name: '',
                age: '',
                alignment: '',
                language: '',
                languages: [],
                size: '',
                size_desc: '',
                speed: ''
            })
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
                    <div className="col-3 col-md-2 col-lg-1 col-spacing" key={i}>
                        <button className={'race-btns ' + `${current}` + '-icon'} onClick={() => this.buttonClickEvent(current)}></button>
                        {current.charAt(0).toUpperCase() + current.slice(1)}
                    </div>
                ))}
            </div>
        )
    }

    renderRaceInfo() {
        return (
            <div className="race-row">
                <div className="race-img">
                    <h4>{this.state.name}</h4>
                    <img src={'./images/Race-Images/' + `${this.state.raceUrl}` + '.png'} alt={this.state.raceUrl} />
                    <button onClick={this.buttonClickEvent}>Back to grid</button>
                </div>

                <div className="race-info">
                    <h5>Age</h5>
                    <p>{this.state.age}</p>
                    <h5>Ability Bonuses</h5>
                    <p>{this.state.alignment}</p>
                    <h5>Language</h5>
                    <p>{this.state.language}</p>
                    <h5>Languages</h5>
                    {this.state.languages}
                    <h5>Size</h5>
                    <p>{this.state.size}</p>
                    <p>{this.state.size_desc}</p>
                    <h5>Speed</h5>
                    <p>{this.state.speed}</p>
                    <h5>Traits Options</h5>
                    {this.state.trait_options}
                    <h5>Traits</h5>
                    {this.state.traits}
                </div>
            </div>
        )
    }

}

