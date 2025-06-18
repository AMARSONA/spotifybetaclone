console.log("Hello, World!");

let currentSong = new Audio();
let songs;
let currFolder;
let songUrl;
let songIndex = 0;


//javascript function to convert seconds to mm:ss format
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// This script fetches a list of songs from a server and logs them to the console.
async function getSongs(folder) {
    currFolder = folder;
    console.log("Fetching songs from folder:", folder);
    // Fetch the list of songs from the server
    let a = await fetch(`/${folder}/index.json`); // Use the folder parameter to fetch songs
    // let a = await fetch(`/${folder}/`);
    let response = await a.json();

    songUrl = []
    for (let i = 0; i < response.length; i++) {
        songUrl[i] = response[i];
        // console.log(`Song ${i + 1}:`, songUrl[i]);
    }
    console.log("Songs fetched:", songUrl);

    // response.forEach(song => {
    //     const songUrl = `/${folder}/${song}`;
    //     console.log('🎵 Song URL:', songUrl);
    //     // You can add this to your playlist or player UI
    // });


    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    songs = []
    for (let i = 0; i < anchors.length; i++) {
        const element = anchors[i];
        if (element.endsWith(".mp3")) {
            // Extract the song name from the href
            songs.push(element);
            // songs.push(element.href.split(`/${folder}/`)[1]);
            // songslink.push(element.href); // Remove any query parameters
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""; // Clear the existing list
    for (const song of songUrl) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34" src="/img/music.svg">
                                              <div class="info">
                                                <div class="title">${song.replaceAll("%20", " ")}</div>  
                                                <div class="artist">Unknown Artist</div>
                                              </div>
                                              <div class="playnow">
                                              <span>Play Now</span>
                                              <img class="invert" src="/img/play.svg">
                                              </div>
                                             </li>`;

    }

    //Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })

    });

    return songUrl; // Return the list of songs

}
//play music function
const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    // let audio = new Audio(`/songs/${track}`);
    if (!pause) {
        currentSong.play();
        play.src = "/img/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

    currentSong.play().catch(error => {
        console.error("Error playing audio:", error);
    });

    currentSong.addEventListener("loadeddata", () => {
        let duration = currentSong.duration;
        console.log("Duration of the song:", duration, currentSong.currentSrc);
    });


}

async function displayAlbums() {
    console.log("displaying albums")
    // let a = await fetch(`/songs/albums.json`); // Fetch the list of albums from the server
    // let a = await fetch(`/songs/${currFolder}/`)
    // let response = await a.json();

    // Fetch albums from JSON and add it to the container
    let res = await fetch('/songs/albums.json');
    let albums = await res.json();

    let cardContainer = document.querySelector(".cardContainer");

    for (let album of albums) {
        cardContainer.innerHTML += `
      <div data-folder="${album.folder}" class="card">
        <div class="play">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                  stroke-linejoin="round" />
          </svg>
        </div>
        <img src="/songs/${album.folder}/${album.cover}" alt="Cover image not found">
        <h2>${album.title}</h2>
        <p>${album.description}</p>
      </div>
    `;
    }

    // Add click handler to load songs
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", async () => {
            let folder = card.dataset.folder;
            songs = await getSongs(`songs/${folder}`);
            playMusic(songs[0]);
        });
    });
}


   //Code for live server====(not compatible with netlify/github)

    // let response = await a.text();
    // let div = document.createElement("div")
    // div.innerHTML = response;
    // let anchors = div.getElementsByTagName("a")
    // let cardContainer = document.querySelector(".cardContainer")
    // let array = Array.from(anchors)
    // for (let index = 0; index < array.length; index++) {
    //     const e = array[index];
    //     if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
    //         let folder = e.href.split("/").slice(-2)[0]
    //         // Get the metadata of the folder
    //         let a = await fetch(`/songs/albums.json`)
    //         let response = await a.json();
    //         console.log("Response:", response);
    //         cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
    //         <div class="play">
    //             <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    //                 xmlns="http://www.w3.org/2000/svg">
    //                 <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
    //                     stroke-linejoin="round" />
    //             </svg>
    //         </div>

    //         <img src="/songs/${folder}/cover.jpg" alt="Image not found">
    //         <h2>${response.title}</h2>
    //         <p>${response.description}</p>
    //     </div>`
    //     }
    // }


    // //Load the playlist whenever card is clicked
    // Array.from(document.getElementsByClassName("card")).forEach(e => {
    //     e.addEventListener("click", async item => {
    //         songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
    //         playMusic(songs[0]); // Play the first song in the list
    //     });
    // });
// }

// Fetches the list of songs from the server and returns an array of song URLs.

async function main() {
    await getSongs("songs/bollywood"); // Fetch songs from the "bollywood" folder
    console.log(songUrl);
    playMusic(songUrl[0], true); // Play the first song in the list

    //Display all the albums on the page
    displayAlbums();


    //Attach an event listener to the play, next and previous buttons
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            play.src = "/img/pause.svg";
            currentSong.play();
            console.log("Playing song:", currentSong);

        }
        else {
            play.src = "/img/play.svg";
            currentSong.pause();
        }
    });
    // next.addEventListener("click", () => {
    //     // Logic to play the next song
    //     console.log("Next song");
    // });
    // previous.addEventListener("click", () => {
    //     // Logic to play the previous song
    //     console.log("Previous song");
    // });





    // //Play the first song in the list
    // if (songs.length > 0) {
    //     let audio = new Audio(songs[0]);
    //     audio.play().catch(error => {
    //         console.error("Error playing audio:", error);
    //     });

    //     audio.addEventListener("loadeddata", () => {
    //         let duration = audio.duration;
    //         console.log("Duration of the song:", duration, audio.currentSrc);
    //     });
    // }
    // else {
    //     console.log("No songs found.");
    // }

    //Listen for timeupdate event to update the song time
    currentSong.addEventListener("timeupdate", () => {
        console.log("Current time:", currentSong.currentTime, "Duration:", currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = `${(currentSong.currentTime / currentSong.duration) * 100}%`;
    });

    //Add an event listener to seekbar to seek the song
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let seekbar = document.querySelector(".seekbar");
        let position = seekbar.getBoundingClientRect();// Get the position of the seekbar
        console.log(position);
        let x = e.clientX - position.left; // Get the x position of the click relative to the seekbar
        let width = position.width; // Get the width of the seekbar
        let percentage = x / width; // Calculate the percentage of the click position
        currentSong.currentTime = percentage * currentSong.duration; // Set the current time of the song
    });


    //Add an event listener for hamburger menu
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";

    });

    //Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";

    });

    //Add an event listener to previous and next buttons
    previous.addEventListener("click", () => {
        console.log("Previous song");
        // let index = 0
        // Logic to play the next song
        songIndex = (songIndex - 1)
        // songIndex = (songIndex - 1 + songUrl.length) % songUrl.length;
        // let index = songUrl.indexOf(currentSong.src.split("/").slice(-1)[0]);
        console.log("Current song index:", songIndex);
        if (songIndex >= 0) {
            playMusic(songUrl[songIndex], true);
            play.src = "/img/pause.svg";
            currentSong.play();
        } else {
            console.log("No previous song available");
            document.querySelector(".songinfo").innerHTML = "No previous song available";
            play.src = "/img/play.svg";
            currentSong.pause();
        }

    });

    next.addEventListener("click", () => {
        console.log("Next song");
        // let index = 0;
        // Logic to play the next song
        songIndex = (songIndex + 1)
        // songIndex = (songIndex + 1) % songUrl.length;
        // let index = songUrl.indexOf(currentSong.src.split("/").slice(-1)[0]);
        console.log("Current song index:", songIndex);
        if (songIndex <= songUrl.length - 1) {
            play.src = "/img/pause.svg";
            currentSong.play();
            playMusic(songUrl[songIndex], true);

        } else {
            console.log("No next song available");
            document.querySelector(".songinfo").innerHTML = "No next song available";
            play.src = "/img/play.svg";
            currentSong.pause();
        }

    });

    //Add an event listener to the volume slider
    document.querySelector(".range").addEventListener("input", (e) => {
        currentSong.volume = e.target.value / 100; // Set the volume of the song
        console.log("Volume set to:", currentSong.volume);
    });

    // Add an event listener to the mute button 
    document.querySelector(".mute").addEventListener("click", () => {
        if (currentSong.muted) {
            currentSong.muted = false;
            document.querySelector(".mute").src = "/img/volume.svg";
            currentSong.volume = .40;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 40;

        } else {
            currentSong.muted = true;
            document.querySelector(".mute").src = "/img/mute.svg";
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
    });









}

main()