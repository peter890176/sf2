const axios = require('axios');

async function testLogin(username, password) {
  try {
    console.log(`Testing login API... (Username: ${username})`);
    
    const response = await axios.post('https://web-production-0a4e.up.railway.app/api/auth/login', {
      username,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Login successful!');
    console.log('Response data:', response.data);
  } catch (error) {
    console.error('Login failed!');
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      } : 'No response data'
    });
  }
}

// Test multiple accounts
const testAccounts = [
  { username: 'emilys', password: 'emilyspass' },
  { username: 'michaelw', password: 'michaelwpass' },
  { username: 'sophiab', password: 'sophiabpass' }
];

async function runTests() {
  for (const account of testAccounts) {
    console.log('\nTesting account:', account.username);
    await testLogin(account.username, account.password);
  }
}

runTests();

async function checkDummyJsonUsers() {
  try {
    console.log('Fetching dummyjson users data...');
    
    const response = await axios.get('https://dummyjson.com/users');
    const users = response.data.users;

    console.log('\nFound users:');
    users.forEach(user => {
      console.log(`\nUsername: ${user.username}`);
      console.log(`Password: ${user.password}`);
      console.log(`Email: ${user.email}`);
      console.log('------------------------');
    });

  } catch (error) {
    console.error('Failed to fetch user data!');
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      } : 'No response data'
    });
  }
}

checkDummyJsonUsers(); 