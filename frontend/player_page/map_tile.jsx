import React from 'react'

const MapTile = mapData => {
  return (
    <div className="map-tile" key={mapData.name}>
      <div className="map-image">
        <img src={"assets/maps/" + mapData.code + ".jpg"} />
        <div className="map-info">
          <div className="map-info-tags">
            <span id="map-name">{mapData.name.toUpperCase()}</span>
          </div>
          <div className="map-info-tags">
            <span>Played: {mapData.timesPlayed}</span>
            <div className="map-info-img">
              <img src={`assets/weapons/trophy.svg`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapTile;
