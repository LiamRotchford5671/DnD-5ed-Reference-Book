window.onload = start();

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
      <table className="table table-hover table-bordered">
        <thead className="thead-dark">
          <tr className="header">
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

async function addRow(arrayOfMonsterNames) {
  let bodyRef = document.getElementById("tableBody");
  let monsterData = await gatherData(arrayOfMonsterNames).catch((err) => {
    console.error(err);
  });

  //console.log(monsterData);

  arrayOfMonsterNames.forEach((element) => {
    let newRow = document.createElement("tr");
    newRow.className = "header";
    var nameCapitalized = element.charAt(0).toUpperCase() + element.slice(1);
    newRow.innerHTML = "<td>" + nameCapitalized + "</td>";
    bodyRef.appendChild(newRow);

    let newNestedRow = document.createElement("tr");

    newNestedRow.innerHTML = "<div>" + "data" + "</div>";
    bodyRef.appendChild(newNestedRow);
  });

  //toggle the nested expanding row
  var ua = navigator.userAgent,
    event = ua.match(/iPad/i) ? "touchstart" : "click";
  if ($(".table").length > 0) {
    $(".table .header").on(event, function () {
      $(this)
        .toggleClass("active", "")
        .nextUntil(".header")
        .css("display", function (i, v) {
          return this.style.display === "table-row" ? "none" : "table-row";
        });
    });
  }
}

function gatherData(arrayOfMonsterNames) {
  return new Promise((resolve) => {
    let dataArr = [];
    arrayOfMonsterNames.forEach(async function (element) {
      let endpoint = "monsters/" + element;
      var data = await doAPIrequest(endpoint);
      dataArr.push(data);
    });

    setTimeout(() => {
      resolve(dataArr);
    }, 4000);
  });
}
