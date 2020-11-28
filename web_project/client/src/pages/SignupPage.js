import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

const SigninPage = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();

    // 비밀번호가 6자이상인지 검사
    if (password.length < 6 || passwordCheck.length < 6) {
      return alert("비밀번호는 6자이상이어야 합니다.");
    }

    // 비밀번호와 비밀번호 체크가 다를 경우를 검사
    if (password !== passwordCheck) {
      return alert("비밀번호가 일치하지 않습니다.");
    }

    const signupInfo = {
      username: username,
      password: password,
    };

    const signup_info = {
      method: "POST",
      body: JSON.stringify(signupInfo),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    if (username && password) {
      fetch("/api/signup", signup_info)
        .then((response) => response.json())
        .then((json) => {
          if (json.message === "success") {
            alert("회원가입에 성공했습니다.");
            props.history.push("/signin");
          } else if (json.message === "user exist") {
            alert("이미 존재하는 유저입니다");
            setUsername("");
            setPassword("");
          } else {
            alert("회원가입에 실패했습니다.");
            setUsername("");
            setPassword("");
          }
        });
    }
  };

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onChangePasswordCheck = (e) => {
    setPasswordCheck(e.target.value);
  };

  return (
    <>
      <Form
        onSubmit={onSubmit}
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
          Sign Up
        </h2>
        <FormGroup>
          <Label>Username</Label>
          <Input
            required="required"
            value={username}
            onChange={onChangeUsername}
            name="username"
            type="name"
            placeholder="Enter your name"
          ></Input>
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input
            required="required"
            type="password"
            value={password}
            onChange={onChangePassword}
            name="password"
            placeholder="Enter your password (length >= 6)"
          ></Input>
        </FormGroup>
        <FormGroup>
          <Label>Confirm Password</Label>
          <Input
            required="required"
            type="password"
            value={passwordCheck}
            onChange={onChangePasswordCheck}
            name="confirm_password"
            placeholder="Enter your password again"
          ></Input>
        </FormGroup>
        <FormGroup>
          <Button type="submit" className="btn-lg btn-dark btn-block">
            Sign up
          </Button>
        </FormGroup>

        <div className="text-center mt-3">
          <a href="/signin">Sign in here!</a>
        </div>
      </Form>
    </>
  );
};

export default SigninPage;
