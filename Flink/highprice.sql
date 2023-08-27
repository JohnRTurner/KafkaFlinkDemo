CREATE TABLE highprice (
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
      'topic' = 'highprice',
      'value.format' = 'json',
      'properties.group.id' = 'my-working-group'
      )