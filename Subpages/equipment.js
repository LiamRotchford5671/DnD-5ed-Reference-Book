class Equipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: true,
      equipUrl: "",
      data: [],
    };
  }

  //Render elements to DOM.
  render() {
    this.construct();
    return (
      <table id="equipTable" className="table table-hover table-bordered">
        <thead className="thead-dark">
          <tr className="header">
            <th>Equipment Name</th>
          </tr>
        </thead>
        <tbody id="tableBody"></tbody>
      </table>
    );
  }

  async construct() {
    //Api request for classes.
    let equipmentFromAPI = await this.doAPIrequest("equipment/");
    //console.log(equipmentFromAPI);

    let arrayOfequipmentNames = equipmentFromAPI.results.map(
      (current) => current.index
    );

    this.buildRows(arrayOfequipmentNames);
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

  buildRows(arrayOfequipmentNames) {
    let bodyRef = document.getElementById("tableBody");

    arrayOfequipmentNames.forEach((element) => {
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

  async constructInnerData(equipmentName) {
    let endpoint = "equipment/" + equipmentName;
    var edata = await this.doAPIrequest(endpoint);

    //console.log(edata);

    edata.holderName = "../images/Equipment-Images/" + edata.index + ".jpeg";

    this.determineRender(edata);
  }

  determineRender(edata) {
    switch (edata.equipment_category.name) {
      case "Adventuring Gear":
      case "Standard Gear":
      case "Tools":
      case "Other Tools":
      case "Kits":
      case "Artisan's Tools":
      case "Gaming Sets":
      case "Musical Instruments":
      case "Equipment Packs":
        if (edata.index.includes("pack") && edata.index != "backpack") {
          ReactDOM.render(
            <EquipmentPacks detailsObj={edata} />,
            document.getElementById(edata.index)
          );
          this.genItemTable(edata);
        } else {
          ReactDOM.render(
            <Gear detailsObj={edata} />,
            document.getElementById(edata.index)
          );
        }
        break;

      case "Armor":
      case "Light Armor":
      case "Medium Armor":
      case "Heavy Armor":
      case "Shields":
        ReactDOM.render(
          <Armor detailsObj={edata} />,
          document.getElementById(edata.index)
        );
        this.genArmorChart(edata);
        break;

      case "Martial Melee Weapons":
      case "Martial Ranged Weapons":
      case "Martial Weapons":
      case "Simple Melee Weapons":
      case "Simple Ranged Weapons":
      case "Simple Weapons":
      case "Weapon":
        ReactDOM.render(
          <Weapons detailsObj={edata} />,
          document.getElementById(edata.index)
        );
        this.genWeaponOmits(edata);
        break;
      case "Mounts and Vehicles":
      case "Mounts and Other Animals":
      case "Land Vehicles":
      case "Tack, Harness, and Drawn Vehicles":
      case "Waterborne Vehicles":
        if (edata.index.includes("barding")) {
          ReactDOM.render(
            <BardingVehicles detailsObj={edata} />,
            document.getElementById(edata.index)
          );
        } else {
          ReactDOM.render(
            <MountsVehicles detailsObj={edata} />,
            document.getElementById(edata.index)
          );
          this.genVehicleOmits(edata);
        }
        break;
    }
  }

  genArmorChart(edata) {
    let eRef = document.getElementById("chartContain_" + edata.index);
    let chartSet = document.createElement("canvas");
    chartSet.className = "echart_" + edata.index;
    chartSet.setAttribute("aria-label", "horizontalBar chart");
    chartSet.setAttribute("role", "img");
    eRef.appendChild(chartSet);

    var ctx = document.getElementsByClassName("echart_" + edata.index);

    var chart = new Chart(ctx, {
      type: "horizontalBar",
      data: {
        labels: ["Base Points", "Strength Min-Requirement", "Weight"],
        datasets: [
          {
            backgroundColor: [
              "rgba(30, 144, 255, 0.8)",
              "rgba(255, 165, 0, 0.8)",
              "rgba(50, 205, 50, 0.8)",
            ],
            borderColor: [
              "rgba(30, 144, 255, 1)",
              "rgba(255, 165, 0, 1)",
              "rgba(50, 205, 50, 1)",
            ],
            data: [edata.armor_class.base, edata.str_minimum, edata.weight],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
      },
    });
  }

  genItemTable(edata) {
    let itemRef = document.getElementById("equipPack_" + edata.index);
    edata.contents.forEach((element) => {
      let newItem = document.createElement("p");
      let itemURLArray = element.item_url.split("/");
      let nameCapitalized =
        itemURLArray[3].charAt(0).toUpperCase() + itemURLArray[3].slice(1);

      newItem.innerHTML = nameCapitalized + " ~ " + element.quantity;
      itemRef.appendChild(newItem);
      itemRef.appendChild(document.createElement("hr"));
    });
  }

  genWeaponOmits(edata) {
    if ("damage" in edata) {
      let damageRef = document.getElementById("weaponDamage_" + edata.index);
      let dmgtitle = document.createElement("h5");
      dmgtitle.innerHTML = "Damage:";
      damageRef.appendChild(dmgtitle);

      let dmgSubtitleOne = document.createElement("h6");
      dmgSubtitleOne.innerHTML = "Damage Dice:";
      damageRef.appendChild(dmgSubtitleOne);

      let dmgDice = document.createElement("p");
      dmgDice.innerHTML = edata.damage.damage_dice;
      damageRef.appendChild(dmgDice);

      let dmgSubtitleTwo = document.createElement("h6");
      dmgSubtitleTwo.innerHTML = "Damage Type:";
      damageRef.appendChild(dmgSubtitleTwo);

      let dmgType = document.createElement("p");
      dmgType.innerHTML = edata.damage.damage_type.name;
      damageRef.appendChild(dmgType);
    }

    if ("throw_range" in edata) {
      let throwRef = document.getElementById("weaponThrowRange_" + edata.index);
      let thrtitle = document.createElement("h5");
      thrtitle.innerHTML = "Throw Range:";
      throwRef.appendChild(thrtitle);

      let throwSubtitleOne = document.createElement("h6");
      throwSubtitleOne.innerHTML = "Normal:";
      throwRef.appendChild(throwSubtitleOne);

      let throwNormal = document.createElement("p");
      throwNormal.innerHTML = edata.throw_range.normal;
      throwRef.appendChild(throwNormal);

      let throwSubtitleTwo = document.createElement("h6");
      throwSubtitleTwo.innerHTML = "Long:";
      throwRef.appendChild(throwSubtitleTwo);

      let throwLong = document.createElement("p");
      throwLong.innerHTML = edata.throw_range.long;
      throwRef.appendChild(throwLong);
    }

    if ("special" in edata) {
      let specialRef = document.getElementById("weaponSpecial_" + edata.index);
      let specialTitle = document.createElement("h5");
      specialTitle.innerHTML = "Special Effect:";
      specialRef.appendChild(specialTitle);

      let specialContent = document.createElement("p");
      specialContent.innerHTML = edata.special;
      specialRef.appendChild(specialContent);
    }
  }

  genVehicleOmits(edata) {
    if ("speed" in edata) {
      let speedRef = document.getElementById("vehicleSpeed_" + edata.index);
      let speedTitle = document.createElement("h5");
      speedTitle.innerHTML = "Speed:";
      speedRef.appendChild(speedTitle);

      let speedContent = document.createElement("p");
      speedContent.innerHTML = edata.speed.quantity + " " + edata.speed.unit;
      speedRef.appendChild(speedContent);
    }
    if ("capacity" in edata) {
      let capacityRef = document.getElementById(
        "vehicleCapacity_" + edata.index
      );
      let capacityTitle = document.createElement("h5");
      capacityTitle.innerHTML = "Capacity:";
      capacityRef.appendChild(capacityTitle);

      let capacityContent = document.createElement("p");
      capacityContent.innerHTML = edata.capacity;
      capacityRef.appendChild(capacityContent);
    }
    if ("weight" in edata) {
      let weightRef = document.getElementById("vehicleWeight_" + edata.index);
      let weightTitle = document.createElement("h5");
      weightTitle.innerHTML = "Weight:";
      weightRef.appendChild(weightTitle);

      let weightContent = document.createElement("p");
      weightContent.innerHTML = edata.weight;
      weightRef.appendChild(weightContent);
    }
  }
}

/*==============================================================================
  ==============================================================================
  Selective React Class Rendering 
*/

class Gear extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <td>
        <div
          className="grid-containerNonChart"
          id={"contain_" + this.props.detailsObj.index}
        >
          <img
            src={this.props.detailsObj.holderName}
            className="equipImage"
            alt={this.props.detailsObj.holderName + " image"}
          />
          <section id={"contentLeft_" + this.props.detailsObj.index}>
            <h5>Equipment Category:</h5>
            <p>{this.props.detailsObj.equipment_category.name}</p>
            <h5>Gear Category:</h5>
            <p>{this.props.detailsObj.gear_category}</p>
            <h5>Cost:</h5>
            <p>
              {this.props.detailsObj.cost.quantity + " "}{" "}
              {this.props.detailsObj.cost.unit}
            </p>
          </section>
          <section id={"contentRight_" + this.props.detailsObj.index}>
            <h5>Quantity</h5>
            <p>{this.props.detailsObj.quantity}</p>
            <h5>Weight:</h5>
            <p>{this.props.detailsObj.weight}</p>
          </section>
        </div>
        <section id={"contentBottom_" + this.props.detailsObj.index}>
          <h5>Description:</h5>
          <p>{this.props.detailsObj.desc}</p>
        </section>
      </td>
    );
  }
}

class Armor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <td>
        <div
          className="grid-containerChart"
          id={"contain_" + this.props.detailsObj.index}
        >
          <img
            src={this.props.detailsObj.holderName}
            className="equipImage"
            alt={this.props.detailsObj.holderName + " image"}
          />

          <section id={"chartContain_" + this.props.detailsObj.index}></section>

          <section id={"contentLeft_" + this.props.detailsObj.index}>
            <h5>Armor Category:</h5>
            <p>{this.props.detailsObj.armor_category}</p>
            <h5>Dexterity Bonus:</h5>
            <p>{this.props.detailsObj.armor_class.dex_bonus.toString()}</p>
            <h5>Stealth Disadvantage:</h5>
            <p>{this.props.detailsObj.stealth_disadvantage.toString()}</p>
            <h5>Cost:</h5>
            <p>
              {this.props.detailsObj.cost.quantity + " "}{" "}
              {this.props.detailsObj.cost.unit}
            </p>
          </section>
        </div>
      </td>
    );
  }
}

