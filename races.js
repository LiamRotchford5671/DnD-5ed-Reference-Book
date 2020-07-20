class Races extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toggle: false,
            classUrl: ''
        };
        this.toggleSwitch = this.toggleSwitch.bind(this);
    }

    toggleSwitch() {
        this.setState(state => ({
            toggle: !state.toggle
        }));
    }

    render() {
        if (this.state.toggle) {
            return this.renderRaceInfo();
        } else if (!this.state.toggle) {
            return this.renderRaceMenu();
        }
    }

    renderRaceMenu() {
        return (
            <div id="races-grid" className="row">
                {this.props.racesArray.map((current, i) => (
                    <div className="col-3 col-md-2 col-lg-1 col-spacing" key={i}>
                        <button className={'race-btns ' + `${current}` + '-icon'} onClick={this.toggleSwitch}></button>
                        {current.charAt(0).toUpperCase() + current.slice(1)}
                    </div>
                ))}
            </div>
        )
    }

    renderRaceInfo() {
        return (
            // TODO:  Figure out which button "onClicked" you, display info as necessary.
            <button onClick={this.toggleSwitch}>Back to grid.</button>
        )
    }

}