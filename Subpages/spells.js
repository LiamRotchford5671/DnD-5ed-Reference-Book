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
    this.genSpellOmits(sdata);
    this.genSlotOmits(sdata);
  }

  genSpellOmits(sdata) {
    let spellClassesRef = document.getElementById(
      "spellClasses_" + sdata.index
    );
    let classesTitle = document.createElement("h5");
    classesTitle.innerHTML = "Classes:";
    spellClassesRef.appendChild(classesTitle);

    let classes = "";
    sdata.classes.forEach((element) => {
      classes = classes.concat(" " + element.name);
    });

    let classesContent = document.createElement("p");
    classesContent.innerHTML = classes;
    spellClassesRef.appendChild(classesContent);

    if ("damage" in sdata) {
      if ("damage.damage_type" in sdata) {
        let spellDmgRef = document.getElementById(
          "spellDamageType_" + sdata.index
        );
        let spellDmgTitle = document.createElement("h5");
        spellDmgTitle.innerHTML = "Damage Type:";
        spellDmgRef.appendChild(spellDmgTitle);

        let spellDmgType = document.createElement("p");
        spellDmgType.innerHTML = sdata.damage.damage_type.name;
        spellDmgRef.appendChild(spellDmgType);
      }
    }

    if ("attack_type" in sdata) {
      let spellAtkTypeRef = document.getElementById(
        "spellAttackType_" + sdata.index
      );
      let spellAtkTypeTitle = document.createElement("h5");
      spellAtkTypeTitle.innerHTML = "Attack Type:";
      spellAtkTypeRef.appendChild(spellAtkTypeTitle);

      let spellAtkType = document.createElement("p");
      spellAtkType.innerHTML = sdata.attack_type;
      spellAtkTypeRef.appendChild(spellAtkType);
    }

    if ("area_of_effect" in sdata) {
      let areaEffectRef = document.getElementById(
        "spellAreaEffect_" + sdata.index
      );
      let areaEffectTitle = document.createElement("h5");
      areaEffectTitle.innerHTML = "Area of Effect:";
      areaEffectRef.appendChild(areaEffectTitle);

      let aeSubtitleOne = document.createElement("h6");
      aeSubtitleOne.innerHTML = "Type:";
      areaEffectRef.appendChild(aeSubtitleOne);

      let aeType = document.createElement("p");
      aeType.innerHTML = sdata.area_of_effect.type;
      areaEffectRef.appendChild(aeType);

      let aeSubtitleTwo = document.createElement("h6");
      aeSubtitleTwo.innerHTML = "Size:";
      areaEffectRef.appendChild(aeSubtitleTwo);

      let aeSize = document.createElement("p");
      aeSize.innerHTML = sdata.area_of_effect.size;
      areaEffectRef.appendChild(aeSize);
    }
  }

  genSlotOmits(sdata) {
    if ("damage" in sdata || "heal_at_slot_level" in sdata) {
      let slotRef = document.getElementById("contentSlots_" + sdata.index);
      let slotTitle = document.createElement("h5");
      let slotSubTitle = document.createElement("h6");
      //console.log(sdata);

      if ("heal_at_slot_level" in sdata) {
        slotTitle.innerHTML = "Heal at Slot Level";
        slotSubTitle.innerHTML = "Level ~ Heal";
      } else if (sdata.damage.damage_at_slot_level != undefined) {
        slotTitle.innerHTML = "Damage at Slot Level";
        slotSubTitle.innerHTML = "Level ~ Damage Dice";
      } else if (sdata.damage.damage_at_character_level != undefined) {
        slotTitle.innerHTML = "Damage at Character Level";
        slotSubTitle.innerHTML = "Level ~ Damage Dice";
      } else {
        return;
      }
      slotRef.appendChild(slotTitle);
      slotRef.appendChild(slotSubTitle);

      if ("heal_at_slot_level" in sdata) {
        Object.entries(sdata.heal_at_slot_level).forEach((element) => {
          let newItem = document.createElement("p");
          newItem.innerHTML = element[0] + " ~ " + element[1];
          slotRef.appendChild(newItem);
          slotRef.appendChild(document.createElement("hr"));
        });
      } else if (sdata.damage.damage_at_slot_level != undefined) {
        Object.entries(sdata.damage.damage_at_slot_level).forEach((element) => {
          let newItem = document.createElement("p");
          newItem.innerHTML = element[0] + " ~ " + element[1];
          slotRef.appendChild(newItem);
          slotRef.appendChild(document.createElement("hr"));
        });
      } else if (sdata.damage.damage_at_character_level != undefined) {
        Object.entries(sdata.damage.damage_at_character_level).forEach(
          (element) => {
            let newItem = document.createElement("p");
            newItem.innerHTML = element[0] + " ~ " + element[1];
            slotRef.appendChild(newItem);
            slotRef.appendChild(document.createElement("hr"));
          }
        );
      } else {
        return;
      }
    }
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
            <div id={"spellClasses_" + this.props.detailsObj.index}></div>
            <h5>Level:</h5>
            <p>{this.props.detailsObj.level}</p>
            <div id={"spellDamageType_" + this.props.detailsObj.index}></div>
          </section>
          <section id={"contentMid_" + this.props.detailsObj.index}>
            <div id={"spellAttackType_" + this.props.detailsObj.index}></div>
            <h5>Range:</h5>
            <p>{this.props.detailsObj.range}</p>
            <div id={"spellAreaEffect_" + this.props.detailsObj.index}></div>
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
            <p>{this.props.detailsObj.ritual.toString()}</p>
            <h5>Concentration:</h5>
            <p>{this.props.detailsObj.concentration.toString()}</p>
          </section>
          <section id={"contentSlots_" + this.props.detailsObj.index}></section>
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
