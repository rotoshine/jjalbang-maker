const isDevMode = process.env.NODE_ENV === 'development'

const path = require('path')
const express = require('express')
const devServer = require('../build/dev-server')

const app = isDevMode ? devServer.app : express()
const PORT = process.env.port || 8081;
const appConfig = require('../config/appConfig');
const bucket = require('./utils/bucket')

app.use('/static', express.static('../dist/static'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/sources/:sourceId/result/:jjalId', async (req, res) => {
  const { sourceId, jjalId } = req.params;
  const signedUrls = await bucket.getFileSignedUrl(sourceId, jjalId)
  
  if (signedUrls.length > 0) {
    return res.render('result', {
      url: appConfig.url,
      sourceId: sourceId,
      imageUrl: signedUrls[0],
      resultUrl: req.url,
      jjalId: jjalId
    });
  } else {
    return res.render('error');
  }
})


app.get('*', (req, res) => {
  if (isDevMode) {
    const compiler = devServer.compiler;
    const filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, function (err, result) {
      if (err) {
        return next(err);
      }
      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    });
  }
  else {
    return res.sendFile(path.join(__dirname), '../dist/index.html');
  }
});


app.listen(PORT);
console.log(`server on! port: ${PORT}`);
