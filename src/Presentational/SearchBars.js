import React from "react";
export function SearchBars(props) {
  return (
    <div>
      <div onClick={props.onClick} className="search-bars">
        <input
          type="search"
          list="datalist1"
          placeholder="city, country code"
          value={props.locVal}
          disabled={props.firstDisabled}
          onChange={props.onChange}
          name="location"
        />
      </div>
      <datalist id="datalist1">
        <option
          value={`${props.nameValues[0]} (${props.countryStateValues[0]})`}
        />
        <option
          value={`${props.nameValues[1]} (${props.countryStateValues[1]})`}
        />
        <option
          value={`${props.nameValues[2]} (${props.countryStateValues[2]})`}
        />
        <option
          value={`${props.nameValues[3]} (${props.countryStateValues[3]})`}
        />
        <option
          value={`${props.nameValues[4]} (${props.countryStateValues[4]})`}
        />
      </datalist>
      <div onClick={props.onClick} className="search-bars">
        <input
          type="text"
          placeholder="zip code"
          value={props.zipVal}
          disabled={!props.firstDisabled}
          onChange={props.onChange}
          name="zipCode"
        />
      </div>
    </div>
  );
}
