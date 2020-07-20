start();

async function start() {
    let classesFromAPI = await doAPIrequest('classes/');
    console.log(classesFromAPI);

    let arrayOfNames = classesFromAPI.results.map(current => current.index);
    console.log(arrayOfNames);

    let allMyPromises = arrayOfNames.map(current => doAPIrequest(`classes/${current}`));

    const classDetails = await Promise.all(allMyPromises);
    console.log(classDetails);
}



async function doAPIrequest(endpoint) {
    let requestUrl = 'https://www.dnd5eapi.co/api/' + endpoint;
    console.log('Fetching: ' + requestUrl);


    let response = await fetch(requestUrl)

    // Get the API response as a JSON.
    const json = await response.json();
    return json;
}