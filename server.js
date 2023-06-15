const express = require('express');
const AWS = require('aws-sdk');
require('dotenv').config();

const app = express();
const port = process.env.port;

const cloudFrontDomain = process.env.CLOUD_FRONT_DOMAIN;
const s3BucketName = process.env.S3_BUCKET_NAME;
const imageKey = process.env.IMAGE_KEY;
const region = process.env.REGION;

// Configure AWS SDK with credentials
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  signatureVersion: process.env.SIGNATURE_VERSION,
  region: region,
});

app.get('/', (req, res) => {

  const s3 = new AWS.S3();

  // Generate a signed URL with a 5-minute expiry for the image file
  const params = {
    Bucket: s3BucketName,
    Key: imageKey,
    Expires: 300, // 5 minutes in seconds
  };

  s3.getSignedUrl('getObject', params, (err, url) => {
    if (err) {
      console.error('Error generating signed URL:', err);
      res.sendStatus(500);
    } else {
      console.log('Signed URL:', url);
      return res.status(200).send("Check console for Signed URL"); //send message to see in console
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
