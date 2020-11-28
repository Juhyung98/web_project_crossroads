import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import LandingMap from "../components/LandingMap";
import { CustomInput } from "reactstrap";
import { Container, Row, Col, Button, Jumbotron } from "reactstrap";
import axios from "axios";
import Loading from "../components/Loading";
import MealCard from "../components/MealCard";

const LandingPage = (props) => {
  const [datas, setDatas] = useState([]);
  const [filteredDatas, setFilteredDatas] = useState([]);
  const [RandomCards, setRandomCards] = useState([]);
  const [all, setAll] = useState(false);
  const [Kfood, setKfood] = useState(false);
  const [Wfood, setWfood] = useState(false);
  const [Cfood, setCfood] = useState(false);
  const [Jfood, setJfood] = useState(false);
  const [meat, setMeat] = useState(false);
  const [snackfood, setSnackfood] = useState(false);
  const [pub, setPub] = useState(false);
  const [fastfood, setFastfood] = useState(false);
  const [cafe, setCafe] = useState(false);
  const [etc, setEtc] = useState(false);
  const [isRandom, setIsRandom] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("/api/datas");
      setDatas(result.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = [];
    const states = [
      Kfood,
      Wfood,
      Cfood,
      Jfood,
      meat,
      snackfood,
      pub,
      fastfood,
      cafe,
      etc,
    ];
    const types = [
      ["한식"],
      ["양식"],
      ["중식"],
      ["일식"],
      ["고기"],
      ["분식"],
      ["호프", "술집"],
      ["패스트푸드"],
      ["카페", "디저트"],
      ["기타"],
    ];
    for (let i = 0; i < states.length; i++) {
      if (states[i] === true) {
        const temp = types[i];
        for (let j = 0; j < datas.length; j++) {
          for (let k = 0; k < temp.length; k++) {
            if (datas[j].type === temp[k]) {
              result.push(datas[j]);
            }
          }
        }
      }
    }
    setFilteredDatas(result);
  }, [
    Kfood,
    Wfood,
    Cfood,
    Jfood,
    meat,
    snackfood,
    pub,
    fastfood,
    cafe,
    etc,
    datas,
  ]);

  useEffect(() => {
    if (all === true) {
      setKfood(true);
      setWfood(true);
      setCfood(true);
      setJfood(true);
      setMeat(true);
      setSnackfood(true);
      setPub(true);
      setFastfood(true);
      setCafe(true);
      setEtc(true);
    } else {
      setKfood(false);
      setWfood(false);
      setCfood(false);
      setJfood(false);
      setMeat(false);
      setSnackfood(false);
      setPub(false);
      setFastfood(false);
      setCafe(false);
      setEtc(false);
    }
  }, [all]);

  const randomHandler = () => {
    if (filteredDatas.length === 0) {
      alert("메뉴를 선택하세요");
      return;
    } else {
      setIsRandom(1);
      setTimeout(() => {
        let x = getRandomInt(0, filteredDatas.length);
        let y = -1;
        while (1) {
          y = getRandomInt(0, filteredDatas.length);
          if (x !== y) break;
        }
        setRandomCards([filteredDatas[x], filteredDatas[y]]);
        setIsRandom(2);
      }, 2500);
    }
  };

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
  };

  return (
    <>
      <NavBar />
      <Container
        style={{
          paddingTop: "1.5rem",
        }}
      >
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
          <Container>
            <Jumbotron
              style={{
                backgroundColor: "#fff",
                paddingTop: "1.5rem",
                boxShadow:
                  "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
              }}
            >
              <Row xs="1" sm="1" md="2">
                <Col style={{}}>
                  <h3 className="text-center">
                    <span className="font-weight-bold">랜덤추천 : </span>메뉴를
                    선택하세요
                  </h3>
                  <span
                    style={{
                      paddingLeft: "0.5rem",
                    }}
                  >
                    {/* <Button color="warning">Random!</Button> */}
                  </span>
                  <Container>
                    <Row>
                      <Col>
                        <CustomInput
                          type="switch"
                          id="all"
                          label="전체"
                          checked={all}
                          onChange={() => setAll(!all)}
                        />
                      </Col>
                    </Row>
                    <Row xs="3" sm="3" md="4">
                      <Col>
                        <CustomInput
                          type="checkbox"
                          id="Kfood"
                          label="한식"
                          checked={Kfood}
                          onChange={() => setKfood(!Kfood)}
                        />
                      </Col>
                      <Col>
                        <CustomInput
                          type="checkbox"
                          id="Wfood"
                          label="양식"
                          checked={Wfood}
                          onChange={() => setWfood(!Wfood)}
                        />
                      </Col>
                      <Col>
                        <CustomInput
                          type="checkbox"
                          id="Cfood"
                          label="중식"
                          checked={Cfood}
                          onChange={() => setCfood(!Cfood)}
                        />
                      </Col>
                      <Col>
                        <CustomInput
                          type="checkbox"
                          id="Jfood"
                          label="일식"
                          checked={Jfood}
                          onChange={() => setJfood(!Jfood)}
                        />
                      </Col>
                      <Col>
                        <CustomInput
                          type="checkbox"
                          id="meat"
                          label="고기"
                          checked={meat}
                          onChange={() => setMeat(!meat)}
                        />
                      </Col>
                      <Col>
                        <CustomInput
                          type="checkbox"
                          id="snackfood"
                          label="분식"
                          checked={snackfood}
                          onChange={() => setSnackfood(!snackfood)}
                        />
                      </Col>
                      <Col>
                        <CustomInput
                          type="checkbox"
                          id="pub"
                          label="호프/술집"
                          checked={pub}
                          onChange={() => setPub(!pub)}
                        />
                      </Col>

                      <Col>
                        <CustomInput
                          type="checkbox"
                          id="fastfood"
                          label="패스트푸드"
                          checked={fastfood}
                          onChange={() => setFastfood(!fastfood)}
                        />
                      </Col>
                      <Col>
                        <CustomInput
                          type="checkbox"
                          id="cafe"
                          label="카페/디저트"
                          checked={cafe}
                          onChange={() => setCafe(!cafe)}
                        />
                      </Col>
                      <Col>
                        <CustomInput
                          type="checkbox"
                          id="etc"
                          label="기타"
                          checked={etc}
                          onChange={() => setEtc(!etc)}
                        />
                      </Col>
                    </Row>
                    <div
                      style={{
                        paddingTop: "1.5rem",
                        alignItems: "center",
                        display: "flex",
                        width: "100%",
                        height: "100%",
                        textAlign: "center",
                      }}
                    >
                      <Button
                        onClick={randomHandler}
                        size="lg"
                        style={{
                          margin: "0 auto",
                        }}
                        color="danger"
                      >
                        Random!
                      </Button>
                    </div>
                  </Container>
                </Col>
                <Col>
                  {isRandom === 0 ? (
                    ""
                  ) : isRandom === 1 ? (
                    <span style={{ padding: "1.5rem" }}>
                      <Loading value="추첨중.." />
                    </span>
                  ) : (
                    <Container>
                      <Row>
                        {RandomCards.map((data, index) => (
                          <Col>
                            <MealCard
                              key={index}
                              id={data.id}
                              name={data.name}
                              address={data.address}
                              latitude={data.latitude}
                              longitude={data.longitude}
                              type={data.type}
                              menu={data.menu}
                              img={data.img}
                              img_source={data.img_source}
                            />
                          </Col>
                        ))}
                      </Row>
                    </Container>
                  )}
                </Col>
              </Row>
            </Jumbotron>
          </Container>
        </div>

        {datas ? <LandingMap datas={datas} /> : "loading..."}
      </Container>
    </>
  );
};

export default LandingPage;
