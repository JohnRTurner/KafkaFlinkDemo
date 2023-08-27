CREATE TABLE rawdata (
                       `iteration` BIGINT,
                       `offset` INT,
                       `fullName` STRING,
                       `streetAddress`  STRING,
                       `city` STRING,
                       `state` STRING,
                       `zipCode` STRING,
                       `phone` STRING,
                       `message` STRING,
                       `product` STRING,
                       `productDescription` STRING,
                       `viewDate` STRING,
                       `price` FLOAT
) WITH (
      'connector' = 'kafka',
      'properties.bootstrap.servers' = 'kafka-1930c95-jrt13a-c2b8.aivencloud.com:22526',
      'scan.startup.mode' = 'earliest-offset',
      'topic' = 'rawdata',
      'value.format' = 'json'
      )