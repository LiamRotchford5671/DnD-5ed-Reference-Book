class ApiFetchData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: 'https://www.dnd5eapi.co/api/classes',
            dataNameList: ['Testing class array'],
            dataUrlList: []
        }
        this.apiResultData = [];
    }

    // apiResultData;

    fetchFunction() {
        var localVariable = []
        fetch('https://www.dnd5eapi.co/api/classes')
            .then(response => {
                console.log('Request successful');
                return response.json();
            })
            .then(data => {
                console.log('Inside fetch then');

                data.results.forEach(result => {
                    localVariable.push(result.name);
                });
            })
            .catch(error => {
            console.log('Request failed', error);
        });
    }

    render() {
            // return [
            //     <h4>{this.state.dataNameList[1]}</h4>,
            //     <p>Input text here: {this.state.dataUrlList[1]}</p>,
            //     <div className="description">
            //         <p>Description text here.</p>
            //     </div>
            // ]
    }
}

function ProcessApiData () {
    var apiData = new ApiFetchData();

    new Promise(apiData.fetchFunction)
        .then(() => {
            console.log('globalVariable');
        })
        //     console.log("in filter api data by class: ")
        //     console.log(apiData.apiResultData)
        // })
        .catch(error => {
            console.log('Processing failed', error)
        });

    return (
        'testing '
    )
}

// export default ApiFetchData;