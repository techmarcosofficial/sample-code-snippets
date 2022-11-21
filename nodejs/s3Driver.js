const AWS = require("aws-sdk");
const stream = require('stream');
const request = require('request');

const globals = require("../globals");
const utils = require("../utils");

const logger = globals.LOGGER;
const config = globals.CURRENT_CONFIG;

const s3 = new AWS.S3({ region: config.aws.s3.region });

const ACL_OWNER_PERM = "bucket-owner-full-control";

function copyObject(currentType, currentFilename, newType, newFilename, platform) {
    const currentBucket = utils.resolveBucket(currentType);
    const currentFullFilename = utils.resolveFullFileName(currentType, currentFilename);

    const newBucket = utils.resolveBucket(newType);
    const newFullFilename = utils.resolveFullFileName(newType, newFilename);

    const copyObjectParams = {
        CopySource: `${currentBucket}/${currentFullFilename}`,
        Bucket: newBucket,
        Key: newFullFilename
    };

    return s3.copyObject(copyObjectParams).promise();
}

function deleteObjects(type, files, platform) {
    const bucketName = utils.resolveBucket(type);
    const fullFilenames = files.map(file => utils.resolveFullFileName(type, file));

    const deleteObjectParams = fullFilenames.map(name => { return { Key: name }; });

    const bucketParams = {
        Bucket: bucketName,
        Delete: {
            Objects: deleteObjectParams,
            Quiet: true
        }
    };

    return s3.deleteObjects(bucketParams).promise();
}

function getObject(type, filename, platform) {
    const bucketName = utils.resolveBucket(type);
    const fullFilename = utils.resolveFullFileName(type, filename);

    var bucketParams = {
        Bucket: bucketName,
        Key: fullFilename
    };

    return s3.getObject(bucketParams).promise();
}

function listObjects(type, prefix, platform) {
    const bucketName = utils.resolveBucket(type);
    const fullPrefix = utils.resolveFullFileName(type, prefix);

    const bucketListParams = {
        Bucket: bucketName,
        Prefix: fullPrefix
    };

    return s3.listObjects(bucketListParams).promise();
}

function obtainSignedUrl(type, filename, contentType, platform) {
    const bucketName = utils.resolveBucket(type);
    const fullFilename = utils.resolveFullFileName(type, filename);

    if (!bucketName || !fullFilename) {
        if (!bucketName) {
            logger.error(`S3 bucket resolution failed in obtaining signed url`);
        }

        if (!fullFilename) {
            logger.error(`S3 full filename resolution failed in obtaining signed url`);
        }

        return null;
    }

    var bucketParams = {
        Bucket: bucketName,
        Key: fullFilename,
        ACL: ACL_OWNER_PERM,
        ContentType: contentType
    };

    return s3.getSignedUrl("putObject", bucketParams);
}

function putObject(type, filename, content, platform) {
    const bucketName = utils.resolveBucket(type);
    const fullFilename = utils.resolveFullFileName(type, filename);

    const bucketParams = {
        Body: content.toString("utf-8"),
        Bucket: bucketName,
        Key: fullFilename,
        ACL: ACL_OWNER_PERM
    };

    return s3.putObject(bucketParams).promise();
}

function putObjectFromUrl(type, filename, url, platform){
    const bucketName = utils.resolveBucket(type);
    const fullFilename = utils.resolveFullFileName(type, filename);

    // Create the streams
    const pass = new stream.PassThrough();

    request(url).pipe(pass);

    const bucketParams = {
        Bucket: bucketName,
        Key: fullFilename,
        Body: pass,
        ACL: 'public-read'
    };

    return s3.upload(bucketParams).promise();
}

module.exports = {
    copyObject,
    deleteObjects,
    getObject,
    listObjects,
    obtainSignedUrl,
    putObject,
    putObjectFromUrl
};