class EquipmentPacks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <td>
        <div
          className="grid-containerNonChart"
          id={"contain_" + this.props.detailsObj.index}
        >
          <img
            src={this.props.detailsObj.holderName}
            className="equipImage"
            alt={this.props.detailsObj.holderName + " image"}
          />
          <section id={"contentLeft_" + this.props.detailsObj.index}>
            <h5>Gear Category:</h5>
            <p>{this.props.detailsObj.gear_category}</p>
            <h5>Cost:</h5>
            <p>
              {this.props.detailsObj.cost.quantity + " "}{" "}
              {this.props.detailsObj.cost.unit}
            </p>
          </section>

          <section id={"contentRight_" + this.props.detailsObj.index}>
            <h5>Pack Contents:</h5>
            <h6>Item ~ Quantity</h6>
            <div id={"equipPack_" + this.props.detailsObj.index}></div>
          </section>
        </div>
      </td>
    );
  }
}

class Weapons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <td>
        <div
          className="grid-containerNonChart"
          id={"contain_" + this.props.detailsObj.index}
        >
          <img
            src={this.props.detailsObj.holderName}
            className="equipImage"
            alt={this.props.detailsObj.holderName + " image"}
          />
          <section id={"contentLeft_" + this.props.detailsObj.index}>
            <h5>Weapon Category:</h5>
            <p>{this.props.detailsObj.category_range}</p>
            <div id={"weaponDamage_" + this.props.detailsObj.index}></div>

            <h5>Cost:</h5>
            <p>
              {this.props.detailsObj.cost.quantity + " "}{" "}
              {this.props.detailsObj.cost.unit}
            </p>
          </section>
          <section id={"contentRight_" + this.props.detailsObj.index}>
            <h5>Range:</h5>
            <h6>Normal:</h6>
            <p>{this.props.detailsObj.range.normal}</p>
            <h6>Long:</h6>
            <p>{this.props.detailsObj.range.long}</p>
            <div id={"weaponThrowRange_" + this.props.detailsObj.index}></div>
            <h5>Weight:</h5>
            <p>{this.props.detailsObj.weight}</p>
          </section>
        </div>
        <section id={"contentBottom_" + this.props.detailsObj.index}>
          <div id={"weaponSpecial_" + this.props.detailsObj.index}></div>
        </section>
      </td>
    );
  }
}

