# file-management
[![Sonar](http://proxy.dialonce.net/sonar/api/badges/gate?key=file-management)](http://sonar.dialonce.net/dashboard?id=file-management)
[![Sonar](http://proxy.dialonce.net/sonar/api/badges/measure?key=file-management&metric=ncloc)](http://sonar.dialonce.net/dashboard?id=file-management)
[![Sonar](http://proxy.dialonce.net/sonar/api/badges/measure?key=file-management&metric=coverage)](http://sonar.dialonce.net/dashboard?id=file-management)
[![Sonar](http://proxy.dialonce.net/sonar/api/badges/measure?key=file-management&metric=code_smells)](http://proxy.dialonce.net/sonar/api/badges/measure?key=file-management&metric=coverage)
[![Sonar](http://proxy.dialonce.net/sonar/api/badges/measure?key=file-management&metric=bugs)](http://sonar.dialonce.net/dashboard?id=file-management)
[![Sonar](http://proxy.dialonce.net/sonar/api/badges/measure?key=file-management&metric=sqale_debt_ratio)](http://sonar.dialonce.net/dashboard?id=file-management)

Library for easy file storage and management supporting upload, downloads and deletes

## Description
It relies on an abstract concept of provider to do the work needed. The only concrete implementation, for now, is that of the S3 provider

## Tests
TO run integration tests (test/integration dir) you must provide 'AWS_ACCESS_KEY_ID', AWS_SECRET_ACCESS_KEY and AWS_REGION env vars

### Examples (S3):
#### Upload (uploads a file to storage)
```js
const fileManagement = require('file-management');
const fs = require('fs');

const testFileName = '<your file name>';
const testLocation = 'dialonce-uploads/ci';

const manager = fileManagement.create('S3', {
      auth: {
        // AWS creds need to be provided
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_REGION: process.env.AWS_REGION,
      },
      // s3 options as needed
      options: {}
    });

 const stream = fs.createReadStream('<path to your file>');
      return manager
      .uploadFile(testLocation, testFileName, stream)
      .then((result) => {
        console.log (result);
      })
      .catch(console.error);
```

#### Run cloudfront invalidation
After `upload` function is executed, it exposes `invalidate` function along with the original upload result:
```js
manager.uploadFile(...args)
.then(({ invalidate, result }) => {
  console.log(result);
  /*
    paths and cloudfront distribution id
    @param paths defaults to ['/*']
    @param distribution can be set as CLOUDFRONT_DISTRIBUTION_ID env var
   */
  return invalidate(['/img/*', '123ABC456EFG'])
})
.then((invalidationResult) => {
  console.log(invalidationResult);
});
```

#### Download (Downloads a file from storage)
```js
const fileManagement = require('file-management');
const fs = require('fs');

const testFileName = '<your file name>';
const testLocation = 'dialonce-uploads/ci'; // S3 Bucket

const manager = fileManagement.create('S3', {
      auth: {
        // AWS creds need to be provided
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_REGION: process.env.AWS_REGION,
      },
      // s3 options as needed
      options: {}
    });

  const stream = fs.createWriteStream(testFileName);
       return manager
       .downloadFile(testLocation, testFileName, stream)
       .then(() => {
         if (!fs.existsSync(testFileName)) {
           throw new Error('File does not exist');
         } else {
           // all ok, file downloaded, delete it
           fs.unlinkSync(testFileName);
         }
       });
```
#### Delete (deletes a file on storage)
```js
const fileManagement = require('file-management');

const testFileName = '<your file name>';
const testLocation = 'dialonce-uploads/ci'; // S3 Bucket

const manager = fileManagement.create('S3', {
      auth: {
        // AWS creds need to be provided
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_REGION: process.env.AWS_REGION,
      },
      // s3 options as needed
      options: {}
    });

  manager
    .deleteFile(testLocation, testFileName)
    .then(() => {
      console.log('File deleted!');
    })
    .catch(console.error);
```

