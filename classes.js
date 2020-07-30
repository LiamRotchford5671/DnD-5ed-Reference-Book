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
                // console.log(levelResults[0].class_specific.rage_count);

                let classSpecific = Object.keys(levelResults[0].class_specific);
                let classSpecificArray = [];
                for (let key in classSpecific) {
                    let regex = new RegExp('_', 'g');
                    classSpecificArray.push(<th scope="col" key={key}>{classSpecific[key].replace(regex, ' ')}</th>)
                }

                function ClassSpecificData(current) {
                    let classSpecificDataArray = [];
                    for (let key in current.class_specific) {
                            classSpecificDataArray.push(<td key={key}>{current.class_specific[key]}</td>)
                    };
                    return classSpecificDataArray;
                }

                let levelTable =
                    <table className="table table-sm table-striped table-hover">
                        <thead className="thead-dark">
                        <tr>
                            <th scope="col">Level</th>
                            <th scope="col">Ability Score Bonuses</th>
                            <th scope="col">Proficiency Bonus</th>
                            <th scope="col">Feature Choices</th>
                            {classSpecificArray}
                        </tr>
                        </thead>
                        <tbody>
                            {levelResults.map((current,i) =>
                            <tr scope="row" key={i}>
                                <td>{current.level}</td>
                                <td>{current.ability_score_bonuses}</td>
                                <td>{current.prof_bonus}</td>
                                <td>{current.features.map(current2 => current2.name + ', ')}</td>
                                {ClassSpecificData(current)}
                            </tr>)}
                        </tbody>
                    </table>

                //Proficiency Data
                let proficiency = results.proficiencies.map((current, i) => <p key={i}>{current.name}</p>);

                let profChoices = results.proficiency_choices.map((current, i) =>
                    <div key={i}>
                        <p>Choose: {current.choose}</p>
                        <div className="class-profs-options list-group-flush">{current.from.map((next, j) =>
                            <button type="button" className="list-group-item list-group-item-action" key={j}>{next.name.replace('Skill:', '')}</button>)}
                        </div>
                    </div>);

                //Starting Equipment Data
                let startingEquipUrl = results.starting_equipment.url.replace('/api/', '')

                const equipResults = await doAPIrequest(startingEquipUrl);

                let equipResultsItems = equipResults.starting_equipment.map((current, i) =>
                    <p key={i}>{current.item.name}: {current.quantity}</p>
                );

                let equipChoiceItems = [];

                for (let key in equipResults) {
                    if (equipResults.hasOwnProperty(key) && key.match("^choice_")) {
                        let equipItems =
                            <div key={key}>
                                <p>Choose 1:</p>
                                <div className="class-equips list-group-flush">
                                    {equipResults[key].map(current => current.from.map((next, i) =>
                                    <button type="button" className="list-group-item list-group-item-action" key={i}>{next.item.name}</button>))}
                                </div>
                            </div>
                        equipChoiceItems.push(equipItems);
                    }
                }

                //Spellcasting
                if (results.spellcasting) {

                    const spellResults = await doAPIrequest(`spellcasting/` + this.state.classUrl + '/');

                    let spells = spellResults.info.map((current, i) =>
                        <div className="list-group-flush" key={i}>
                            <button type="button" className="spell-name list-group-item list-group-item-action" onClick={()=>{
                                this.setState(state => ({
                                    spellDesc: !state.spellDesc
                                }));
                                // console.log(this.state.spellDesc);
                            }}>{current.name}</button>

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
                    class_levels: levelTable,
                    profs: proficiency,
                    profChoices: profChoices,
                    saveThrows: results.saving_throws.map((current, i) => <p key={i}>{current.name}</p>),
                    startEquips: equipResultsItems,
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
                spellDesc: false,
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
                            <p>Hit die: {this.state.hit_die}</p>
                            <img src={'./images/Class-Images/' + `${this.state.classUrl}` + '.png'}
                                 alt={this.state.name}/>
                             <div className="starting-equip">
                                <h5>Starting Equipment</h5>
                                {this.state.startEquips}
                             </div>
                        </div>
                        <div className="class-levels">
                            {this.state.class_levels}
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
                            <div className="class-prof-choices">
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
