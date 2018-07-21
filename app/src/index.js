const applicationServerPublicKey = 'BC844Rj7t_QfXN2d44qIXoUTEGHlUAanrIqxdga3Vv-jicYvrAHpx5cncywF7Ammi2PqTyxvHcadAxCg2INNXvo';

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

    navigator.serviceWorker.register('./../serviceworker.js')
    .then(function(swReg) {
        if(window.PushManager) {
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
} else {
    // do nothing
}

function countdown() {
    // TODO: make interval for countdown
    console.log('right now I\'m just a log statement');
}

countdown();