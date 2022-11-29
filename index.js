const express = require('express');
const fileUpload = require('express-fileupload');
var cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();

const PORT = 8000;

const db = {};

app.use('/form', express.static(__dirname + '/index.html'));

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded());

app.get('/ping', function(req, res) {
  res.send('pong');
});

app.post('/logo-url', function(req, res) {

  const { userId, url } = req.body;

  db[userId] = url;

  res.send({ ok: true, db });
});

app.get('/logo-url/:userId', function(req, res) {

  const { userId } = req.params;

  res.send({ url: db[userId] });
});

app.post('/upload', function(req, res) {

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  console.log('req.files >>>', req.files, Object.keys(req.files)); // eslint-disable-line
  console.log('req.files >0>>', Object.keys(req.files)); // eslint-disable-line

  const uploadedFile = req.files.file;
  const ext = path.extname(uploadedFile.name);

  const fn = uuidv4() + ext;

  const uploadPath = __dirname + '/uploads/' + fn;
  const uploadUrl = `http://localhost:${PORT}/uploads/${fn}`;

  uploadedFile.mv(
    uploadPath,
    function(err) {

      if (err) {
        return res.status(500).send(err);
      }

      res.send({
        url: uploadUrl,
      });
  });
});

app.use('/uploads', express.static('uploads'))

app.listen(PORT, function() {
  console.log('Express server listening on port ', PORT); // eslint-disable-line
});
