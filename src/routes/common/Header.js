import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { faSquarePlus, faHeart, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Header = ({ isLogin }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth);
    navigate('/');
  };
  return (
    <Container>
      {isLogin ? (
        <Nav>
          <Title onClick={() => navigate('/')}>Instagram</Title>
          <div>
            <FontAwesomeIcon style={{ marginRight: 10, cursor: 'pointer' }} onClick={() => navigate('/write')} icon={faSquarePlus} size='2x' />
            <FontAwesomeIcon style={{ marginRight: 10, cursor: 'pointer' }} onClick={() => navigate('/like')} icon={faHeart} size='2x' />
            <FontAwesomeIcon style={{ marginRight: 10, cursor: 'pointer' }} onClick={() => navigate('/notice')} icon={faPaperPlane} size='2x' />
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </Nav>
      ) : (
        <Nav>
          <Title onClick={() => navigate('/')}>Instagram</Title>
          <div>
            <Button onClick={() => navigate('/login')}>Login</Button>
            <Button onClick={() => navigate('/signup')}>SignUp</Button>
          </div>
        </Nav>
      )}
    </Container>
  );
};

const Container = styled.div`
  font-family: 'insta';
`;

const Title = styled.h1`
  font-size: 60px;
  cursor: pointer;
`;

const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  padding: 15px;
  border: none;
  color: white;
  border-radius: 5px;
  background-color: #65b5f8;
  cursor: pointer;
  margin-right: 5px;
  font-size: 30px;
  font-family: 'insta';
  transition: 0.4s;
  &:hover {
    background-color: #3ca3fa;
  }
`;

export default Header;
