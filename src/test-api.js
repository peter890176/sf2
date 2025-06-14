const axios = require('axios');

async function testLogin(username, password) {
  try {
    console.log(`開始測試登入 API... (用戶名: ${username})`);
    
    const response = await axios.post('https://web-production-0a4e.up.railway.app/api/auth/login', {
      username,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('登入成功！');
    console.log('響應數據:', response.data);
  } catch (error) {
    console.error('登入失敗！');
    console.error('錯誤詳情:', {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      } : '無響應數據'
    });
  }
}

// 測試多個帳號
const testAccounts = [
  { username: 'emilys', password: 'emilyspass' },
  { username: 'michaelw', password: 'michaelwpass' },
  { username: 'sophiab', password: 'sophiabpass' }
];

async function runTests() {
  for (const account of testAccounts) {
    console.log('\n測試帳號:', account.username);
    await testLogin(account.username, account.password);
  }
}

runTests();

async function checkDummyJsonUsers() {
  try {
    console.log('開始獲取 dummyjson 用戶資料...');
    
    const response = await axios.get('https://dummyjson.com/users');
    const users = response.data.users;

    console.log('\n找到的用戶：');
    users.forEach(user => {
      console.log(`\n用戶名: ${user.username}`);
      console.log(`密碼: ${user.password}`);
      console.log(`電子郵件: ${user.email}`);
      console.log('------------------------');
    });

  } catch (error) {
    console.error('獲取用戶資料失敗！');
    console.error('錯誤詳情:', {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      } : '無響應數據'
    });
  }
}

checkDummyJsonUsers(); 