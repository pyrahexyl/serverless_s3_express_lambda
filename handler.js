'use strict';

const queryString = require("query-string");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

// S3バケット名
const S3_BUCKETNAME = process.env.S3_BUCKET;//serverless.ymlから環境変数を取得


/**
 *  GET 
 *    $ curl 'https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/storage/get/foo.txt'
 */
module.exports.get = (event, context, callback) => {
  const key = event.pathParameters.key;
  let err = [];
  if( ! ( key !== "" && key.match(/^([a-zA-Z0-9]{1,})\.json$/) ) ){
    err.push("invalid key")
  }

  if( err.length >= 1 ){
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({status:false, message:err}),
    });

    return(false);
  }

  const params = {
    Bucket: S3_BUCKETNAME,
    Key: key,
  };

  s3.getObject(params, (err, data)=>{
    if (err) {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({status:false, message:err})
      });
    }
    else {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({status:true, data:data, body:data.Body.toString()})
      });
    }
  });
};


/**
 *  POST 
 *    $ curl -d 'data=xxxxx' -X POST 'https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/storage/set/{key}'
 */
module.exports.set = (event, context, callback) => {
  //--------------------------
  // 引数チェック
  //--------------------------
  const body = JSON.parse(event.body);
  const key = event.pathParameters.key;
  let err = [];
  if( ! ( key !== "" && key.match(/^([a-zA-Z0-9]{1,})\.json$/) ) ){
    err.push("invalid key")
  }
  if( ! ("data" in body && body.data !== "") ){
    err.push("invalid data")
  }

  if( err.length >= 1 ){
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({status:false, message:err}),
    });

    return(false);
  }

  const request = {
    text:body.data,
    url:body.url,
    title:body.title,
    timestamp:body.now
  }
  const params = {
    Bucket: S3_BUCKETNAME,
    Key: key,
    Body: JSON.stringify(request),
    ContentType: "text/plain"
  };

  s3.putObject(params, (err, data)=>{
    if (err) {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({status:false, message:err, request:request, params:params})
      });
    }
    else {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({status:true, data:data, request:request, params:params})
      });
    }
  });
};


/**
 *  POST 
 *    $ curl -X POST 'https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/storage/remove/{key}'
 */
module.exports.remove = (event, context, callback) => {
  const key = event.pathParameters.key;
  let err = [];
  if( ! ( key !== "" && key.match(/^([a-zA-Z0-9]{1,})\.json$/) ) ){
    err.push("invalid key")
  }

  if( err.length >= 1 ){
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({status:false, message:err}),
    });

    return(false);
  }

  const params = {
    Bucket: S3_BUCKETNAME,
    Key: key,
  };

  s3.deleteObject(params, (err, data)=>{
    if (err) {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({status:false, message:err})
      });
    }
    else {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({status:true, data:data})
      });
    }
  });
};


/**
 *  POST 
 *    $ curl 'https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/storage/list'
 */
module.exports.list = (event, context, callback) => {
  const params = {
    Bucket: S3_BUCKETNAME,
  };

  s3.listObjectsV2(params, (err, data)=>{
    if (err) {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({status:false, message:err})
      });
    }
    else {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({status:true, data:data})
      });
    }
  });
};