/*global kakao*/
import React, { useEffect, useState } from "react";
import { Input } from "reactstrap";
import { Label, Row, Col, FormGroup } from "reactstrap";
import appKey from "../config/appKey.json";

const LandingMap = (props) => {
  const [FDatas, setFDatas] = useState([]);
  const [selectedOption, setselectedOption] = useState("");

  window.onload = function () {
    let init = document.getElementById("init");
    init.click();
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey.value}&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        let container = document.getElementById("map");
        let options = {
          center: new kakao.maps.LatLng(37.496498, 126.957481),
          level: 3,
        };
        let map = new window.kakao.maps.Map(container, options);
        let positions = [];
        // 마커 이미지를 생성합니다
        // 마커 이미지의 이미지 크기 입니다
        let imageSize = new kakao.maps.Size(40, 40);
        let imageSrc_cafe = "cafe_icon.png";
        let imageSrc_meal = "meal_icon.png";
        let imageSrc_pub = "pub_icon.png";

        const CreateMarkerImage = (type) => {
          if (type === "술집" || type === "호프")
            return new kakao.maps.MarkerImage(imageSrc_pub, imageSize);
          else if (type === "카페" || type === "디저트")
            return new kakao.maps.MarkerImage(imageSrc_cafe, imageSize);
          else return new kakao.maps.MarkerImage(imageSrc_meal, imageSize);
        };

        for (let i = 0; i < FDatas.length; i++) {
          const temp = FDatas[i];
          positions.push({
            title: temp.name,
            latlng: new kakao.maps.LatLng(temp.latitude, temp.longitude),
            image: CreateMarkerImage(temp.type),
          });
        }

        for (let i = 0; i < positions.length; i++) {
          // 마커를 생성합니다
          let marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: positions[i].latlng, // 마커를 표시할 위치
            image: positions[i].image, // 마커 이미지
          });
          marker.setMap(map);
          const name = positions[i].title;
          // 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다
          let iwContent = `<div style="padding:5px;">${name}</div>`, // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
            iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

          // 인포윈도우를 생성합니다
          let infowindow = new kakao.maps.InfoWindow({
            content: iwContent,
            removable: iwRemoveable,
          });

          // 마커에 클릭이벤트를 등록합니다
          kakao.maps.event.addListener(marker, "click", function () {
            // 마커 위에 인포윈도우를 표시합니다
            infowindow.open(map, marker);
          });
        }
      });
    };
  }, [FDatas]);

  useEffect(() => {
    var result = [];
    if (selectedOption === "mealRadio") {
      for (let i = 0; i < props.datas.length; i++) {
        const temp = props.datas[i];
        if (
          temp.type !== "카페" &&
          temp.type !== "디저트" &&
          temp.type !== "술집" &&
          temp.type !== "호프"
        ) {
          result.push(temp);
        }
      }
    } else if (selectedOption === "cafeRadio") {
      for (let i = 0; i < props.datas.length; i++) {
        const temp = props.datas[i];
        if (temp.type === "카페" || temp.type === "디저트") {
          result.push(temp);
        }
      }
    } else if (selectedOption === "pubRadio") {
      for (let i = 0; i < props.datas.length; i++) {
        const temp = props.datas[i];
        if (temp.type === "술집" || temp.type === "호프") {
          result.push(temp);
        }
      }
    }
    setFDatas(result);
  }, [selectedOption, props]);

  const handleOptionChange = (e) => {
    setselectedOption(e.target.value);
  };

  return (
    <>
      <hr className="my-2" />
      <Row>
        <Col>
          <span className="font-weight-bold">고민사거리 MAP</span>
        </Col>
        <Col>
          <Row>
            <Col>
              <FormGroup>
                <Label className="float-right">
                  <Input
                    id="init"
                    checked={selectedOption === "mealRadio"}
                    value="mealRadio"
                    onChange={handleOptionChange}
                    type="radio"
                    name="radio1"
                  />
                  식사
                </Label>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label className="float-right">
                  <Input
                    value="cafeRadio"
                    checked={selectedOption === "cafeRadio"}
                    onChange={handleOptionChange}
                    type="radio"
                    name="radio1"
                  />
                  카페
                </Label>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label className="float-right">
                  <Input
                    value="pubRadio"
                    checked={selectedOption === "pubRadio"}
                    onChange={handleOptionChange}
                    type="radio"
                    name="radio1"
                  />
                  술집
                </Label>
              </FormGroup>
            </Col>
          </Row>
        </Col>
      </Row>

      <div
        id="map"
        style={{
          width: "100%",
          height: "27rem",
        }}
      ></div>
      <p>
        ※같은 건물에 위치한 식당의 경우, 좌표가 겹쳐서 보이지 않는 경우가
        있습니다. 식당들의 자세한 정보는 menu에서 확인해주세요.
      </p>
    </>
  );
};

export default LandingMap;
