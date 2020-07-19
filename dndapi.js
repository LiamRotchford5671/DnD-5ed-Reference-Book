var apiDataList = [];

class ApiFetchData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: 'https://www.dnd5eapi.co/api/classes',
            dataName: []
        }
    }

    fetchFunction() {
        console.log("Fetching");
        fetch('https://www.dnd5eapi.co/api/classes')
            .then(response => {
                console.log('Request successful');
                return response.json();
            })
            .then(data => {
                console.log('Inside fetch then');
                data.results.forEach(result => {
                    this.state.dataName.push(result.name);
                });
            })
            .catch(error => {
            console.log('Request failed', error);
        });
    }

    render() {
        console.log("Rendering");
        console.log(this.state.dataName);
            return (
                <p>Data name here: {this.state.dataName[0]}</p>
                // <h4>Test</h4>,
                // <p>Input text here: Text here</p>,
                // <div className="description">
                //     <p>Description text here.</p>
                // </div>
            )
    }
}

function testFunction() {
    return 100;
}

function ProcessApiData() {
    var apiData = new ApiFetchData();
    apiData.fetchFunction();
    console.log("testing" + apiData.dataName);
    // new Promise(apiData.fetchFunction)
    //     .then(response => {
    //         console.log('Fetch successful' + response);
    //     })
    //     //     console.log("in filter api data by class: ")
    //     //     console.log(apiData.apiResultData)
    //     // })
    //     .catch(error => {
    //         console.log('Processing failed', error)
    //     });

    return (
        'testing '
    )
}

// export default ApiFetchData;