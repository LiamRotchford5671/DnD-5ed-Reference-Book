// start();
//
// async function start() {
//     let classesFromAPI = await doAPIrequest('classes/');
//     console.log(classesFromAPI);
//
//     let arrayOfNames = classesFromAPI.results.map(current => current.index);
//     console.log(arrayOfNames);
//
//     let allMyPromises = arrayOfNames.map(current => doAPIrequest(`classes/${current}`));
//
//     const classDetails = await Promise.all(allMyPromises);
//     console.log(classDetails);
// }
//
//

async function doAPIrequest(endpoint) {
    let requestUrl = 'https://www.dnd5eapi.co/api/' + endpoint;
    console.log('Fetching: ' + requestUrl);


    let response = await fetch(requestUrl)

    // Get the API response as a JSON.
    const json = await response.json();
    return json;
}

start();


async function start(props) {
    //Api request for classes.
    let classesFromAPI = await doAPIrequest('classes/');
    console.log(classesFromAPI);

    let arrayOfClassNames = classesFromAPI.results.map(current => current.index);
    console.log(arrayOfClassNames);

    //Api request for races.
    let racesFromAPI = await doAPIrequest('races/');
    console.log(racesFromAPI);

    let arrayOfRaceNames = racesFromAPI.results.map(current => current.index);
    console.log(arrayOfRaceNames);


    // let allMyPromises = arrayOfClassNames.map(current => doAPIrequest(`classes/${current}`));
    //
    // const classDetails = await Promise.all(allMyPromises);
    // console.log(classDetails);

    ReactDOM.render(<Classes classesArray={arrayOfClassNames}/>, document.querySelector('#classes'));
    ReactDOM.render(<Races racesArray={arrayOfRaceNames}/>, document.querySelector('#races'));
}



function CheckName(urlname) {
    // let classInfoFromApi = await doAPIrequest(`classes/${urlname}`)
    // console.log(classInfoFromApi.hit_die);
    //
    // return classInfoFromApi.hit_die;

    return urlname;

}