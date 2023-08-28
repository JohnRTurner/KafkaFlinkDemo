# Kafka Flink Demo
This Demo uses the kafka-load application to upload data to Kafka, 
split the data into two additional topics using Flink,
and push the Kafka metrics into InfluxDB for reporting through a Grafana dashboard.

A video can be seen [here](video/KafkaFlinkDemo.mp4).

## Demo Steps
1. Create **Kafka** cluster and topics
2. Create **kafka-load** Docker to ingest data into Kafka configuring to Kafka cluster
3. Create **Flink** and setup to Kafka cluster
4. Create **InfluxDB**
5. Create **Grafana** Instance adding reports pointing to InfluxDB
6. Setup **Kafka monitoring** to push metrics to InfluxDB
7. Start **kafka-load** application
   - Data will flow from _kafka-load -> Kafka -> Flink -> Kafka_
   - Metrics will flow _Kafka -> InfluxDB -> Grafana_

## kafka-load - Application Details
This application is written in Node.js and leverages docker-compose to for easy deployment.
Kafka-load is multiprocess to allow testing at high concurrency.  
### Parameters settable in the docker-compose.yml

| Name         | Description                           |
|--------------|---------------------------------------|
| Brokers      | CSV list of broker host or host:port. |
| TopicName    | Name of the Kafka Topic               |
| RunSeconds   | How long to Create Records            |
| KafkaThreads | Concurrency of Loader                 |

### Application Files
- **compose/docker-compose.yml** - Deploys the program and is where the parameters are updated
- **compose/.env** - Used to pass parameters to docker-compose.yml
- **compose/kafka-load/Dockerfile** - Creates the kafka-load docker
- **compose/kafka-load/package.json** - Used to by npm to build the Node.js includes library versions
- **compose/kafka-load/index.js** - The main application module used to configure and start distinct worker processes.
- **compose/kafka-load/worker.js** -Each worker.js is a separate process that generates and uploads data to Kafka

### Certificate Files
- **compose/kafka-load/certs/ca.pem** - the CA certificate for the Kafka cluster
- **compose/kafka-load/certs/service.cert** - the access certificate for the Kafka cluster
- **compose/kafka-load/certs/service.key** - the access key for the Kafka cluster