class MountsVehicles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <td
        className="grid-containerNonChart"
        id={"contain_" + this.props.detailsObj.index}
      >
        <img
          src={this.props.detailsObj.holderName}
          className="equipImage"
          alt={this.props.detailsObj.holderName + " image"}
        />
        <section id={"contentLeft_" + this.props.detailsObj.index}>
          <h5>Vehicle Category:</h5>
          <p>{this.props.detailsObj.vehicle_category}</p>
          <div id={"vehicleSpeed_" + this.props.detailsObj.index}></div>
          <div id={"vehicleCapacity_" + this.props.detailsObj.index}></div>
          <h5>Cost:</h5>
          <p>
            {this.props.detailsObj.cost.quantity + " "}{" "}
            {this.props.detailsObj.cost.unit}
          </p>
          <div id={"vehicleWeight_" + this.props.detailsObj.index}></div>
        </section>
      </td>
    );
  }
}

class BardingVehicles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <td>
        <div
          className="grid-containerNonChart"
          id={"contain_" + this.props.detailsObj.index}
        >
          <img
            src={this.props.detailsObj.holderName}
            className="equipImage"
            alt={this.props.detailsObj.holderName + " image"}
          />
          <section id={"contentLeft_" + this.props.detailsObj.index}>
            <h5>Vehicle Category:</h5>
            <p>{this.props.detailsObj.vehicle_category}</p>
            <h5>Cost:</h5>
            <p>
              {this.props.detailsObj.cost.quantity + " "}{" "}
              {this.props.detailsObj.cost.unit}
            </p>
          </section>
          <section id={"contentRight_" + this.props.detailsObj.index}>
            <h5>Description:</h5>
            <p>{this.props.detailsObj.desc}</p>
          </section>
        </div>
      </td>
    );
  }
}
