const axios = require('axios');
(async () => {
  const url = "https://trenit.app/v1/grx?r=TUlMQU5PIENFTlRSQUxFLENFU0VOQSwxNy8wNC8yMDI2LDE1OjAw"; // Milano Centrale to Cesena
  try {
    const res = await axios.get(url, { headers: { "User-Agent": "Dalvik/2.1.0" } });
    console.log(JSON.stringify(res.data.routes[0].l, null, 2));
  } catch (e) {
    console.error(e.message);
  }
})();
