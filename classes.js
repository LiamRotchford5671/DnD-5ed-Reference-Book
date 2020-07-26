class Classes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toggle: true,
            classUrl: '',
            name: '',
            data: [],
            profs: [],
            saveThrows: [],
            startEquips: [],
            subclasses: [],
            visible: false
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
            const classInfoRequest = async () => {
                await this.setState({
                    classUrl: name
                })
                const results = await doAPIrequest(`classes/` + this.state.classUrl + '/');
                console.log(results);

                this.setState({
                    name: results.name,
                    data: results.hit_die,
                    profs: results.proficiencies.map((current, i) => <p key={i}>{current.name}</p>),
                    saveThrows: results.saving_throws.map((current, i) => <p key={i}>{current.name}</p>),
                    startEquips: results.starting_equipment.url,
                    subclasses: results.subclasses.map((current, i) => <p key={i}>{current.name}</p>)
                });
            };
            classInfoRequest();
        } else {

            //Clear previous info.
            this.setState({
                name: '',
                data: [],
                profs: [],
                saveThrows: [],
                startEquips: [],
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
                        <div className="class-info">
                            <h4>{this.state.name}</h4>
                            <p>Hit die: {this.state.data}</p>
                            <img src={'./images/Class-Images/' + `${this.state.classUrl}` + '.png'}
                                 alt={this.state.name}/>
                            <button onClick={this.buttonClickEvent}>Back to grid</button>
                        </div>
                        <div className="class-stats">
                            <h5>Proficiencies</h5>
                            {this.state.profs}
                            <h5>Saving Throws</h5>
                            {this.state.saveThrows}
                            <h5>Starting Equipment</h5>
                            {this.state.startEquips}
                            <h5>Subclasses</h5>
                            {this.state.subclasses}
                        </div>
                    </div>
                </ReactTransitionGroup.CSSTransition>
            </div>

        )
    }
}
