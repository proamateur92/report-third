import Router from './routes/Router';
import { Provider } from 'react-redux';
import store from './redux/configStore';
import styled from 'styled-components';

function App() {
  return (
    <Container>
      <Box>
        <Provider store={store}>
          <Router />
        </Provider>
      </Box>
    </Container>
  );
}

const Box = styled.div`
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  margin: auto;
  flex-direction: column;
  width: 700px;
`;
export default App;
