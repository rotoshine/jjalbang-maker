const appConfig = require('../../config/appConfig');

const { firebaseConfig } = appConfig
if (!firebaseConfig) {
  throw new Error('invalid appConfig')
}

const { projectId, storageBucket } = firebaseConfig

const { Storage } = require('@google-cloud/storage')
const strorage = new Storage({
  projectId
})

const bucket = strorage.bucket(storageBucket);

const getFileSignedUrl = async (sourceId, jjalId) => {
  const filePath = `result/${sourceId}/${jjalId}`;

  try {
    const file = bucket.file(filePath);
    return file.getSignedUrl({
      action: 'read',
      expires: '04-12-2222'
    })
  } catch(e) {
    console.error(`[Bucket error] ${e.message}`)
    return []
  }
}
exports.getFileSignedUrl = getFileSignedUrl
