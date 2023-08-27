const workerpool = require("workerpool")
const fs = require("fs");

const clientId = "kafkaGenerator"
const brokers = process.env.Brokers
const topicName = process.env.TopicName
const kafkaThreads = process.env.KafkaThreads * 1
const runSeconds = process.env.RunSeconds * 1
const batchesPerRun = 10

const pool = workerpool.pool("./worker.js",
    {minWorkers: kafkaThreads, maxWorkers: kafkaThreads, workerType: 'process'});

let hasCerts = true
try {
    fs.statSync("../certs/ca.pem");
} catch (e){
    hasCerts = false
}
try {
    fs.statSync("../certs/service.key");
} catch (e){
    hasCerts = false
}
try {
    fs.statSync("../certs/service.cert");
} catch (e){
    hasCerts = false
}

console.log(`Passed parameters -- Brokers:${brokers} TopicName:${topicName} RunSeconds:${runSeconds}`);
console.log(`Hard Coded -- ClientID:${clientId}  BatchesPerRun:${batchesPerRun}`);
console.log(`Derived from certs directory -- HasCerts:${hasCerts}`);
let runningBatch = [];
for(let kafkaThread = 0; kafkaThread < kafkaThreads; kafkaThread++) {
    runningBatch[kafkaThread] = 0;
    pool.exec('startKafkaGenerator', [clientId, hasCerts, brokers, topicName, batchesPerRun, runSeconds], {
        on: function (payload) {
            if (payload.status === 'Producer running'){
                runningBatch[kafkaThread]++;
            } else {
                console.log(payload.status)
            }
        }
    }).then(function(){
        console.log("Successfully finished a pool thread");
    }).catch( function (err){
        console.error(err);
    });
    console.log("Started a thread");
    console.log(`There are ${pool.stats().busyWorkers} busy works and ${pool.stats().activeTasks} active tasks ` +
        `status ${JSON.stringify(runningBatch)}`)
}

setInterval(function () {
    console.log(`There are ${pool.stats().busyWorkers} busy works and ${pool.stats().activeTasks} active tasks ` +
        `status ${JSON.stringify(runningBatch)}`)
    if (pool.stats().busyWorkers === 0 && pool.stats().activeTasks === 0) {
        console.log("Shutting down pool as everything is complete.")
        pool.terminate().then(function(){
            console.log("Successfully Terminated Pool.")
        }).always(function (){
            process.exit()
        });
    }
}, 5000);


