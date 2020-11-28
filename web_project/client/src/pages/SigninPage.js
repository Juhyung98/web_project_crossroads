import React, { useState } from "react";
import cookie from "react-cookies";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { FacebookLoginButton } from "react-social-login-buttons";

const SigninPage = (props) => {
  const [userName, setUserName] = useState("");
  const [userPw, setUserPw] = useState("");

  const signinApi = (user) => {
    return fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(user),
    }).then((response) => response.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName || !userPw) {
      return;
    }
    try {
      const response = await signinApi({
        username: userName,
        password: userPw,
      });

      if (response.message === "Token issue") {
        localStorage.setItem("user", JSON.stringify(response.token));
        const expires = new Date();
        expires.setDate(expires.getDate() + 60);
        cookie.save("username", response.username, {
          expires,
        });
        props.history.push("/mypick");
      } else if (response.message === "user does not exist") {
        alert("User does not exist");
        props.history.push("/signin");
        setUserName("");
        setUserPw("");
      } else if (response.message === "invalid password") {
        alert("Invalid Password");
        props.history.push("/signin");
        setUserName("");
        setUserPw("");
      } else if (response.message === "server error") {
        alert("Server Error");
        props.history.push("/signin");
        setUserName("");
        setUserPw("");
      }
    } catch (err) {
      alert("Signin Failed");
      setUserName("");
      setUserPw("");
      props.history.push("/signin");
    }
  };

  const onChangeUsername = (e) => {
    setUserName(e.target.value);
  };

  const onChangePassword = (e) => {
    setUserPw(e.target.value);
  };

  return (
    <>
      <Form
        style={{
          width: "100%",
          maxWidth: "330px",
          padding: "15px",
          margin: "auto",
          height: "100%",
        }}
      >
        <a href="/" style={{ color: "#000000", textDecoration: "none" }}>
          <h1 className="text-center">
            <span className="font-weight-bold">고민사거리</span>.com
          </h1>
        </a>
        <h2 className="text-center">
          <br />
          Sign In
        </h2>
        <FormGroup>
          <Label>Username</Label>
          <Input
            required="required"
            value={userName}
            onChange={onChangeUsername}
            type="name"
            placeholder="Enter your name"
          ></Input>
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input
            required="required"
            type="password"
            value={userPw}
            onChange={onChangePassword}
            placeholder="Enter your password"
          ></Input>
        </FormGroup>
        <FormGroup>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="btn-lg btn-dark btn-block"
          >
            Sign in
          </Button>
        </FormGroup>
        <div className="text-center pt-3">
          Or continue with your social account
        </div>
        <FacebookLoginButton className="mt-3 mb-3" />
        <div className="text-center">
          <a href="/signup">Sign up here!</a>
        </div>
      </Form>
    </>
  );
};
export default SigninPage;
