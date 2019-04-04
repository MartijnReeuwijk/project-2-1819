if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/worker.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });

  window.addEventListener("load", function() {
    var status = document.getElementById("status");

    function updateOnlineStatus(event) {
      var condition = navigator.onLine ? "online" : "offline";
      console.log(condition);
      status.className = condition;
      status.innerHTML =
        "Je verbinding is " +
        condition.toUpperCase() +
        " je bekijkt nu gecachte data deze kan oud zijn";

      log.insertAdjacentHTML("beforeend", "Event: " + event.type);
    }

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
  });



}
