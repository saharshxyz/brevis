const fetch = require('node-fetch');
require('dotenv').config();

const { API_KEY, DOMAIN, REUSE } = process.env;

// eslint-disable-next-line consistent-return
const shorten = async (target) => {
  try {
    const response = await fetch('https://kutt.it/api/v2/links', {
      method: 'POST',
      body: JSON.stringify({
        target: target.toString(),
        reuse: REUSE,
        domain: DOMAIN,
      }),
      headers: {
        'content-type': 'application/json',
        'X-API-KEY': API_KEY,
      },
    });
    return (await response.json()).link;
  } catch (error) {
    console.error(error);
  }
};

const run = async (longlink) => {
  console.log(await shorten(longlink));
};

run('https://youtube.com');
