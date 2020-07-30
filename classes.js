class Classes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toggle: true,
            classUrl: '',
            name: '',
            hit_die: '',
            class_levels: [],
            profs: [],
            profChoices: [],
            saveThrows: [],
            spellCasting: [],
            spellDesc: false,
            startEquips: [],
            equipChoiceItems: [],
            subclasses: []
        };

        this.buttonClickEvent = this.buttonClickEvent.bind(this);
        this.classDataHandler = this.classDataHandler.bind(this);
    }

    //On click, toggles between nav and info section.
    //If state is set for info section, run asynchronous function to get and set api data.
    buttonClickEvent(name) {
        this.setState(state => ({
            toggle: !state.toggle
        }));

        this.classDataHandler(name);
    }

    classDataHandler(name) {
        if (this.state.toggle === true) {
            const classInfoRequest = async () => {
                await this.setState({
                    classUrl: name
                })

                //Initial Class API Fetch
                const results = await doAPIrequest(`classes/` + this.state.classUrl + '/');
                console.log(results);

                //Class Levels
                const levelResults = await doAPIrequest(`classes/` + this.state.classUrl + '/levels');
                console.log(levelResults);
                console.log(levelResults[0].class_specific.rage_count);
                let levelData = levelResults.map((current,i) =>
                    <tr scope="row" key={i}>
                        <td>{current.level}</td>
                        <td>{current.ability_score_bonuses}</td>
                        <td>{current.prof_bonus}</td>
                        <td>{current.features.map(current2 => current2.name + ', ')}</td>
                        {/*<td>{current.class_specific.rage_count}</td>*/}
                        {/*<td>{current.class_specific.rage_damage_bonus}</td>*/}
                        {/*<td>{current.class_specific.brutal_critical_dice}</td>*/}
                    </tr>)


                //Proficiency Data
                let profChoices = results.proficiency_choices.map((current, i) =>
                    <div key={i}>
                        <p>Choose: {current.choose}</p>
                        <div className="class-profs-options">{current.from.map((next, j) =>
                            <p key={j}>{next.name.replace('Skill:', '')}</p>)}
                        </div>
                    </div>);

                //Starting Equipment Data
                let startingEquipUrl = results.starting_equipment.url.replace('/api/', '')

                const equipResults = await doAPIrequest(startingEquipUrl);

                let equipResultsItems = equipResults.starting_equipment;
                let equipChoiceItems = [];

                for (var key in equipResults) {
                    if (equipResults.hasOwnProperty(key) && key.match("^choice_")) {
                        let equipItems =
                            <div key={key}>
                                <p>Choose 1:</p>
                                <div className="class-equips">
                                    {equipResults[key].map(current => current.from.map((next, i) =>
                                    <p key={i}>{next.item.name}</p>))}
                                </div>
                            </div>
                        equipChoiceItems.push(equipItems);
                    }
                }

                //Spellcasting
                if (results.spellcasting) {

                    const spellResults = await doAPIrequest(`spellcasting/` + this.state.classUrl + '/');

                    let spells = spellResults.info.map((current, i) =>
                        <div key={i}>
                            <p className="spell-name" onClick={()=>{
                                this.setState(state => ({
                                    spellDesc: !state.spellDesc
                                }));
                                // console.log(this.state.spellDesc);
                            }}>{current.name}</p>

                            <ReactTransitionGroup.CSSTransition
                                in={this.state.spellDesc}
                                timeout={500}
                                classNames="spellTrans"
                                unmountOnExit
                            >
                                <p className="spell-desc">{current.desc}</p>
                            </ReactTransitionGroup.CSSTransition>
                        </div>
                    )
                    console.log(spellResults);

                    this.setState({
                        spellCasting: <div>
                            <h5>Spellcasting</h5>
                            <p>{spellResults.spellcasting_ability.name}</p>
                            {spells}
                        </div>
                    })
                }


                //Set Data
                this.setState({
                    name: results.name,
                    index: results.index,
                    hit_die: results.hit_die,
                    class_levels: levelData,
                    profs: results.proficiencies.map((current, i) => <p key={i}>{current.name}</p>),
                    profChoices: profChoices,
                    saveThrows: results.saving_throws.map((current, i) => <p key={i}>{current.name}</p>),
                    startEquips: equipResultsItems.map((current, i) => <p key={i}>{current.item.name}</p>),
                    equipChoiceItems: equipChoiceItems,
                    subclasses: results.subclasses.map((current, i) => <p key={i}>{current.name}</p>)
                });
            };
            classInfoRequest();
        } else {

            //Clear previous info.
            this.setState({
                name: '',
                hit_die: '',
                class_levels: [],
                profs: [],
                profChoices: [],
                saveThrows: [],
                spellCasting: [],
                startEquips: [],
                equipChoiceItems: [],
                subclasses: []
            });
        }
    }

    //Render elements to DOM.
    render() {
        return (
            <div id="class-grid">
                {this.state.toggle && (<div className="row">
                    {this.props.classesArray.map((current, i) => (
                        <div className="col-3 col-md-2 col-lg-1 col-spacing" key={i}>
                            <button className={'class-btns ' + `${current}` + '-icon'}
                                    onClick={() => this.buttonClickEvent(current)}></button>
                            {current.charAt(0).toUpperCase() + current.slice(1)}
                        </div>
                    ))}
                </div>)}

                <ReactTransitionGroup.CSSTransition
                    in={!this.state.toggle}
                    timeout={500}
                    classNames="cTrans"
                    unmountOnExit
                >
                    <div className="class-row">
                        <button className={'class-btns ' + `${this.state.index}` + '-icon'}
                                onClick={this.buttonClickEvent}></button>
                        <div className="class-img">
                            <h4>{this.state.name}</h4>
                            <p>Hit die: {this.state.data}</p>
                            <img src={'./images/Class-Images/' + `${this.state.classUrl}` + '.png'}
                                 alt={this.state.name}/>
                             <div className="starting-equip">
                                <h5>Starting Equipment</h5>
                                {this.state.startEquips}
                             </div>
                        </div>
                        <div className="class-levels">
                            <table className="table table-sm table-striped table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">Level</th>
                                        <th scope="col">Ability Score Bonuses</th>
                                        <th scope="col">Proficiency Bonus</th>
                                        <th scope="col">Feature Choices</th>
                                        <th scope="col">Rage Count</th>
                                        <th scope="col">Rage Damage Bonus</th>
                                        <th scope="col">Brutal Critical</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.class_levels}
                                </tbody>
                            </table>
                        </div>
                        <div className="class-info">
                            <div>
                                <h5>Proficiencies</h5>
                                {this.state.profs}
                                <h5>Saving Throws</h5>
                                {this.state.saveThrows}
                                <h5>Subclasses</h5>
                                {this.state.subclasses}
                            </div>
                            <div className="class-stats">
                                <h5>Proficiency Choices</h5>
                                <div className="class-profs">
                                    {this.state.profChoices}
                                </div>
                            </div>
                        </div>
                        <div className="equip-choices">
                            <h5>Equipment Choices</h5>
                            <div className="class-equip-items">
                                {this.state.equipChoiceItems}
                            </div>
                        </div>
                        {this.state.spellCasting}
                    </div>
                </ReactTransitionGroup.CSSTransition>
            </div>

        )
    }
}
