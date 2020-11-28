/*global kakao*/
import React, { useEffect } from 'react'
import appKey from '../config/appKey.json';

const Map = (props) => {

    useEffect(()=>{
    
        const script = document.createElement("script");
        script.async = true;
        script.src =
          `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey.value}&autoload=false`;
        document.head.appendChild(script);
    
        script.onload = () => {
          kakao.maps.load(() => {
            let container = document.getElementById("myMap");
            let options = {
              center: new kakao.maps.LatLng(props.latitude, props.longitude),
              level: 3
            };
            const map = new window.kakao.maps.Map(container, options);
            let markerPosition  = new kakao.maps.LatLng(props.latitude, props.longitude); 
            let marker = new kakao.maps.Marker({
                position: markerPosition
            });
            marker.setMap(map);
            });
        };
    
        }
        );

    return (
        <div id='myMap' style={{
            'width':'100%',
            'height':'25rem'
          }}></div>
    )
}

export default Map;