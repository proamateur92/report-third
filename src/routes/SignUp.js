import { useRef } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const inputNickName = useRef('');
  const inputPassword = useRef('');
  const inputEmail = useRef('');

  const handleSignUp = async e => {
    e.preventDefault();
    // 예외처리
    try {
      await createUserWithEmailAndPassword(auth, inputEmail.current.value, inputPassword.current.value);
      await addDoc(collection(db, 'users'), {
        userId: inputEmail.current.value,
        userPassword: inputPassword.current.value,
        userNickName: inputNickName.current.value,
      });
      alert('회원가입되었습니다^-^');
      navigate('/');
    } catch (error) {
      alert('이메일 또는 비밀번호를 확인해주세요');
      navigate('/signup');
    } finally {
      inputEmail.current.value = '';
      inputPassword.current.value = '';
    }
    // console.log(docRef.id);
    // console.log(docRef.data());
  };

  return (
    <InputForm onSubmit={handleSignUp}>
      <h1>회원가입 페이지</h1>
      <input ref={inputEmail} type='text' placeholder='이메일을 입력하세요' />
      <input ref={inputPassword} type='password' placeholder='비밀번호를 입력하세요' />
      <input ref={inputNickName} type='text' placeholder='닉네임을 입력하세요' />
      <Button>회원가입 하기</Button>
    </InputForm>
  );
};

const InputForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.button`
  padding: 5px;
  border: none;
  color: white;
  border-radius: 5px;
  background-color: #65b5f8;
  cursor: pointer;
  margin-right: 5px;
  font-size: 18px;
`;

export default SignUp;
