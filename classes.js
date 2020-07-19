// import ApiFetchData from './dndapi';
<script src="dndapi.js"></script>

class ClassPage extends React.Component {
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
                <div id="class-grid" className="row">
                    <div className="col-3 col-md-2 col-lg-1 col-spacing">
                        <button className="class-btns barbarian-icon" onClick={this.toggleSwitch}></button>
                        Barbarian
                    </div>
                    <div className="col-3 col-md-2 col-lg-1 col-spacing">
                        <button className="class-btns bard-icon" onClick={this.toggleSwitch}></button>
                        Bard
                    </div>
                    <div className="col-3 col-md-2 col-lg-1 col-spacing">
                        <button className="class-btns cleric-icon" onClick={this.toggleSwitch}></button>
                        Cleric
                    </div>
                    <div className="col-3 col-md-2 col-lg-1 col-spacing">
                        <button className="class-btns druid-icon" onClick={this.toggleSwitch}></button>
                        Druid
                    </div>
                    <div className="col-3 col-md-2 col-lg-1 col-spacing">
                        <button className="class-btns fighter-icon" onClick={this.toggleSwitch}></button>
                        Fighter
                    </div>
                    <div className="col-3 col-md-2 col-lg-1 col-spacing">
                        <button className="class-btns monk-icon" onClick={this.toggleSwitch}></button>
                        Monk
                    </div>
                    <div className="col-3 col-md-2 col-lg-1 col-spacing">
                        <button className="class-btns paladin-icon" onClick={this.toggleSwitch}></button>
                        Paladin
                    </div>
                    <div className="col-3 col-md-2 col-lg-1 col-spacing">
                        <button className="class-btns ranger-icon" onClick={this.toggleSwitch}></button>
                        Ranger
                    </div>
                    <div className="col-3 col-md-2 col-lg-1 col-spacing">
                        <button className="class-btns rouge-icon" onClick={this.toggleSwitch}></button>
                        Rogue
                    </div>
                    <div className="col-3 col-md-2 col-lg-1 col-spacing">
                        <button className="class-btns sorcerer-icon" onClick={this.toggleSwitch}></button>
                        Sorcerer
                    </div>
                    <div className="col-3 col-md-2 col-lg-1 col-spacing">
                        <button className="class-btns warlock-icon" onClick={this.toggleSwitch}></button>
                        Warlock
                    </div>
                    <div className="col-3 col-md-2 col-lg-1 col-spacing">
                        <button className="class-btns wizard-icon" onClick={this.toggleSwitch}></button>
                        Wizard
                    </div>
                </div>
            )
        } else if (!this.state.toggle) {
            return (
                <div className="section-info">
                    <ProcessApiData />
                    <p>Button name: </p>
                    <button onClick={this.toggleSwitch}>Back to grid</button>
                </div>
            )
        }
    }
}

ReactDOM.render(<ClassPage />, document.querySelector('#classes'));
