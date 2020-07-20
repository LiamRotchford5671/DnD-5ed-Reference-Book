class Classes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toggle: false,
            classUrl: ''
        };
        this.toggleSwitch = this.toggleSwitch.bind(this);
    }

    toggleSwitch(name) {
        this.setState(state => ({
            toggle: !state.toggle,
            classUrl: name
        }));
    }

    render() {
        if (this.state.toggle) {
            return this.renderClassInfo();
        } else if (!this.state.toggle) {
            return this.renderClassMenu();
        }
    }

    renderClassMenu() {
        return (
            <div id="class-grid" className="row">
                {this.props.classesArray.map((current, i) => (
                    <div className="col-3 col-md-2 col-lg-1 col-spacing" key={i}>
                        <button className={'class-btns ' + `${current}` + '-icon'} onClick={() => this.toggleSwitch(current)}></button>
                        {current.charAt(0).toUpperCase() + current.slice(1)}
                    </div>
                ))}
            </div>
        )
    }

    renderClassInfo() {
        return (
            <div>
                <button onClick={this.toggleSwitch}>Back to grid.</button>
                <div>
                    {CheckName(this.state.classUrl)}
                </div>
            </div>
        )
    }

}

