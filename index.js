//Run asynchronous function that renders dynamic class and race sections.
start();


async function start() {
    //Api request for classes.
    let classesFromAPI = await doAPIrequest('classes/');
    // console.log(classesFromAPI);

    let arrayOfClassNames = classesFromAPI.results.map(current => current.index);
    // console.log(arrayOfClassNames);

    //Api request for races.
    let racesFromAPI = await doAPIrequest('races/');
    // console.log(racesFromAPI);

    let arrayOfRaceNames = racesFromAPI.results.map(current => current.index);
    // console.log(arrayOfRaceNames);


    // let allMyPromises = arrayOfClassNames.map(current => doAPIrequest(`classes/${current}`));
    //
    // const classDetails = await Promise.all(allMyPromises);
    // console.log(classDetails);


    //Renders class of Classes and Races to the DOM.
    ReactDOM.render(<Classes classesArray={arrayOfClassNames}/>, document.querySelector('#classes'));
    ReactDOM.render(<Races racesArray={arrayOfRaceNames}/>, document.querySelector('#races'));
}

//Run asynchronous api request and return in json format.
async function doAPIrequest(endpoint) {
    let requestUrl = 'https://www.dnd5eapi.co/api/' + endpoint;
    console.log('Fetching: ' + requestUrl);

    let response = await fetch(requestUrl);

    // Get the API response as a JSON.
    const json = await response.json();
    return json;
}