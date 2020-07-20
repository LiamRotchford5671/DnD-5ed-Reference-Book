class Classes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toggle: false,
            name: 'Blank Name'
        };
        this.toggleSwitch = this.toggleSwitch.bind(this);

        // How can I wait for this to finish before proceeding?
        // because constructors cant be "async".
        this.storedAPIData = await doAPIrequest('classes/');
    }

    toggleSwitch() {
        this.setState(state => ({
            toggle: !state.toggle
        }));
    }


    render() {
        if (this.state.toggle) {
            return (
                <h3 className="titles" onClick={this.toggleSwitch}>ON!</h3>
            )
        } else if (!this.state.toggle) {
            // return (
            //     <h3 className="titles" onClick={this.toggleSwitch}>OFF!</h3>
            // )
            return this.renderDefault();
        }
    }

    renderDefault() {

        const myArray = ["barbarian",
                         "bard",
                         "cleric"];

        return (
            <div id="class-grid" className="row">
                {myArray.map(current => (
                    <div className="col-3 col-md-2 col-lg-1 col-spacing">
                        <button className={'class-btns ' + `${current}` + '-icon'} onClick={this.toggleSwitch}></button>
                        {current.charAt(0).toUpperCase() + current.slice(1)}
                    </div>
                ))}
            </div>
        )
    }



}


ReactDOM.render(<Classes />, document.querySelector('#classes'));
