import {useState} from 'react';
import {Form, Button, Row, Col, Container} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from "../API";
function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  

  const navigate=useNavigate();
  
 
  const handleLogin = async (credentials) => {  
    try {
      const user = await API.logIn(credentials);
      props.setLoggedIn(true);
      props.setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
      navigate("/studyPlan");
    } catch (err) {
      console.log(err);
      props.setMessage({ msg: err, type: 'danger' });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = {username, password};
    handleLogin(credentials);
    
  };
  
  return (
    <Row className="justify-content-center">
    <Col align="left" sm={4}>
      <br/>
      <Form onSubmit={handleSubmit} style={{ padding:'10%', backgroundColor:'#e6fae9'}}>
        <Form.Group controlId='username'>
          <Form.Label>email</Form.Label>
          <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} required={true}/>
        </Form.Group>
        <br/>
        <Form.Group controlId='password'>
          <Form.Label>password</Form.Label>
          <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} required={true}
                        minLength={6}/>
        </Form.Group >
        <br/>
        <Button type="submit">Login</Button>{' '}

        <Button variant="danger" active onClick={()=>navigate('/')}>
                            Back
                        </Button>
      </Form>
      </Col>
      </Row>
  )
}

/*function LogoutButton(props) {
  return (
      <Row>
        <Col>
          <Button variant="outline-primary" onClick={props.logout}>Logout</Button>
        </Col>
      </Row>
  )
}*/

export {LoginForm, /*LogoutButton*/};