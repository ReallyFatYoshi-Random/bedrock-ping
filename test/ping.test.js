#!/env/bin node
const axios = require('axios');

it('Valid server ping.', async () => {
  await axios.default
    .get('http://localhost:8000/api/ping?hostname=play.pokebedrock.com')
    .then((res) => expect(res.status).toBe(200));
});

it('Invalid server ping.', async () => {
  await axios
    .all('http://localhost:8000/api/ping?hostname=com')
    .catch((res) => expect(res.status).toBe(400));
});
