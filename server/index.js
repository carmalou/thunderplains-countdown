const Hapi = require('hapi');
const webpush = require('web-push');

webpush.setVapidDetails(
    'mailto:fake@fake.com',
    require('./keys.json').publicKey,
    require('./keys.json').privateKey
);

const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.PORT ? '0.0.0.0' : 'localhost',
    routes: {
        cors: true
    }
});

var knex = require('knex')({
    client: 'pg',
    connection: {
      host : 'localhost',
      user : 'carmenlong',
      password : '',
      database : 'push_notifications'
    },
    pool: { min: 0, max: 7 }
});

const init = async () => {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);

    server.route({
        method: 'POST',
        path: '/api/save-subscription/',
        handler: async function(request, h) {
            if (!request.payload || !request.payload.endpoint) {
                // Not a valid subscription.
                throw new Error({
                    error: {
                      id: 'no-endpoint',
                      message: 'Subscription must have an endpoint.'
                    }
                });
            } else {
                // actually save to DB
                var tmp = await knex
                .returning('id')
                .insert({
                    subscription: JSON.stringify(request.payload)
                })
                .into('subscriptions')
                .then(function(response) {
                    console.log('response: ', response);
                    return response;
                })
                .catch(function(err) {
                    console.log('err: ', err);
                })

                return tmp;
            }
        }
    });

    server.route({
      method: 'POST',
      path: '/api/trigger-push-msg',
      handler: function(request, h) {
          return knex
          .select('*')
          .from('subscriptions')
          .then(function(subscriptions) {
              return Promise.all(subscriptions.map(function(subscription) {
                  console.log(subscription);
                  return triggerPushMessage(subscription.subscription);   
              }));
          });
      }  
    });

};

function triggerPushMessage(subscription) {
    var obj = {
        title: 'I am push notification',
        body: 'Yay it works.'
    };

    return webpush.sendNotification(subscription, JSON.stringify(obj))
    .then(function(response) {
        console.log('line 85 ', response);
    })
    .catch(function(err) {
        console.log('err! ', err);
    });
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});



init();