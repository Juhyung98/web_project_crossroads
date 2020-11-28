import React from "react";
import NavBar from "../components/NavBar";
import { Container } from "reactstrap";
import { Jumbotron } from "reactstrap";

const AboutPage = (props) => {
  return (
    <>
      <NavBar />
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          textAlign: "center",
          alignItems: "center",
        }}
      >
        <Container>
          <Jumbotron style={{ backgroundColor: "#fff" }}>
            <h1 className="display-3">Enjoy your meal!</h1>
            <br />
            <p className="lead">
            <mark><em>고민사거리</em></mark>는 숭실대학생들의 식사고민을 덜어주기 위해 제작된
              웹사이트입니다.
              <br />
              본래 "고민사거리"라는 단어는 숭실대 근처에 있는 식당가를 의미합니다.
              <br />
              학생들이 사거리에 서서 무엇을 먹을지 고민한다고 하여, "고민사거리"라는 이름을 붙였습니다.
              <br />
              본 웹페이지 <mark><em>고민사거리</em></mark>는 숭실대 일대 및 일명 "고민사거리"에 있는 식당들을 종류별로
              카테고리화하였습니다.
              <br />
              친구들과 메뉴를 정할 때 랜덤추천을 사용해보세요!
            </p>
            <br />
            <hr className="my-2" />
            <br />
            <p>
              식당추가 등 문의사항은 언제든지 환영입니다! choijh9182@naver.com로 연락주세요
              <br />20180402 최주형
              <br />20170401 최정민
              <br />20183423 최한나
              <br />20170403 최혜원
            </p>
            {/* <br/><br/><br/> */}
          </Jumbotron>
        </Container>
      </div>
    </>
  );
};

export default AboutPage;
