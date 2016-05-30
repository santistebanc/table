var path = require('path'),
  express = require('express'),
  webpack = require('webpack'),
  argv = require('yargs').argv;

var ports = {
  dev: 3007
};

var env = argv.env || 'dev',
  port = ports[env];

var webpackConfig = require('./webpack.config.js'),
  compiler = webpack(webpackConfig),
  app = express();

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  noInfo: true
}));

app.use('/img', express.static('img'));

app.use('/font-awesome', express.static('font-awesome'));

app.get('/countries', function(req, res) {
  res.sendFile(path.join(__dirname, 'src/countries.json'));
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at localhost:' + port);
});
