document.addEventListener('deviceready', () => {
  const finalScoreEl = document.getElementById('finalScore');
  const finalTimeEl = document.getElementById('finalTime');
  const saveBtn = document.getElementById('saveScore');
  const playerNameInput = document.getElementById('playerName');

  const score = parseInt(localStorage.getItem('quizScore')) || 0;
  const time = parseInt(localStorage.getItem('quizTime')) || 0;

  finalScoreEl.textContent = `Score final : ${score}/10`;
  finalTimeEl.textContent = `Temps total : ${time}s`;

  saveBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim() || "Anonyme";
    saveScore({ name, score, time });
  });
});

function saveScore(newEntry) {
  window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
    dir.getFile("scoreboard.json", { create: true }, function(fileEntry) {
      // Lecture du fichier existant
      fileEntry.file(function(file) {
        const reader = new FileReader();
        reader.onloadend = function() {
          let list = [];
          try {
            list = JSON.parse(this.result || '[]');
          } catch(e) { list = []; }

          // Ajouter le nouveau score
          list.push(newEntry);

          // Trier et garder top 100
          list.sort((a,b) => b.score - a.score || a.time - b.time);
          if(list.length > 100) list.length = 100;

          // Écrire dans le fichier
          fileEntry.createWriter(function(writer) {
            writer.onwriteend = function() {
              alert("Score sauvegardé ✅");
              location.href = "score.html"; // Aller au classement
            };
            writer.onerror = function(e) {
              console.error("Erreur écriture fichier", e);
              alert("Impossible de sauvegarder le score !");
            };

            const blob = new Blob([JSON.stringify(list)], { type: "application/json" });
            writer.write(blob);
          });
        };
        reader.readAsText(file);
      });
    });
  }, function(err) {
    console.error("Erreur accès dataDirectory", err);
    alert("Impossible d'accéder au stockage !");
  });
}
