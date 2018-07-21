const Hapi = require('hapi');

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
    })

};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});



init();