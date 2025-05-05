let playlists = {}; // Key: playlist name, Value: array of songs
let likedSongs = []; // Store original liked songs
let currentGeneratedPlaylist = [];

// Load liked songs on page load and store them
document.addEventListener("DOMContentLoaded", () => {
  fetch("likedSongs.json")
    .then(response => response.json())
    .then(songs => {
      likedSongs = songs;
      playlists["Liked music"] = songs;

      displaySongs(songs);
      setupSidebarPlaylists(); // Call the function here!
    })
    .catch(err => console.error("Error loading liked songs:", err));

  // Modal functionality
  const moodModal = document.getElementById("moodModal");
  const openMoodModal = document.getElementById("openMoodModal");
  const closeModal = document.querySelector(".close");

  openMoodModal.onclick = () => moodModal.style.display = "block";
  closeModal.onclick = () => moodModal.style.display = "none";
  window.onclick = (event) => {
    if (event.target === moodModal) moodModal.style.display = "none";
  };

  // Mood playlist generate button
  document.getElementById("generateButton").addEventListener("click", () => {
    const mood = document.getElementById("mood-select").value;
    if (mood) {
      generateMoodPlaylist(mood);
    } else {
      alert("Please select a mood!");
    }
  });

  // Save mood playlist
  document.getElementById("saveMoodPlaylist").addEventListener("click", () => {
    if (currentGeneratedPlaylist.length === 0) {
      alert("No songs to save!");
      return;
    }

    const playlistName = prompt("Enter a name for this mood playlist:");
    if (!playlistName) return;

    playlists[playlistName] = [...currentGeneratedPlaylist];
    updateSidebarPlaylists(); // Call this function after saving!
    alert(`Saved "${playlistName}" to your playlists!`);
    document.getElementById("moodModal").style.display = "none";
  });
});



// Display any given song list
function displaySongs(songs) {
  const songsContainer = document.querySelector(".songs");
  songsContainer.innerHTML = "";

  songs.forEach(song => {
    const songElement = document.createElement("div");
    songElement.classList.add("song");

    songElement.innerHTML = `
      <div class="info">
        <img src="${song.cover}" />
        <div>
          <div class="title">${song.title}</div>
          <div class="artist">${song.artist} • ${song.album}</div>
        </div>
      </div>
      <div class="like"><img src="likeicon.png"></div>
      <div class="duration">${song.duration}</div>
    `;

    songsContainer.appendChild(songElement);
  });

  // Update total info
  const totalSongs = songs.length;
  let totalSeconds = 0;
  songs.forEach(song => {
    const [min, sec] = song.duration.split(":").map(Number);
    totalSeconds += min * 60 + sec;
  });

  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  const totalInfoElement = document.getElementById("totalInfo");
  if (totalInfoElement) {
    totalInfoElement.textContent = `${totalSongs} songs • ${totalHours} hr ${remainingMinutes} min`;
  }
}

// Handle click on any playlist
function handlePlaylistClick(name) {
  document.querySelectorAll('.playlist').forEach(p => p.classList.remove('active'));
  const clicked = [...document.querySelectorAll('.playlist')].find(p => p.textContent === name);
  if (clicked) clicked.classList.add('active');

  if (playlists[name]) {
    displaySongs(playlists[name]);
  }

  const titleElement = document.querySelector(".playlist-info h2");
    if (titleElement) {
      titleElement.textContent = name;
    }

    // ✅ Update description based on playlist
    const descriptionElement = document.querySelector(".playlist-info p:nth-of-type(2)");
    if (descriptionElement) {
      if (name === "Liked music") {
        descriptionElement.textContent = "Auto playlist • 2025";
      } else {
        descriptionElement.textContent = "Mood-based playlist • 2025";
      }
    }

    // ✅ Optional: update the long paragraph (4th p tag)
    const detailPara = document.querySelector(".playlist-info p:nth-of-type(4)");
    if (detailPara) {
      if (name === "Liked music") {
        detailPara.textContent = "Music that you like in any YouTube app will be shown here. You can change this in Settings.";
      } else {
        detailPara.textContent = `Songs that match the mood or theme of "${name}"`;
      }
    }
  }

// Setup sidebar click events for all playlists
function setupSidebarPlaylists() {
  const playlistsContainer = document.querySelector(".playlists");
  playlistsContainer.innerHTML = ''; // Clear old content

  for (const playlistName in playlists) {
    const playlistEl = document.createElement("div");
    playlistEl.className = "playlist";
    playlistEl.textContent = playlistName;

    playlistEl.addEventListener("click", () => {
      handlePlaylistClick(playlistName);
    });

    playlistsContainer.appendChild(playlistEl);
  }
  // Select "Liked music" on initial load
  handlePlaylistClick("Liked music");
}

// Generate playlist based on mood
function generateMoodPlaylist(mood) {
  const filtered = likedSongs.filter(song => {
    const songMood = song.mood ? song.mood.toLowerCase() : '';
    return songMood === mood.toLowerCase();
  });

  currentGeneratedPlaylist = filtered;

  // Preview songs in modal (optional)
  const playlistContainer = document.querySelector(".playlist-songs");
  if (playlistContainer) {
    playlistContainer.innerHTML = "";
    filtered.forEach(song => {
      const songElement = document.createElement("div");
      songElement.classList.add("song");

      songElement.innerHTML = `
        <div class="info">
          <img src="${song.cover}" />
          <div>
            <div class="title">${song.title}</div>
            <div class="artist">${song.artist} • ${song.album}</div>
          </div>
        </div>
        <div class="duration">${song.duration}</div>
      `;
      playlistContainer.appendChild(songElement);
    });
  }

  document.getElementById("moodModal").style.display = "block";
}

function updateSidebarPlaylists() {
  setupSidebarPlaylists();
}
