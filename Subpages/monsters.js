class Monsters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: true,
      monsterUrl: "",
      data: [],
    };
  }

  //Render elements to DOM.
  render() {
    this.construct();
    return (
      <table id="monsterTable" className="table table-hover table-bordered">
        <thead className="thead-dark">
          <tr className="header">
            <th>Monster Name</th>
          </tr>
        </thead>
        <tbody id="tableBody"></tbody>
      </table>
    );
  }

  async construct() {
    //Api request for classes.
    let monstersFromAPI = await this.doAPIrequest("monsters/");
    //console.log(monstersFromAPI);

    let arrayOfMonsterNames = monstersFromAPI.results.map(
      (current) => current.index
    );

    this.buildRows(arrayOfMonsterNames);
  }

  //Run asynchronous api request and return in json format.
  async doAPIrequest(endpoint) {
    let requestUrl = "https://www.dnd5eapi.co/api/" + endpoint;
    //console.log("Fetching: " + requestUrl);

    let response = await fetch(requestUrl);

    // Get the API response as a JSON.
    const json = await response.json();
    return json;
  }

  buildRows(arrayOfMonsterNames) {
    let bodyRef = document.getElementById("tableBody");

    arrayOfMonsterNames.forEach((element) => {
      let newRow = document.createElement("tr");
      var nameCapitalized = element.charAt(0).toUpperCase() + element.slice(1);
      newRow.className = "header";
      newRow.setAttribute("value", element);
      newRow.innerHTML = "<td>" + nameCapitalized + "</td>";
      bodyRef.appendChild(newRow);

      let newNestedRow = document.createElement("tr");
      newNestedRow.innerHTML = '<div class="innerRow"></div>';
      newNestedRow.setAttribute("id", element);
      bodyRef.appendChild(newNestedRow);

      this.constructInnerData(element);
    });

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

  async constructInnerData(monsterName) {
    let endpoint = "monsters/" + monsterName;
    var mdata = await this.doAPIrequest(endpoint);
    //console.log(mdata);
    mdata.holderName = "../images/Monster-Images/" + monsterName + ".jpg";

    ReactDOM.render(
      <MonsterDetails detailsObj={mdata} />,
      document.getElementById(monsterName)
    );
  }
}

class MonsterDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      toggle: true,
      monsterUrl: "",
      data: [],
    };
  }

  render() {
    return (
      <div>
        <img
          src={this.props.detailsObj.holderName}
          onError={(event) =>
            event.target.setAttribute(
              "src",
              "../images/Monster-Images/non-img.png"
            )
          }
          alt={this.props.detailsObj.holderName + " image"}
        />
        {this.props.detailsObj.type}
      </div>
    );
  }
}
