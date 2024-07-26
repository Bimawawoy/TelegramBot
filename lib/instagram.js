// instagram.js
const { IgApiClient } = require('instagram-private-api');
const fs = require('fs');
const readlineSync = require('readline-sync');

function getInstagramCredentials() {
  try {
    const data = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    if (data.username && data.password) {
      return { username: data.username, password: data.password };
    }
  } catch (err) {
    console.error('Gagal membaca config.json:', err.message);
  }

  const username = readlineSync.question('Masukkan username Instagram: ');
  const password = readlineSync.question('Masukkan password Instagram: ', { hideEchoBack: true });

  const credentials = { username, password };
  fs.writeFileSync('config.json', JSON.stringify({ ...credentials, token: "" }, null, 2));
  
  return credentials;
}


async function getInstagramInfo(username, igUsername, igPassword) {
  const ig = new IgApiClient();
  
  ig.state.generateDevice(igUsername);
  try {
    await ig.account.login(igUsername, igPassword);


    const user = await ig.user.searchExact(username);
    if (!user || !user.pk) {
      return { data: 'User tidak ditemukan' };
    }
    
    const userInfo = await ig.user.info(user.pk);
    console.log(userInfo)

    const userData = {
      username: userInfo.username,
      fullName: userInfo.full_name,
      bio: userInfo.biography,
      followers: userInfo.follower_count,
      following: userInfo.following_count,
      profilePic: userInfo.profile_pic_url
    };

    return { 
      data: `Username: ${userData.username}\nFull Name: ${userData.fullName}\nBio: ${userData.bio}\nFollowers: ${userData.followers}\nFollowing: ${userData.following}`, 
      picPath: userData.profilePic 
    };

  } catch (error) {
    console.error('Gagal mengambil data Instagram:', error.message);
    return { data: 'Gagal mengambil data Instagram' };
  }
}

module.exports = { getInstagramCredentials, getInstagramInfo };
