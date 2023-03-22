const Koa = require('koa');
const Router = require('koa-router');
const axios = require('axios');
const koaSlow = require('koa-slow');
const cors = require('@koa/cors');

const app = new Koa();
const router = new Router();
const delay = koaSlow({ delay: 3000 });

const NEWS_API_KEY = 'e8b58b7078694608825d928f17664614';


app.use(cors());
router.get('/news', async (ctx) => {
  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: 'us', 
        category: 'entertainment',
        apiKey: NEWS_API_KEY,
      },
    });
    const articles = response.data.articles
    .sort(() => 0.5 - Math.random())
    .filter((article) => article.urlToImage && article.publishedAt && article.description)
    .slice(0, 3)
    .map((article) => ({
      image: article.urlToImage,
      date: article.publishedAt,
      text: article.description,
    }));

    ctx.body = articles;
    ctx.type = 'application/json';
    ctx.status = 200;
  } catch (error) {
    console.error(error);
    ctx.body = { error: 'Failed to fetch news' };
    ctx.type = 'application/json';
    ctx.status = 500;
  }
});

app.use(delay);
app.use(router.routes());

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
