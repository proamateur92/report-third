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
  const [data, setData] = useState({ author: '', userId: '', content: '', imageFile: '', createdDate: '', layout: '' });
  const [isLogin, setIsLogin] = useState(false);
  const [thumbnail, setThumbNail] = useState('');
  const [layout, setLayout] = useState('');

  const { id } = useParams();
  const board = location.state;

  // 수정 로직
  useEffect(() => {
    id && setMode(false);
    if (board) {
      setData({ content: board.content, imageFile: board.imageFile });
    }
  }, [id, board]);

  const loginCheck = async user => {
    if (user) {
      console.log(user);
      setIsLogin(true);
      setData({ ...data, userId: user.email });
    } else {
      alert('잘못된 접근입니다.');
      navigate('/');
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, loginCheck);
  }, []);

  const handleData = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // 글 등록 로직
  const handleWrite = e => {
    e.preventDefault();
    setData({ ...data, createdDate: Date.parse(new Date()) });
    // mode ? dispatch(addBoardFB(data)) : dispatch(updateBoardFB(id, data));
    // setData({ userId: '', content: '', imageFile: '', createdDate: '' });
    // navigate('/');
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
    setData({ ...data, layout: event.target.value });
  };

  // 데이터 잘 넘어가는지 콘솔 테스트
  console.log(data);
  return (
    <>
      <Header isLogin={isLogin} />
      <WriteFrom onSubmit={handleWrite}>
        <h1>{mode ? '글 작성 페이지' : '글 수정 페이지'}</h1>
        <input name='imageFile' onChange={handleImage} type='file' />
        <Layout align='left'>
          <Guide>
            <label htmlFor='right'>오른쪽에 이미지 왼쪽에 텍스트</label>
            <input value='right' id='right' onChange={handleLayout} name='layout' type='radio' />
          </Guide>
          <Contents>
            <Text></Text>
            <Thumbnail align='right'>
              <img src={thumbnail ? thumbnail : 'https://pic.onlinewebfonts.com/svg/img_328197.png'} />
            </Thumbnail>
          </Contents>
        </Layout>
        <Layout align='left'>
          <Guide>
            <label htmlFor='left'>왼쪽에 이미지 오른쪽에 텍스트</label>
            <input value='left' id='left' onChange={handleLayout} name='layout' type='radio' />
          </Guide>
          <Contents>
            <Thumbnail>
              <img src={thumbnail ? thumbnail : 'https://pic.onlinewebfonts.com/svg/img_328197.png'} />
            </Thumbnail>
            <Text></Text>
          </Contents>
        </Layout>
        <Layout align='bottom'>
          <Guide>
            <label htmlFor='bottom'>하단에 이미지 상단에 텍스트</label>
            <input value='bottom' id='bottom' onChange={handleLayout} name='layout' type='radio' />
          </Guide>
          <Contents>
            <Text></Text>
            <Thumbnail>
              <img src={thumbnail ? thumbnail : 'https://pic.onlinewebfonts.com/svg/img_328197.png'} />
            </Thumbnail>
          </Contents>
        </Layout>
        <textarea name='content' value={data.content} onChange={handleData}></textarea>
        <button>{mode ? '글 작성하기' : '글 수정하기'}</button>
      </WriteFrom>
    </>
  );
};

const WriteFrom = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Layout = styled.div`
  background-color: blue;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: right;
  :nth-child(0) {
    background-color: red;
  }
`;

const Text = styled.div`
  width: 50%;
`;

const Contents = styled.div`
  width: 90%;
  display: flex;
  justify-content: center;
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

export default Write;
