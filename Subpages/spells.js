class Spells extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: true,
      spellUrl: "",
      data: [],
    };
  }

  //Render elements to DOM.
  render() {
    this.construct();
    return (
      <table id="spellTable" className="table table-hover table-bordered">
        <thead className="thead-dark">
          <tr className="header">
            <th>Spell Name</th>
          </tr>
        </thead>
        <tbody id="tableBody"></tbody>
      </table>
    );
  }

  async construct() {
    //Api request for classes.
    let spellsFromAPI = await this.doAPIrequest("spells/");
    //console.log(spellsFromAPI);

    let arrayOfSpellNames = spellsFromAPI.results.map(
      (current) => current.index
    );

    this.buildRows(arrayOfSpellNames);
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

  buildRows(arrayOfSpellNames) {
    let bodyRef = document.getElementById("tableBody");

    arrayOfSpellNames.forEach((element) => {
      let newRow = document.createElement("tr");
      var nameCapitalized = element.charAt(0).toUpperCase() + element.slice(1);
      nameCapitalized = nameCapitalized.replace(/-/g, " ");
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

  async constructInnerData(spellName) {
    let endpoint = "spells/" + spellName;
    var sdata = await this.doAPIrequest(endpoint);

    //console.log(sdata);

    sdata.holderName = "../images/Spell-Images/" + sdata.school.name + ".png";

    ReactDOM.render(
      <SpellDetails detailsObj={sdata} />,
      document.getElementById(spellName)
    );
  }
}

class SpellDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      toggle: true,
      spellUrl: "",
      data: [],
    };
  }

  render() {
    return (
      <td>
        <div
          className="grid-containerNonChartSpells"
          id={"contain_" + this.props.detailsObj.index}
        >
          <img
            src={this.props.detailsObj.holderName}
            className="spellImage"
            onError={(event) =>
              event.target.setAttribute(
                "src",
                "../images/Spell-Images/undefined.png"
              )
            }
            alt={this.props.detailsObj.holderName + " image"}
          />

          <section id={"contentLeft_" + this.props.detailsObj.index}>
            <h5>School:</h5>
            <p>{this.props.detailsObj.school.name}</p>
            <h5>Classes:</h5>
            <p>{this.props.detailsObj.classes.name}</p>
            <h5>Level:</h5>
            <p>{this.props.detailsObj.level}</p>
            <h5>Damage Type:</h5>
          </section>
          <section id={"contentMid_" + this.props.detailsObj.index}>
            <h5>Range:</h5>
            <p>{this.props.detailsObj.range}</p>
            <h5>Casting Time:</h5>
            <p>{this.props.detailsObj.casting_time}</p>
            <h5>Duration:</h5>
            <p>{this.props.detailsObj.duration}</p>
          </section>
          <section id={"contentRight_" + this.props.detailsObj.index}>
            <h5>Material:</h5>
            <p>{this.props.detailsObj.material}</p>
            <h5>Components:</h5>
            <p>{this.props.detailsObj.components}</p>
            <h5>Ritual:</h5>
            <p>{this.props.detailsObj.ritual}</p>
            <h5>Concentration:</h5>
            <p>{this.props.detailsObj.concentration}</p>
          </section>
        </div>

        <section id={"contentBottom_" + this.props.detailsObj.index}>
          <h5>Description:</h5>
          <p>{this.props.detailsObj.desc}</p>
          <h5>Higher Level:</h5>
          <p>{this.props.detailsObj.higher_level}</p>
        </section>
      </td>
    );
  }
}
