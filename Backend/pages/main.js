if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('service-worker.js')
      .then(reg => {
      console.log("Successfully registered!");
    })
      .catch(err => {
      console.error("Oups", err);
    });
  }

  // let deferredPrompt;

  // window.addEventListener('beforeinstallprompt', (e) => {
  //   // Stash the event so it can be triggered later.
  //   deferredPrompt = e;
  //   showInstallPromotion();
  // });