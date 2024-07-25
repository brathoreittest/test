let player;
let videoIds = [];
let currentIndex = 0;

// Function to extract video ID from a YouTube URL
function extractVideoID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Function to get video details
async function getVideoDuration(videoId) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${API_KEY}`);
        const data = await response.json();
        if (data.items.length > 0) {
            const duration = data.items[0].contentDetails.duration;
            return parseISO8601Duration(duration);
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching video details:', error);
        return null;
    }
}

// Function to parse ISO 8601 duration format
function parseISO8601Duration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    return (hours * 3600) + (minutes * 60) + seconds;
}

function onYouTubeIframeAPIReady() {
    console.log('YouTube IFrame API is ready.');
    fetch('videos.txt')
        .then(response => response.text())
        .then(async data => {
            videoIds = data.split('\n').map(id => id.trim()).filter(id => id !== '');
            console.log('Loaded video IDs:', videoIds);
            if (videoIds.length > 0) {
                await loadVideo();
            } else {
                console.error('No video IDs found.');
            }
        })
        .catch(error => console.error('Error loading video IDs:', error));
}

async function loadVideo() {
    if (videoIds.length === 0) {
        console.error('No video IDs available to load.');
        return;
    }
    
    const videoId = videoIds[currentIndex];
    const durationInSeconds = await getVideoDuration(videoId);
    
    if (durationInSeconds === null) {
        console.error('Could not get duration for video ID:', videoId);
        return;
    }
    
    const randomTime = Math.floor(Math.random() * durationInSeconds); // Random time between 0 and video duration
    console.log(`Loading video ID: ${videoId} at random time: ${randomTime} seconds`);
    
    if (player) {
        player.loadVideoById({ videoId: videoId, startSeconds: randomTime });
    } else {
        player = new YT.Player('player', {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: { 'start': randomTime },
            events: {
                'onReady': onPlayerReady,
                'onError': onPlayerError
            }
        });
    }
}

function onPlayerReady(event) {
    console.log('Player is ready. Starting video.');
    event.target.playVideo();
}

function onPlayerError(event) {
    console.error('Error loading or playing video. Moving to next video.');
    nextVideo();
}

function nextVideo() {
    currentIndex = (currentIndex + 1) % videoIds.length;
    console.log('Loading next video. Current index:', currentIndex);
    loadVideo();
}

document.getElementById('prevBtn').addEventListener('click', () => {
    if (videoIds.length === 0) {
        console.error('No video IDs available for navigation.');
        return;
    }
    currentIndex = (currentIndex - 1 + videoIds.length) % videoIds.length;
    console.log('Previous button clicked. Current index:', currentIndex);
    loadVideo();
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (videoIds.length === 0) {
        console.error('No video IDs available for navigation.');
        return;
    }
    nextVideo();
});
