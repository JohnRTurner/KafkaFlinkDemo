const { faker } = require("@faker-js/faker");
const Kafka = require("node-rdkafka")
const workerpool = require('workerpool')

/* This function creates a single generator*/
async function startKafkaGenerator(clientId, brokers, topicName, batchesPerRun, runSeconds){
    let rowsPerBatch = 1000
    let producer= new Kafka.Producer({'client.id':clientId, 'metadata.broker.list': brokers, 'dr_cb': true });
    let producerReady = false;
    producer.connect();
    producer.on('event.error', function(err) {
        workerpool.workerEmit({
            status: `Error from producer ${err.message}`,
        });
        producerReady = false;
    })
    producer.on('ready', function() {
        workerpool.workerEmit({
            status: `Producer ready`,
        });
        producerReady = true;
    });

    let kafkaThread = setInterval(async () => {
        if (producerReady) {
            workerpool.workerEmit({
                status: `Producer running`,
            });
            for (let batch = 0; batch < batchesPerRun; batch++) {
                try {
                    let iter = faker.number.int({min: 1, max: 1000000})
                    for (let row = 0; row < rowsPerBatch; row++) {
                        let message = {
                            iteration: iter,
                            offset: row,
                            fullName: faker.person.fullName(),
                            streetAddress: faker.location.streetAddress(),
                            city: faker.location.city(),
                            state: faker.location.state(),
                            zipCode: faker.location.zipCode(),
                            phone: faker.phone.number(),
                            message: faker.lorem.sentence(),
                            product: faker.commerce.productName(),
                            productDescription: faker.commerce.productDescription(),
                            viewDate: faker.date.recent({days: 30}),
                            //qty: faker.number.int({ min: 1, max: 20 }),
                            price: faker.number.float({min: .11, max: 100, precision: .01})
                        }
                        producer.produce(topicName, null, Buffer.from(JSON.stringify(message)))
                    }
                    // producer.flush();
                } catch (err) {
                    workerpool.workerEmit({
                        status: `A problem occurred when sending message`,
                    });

                }
            }
            producer.flush();
        } else {
            workerpool.workerEmit({
                status: '`Producer is not ready. Connected: ${producer.isConnected()}  Last Error: ${producer.getLastError()?.message}',
            });
        }
    }, 1000);

    await sleep2(runSeconds);
    clearInterval(kafkaThread);

    return true;
}

function sleep2(ms) {
    return new Promise(resolve => {
        setTimeout(() => { resolve(ms * 1000); }, ms * 1000);
    });
}

workerpool.worker({
    startKafkaGenerator: startKafkaGenerator,
})