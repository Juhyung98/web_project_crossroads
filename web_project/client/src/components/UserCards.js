import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import PickedCard from "../components/PickedCard";

const UserCards = (props) => {
  const [username, setUsername] = useState("User");
  const [picks, setPicks] = useState([]);

  const authApi = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    return fetch("/api/mypicks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: user,
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setPicks(result.datas);
      });
  };

  useEffect(() => {
    setUsername(props.username);
    authApi();
  }, [username, props]);

  const LogoutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    props.isLogin(false);
    return;
  };

  return (
    <>
      <h1 style={{ paddingTop: "3rem" }} className="text-center">
        <div className="font-weight-bold">{username}'s Pick</div>
        <Button onClick={LogoutHandler} color="link" className="float-right">
          <h4>Logout</h4>
        </Button>
      </h1>
      <br />
      <hr className="my-2" />
      <br />
      <Container style={{ paddingTop: "1.2rem" }}>
        <Row xs="2" sm="2" md="4">
          {picks &&
            picks.map((data, index) => (
              <Col key={index}>
                <PickedCard
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
    </>
  );
};

export default UserCards;
