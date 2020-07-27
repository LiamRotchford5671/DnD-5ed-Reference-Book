window.onload = function () {
  start();
};

class Monsters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: true,
      monsterUrl: "",
      name: "",
      data: [],
    };
  }

  //Render elements to DOM.
  render() {
    return (
      <table className="table table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody id="tableBody"></tbody>
      </table>
    );
  }
}

async function start() {
  //Api request for classes.
  let monstersFromAPI = await doAPIrequest("monsters/");
  //console.log(monstersFromAPI);

  let arrayOfMonsterNames = monstersFromAPI.results.map(
    (current) => current.index
  );

  ReactDOM.render(<Monsters />, document.getElementById("dataTable"));
  addRow(arrayOfMonsterNames);
}

//Run asynchronous api request and return in json format.
async function doAPIrequest(endpoint) {
  let requestUrl = "https://www.dnd5eapi.co/api/" + endpoint;
  //console.log("Fetching: " + requestUrl);

  let response = await fetch(requestUrl);

  // Get the API response as a JSON.
  const json = await response.json();
  return json;
}

function addRow(arrayOfMonsterNames) {
  let bodyRef = document.getElementById("tableBody");

  arrayOfMonsterNames.forEach((element) => {
    let newRow = document.createElement("tr");
    newRow.innerHTML = "<td>" + element + "</td>";
    bodyRef.appendChild(newRow);
  });
}
