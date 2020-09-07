import express from 'express';
import history from 'connect-history-api-fallback';
import compression from 'compression';
import morgan from 'morgan';

const app = express();

const staticFileMiddleware = express.static('./');
app.use(staticFileMiddleware);

app.use(history({
  htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
  rewrites: [
    {
      from: /^\/.*$/,
      to: (context) => {
        return "/";
      }
    },
  ]
}));

app.use(staticFileMiddleware);
app.use(compression());
app.use(morgan('tiny'));

app.listen(8787, function () {
  console.log('listening on port 8787');
});
