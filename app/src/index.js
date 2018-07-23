const applicationServerPublicKey = 'BC844Rj7t_QfXN2d44qIXoUTEGHlUAanrIqxdga3Vv-jicYvrAHpx5cncywF7Ammi2PqTyxvHcadAxCg2INNXvo';
const moment = require('moment');

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

if(navigator.serviceWorker) {
    // register sw

    navigator.serviceWorker.register('./serviceworker.js')
    .then(function(swReg) {
        if(window.PushManager) {
            // check if user is subscribed
            // if they are subscribed, just return
            // if not, ask to subscribe
            return swReg.pushManager.getSubscription()
            .then(function(subscription) {
                if(subscription) {
                    return;
                } else {
                    // set up push
                    return swReg.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlB64ToUint8Array(applicationServerPublicKey)
                    })
                    .then(function(subscription) {
                        return fetch('http://localhost:3000/api/save-subscription/', {
                            method: "POST", // *GET, POST, PUT, DELETE, etc.
                            headers: {
                                "Content-Type": "application/json; charset=utf-8",
                            },
                            body: JSON.stringify(subscription), // body data type must match "Content-Type" header
                        })
                        .then(function(response) {
                            console.log('success ', response);
                        })
                        .catch(function(err) {
                            console.log('err ', err);
                        })
                    })
                    .catch(function(err) {
                        console.log('something is probs missing ', err);
                    })
                }
            })
        }
    })
}

function countdown() {
    var tpc = moment('2018-11-01');
    var rightNow = moment();
    var diff = tpc.diff(rightNow);
    var duration = moment.duration(diff);

    var months = duration.get('months');
    var days = duration.get('days');
    var hours = duration.get('hours');
    var seconds = duration.get('seconds');

    document.getElementById('countdown_span').textContent = months + " months " + days + " days  " + hours + " hours and " + seconds + " seconds.";
}

window.setInterval(countdown, 1000);