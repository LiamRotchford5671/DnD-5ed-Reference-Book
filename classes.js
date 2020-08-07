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
            profSelectedItems: [],
            saveThrows: [],
            spellCasting: [],
            startEquips: [],
            equipChoiceItems: [],
            equipSelectedItems: [],
            equipChoiceDesc: [],
            subclasses: []
        };

        this.buttonClickEvent = this.buttonClickEvent.bind(this);
        this.classDataHandler = this.classDataHandler.bind(this);
        this.addSelection = this.addSelection.bind(this);
        this.removeSelection = this.removeSelection.bind(this);
    }

    //On click, toggles between nav and info section.
    //If state is set for info section, run asynchronous function to get and set api data.
    buttonClickEvent(name) {
        this.setState(state => ({
            toggle: !state.toggle
        }));

        this.classDataHandler(name);
    }

    addSelection(item, type, url, eachLimit, index, max) {
        url = url.replace('/api/', '');
        const choiceInfoRequest = async () => {
            if (type === "equip") {
                const results = await doAPIrequest(url);
                console.log(results);

                await this.setState({
                    equipChoiceDesc: <div className={"desc" + item + " collapse"}>
                        <p>Category: {results.equipment_category.name}</p>
                        <p>Weight: {results.weight}</p>
                        <p>Cost: {results.cost.quantity} {results.cost.unit}</p>
                    </div>
                })
            }

            let selectionArray = [];
            let finalArray = [];

            if (this.state.equipSelectedItems[index]) {
                console.log('test');
            } else {
                finalArray = this.state.equipSelectedItems.slice();
                finalArray[index] = selectionArray;
                this.setState({
                    equipSelectedItems: finalArray
                })
            }

            if (type === "equip") {
                if (this.state.equipSelectedItems.length <= max) {
                    if (this.state.equipSelectedItems[index].length < eachLimit) {
                        finalArray = this.state.equipSelectedItems.slice();
                        selectionArray = this.state.equipSelectedItems[index].slice();
                        let i = selectionArray.length;

                        selectionArray[i] = <div key={item}>
                            <button type="button" className="btn btn-light choice" data-toggle="collapse" data-target={'.desc' + item}>{item}</button>
                            <button className="btn badge badge-dark" onClick={() => this.removeSelection(type, index, i)}>x</button>
                            {this.state.equipChoiceDesc}
                        </div>;

                        finalArray[index] = selectionArray;

                        this.setState({
                            equipSelectedItems: finalArray
                        });

                    }

                }

            } else if (type === "prof") {
                selectionArray = this.state.profSelectedItems.slice();
                if (selectionArray.length < eachLimit) {
                    let i = selectionArray.length;
                    selectionArray[i] = <div key={item}>
                        <button type="button" className="btn btn-light choice">{item}</button>
                        <button className="btn badge badge-dark" onClick={() => this.removeSelection(type, i)}>x</button>
                    </div>;
                }
                this.setState({
                    profSelectedItems: selectionArray
                });
            }
        }
        choiceInfoRequest();


        //
        // if (item === this.state.equipSelectedItems) {
        //     this.setState({
        //         equipSelectedItem: []
        //     });
        // } else {
        //     this.setState({
        //         equipSelectedItems: selectionArray
        //     });
        // }
    }

    removeSelection(type, index, i) {
        let selectionArray = [];
        let finalArray = [];

        if (type === "equip") {
            finalArray = this.state.equipSelectedItems.slice();
            selectionArray = this.state.equipSelectedItems[index].slice();
            console.log(selectionArray);
            selectionArray.splice(i, 1);
            finalArray[index] = selectionArray;

            this.setState({
                equipSelectedItems: finalArray
            });

        } else if (type === "prof") {
            selectionArray = this.state.profSelectedItems.slice();
            if (this.state.profSelectedItems.length === 1) {
                selectionArray.splice(0, 1);
            } else {
                selectionArray.splice(index, 1);
            }
            this.setState({
                profSelectedItems: selectionArray
            });
        }
    }

    choiceData(type, url) {

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

                //Saving Throws
                let saveThrowNames = results.saving_throws.map(current => current.name);
                let saveThrows = [];

                for (let name in saveThrowNames) {
                    const saveThrowResults = await doAPIrequest(`ability-scores/` + saveThrowNames[name].toLowerCase() + '/')
                    let abilitySkills = [];
                    if (saveThrowResults.skills !== null && saveThrowResults.skills.length !== 0) {
                        abilitySkills.push(<p key={name}>Skills: {saveThrowResults.skills.map(current => current.name + ', ')}</p>);
                    }
                    saveThrows.push(
                        <div className="saveThrows" key={name}>
                            <button type="button" className="btn btn-danger" data-toggle="collapse" data-target={'.saveThrowDesc' + name}>{saveThrowResults.name}</button>
                            <div className={"collapse saveThrowDesc" + name}>
                                <p>{saveThrowResults.desc}</p>
                                {abilitySkills}
                            </div>
                        </div>);
                }

                //Subclasses
                let subClasses = results.subclasses.map(async (current, i) => {
                    let subClassUrl = current.name.toLowerCase().replace(' ', '-');
                    let subClassResults = await doAPIrequest(`subclasses/` + subClassUrl + '/');

                    this.setState({
                        subclasses: <div key={i}>
                            <p><b>- {current.name} -</b></p>
                            <p>Subclass Flavor: {subClassResults.subclass_flavor}</p>
                            <p>{subClassResults.desc}</p>
                            <p>Features: {subClassResults.features.map((next, i) => next.name + ', ')}</p>
                        </div>
                    })
                });

                //Proficiency Data
                let proficiency = results.proficiencies.map((current, i) => <p key={i}>{current.name}</p>);

                //Proficiency Choices
                let profChoices = results.proficiency_choices.map((current, i) =>
                    <div key={i} className="dropdown dropright">
                        <button type="button" className="btn btn-danger dropdown-toggle" data-toggle="dropdown">Choose: {current.choose}</button>
                        <div className="dropdown-menu">{current.from.map((next, j) =>
                            <button type="button" className="dropdown-item" key={j} onClick={() => this.addSelection(next.name.replace('Skill:', ''), "prof", next.url, current.choose, i, results.proficiency_choices.length)}>{next.name.replace('Skill:', '')}</button>)}
                        </div>
                    </div>);

                //Starting Equipment Data
                let startingEquipUrl = results.starting_equipment.url.replace('/api/', '')

                const equipResults = await doAPIrequest(startingEquipUrl);
                console.log(equipResults);

                let equipResultsUrls = equipResults.starting_equipment.map(current => current.item.url.replace('/api/', ''));
                let startEquips = [];
                let equips = equipResults.starting_equipment;

                for (let item in equips) {
                    const eachEquipResults = await doAPIrequest(equipResultsUrls[item]);
                    // console.log(eachEquipResults);

                    function Contents() {
                        if (eachEquipResults.contents) {
                            let equipContents = eachEquipResults.contents.map(current => current.item_url.replace('/api/equipment/', '') + ', ');
                            return <p>Contents: {equipContents}</p>
                        }
                    }

                    function WeaponEquips() {
                        if (eachEquipResults.equipment_category.name === "Weapon") {
                            let rangeLong = [];
                            let throwRange = [];
                            let rangeData = [eachEquipResults.range.normal, 0, 0, 0];

                            if (eachEquipResults.range.long !== null) {
                                rangeLong = ", Long - " + eachEquipResults.range.long;
                                rangeData[1] = eachEquipResults.range.long
                            } else if (eachEquipResults.throw_range) {
                                throwRange = <p>Throw Range: Normal - {eachEquipResults.throw_range.normal}, Long - {eachEquipResults.throw_range.long}</p>;
                                rangeData[2] = eachEquipResults.throw_range.normal;
                                rangeData[3] = eachEquipResults.throw_range.long;
                            }

                            function weaponChart() {
                                // var ctx2 = document.querySelector('#weaponChart');
                                // var myBarChart2 = new Chart(ctx2, {
                                //     type: 'polarArea',
                                //     data: {
                                //         datasets: [{
                                //             label: ['Normal', 'Long'],
                                //             data: [0,1,2,3],
                                //             backgroundColor: 'rgba(255,46,46,0.8)'
                                //         }]
                                //     },
                                //     options: {
                                //         legend: {
                                //             display: true
                                //         }
                                //     }
                                // });
                            }

                            return <div>
                                <p>{eachEquipResults.category_range}</p>
                                <p>Properties: {eachEquipResults.properties.map(current => current.name + ', ')}</p>
                                <p>Damage: {eachEquipResults.damage.damage_type.name} {eachEquipResults.damage.damage_dice}</p>
                                <p>Range: Normal - {eachEquipResults.range.normal}{rangeLong}</p>
                                {throwRange}
                                <div className={"weapon-chart collapse equip-desc" + item + " container col-lg-4"}>
                                    <canvas id="weaponChart" aria-label="polar chart" role="img"></canvas>
                                </div>
                                {weaponChart()}
                            </div>;
                        }
                    }

                    function ArmorEquips() {
                        if (eachEquipResults.equipment_category.name === "Armor") {
                            return <div>
                                <p>Armor Category: {eachEquipResults.armor_category}</p>
                                <p>Armor Class: Base - {eachEquipResults.armor_class.base}</p>
                                <p>Strength Minimum: {eachEquipResults.str_minimum}</p>
                            </div>;
                        }
                    }

                    let equipWeight = '';
                    if (eachEquipResults.weight) {
                        equipWeight = <p>Weight: {eachEquipResults.weight}</p>;
                    }

                    startEquips.push(
                        <div className="startEquips" key={item}>
                            <button className="btn btn-light " data-toggle="collapse" data-target={'.equip-desc' + item}>{equips[item].item.name}: {equips[item].quantity}</button>
                            <div className={"collapse equip-desc" + item}>
                                <p>Category: {eachEquipResults.equipment_category.name}</p>
                                {WeaponEquips()}
                                {ArmorEquips()}
                                {Contents()}
                                {equipWeight}
                                <p>Cost: {eachEquipResults.cost.quantity} {eachEquipResults.cost.unit}</p>
                            </div>
                        </div>
                    );
                }

                //Equipment Choices
                let equipChoiceItems = [];

                for (let key in equipResults) {
                    if (equipResults.hasOwnProperty(key) && key.match("^choice_")) {
                        let equipItems =
                            <div className="dropdown dropright" key={key}>
                                <button type="button" className="btn btn-danger dropdown-toggle" data-toggle="dropdown">Choose 1:</button>
                                <div className="dropdown-menu">
                                    {equipResults[key].map(current => current.from.map((next, i) =>
                                    <button type="button" className="dropdown-item" key={i} onClick={() => this.addSelection(next.item.name, "equip", next.item.url, current.choose, key.replace('choice_', '') - 1, equipResults.choices_to_make)}>{next.item.name}</button>))}
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
                            <button type="button" className="btn btn-danger" data-toggle="collapse" data-target={'#spell-desc' + i}>
                                {current.name}
                            </button>
                            <p id={'spell-desc' + i} className="spell-desc collapse">{current.desc}</p>
                        </div>
                    )

                    this.setState({
                        spellCasting: <div className="class-spells col-lg-4 col-md-12">
                            <h5>Spellcasting</h5>
                            <p>{spellResults.spellcasting_ability.name}</p>
                            {spells}
                        </div>
                    })
                }

                //Class Levels
                const levelResults = await doAPIrequest(`classes/` + this.state.classUrl + '/levels');

                function LevelDataHeads() {
                    let classSpecificArray = [];
                    let classSpecific = Object.keys(levelResults[0].class_specific);

                    for (let key in classSpecific) {
                        let regex = new RegExp('_', 'g');
                        if (typeof levelResults[0].class_specific[classSpecific[key]] !== 'object') {
                            classSpecificArray.push(<th scope="col" key={key}>{classSpecific[key].replace(regex, ' ')}</th>);
                        }
                    }
                    return classSpecificArray;
                }

                function ClassSpecificData(current) {
                    let classSpecificDataArray = [];
                    for (let key in current.class_specific) {
                        if (typeof current.class_specific[key] !== 'object') {
                            classSpecificDataArray.push(<td key={key}>{current.class_specific[key]}</td>);
                        }
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
                            {LevelDataHeads()}
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

                let levels = [];
                let abilityBonus = [];
                let proficiencyBonus = [];
                levelResults.map(current => {
                    levels.push(current.level);
                    abilityBonus.push(current.ability_score_bonuses);
                    proficiencyBonus.push(current.prof_bonus);
                })

                var ctx = document.querySelector('.levelsChart');
                var myBarChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: levels,
                        datasets: [{
                            label: ["Ability Score Bonus"],
                            data: abilityBonus,
                            backgroundColor: 'rgba(255,46,46,0.8)'
                        },
                            {
                                label: ["Proficiency Bonus"],
                                data: proficiencyBonus,
                                backgroundColor: 'rgba(83,217,255,0.8)'
                            }
                        ]
                    },
                    options: {
                        legend: {
                            display: true
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    min: 0,
                                    max: 10
                                }
                            }],
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Levels'
                                }
                            }]
                        }
                    }
                });

                //Set Data
                this.setState({
                    name: results.name,
                    index: results.index,
                    hit_die: results.hit_die,
                    saveThrows: saveThrows,
                    class_levels: levelTable,
                    profs: <div className="profs">{proficiency}</div>,
                    profChoices: profChoices,
                    startEquips: startEquips,
                    equipChoiceItems: equipChoiceItems
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
                profSelectedItems: [],
                saveThrows: [],
                spellCasting: [],
                startEquips: [],
                equipChoiceItems: [],
                equipSelectedItems: [],
                equipChoiceDesc: [],
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
                    <div className="class-section">
                        <div className="class-info">
                            <div className="class-header col-lg-4 col-md-12 row">
                                <button className={"class-section-btns " + this.state.classUrl + "-icon"} onClick={this.buttonClickEvent}></button>
                                <div className="class-img col-8">
                                    <h4>{this.state.name}</h4>
                                    <p>Hit die: {this.state.hit_die}</p>
                                    <img src={'./images/Class-Images/' + this.state.classUrl + '.png'} alt={this.state.name}/>
                                </div>
                            </div>

                            <div className="class-stats col-lg-8 col-md-12">
                                <h5>Saving Throws</h5>
                                {this.state.saveThrows}
                                <h5>Subclasses</h5>
                                {this.state.subclasses}
                            </div>
                            <div className="class-profs col-lg-4 col-md-6 col-sm-12">
                                <h5>Proficiencies</h5>
                                {this.state.profs}
                                <h5>Proficiency Choices</h5>
                                <div className="class-prof-options">
                                    {this.state.profChoices}
                                    {this.state.profSelectedItems}
                                </div>
                            </div>
                            <div className="class-equips col-lg-4 col-md-6 col-sm-12">
                                <h5>Starting Equipment</h5>
                                {this.state.startEquips}
                                <h5>Equipment Choices</h5>
                                <div className="class-equip-items">
                                    {this.state.equipChoiceItems}
                                    {this.state.equipSelectedItems}
                                </div>
                            </div>
                            {this.state.spellCasting}
                        </div>

                        <div className="class-levels">
                            {this.state.class_levels}
                            <div className="container">
                                <canvas className="levelsChart" aria-label="bar chart" role="img"></canvas>
                            </div>
                        </div>
                    </div>
                </ReactTransitionGroup.CSSTransition>
            </div>

        )
    }
}