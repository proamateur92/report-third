import { useRef, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import styled from 'styled-components';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const inputNickName = useRef('');
  const inputPassword = useRef('');
  const inputPasswordCheck = useRef('');
  const inputEmail = useRef('');
  const [isSubmit, setIsSubmit] = useState(false);

  const check = () => {
    console.log('check');
    if (inputEmail.current.value.trim().length > 0 && inputPassword.current.value.trim().length > 0 && inputPasswordCheck.current.value.trim().length > 0) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  };
  // 회원가입 버튼 클릭 시
  const handleSignUp = async e => {
    e.preventDefault();

    if (!isSubmit) return;
    const emailRule = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    const email = inputEmail.current.value;
    const pwd1 = inputPassword.current.value;
    const pwd2 = inputPasswordCheck.current.value;

    // 회원가입 조건 확인
    if (email.trim() === '') {
      alert('이메일을 입력하세요.');
      inputEmail.current.focus();
      return;
    }

    if (!emailRule.test(email)) {
      alert('이메일 형식이 올바르지 않습니다.');
      inputEmail.current.focus();
      return;
    }

    if (pwd1.trim() === '') {
      alert('비밀번호 확인해주세요.');
      inputPassword.current.focus();
      return;
    }

    if (pwd1.trim().length < 6) {
      alert('비밀번호는 6자리 이상이어야 합니다.');
      inputPassword.current.focus();
      return;
    }

    if (pwd2.trim() === '') {
      alert('비밀번호 확인해주세요.');
      inputPasswordCheck.current.focus();
      return;
    }

    if (!emailRule.test(email)) {
      alert('이메일을 확인해주세요.');
      inputEmail.current.focus();
      return;
    }

    if (pwd1 !== pwd2) {
      alert('비밀번호가 일치하지 않습니다.');
      inputPasswordCheck.current.focus();
      return;
    }

    // firebase 회원 추가 로직
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
      alert('이미 존재하는 이메일입니다.');
      inputEmail.current.focus();
      navigate('/signup');
    } finally {
      inputEmail.current.value = '';
      inputPassword.current.value = '';
    }
  };

  return (
    <InputForm onSubmit={handleSignUp}>
      <Box>
        <Title style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          Instagram
        </Title>
        <Back>
          <FontAwesomeIcon onClick={() => navigate('/')} icon={faArrowLeft} size='xl' />
        </Back>
        <Input ref={inputEmail} onChange={check} type='text' placeholder='Input email' />
        <Input ref={inputPassword} onChange={check} type='password' placeholder='Input password' />
        <Input ref={inputPasswordCheck} onChange={check} type='password' placeholder='Input password again' />
        <Input ref={inputNickName} type='text' placeholder='Input nickname' />
        <Button block={isSubmit} disabled={!isSubmit}>
          Sign up
        </Button>
      </Box>
    </InputForm>
  );
};

const InputForm = styled.form`
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
  height: 500px;
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
  border-bottom: 2px solid #eee;
  font-size: 32px;
  font-family: 'insta';
  color: #bec2bf;
  transition: 0.4s;
  &::placeholder {
    font-size: 32px;
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
  background-color: ${props => (props.block ? '#65b5f8' : '#97cefc')};
  font-family: 'insta';
  font-size: 32px;
  margin-right: 5px;
  cursor: ${props => (props.block ? 'pointer' : 'not-allowed')};
  transition: 0.4s;
  &:hover {
    color: ${props => (props.block ? '#ccc' : '#fff')};
    background-color: ${props => (props.block ? '#3ca3fa' : '#65b5f8')};
  }
`;

export default SignUp;
