class Classes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toggle: false,
            name: 'Blank Name'
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
            return this.renderInfoAboutClass();
        } else if (!this.state.toggle) {
            // return (
            //     <h3 className="titles" onClick={this.toggleSwitch}>OFF!</h3>
            // )
            return this.renderMenuWithButtons();
        }
    }

    renderMenuWithButtons() {
        return (
            <div id="class-grid" className="row">
                {this.props.injectedArray.map(current => (
                    <div className="col-3 col-md-2 col-lg-1 col-spacing">
                        <button className={'class-btns ' + `${current}` + '-icon'} onClick={this.toggleSwitch}></button>
                        {current.charAt(0).toUpperCase() + current.slice(1)}
                    </div>
                ))}
            </div>
        )
    }

    renderInfoAboutClass() {
        return (
            // TODO:  Figure out which button "onClicked" you, display info as necessary.
            <h3 className="titles" onClick={this.toggleSwitch}>ON!</h3>
        )
    }

}



start();

async function start() {
    let classesFromAPI = await doAPIrequest('classes/');
    console.log(classesFromAPI);

    let arrayOfNames = classesFromAPI.results.map(current => current.index);
    console.log(arrayOfNames);

    let allMyPromises = arrayOfNames.map(current => doAPIrequest(`classes/${current}`));

    const classDetails = await Promise.all(allMyPromises);
    console.log(classDetails);

    ReactDOM.render(<Classes injectedArray={arrayOfNames}/>, document.querySelector('#classes'));

}