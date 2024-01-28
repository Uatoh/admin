import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/apiCalls';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();

  const handleClick = async (e) => {
    e.preventDefault();
    await login(dispatch, { username, password });

    const loggedInUser = JSON.parse(localStorage.getItem('persist:root'))?.user;
    if (loggedInUser) {
      history.push('/');
      window.location.reload();
    }
  };

  return (
    <>
      <div>
        <p>Library yang dipakai:</p>
        <p>MongoDB, ExpressJS, ReactJS, NodeJS</p>
        <p>Redux Toolkit, Axios, React Router</p>
        <p>Stripe, JWT, Mongoose, Nodemon</p>
        <p>Material UI, Styled Components</p>
      </div>
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <input
          style={{ padding: 10, marginBottom: 20 }}
          type="text"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          style={{ padding: 10, marginBottom: 20 }}
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleClick} style={{ padding: 10, width: 100 }}>
          Login
        </button>
      </div>
    </>
  );
};

export default Login;
