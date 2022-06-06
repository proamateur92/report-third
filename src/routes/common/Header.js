import { signOut } from 'firebase/auth';
import { db, auth } from '../../firebase/firebase';
import { faSquarePlus, faHeart, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Header = ({ isLogin }) => {
  const navigate = useNavigate();
  return (
    <div>
      {isLogin ? (
        <Nav>
          <h1 onClick={() => navigate('/')}>Instagram</h1>
          <div>
            <div>
              <FontAwesomeIcon onClick={() => navigate('/write')} icon={faSquarePlus} size='2x' />
              <FontAwesomeIcon onClick={() => navigate('/like')} icon={faHeart} size='2x' />
              <FontAwesomeIcon onClick={() => navigate('/notice')} icon={faPaperPlane} size='2x' />
            </div>
          </div>
          <Button onClick={() => signOut(auth)}>로그아웃</Button>
        </Nav>
      ) : (
        <Nav>
          <h1 onClick={() => navigate('/')}>Instagram</h1>
          <div>
            <Button onClick={() => navigate('/login')}>로그인</Button>
            <Button onClick={() => navigate('/signup')}>회원가입</Button>
          </div>
        </Nav>
      )}
    </div>
  );
};

const Nav = styled.div`
  display: flex;
  justify-content: space-between;
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

export default Header;
