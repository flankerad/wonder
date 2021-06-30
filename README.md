# WonderQ

WonderQ is a basic messaging queue implemented in Javascript/ES6 with Nodejs.
>* Publisher publishes message to queue and consumer processes messages, after processing messages get deleted from the queue.
> * When consumer retrieves messages from the queue it sets <*consumerId*> ensuring message is processed by only one consumer at a any given time.
> * If message is not processed within a defined time, messages is unlocked and then available for other consumers to process.
> Limitations and scaling up ideas are listed below.


### Requirements
```
Node.js
yarn
```
### Installation

```
yarn install
```

###



## APIs

 ### Publisher
##### POST
 >Publish message to the queue.

>@returns <messageId> unique id of the published message
```
   v1/publish
```
 ### Consumer
 > Consumer retrieves messages from the queue depending on the limit of messages for consumer.\
Also sends consumerId to inform what consumer is processing message, in case of multiple consumers.

##### GET
>@params\
<consumerId> unique consumer id, *integer*\
<limit> max messages consumer can retrieve, *integer*

```
   v1/consumer?cid=<consumerID>&limit=<limit>
```
 ##### DELETE
 > Deletes processed message in the queue.


>@params\
<consumerId> unique consumer id, *integer*\
<id> id of message stored in queue, *integer*\
@returns "true" or "false"

```
    v1/consumer?cid<consumerID>&id=<id>
```

## Tests

 ###### TODO: Adding more test cases
```
yarn test
```

Assuming the same system is up for deployment and no changes can be done
## Scaling up for Production
```
* Provisioning
  - Estimations for resources
    eg; taking a single message on avg 200 bytes
      for queue to handle approx 1M requests 200*1M 200MB of memory just for the queue

* Allocate resources and create a AMI
  - EC2 Instance for running the Nodejs code, since queue is in Memory
  - API Gateway, for handling the API request, makes it easy to monitor, rate limit apis
    - Cloudwatch, for logging
    - S3, storage, codebase
    - AWS code commit

  * Autoscaling
    - Set up cloudwatch triggers for autoscaling

    -
  * Monitoring
    -  Set up Cloudwatch threshold alarms
    -  Memory alarms
    -  Health check

  * Manage pipeline AWS codecommit
  * Cloudformation deployment
```

## Limitations
```
* In memory, no persistence.
* Single Server
* No failover
* No data replication
```
## Solution
```
* Since the message queue by requirement would be always in memory, there would be a need to of replication, if the server or instance goes down.
* We can setup two EC2 instances, behind reverse proxy like Nginx when on instance goes down other can be served.
* To have data consistency rsync or a sync deamon can share data.
  or if allowed cache Elasticache would remove necessity of reverse proxy.
  API gateway: Managed service makes it easy to manage and monitor API's
```
### Authors
**Anshul**
