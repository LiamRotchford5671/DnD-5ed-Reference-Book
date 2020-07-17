class RacesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggle: true,
            name: 'Blank Name'
        };
        this.toggleSwitch = this.toggleSwitch.bind(this);
        this.InputText = this.InputText.bind(this);
    }

    toggleSwitch() {
        this.setState(state => ({
            toggle: !state.toggle
        }));
    }

    InputText() {
        if (this.state.toggle) {
            return ('On')
        } else if(!this.state.toggle) {
            return ('Off')
        }
    }

    render() {
        if (this.state.toggle) {
            return (
                <div id="races-grid" className="row">
                    <div className="col-4 col-md-4 col-lg-1 col-spacing">
                        <button className="race-btns dragonborn-icon" onClick={this.toggleSwitch}></button>
                        Dragonborn
                    </div>
                    <div className="col-4 col-md-4 col-lg-1 col-spacing">
                        <button className="race-btns dwarf-icon" onClick={this.toggleSwitch}></button>
                        Dwarf
                    </div>
                    <div className="col-4 col-md-4 col-lg-1 col-spacing">
                        <button className="race-btns elf-icon" onClick={this.toggleSwitch}></button>
                        Elf
                    </div>
                    <div className="col-4 col-md-4 col-lg-1 col-spacing">
                        <button className="race-btns gnome-icon" onClick={this.toggleSwitch}></button>
                        Gnome
                    </div>
                    <div className="col-4 col-md-4 col-lg-1 col-spacing">
                        <button className="race-btns half-elf-icon" onClick={this.toggleSwitch}></button>
                        Half-Elf
                    </div>
                    <div className="col-4 col-md-4 col-lg-1 col-spacing">
                        <button className="race-btns half-orc-icon" onClick={this.toggleSwitch}></button>
                        Half-Orc
                    </div>
                    <div className="col-4 col-md-4 col-lg-1 col-spacing">
                        <button className="race-btns halfling-icon" onClick={this.toggleSwitch}></button>
                        Halfling
                    </div>
                    <div className="col-4 col-md-4 col-lg-1 col-spacing">
                        <button className="race-btns human-icon" onClick={this.toggleSwitch}></button>
                        Human
                    </div>
                    <div className="col-4 col-md-4 col-lg-1 col-spacing">
                        <button className="race-btns tiefling-icon" onClick={this.toggleSwitch}></button>
                        Tiefling
                    </div>
                </div>
            )
        } else if (!this.state.toggle) {
            return (
                <div id="classInfo">
                    <ProcessApiData />
                    <p>Button name: </p>
                    <button onClick={this.toggleSwitch}>Back to grid</button>
                </div>
            )
        }
    }
}

ReactDOM.render(<RacesPage />, document.querySelector('#races'));