import React from 'react'
import {Container, Jumbotron, Button} from 'reactstrap';
const LoginLink = () => {
    return (
        <>
            <div style={{paddingTop:'8rem', 'display':'flex', 'width':'100%', "height":'100%', 'textAlign':'center', 'alignItems':'center'}}>
                <Container style={{}}>
                    <Jumbotron 
                    style={{'backgroundColor':'#fff'}}
                    >
                        <h1 className="display-3">My pick</h1><br/>
                        <p className="lead">로그인이 필요합니다.
                        </p>
                        <br/>
                        <hr className="my-2" />
                        <br/>
                        <Button color="link" href='/signin'>로그인</Button>
                        <Button color="link" href='/signup'>회원가입</Button>
                    </Jumbotron>
                </Container>
            </div>
        </>
    )
}

export default LoginLink;