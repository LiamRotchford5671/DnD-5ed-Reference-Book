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
      newNestedRow.className = "innerRow";
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

    if (mdata.index == "zombie") {
      console.log(mdata);
    }

    mdata.holderName = "../images/Monster-Images/" + monsterName + ".jpg";

    ReactDOM.render(
      <MonsterDetails detailsObj={mdata} />,
      document.getElementById(monsterName)
    );

    this.genChart(mdata);
  }

  genChart(mdata) {
    let mRef = document.getElementById("chartContain_" + mdata.index);
    let chartSet = document.createElement("canvas");
    chartSet.className = "mchart_" + mdata.index;
    chartSet.setAttribute("aria-label", "horizonalBar chart");
    chartSet.setAttribute("role", "img");
    mRef.appendChild(chartSet);

    var ctx = document.getElementsByClassName("mchart_" + mdata.index);

    var chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Hit Points",
          "Armor Class",
          "Challenge Rating",
          "Charisma",
          "Constitution",
          "Dexterity",
          "Intelligence",
          "Strength",
          "Wisdom",
        ],
        datasets: [
          {
            backgroundColor: [
              "rgba(255, 0, 0, 0.8)",
              "rgba(119, 136, 153, 0.8)",
              "rgba(147, 112, 219, 0.8)",
              "rgba(173, 255, 47, 0.8)",
              "rgba(32, 178, 170, 0.8)",
              "rgba(50, 205, 50, 0.8)",
              "rgba(30, 144, 255, 0.8)",
              "rgba(255, 191, 0, 0.8)",
              "rgba(95, 158, 160, 0.8)",
            ],
            borderColor: [
              "rgba(255, 0, 0, 1)",
              "rgba(119, 136, 153, 1)",
              "rgba(147, 112, 219, 1)",
              "rgba(173, 255, 47, 1)",
              "rgba(32, 178, 170, 1)",
              "rgba(50, 205, 50, 1)",
              "rgba(30, 144, 255, 1)",
              "rgba(255, 191, 0, 0.8)",
              "rgba(95, 158, 160, 0.8)",
            ],
            data: [
              mdata.hit_points,
              mdata.armor_class,
              mdata.challenge_rating,
              mdata.charisma,
              mdata.constitution,
              mdata.dexterity,
              mdata.intelligence,
              mdata.strength,
              mdata.wisdom,
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRation: false,
        legend: {
          display: false,
        },
      },
    });
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
      <div
        className="grid-container"
        id={"contain_" + this.props.detailsObj.index}
      >
        <img
          src={this.props.detailsObj.holderName}
          className="image"
          onError={(event) =>
            event.target.setAttribute(
              "src",
              "../images/Monster-Images/non-img.png"
            )
          }
          alt={this.props.detailsObj.holderName + " image"}
        />
        <section id={"chartContain_" + this.props.detailsObj.index}></section>
        <section id={"contentLeft_" + this.props.detailsObj.index}>
          <h5>Type:</h5>
          <p>{this.props.detailsObj.type}</p>
          <h5>Alignment:</h5>
          <p>{this.props.detailsObj.alignment}</p>
          <h5>Hit Dice:</h5>
          <p>{this.props.detailsObj.hit_dice}</p>
          <h5>Languages</h5>
          <p>{this.props.detailsObj.languages}</p>
          <h5>Size:</h5>
          <p>{this.props.detailsObj.size}</p>
        </section>

        <section id={"contentRight_" + this.props.detailsObj.index}></section>
      </div>
    );
  }
}
