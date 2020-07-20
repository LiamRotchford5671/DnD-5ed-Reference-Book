class Classes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toggle: false,
            classUrl: '',
            name: '',
            data: []
        };
        this.buttonClickEvent = this.buttonClickEvent.bind(this);
    }

    //On click, toggles between nav and info section.
    //If state is set for info section, run asynchronous function to get and set api data.
    buttonClickEvent(name) {
        this.setState(state => ({
            toggle: !state.toggle
        }));

        if (this.state.toggle === false) {
            const classInfoRequest = async () => {
                await this.setState({
                    classUrl: name
                })
                const results = await doAPIrequest(`classes/` + this.state.classUrl + '/');
                console.log(results);

                this.setState({
                    name: results.name,
                    data: results.hit_die
                });
            };
            classInfoRequest();
        } else {
            this.setState({
                name: '',
                data: []
            });
        }
    }

    //Structure for rendered DOM elements.
    render() {
        if (this.state.toggle) {
            return this.renderClassInfo();
        } else if (!this.state.toggle) {
            return this.renderClassNav();
        }
    }

    renderClassNav() {
        return (
            <div id="class-grid" className="row">
                {this.props.classesArray.map((current, i) => (
                    <div className="col-3 col-md-2 col-lg-1 col-spacing" key={i}>
                        <button className={'class-btns ' + `${current}` + '-icon'} onClick={() => this.buttonClickEvent(current)}></button>
                        {current.charAt(0).toUpperCase() + current.slice(1)}
                    </div>
                ))}
            </div>
        )
    }

    renderClassInfo() {
        return (
            <div>
                <div>
                    <h4>{this.state.name}</h4>
                    <p>Hit die: {this.state.data}</p>
                    <img src={'./images/Class-Images/' + `${this.state.classUrl}` + '.png'} alt={this.state.classUrl} />
                </div>
                <button onClick={this.buttonClickEvent}>Back to grid</button>
            </div>
        )
    }

}

