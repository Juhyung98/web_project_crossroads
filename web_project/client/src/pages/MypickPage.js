import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import LoginLink from '../components/LoginLink';
import UserCards from '../components/UserCards';
import { Container } from 'reactstrap';

const MypickPage = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [userName, setUserName] = useState('');
    const authApi = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return fetch('/api/auth', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': user,
                'Accept': 'application/json'

            }
        }).then(response => response.json())
        .then(result => {
            if(result.message === 'valid token') {
                setIsLogin(true);
                setUserName(result.username);
            } else if(result.message === 'expired token') {
                // alert('토큰이 만료되었습니다. 로그인 해주세요.');
                setIsLogin(false);
            } else if(result.message === 'invalid token') {
                setIsLogin(false);
            }
        });
    }
    
    useEffect(() => {
        authApi();
    }, [isLogin]);

    return (
        <>
        <Container>
            <NavBar/>
            {
            isLogin ? 
            (<>
            <UserCards username={userName} isLogin={setIsLogin}/>
            </>) 
            : 
            (<>
            <LoginLink/>
            </>)
            }
        </Container>
        </>
    )
}

export default MypickPage;
