import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth, storage } from '../firebase/firebase';
import { doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addBoardFB, updateBoardFB } from '../redux/modules/board';
import Header from './common/Header';
import styled from 'styled-components';

const Write = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [mode, setMode] = useState(true);
  const [data, setData] = useState({ userId: '', content: '', imageFile: '', createdDate: '', layout: '', like: 0 });
  const [isLogin, setIsLogin] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [thumbnail, setThumbNail] = useState('');

  const { id } = useParams();

  // 로그인 여부 파악
  const loginCheck = async user => {
    if (user) {
      setIsLogin(true);
      // 로그인 정보가 존재하므로 firestore인증 정보의 이메일을
      // userId값으로 넣어준다
      setData({ ...data, userId: user.email });
    } else {
      // 로그인 정보가 존재하지 않으면 메인 페이지로 강제 이동
      alert('잘못된 접근입니다.');
      navigate('/');
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, loginCheck);
  }, []);

  // 수정 모드일 때 데이터 data에 담아놓기
  if (mode && location.state) {
    const board = location.state;
    setData(prev => ({ ...prev, content: board.content, imageFile: board.imageFile, layout: board.layout, like: board.like }));
    setMode(false);
    setThumbNail(board.imageFile);
  }

  // data값의 변경이 감지되면 validation 함수 실행
  useEffect(() => {
    validCheck();
  }, [data]);

  const validCheck = () => {
    if (data.layout !== '' && data.content !== '' && data.imageFile !== '') {
      setIsValid(true);
      return;
    }
    setIsValid(false);
  };

  const handleData = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // 글 수정 / 등록 로직
  const handleWrite = e => {
    e.preventDefault();

    // 파일 선택, 레이아웃, 내용의 공백이 하나라도 존재하면 return
    if (!isValid) {
      return;
    }

    // 글 등록 시점 date값
    const createdDate = Date.parse(new Date());

    // mode -> true 글 작성 로직
    // mode -> false 글 수정 로직
    if (mode) {
      // 글 작성일 때
      if (data.imageFile === '') {
        alert('레이아웃을 선택해주세요');
        return;
      }
      if (data.layout === '') {
        alert('레이아웃을 선택해주세요');
        return;
      }
      if (data.content === '') {
        alert('내용을 입력해주세요.');
        return;
      }

      dispatch(addBoardFB({ ...data, createdDate }));
    } else {
      // 글 수정일 때
      console.log(data);
      console.log('수정!!');
      dispatch(updateBoardFB(id, { ...data, createdDate }));
    }

    setData({ userId: '', content: '', imageFile: '', createdDate: '' });
    navigate('/');
  };

  const handleImage = async e => {
    const imageFile = e.target.files[0];
    const storageRef = ref(storage, `images/${imageFile.name}`);

    try {
      await uploadBytes(storageRef, imageFile);
      const fileDownloadUrl = await getDownloadURL(storageRef);
      setThumbNail(fileDownloadUrl);
      setData({ ...data, imageFile: fileDownloadUrl });
      // console.log('업로드 정보: ', uploadImage);
      // console.log('다운로드 정보: ', fileDownloadUrl);
    } catch (error) {
      alert(error);
    }
  };

  // 레이아웃 변경할 때 data값 수정
  const handleLayout = event => {
    setData(prev => ({ ...prev, layout: event.target.value }));
  };

  console.log(data);
  return (
    <Container>
      <Header isLogin={isLogin} />
      <WriteFrom onSubmit={handleWrite}>
        <h1>{mode ? '게시글 작성' : '게시글 수정'}</h1>
        <input name='imageFile' onChange={handleImage} type='file' />
        <Layout>
          <Guide>
            <input checked={data.layout === 'right' ? true : false} value='right' id='right' onChange={handleLayout} name='layout' type='radio' />
            <label htmlFor='right'>오른쪽에 이미지 왼쪽에 텍스트</label>
          </Guide>
          <Contents align='right'>
            <Text align='right'>{mode ? data.content : data.content}</Text>
            <Thumbnail align='right'>
              <img src={thumbnail ? thumbnail : 'https://pic.onlinewebfonts.com/svg/img_328197.png'} alt='커버이미지' />
            </Thumbnail>
          </Contents>
        </Layout>
        <Layout>
          <Guide>
            <input checked={data.layout === 'left' ? true : false} value='left' id='left' onChange={handleLayout} name='layout' type='radio' />
            <label htmlFor='left'>왼쪽에 이미지 오른쪽에 텍스트</label>
          </Guide>
          <Contents align='left'>
            <Thumbnail>
              <img src={thumbnail ? thumbnail : 'https://pic.onlinewebfonts.com/svg/img_328197.png'} alt='커버이미지' />
            </Thumbnail>
            <Text name='left' align='left'>
              {data.content}
            </Text>
          </Contents>
        </Layout>
        <Layout align='bottom'>
          <Guide>
            <input checked={data.layout === 'bottom' ? true : false} value='bottom' id='bottom' onChange={handleLayout} name='layout' type='radio' />
            <label htmlFor='bottom'>하단에 이미지 상단에 텍스트</label>
          </Guide>
          <Contents align='bottom'>
            <Text align='bottom'>{data.content}</Text>
            <Thumbnail>
              <img src={thumbnail ? thumbnail : 'https://pic.onlinewebfonts.com/svg/img_328197.png'} alt='커버이미지' />
            </Thumbnail>
          </Contents>
        </Layout>
        <Content name='content' value={data.content} onChange={handleData}></Content>
        <SubmitButton block={isValid}>{mode ? '글 작성하기' : '글 수정하기'}</SubmitButton>
      </WriteFrom>
    </Container>
  );
};

const Container = styled.div`
  background-color: red;
`;

const WriteFrom = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Layout = styled.div`
  background-color: blue;
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: right;
  margin-bottom: 20px;
  &:first-of-type {
    margin-top: 20px;
  }
`;

const Content = styled.textarea`
  width: 90%;
  height: 100px;
  margin: 30px 0;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: ${props => (props.align === 'bottom' ? 'column' : '')};
  justify-content: ${props => (props.align === 'bottom' ? '' : 'space-between')};
  align-items: ${props => (props.align === 'bottom' ? 'center' : '')};
`;

const Text = styled.p`
  width: ${props => (props.align === 'bottom' ? '100%' : '50%')};
  /* height: ${props => (props.align === 'bottom' ? '100px' : '150px')}; */
  word-wrap: break-word;
`;

const Guide = styled.span``;

const Thumbnail = styled.div`
  width: 300px;
  height: 300px;
  img {
    width: 100%;
    height: 100%;
  }
`;

const SubmitButton = styled.button`
  background-color: ${props => (props.block ? '#65b5f8' : '#97cefc')};
  color: #fff;
  outline: none;
  border: none;
  font-size: 24px;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 10px;
  width: 90%;
  margin-bottom: 30px;
  cursor: ${props => (props.block ? 'pointer' : 'not-allowed')};
`;

export default Write;
