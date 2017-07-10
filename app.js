const isDevMode = process.env.NODE_ENV === 'development';
const path = require('path');
const express = require('express');
const devServer = require('./build/dev-server');

let app;
if ( isDevMode ) {
  app = devServer.app;
} else {
  app = express();
}
const PORT = process.env.port || 8081;
const appConfig = require('./config/appConfig');

app.use('/static', express.static('dist/static'));


app.set('views', __dirname + '/server/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

const gcs = require('@google-cloud/storage')({
  projectId: appConfig.firebaseConfig.projectId,
  keyFilename: `${__dirname}/config/key/jjalbang-maker-4a4f44935e2b.json`
});
const bucket = gcs.bucket(appConfig.firebaseConfig.storageBucket);
app.get('/sources/:sourceId/result/:jjalId', (req, res) => {
  const { sourceId, jjalId } = req.params;
  const filePath = `result/${req.params.sourceId}/${jjalId}`;
  const file = bucket.file(filePath);
  return file.getSignedUrl({
    action: 'read',
    expires: '04-12-2222'
  }).then((signedUrls) => {
    if ( signedUrls.length > 0 ) {
      return res.render('result', {
        url: appConfig.url,
        sourceId: sourceId,
        imageUrl: signedUrls[ 0 ],
        resultUrl: req.url,
        jjalId: jjalId
      });
    } else {
      return res.render('error');
    }
  });
});


app.get('*', (req, res) => {
  if ( isDevMode ) {
    const compiler = devServer.compiler;
    const filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, function (err, result) {
      if ( err ) {
        return next(err);
      }
      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    });
  }
  else {
    return res.sendFile(`${__dirname}/dist/index.html`);
  }
});


app.listen(PORT);
console.log(`server on! port: ${PORT}`);
