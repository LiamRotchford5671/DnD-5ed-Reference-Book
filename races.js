class Races extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toggle: true,
            raceUrl: '',
            name: '',
            ability: [],
            abilityOptions: [],
            age: '',
            alignment: '',
            languageDesc: '',
            languages: [],
            languageOptions: [],
            size: '',
            size_desc: '',
            speed: '',
            profs: [],
            profOptions: [],
            subraces: [],
            traits: [],
            trait_options: []
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

                //Ability Bonuses
                let abilityBonuses = results.ability_bonuses.map((current, i) =>
                    <p key={i}>{current.name}: {current.bonus}</p>
                );
                if (results.ability_bonus_options) {
                    let abilityOptions =
                        <div>
                            <h5>Ability Bonus Options</h5>
                            <p>Choose: {results.ability_bonus_options.choose}</p>
                            <div className="Options">
                                {results.ability_bonus_options.from.map((current, i) =>
                                <p key={i}>{current.name}: {current.bonus}</p>)}
                            </div>
                        </div>;

                    this.setState({
                        abilityOptions: abilityOptions
                    });
                }

                //Language Bonuses
                if (results.language_options) {
                    let languageOptions =
                        <div>
                            <p>Choose 1: </p>
                            <div className="Options">
                            {results.language_options.from.map((current, i) =>
                            <p key={i}>{current.name}</p>)}
                            </div>
                        </div>;

                    this.setState({
                        languageOptions: languageOptions
                    });
                }

                //Proficiencies
                if (results.starting_proficiencies != '') {
                    let profs =
                        <div>
                            <h5>Proficiencies</h5>
                            {results.starting_proficiencies.map((current,i) =>
                            <p key={i}>{current.name}</p>)}
                        </div>;
                    if (results.starting_proficiency_options) {
                        let profOptions =
                            <div>
                                <h5>Proficiency Options</h5>
                                <p>Choose 1:</p>
                                <div className="Options">
                                    {results.starting_proficiency_options.from.map((current, i) =>
                                        <p key={i}>{current.name}</p>)}
                                </div>
                            </div>;

                        this.setState({
                            profOptions: profOptions
                        })
                    }

                    this.setState({
                        profs: profs
                    })
                }

                //Subraces
                if (results.subraces != '') {
                    let subraces =
                        <div>
                            <h5>Subraces</h5>
                            {results.subraces.map((current, i) =>
                                <p key={i}>{current.name}</p>)}
                        </div>;
                    this.setState({
                        subraces: subraces
                    })
                }

                //Traits Data
                if (results.traits !='') {
                    let traitsInfo =
                        <div>
                            <h5>Traits</h5>
                            {results.traits.map((current,i) =>
                            <p key={i}>{current.name}</p>)}
                        </div>;

                    this.setState({
                        traits: traitsInfo
                    })
                }

                if (results.trait_options) {
                    let trait_options =
                        <div>
                            <h5>Trait Options</h5>
                            <p>Choose 1:</p>
                            <div className="Options">
                                {results.trait_options.from.map((current,i) =>
                                <p key={i}>{current.name}</p>)}
                            </div>
                        </div>;

                    this.setState({
                        trait_options: trait_options
                    })
                }

                this.setState({
                    name: results.name,
                    ability: abilityBonuses,
                    age: results.age,
                    alignment: results.alignment,
                    languageDesc: results.language_desc,
                    languages: results.languages.map((current, i) => <p key={i}>{current.name}</p>),
                    size: results.size,
                    size_desc: results.size_description,
                    speed: results.speed
                });
            };
            raceInfoRequest();
        } else {

            //Clear previous info.
            this.setState({
                name: '',
                ability: [],
                abilityOptions: [],
                age: '',
                alignment: '',
                languageDesc: '',
                languages: [],
                languageOptions: [],
                size: '',
                size_desc: '',
                speed: '',
                profs: [],
                profOptions: [],
                subraces: [],
                traits: [],
                trait_options: []
            })
        }
    }

    //Render elements to DOM.
    render() {
        return (
            <div id="race-grid" className="row">
                {this.state.toggle && ( <div className="row">
                    {this.props.racesArray.map((current, i) => (
                        <div className="col-3 col-md-2 col-lg-1 col-spacing" key={i}>
                            <button className={'race-btns ' + `${current}` + '-icon'} onClick={() => this.buttonClickEvent(current)}></button>
                            {current.charAt(0).toUpperCase() + current.slice(1)}
                        </div>
                    ))}
                </div>)}

                <ReactTransitionGroup.CSSTransition
                    in={!this.state.toggle}
                    timeout={500}
                    classNames="rTrans"
                    unmountOnExit
                >
                    <div className="race-row">
                        <div className="race-img">
                            <button onClick={this.buttonClickEvent}>Back to grid</button>
                            <h4>{this.state.name}</h4>
                            <img src={'./images/Race-Images/' + `${this.state.raceUrl}` + '.png'} alt={this.state.raceUrl} />
                            {this.state.subraces}
                            <h5>Ability Bonuses</h5>
                            {this.state.ability}
                            {this.state.abilityOptions}
                        </div>

                        <div className="race-info">
                            <h5>Speed</h5>
                            <p>{this.state.speed}</p>
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
                            {this.state.profs}
                            {this.state.profOptions}
                            {this.state.traits}
                            {this.state.trait_options}
                        </div>
                    </div>
                </ReactTransitionGroup.CSSTransition>
            </div>
        )
    }
}

