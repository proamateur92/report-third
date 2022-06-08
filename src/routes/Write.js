import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, storage } from '../firebase/firebase';
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
  const boards = useSelector(state => state.board.list);
  const result = boards.filter(board => board.id === id);

  // 로그인 여부 파악
  const loginCheck = user => {
    if (user) {
      setIsLogin(true);
      // 로그인 정보가 존재하므로 firestore인증 정보의 이메일을
      // userId값으로 넣어준다
      setData({ ...data, userId: user.email });
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, loginCheck);
  }, []);

  useEffect(() => {
    if (!id) {
      setMode(true);
      setThumbNail('');
      setData(prev => ({ userId: prev.userId, content: '', imageFile: '', createdDate: '', layout: '', like: 0 }));
    } else {
      if (result.length === 0) {
        navigate('/');
      }
    }
  }, [id]);

  // 수정 모드일 때 데이터 data에 담아놓기
  if (mode && location.state) {
    const board = location.state;
    setData(prev => ({ ...prev, content: board.content, imageFile: board.imageFile, layout: board.layout, like: board.like }));
    setMode(false);
    setThumbNail(board.imageFile);
  }

  // data값의 변경이 감지되면 글작성 요소의 공백이 없는지 validation 체크
  useEffect(() => {
    if (data.layout !== '' && data.content !== '' && data.imageFile !== '') {
      setIsValid(true);
      return;
    }
    setIsValid(false);
  }, [data]);

  // 각 요소들의 값이 변경되면 data값을 set
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
      dispatch(updateBoardFB(id, { ...data, createdDate }));
    }

    setData({ userId: '', content: '', imageFile: '', createdDate: '' });
    navigate('/');
  };

  // 이미지 업로드 로직
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
  return (
    <>
      <Header isLogin={isLogin} />
      {isLogin ? (
        <>
          <WriteFrom onSubmit={handleWrite}>
            <span style={{ fontSize: '36px', fontWeight: 'bold', fontFamily: 'insta' }}>{mode ? 'Write' : 'Edit'}</span>
            <input style={{ margin: '20px 0' }} name='imageFile' onChange={handleImage} type='file' />
            <Layout>
              <Guide>
                <input checked={data.layout === 'right' ? true : false} value='right' id='right' onChange={handleLayout} name='layout' type='radio' />
                <label htmlFor='right'>오른쪽에 이미지 왼쪽에 텍스트</label>
              </Guide>
              <Thumbnail layout='right'>
                <p layout='right'>{data.content}</p>
                <img layout='right' src={thumbnail ? thumbnail : 'https://pic.onlinewebfonts.com/svg/img_328197.png'} alt='커버이미지' />
              </Thumbnail>
            </Layout>
            <Layout>
              <Guide>
                <input checked={data.layout === 'left' ? true : false} value='left' id='left' onChange={handleLayout} name='layout' type='radio' />
                <label htmlFor='left'>왼쪽에 이미지 오른쪽에 텍스트</label>
              </Guide>
              <Thumbnail layout='left'>
                <img layout='left' src={thumbnail ? thumbnail : 'https://pic.onlinewebfonts.com/svg/img_328197.png'} alt='커버이미지' />
                <p layout='left'>{data.content}</p>
              </Thumbnail>
            </Layout>
            <Layout layout='bottom'>
              <Guide>
                <input checked={data.layout === 'bottom' ? true : false} value='bottom' id='bottom' onChange={handleLayout} name='layout' type='radio' />
                <label htmlFor='bottom'>하단에 이미지 상단에 텍스트</label>
              </Guide>
              <Thumbnail layout='bottom'>
                <p layout='bottom'>{data.content}</p>
                <img layout='bottom' src={thumbnail ? thumbnail : 'https://pic.onlinewebfonts.com/svg/img_328197.png'} alt='커버이미지' />
              </Thumbnail>
            </Layout>
            <Content name='content' value={data.content} onChange={handleData}></Content>
            <SubmitButton block={isValid}>{mode ? '글 작성하기' : '글 수정하기'}</SubmitButton>
          </WriteFrom>
        </>
      ) : (
        <>
          <h1>로그인 후 글쓰기가 가능합니다!</h1>
        </>
      )}
    </>
  );
};

const WriteFrom = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Layout = styled.div`
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
  width: 100%;
  height: 130px;
  margin: 50px 0;
`;

const Guide = styled.span``;

const Thumbnail = styled.div`
  display: flex;
  flex-direction: ${props => (props.layout === 'bottom' ? 'column' : 'flex-start')};
  width: 100%;
  height: 50vh;
  p {
    width: ${props => (props.layout === 'bottom' ? '100%' : '50%')};
    word-wrap: break-word;
    height: 70%;
  }
  img {
    width: ${props => (props.layout === 'bottom' ? '100%' : '50%')};
    height: 70%;
    border-radius: 15px;
  }
`;

const SubmitButton = styled.button`
  background-color: ${props => (props.block ? '#65b5f8' : '#97cefc')};
  color: #fff;
  padding: 15px;
  width: 100%;
  margin-bottom: 30px;
  outline: none;
  border: none;
  font-size: 24px;
  border-radius: 5px;
  box-sizing: border-box;
  cursor: ${props => (props.block ? 'pointer' : 'not-allowed')};
`;

export default Write;
