import styled from 'styled-components';
import React, { useRef } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
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
      // const q = query(collection(db, 'users'), where('userId', '==', loginUser.user.email));
      // const userData = await getDocs(q);
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
      <h1>로그인 페이지</h1>
      <div>
        <label htmlFor='userId'>이메일: </label>
        <input id='userId' ref={inputId} type='text' placeholder='아이디를 입력해주세요.' />
      </div>
      <div>
        <label htmlFor='userPwd'>비밀번호: </label>
        <input id='userPwd' ref={inputPwd} type='password' placeholder='비밀번호를 입력해주세요.' />
      </div>
      <button type='submit'>로그인</button>
    </LoginForm>
  );
};

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export default Login;
