const axios = require("axios");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
async function seedHelper() {
  const apiKey = process.env.API_KEY_NEWS;
  const { data } = await axios.post(
    "https://eventregistry.org/api/v1/article/getArticles",
    {
      query: {
        $query: {
          $and: [
            {
              locationUri: "http://en.wikipedia.org/wiki/United_Kingdom",
            },
            {
              sourceUri: "bbc.com",
            },
            {
              lang: "eng",
            },
          ],
        },
        $filter: {
          forceMaxDataTimeWindow: "31",
        },
      },
      resultType: "articles",
      articlesSortBy: "date",
      apiKey,
    }
  );
  return data;
}
module.exports = seedHelper;
