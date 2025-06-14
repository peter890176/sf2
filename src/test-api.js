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
    return response;
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
    return null;
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

// Test user profile API
async function testUserProfile(token) {
  try {
    console.log('Testing user profile API...');
    
    // Test profile endpoint
    const profileResponse = await axios.get('https://web-production-0a4e.up.railway.app/api/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('\nProfile API Response:');
    console.log('Status:', profileResponse.status);
    console.log('Data:', JSON.stringify(profileResponse.data, null, 2));

  } catch (error) {
    console.error('Profile API test failed!');
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

// Test profile update
async function testProfileUpdate(token) {
  try {
    console.log('\nTesting profile update API...');
    const response = await axios.put(
      'https://web-production-0a4e.up.railway.app/api/users/profile',
      {
        firstName: 'Emily Updated',
        lastName: 'Johnson Updated',
        phone: '+81 965-431-3025'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('Profile Update Response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Profile Update Error:', error.response?.data || error.message);
  }
}

// Test password change
async function testPasswordChange(token) {
  try {
    console.log('\nTesting password change API...');
    const response = await axios.put(
      'https://web-production-0a4e.up.railway.app/api/users/password',
      {
        currentPassword: 'emilyspass',
        newPassword: 'newpassword123'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('Password Change Response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Password Change Error:', error.response?.data || error.message);
  }
}

// Test email update
async function testEmailUpdate(token) {
  try {
    console.log('\nTesting email update API...');
    const response = await axios.put(
      'https://web-production-0a4e.up.railway.app/api/users/email',
      {
        newEmail: 'emily.updated@x.dummyjson.com'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('Email Update Response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Email Update Error:', error.response?.data || error.message);
  }
}

// Run all tests
async function runAllTests() {
  const loginResponse = await testLogin();
  if (loginResponse && loginResponse.data && loginResponse.data.token) {
    const token = loginResponse.data.token;
    await testUserProfile(token);
    await testProfileUpdate(token);
    await testPasswordChange(token);
    await testEmailUpdate(token);
  }
}

runAllTests(); 