import styled from 'styled-components';
import React, { useRef } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const inputId = useRef('');
  const inputPwd = useRef('');

  const loginFB = async e => {
    // 예외처리
    e.preventDefault();
    try {
      // 로그인 정보 인증
      const loginUser = await signInWithEmailAndPassword(auth, inputId.current.value, inputPwd.current.value);

      // 로그인 정보와 users의 DB와 비교
      const q = query(collection(db, 'users'), where('userId', '==', loginUser.user.email));
      const userData = await getDocs(q);
      // userData.forEach(userInfo => console.log(userInfo.id, ' => ', userInfo.data()));
      navigate('/');
    } catch (error) {
      alert('이메일 또는 비밀번호가 일치하지 않습니다.');
      navigate('/login');
    } finally {
      inputId.current.value = '';
      inputPwd.current.value = '';
    }
  };

  return (
    <LoginForm onSubmit={loginFB}>
      <Box>
        <Title style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          Instagram
        </Title>
        <Back>
          <FontAwesomeIcon onClick={() => navigate('/')} icon={faArrowLeft} size='xl' />
        </Back>
        <Input ref={inputId} type='text' placeholder='Input your email' />
        <Input ref={inputPwd} type='password' placeholder='Input your password' />
        <Button type='submit'>login</Button>
      </Box>
    </LoginForm>
  );
};

const LoginForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Box = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 380px;
  padding: 50px 60px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
`;

const Back = styled.div`
  position: absolute;
  top: 65px;
  left: 35px;
  cursor: pointer;
  transition: 0.4s;
  &:hover {
    color: #65b5f8;
    transform: scale(1.3);
  }
`;

const Input = styled.input`
  outline: none;
  border: none;
  margin-bottom: 30px;
  padding: 5px 0;
  border-bottom: 2px solid #eee;
  font-size: 36px;
  font-family: 'insta';
  color: #bec2bf;
  transition: 0.4s;
  &::placeholder {
    font-size: 36px;
    color: #d7dbd8;
    font-family: 'insta';
  }
  &:focus {
    border-bottom: 2px solid #65b5f8;
  }
`;

const Title = styled.span`
  display: block;
  font-size: 48px;
  font-weight: bold;
  font-family: 'insta';
  margin-bottom: 55px;
`;

const Button = styled.button`
  padding: 10px 40px;
  border: none;
  margin: 20px 0;
  color: #fff;
  border-radius: 5px;
  background-color: #65b5f8;
  font-family: 'insta';
  font-size: 32px;
  margin-right: 5px;
  cursor: 'pointer';
  transition: 0.4s;
  &:hover {
    color: #ccc;
    background-color: #3ca3fa;
    transform: scale(1.1);
  }
`;

export default Login;
