document.addEventListener('deviceready', function() {
  const tbody = document.getElementById('scoreTableBody');

  window.resolveLocalFileSystemURL(
    cordova.file.dataDirectory + "scoreboard.json",
    function(fileEntry) {
      fileEntry.file(function(file) {
        const reader = new FileReader();
        reader.onloadend = function() {
          let list = [];
          try { list = JSON.parse(this.result) || []; } catch (e) { list = []; }
          list.sort((a, b) => b.score - a.score || a.time - b.time);
          list = list.slice(0, 10); // top 10

          tbody.innerHTML = "";
          if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4">Aucun score enregistré</td></tr>`;
            return;
          }

          list.forEach((entry, i) => {
            const row = document.createElement('tr');

            let medal = "";
            if (i === 0) medal = "🥇";
            else if (i === 1) medal = "🥈";
            else if (i === 2) medal = "🥉";
            else medal = i + 1;

            row.classList.add("rank-" + (i + 1));

            row.innerHTML = `
              <td>${medal}</td>
              <td>${entry.name}</td>
              <td>${entry.score}/10</td>
              <td>${entry.time}s</td>`;
            tbody.appendChild(row);
          });
        };
        reader.readAsText(file);
      });
    },
    function() {
      tbody.innerHTML = `<tr><td colspan="4">Aucun score enregistré</td></tr>`;
    }
  );

  document.getElementById('backHome').addEventListener('click', function() {
    location.href = "index.html";
  });
}, false);
