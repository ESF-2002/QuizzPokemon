var app = {
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  onDeviceReady: function() {
    console.log("Cordova prêt 🚀");
  }
};

app.initialize();
