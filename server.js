const path = require('path');
const express = require('express');
const { createRequestHandler } = require('@remix-run/express');

const app = express();

// 静态文件
app.use(express.static('build/client'));

// Remix 路由
app.all(
  '*',
  createRequestHandler({
    build: require('./build/server/index.js'),
    mode: process.env.NODE_ENV,
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
