import axios from '../Forr%C3%A1sk%C3%B3d/Web/node_modules/axios/index.js'

axios.post('http://localhost:5000/api/auth/register', {
    username: 'tesztelek',
    email: 'teszt@teszt.hu',
    password: 'Tesztelek0'
  }).then(response => {
    console.log('Sikeres válasz:', response);
  }).catch(error => {
    console.error('Axios hiba:', error);
  });
  