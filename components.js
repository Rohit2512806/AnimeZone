function createAnimeCard(anime, isRecommendation) {
    const wrapper = document.createElement('div');
    wrapper.className = 'anime-item';

    const link = document.createElement('a');
    let episodeNumber = anime.episode;
    let targetUrl;

    const parentSection = wrapper.closest('section'); // Closest section element

    if (parentSection) {
        if (parentSection.id === 'recommendationSection') {
            if (anime.totalEpisodes > 0) {
                episodeNumber = 'Complete';
                targetUrl = `anime-detail.html?title=${encodeURIComponent(anime.title)}`;
            } else {
                episodeNumber = 'Ongoing';
                targetUrl = `video-player.html?title=${encodeURIComponent(anime.title)}&ep=1`;
            }
            link.href = targetUrl;
        } else if (parentSection.id === 'latestAnimeSection') {
            let latestEpisodeNum = '';
            if (anime.episodes && anime.episodes.length > 0) {
                latestEpisodeNum = anime.episodes[anime.episodes.length - 1].episodeNum;
            }

            const videoUrl = getVideoUrlByEpisode(anime.title, latestEpisodeNum);
            if (videoUrl) {
                targetUrl = `video-player.html?title=${encodeURIComponent(anime.title)}&ep=${latestEpisodeNum}&url=${encodeURIComponent(videoUrl)}`;
            } else {
                targetUrl = `anime-detail.html?title=${encodeURIComponent(anime.title)}`;
            }
            link.href = targetUrl;
        } else {
            targetUrl = `anime-detail.html?title=${encodeURIComponent(anime.title)}`;
            link.href = targetUrl;
        }
    } else {
        targetUrl = `anime-detail.html?title=${encodeURIComponent(anime.title)}`;
        link.href = targetUrl;
    }

    link.style.textDecoration = 'none';
    link.style.color = 'inherit';

    const card = document.createElement('div');
    card.className = 'anime-card';

    const img = document.createElement('img');
    img.src = anime.img;
    img.alt = anime.title;
    card.appendChild(img);

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    let latestEpisodeNum = '';
    if (anime.episodes && anime.episodes.length > 0) {
        latestEpisodeNum = anime.episodes[anime.episodes.length - 1].episodeNum;
    }

    const episodeBtn = document.createElement('button');
    episodeBtn.className = 'episode-btn';
    episodeBtn.textContent = `Ep ${latestEpisodeNum}`;
    actions.appendChild(episodeBtn);

    const subBtn = document.createElement('button');
    subBtn.className = 'sub-btn';
    subBtn.textContent = 'Sub';

    if (isRecommendation) {
        const statusText = getAnimeStatus(anime.title);
        const statusSpan = document.createElement('span');
        statusSpan.className = 'recommendation-status';
        statusSpan.textContent = statusText;
        statusSpan.style.marginRight = '10px'; 

        actions.appendChild(statusSpan);
        actions.appendChild(subBtn);
        episodeBtn.style.display = 'none'; 
    } else {
        actions.appendChild(subBtn);
    }

    card.appendChild(actions);

    const titleDiv = document.createElement('div');
    titleDiv.className = 'anime-title';
    titleDiv.textContent = anime.title;

    link.appendChild(card);
    link.appendChild(titleDiv);

    wrapper.appendChild(link);

    return wrapper;
}


// Helper function to get anime status
function getAnimeStatus(animeTitle) { 
    if (typeof allAnimeList === 'undefined') {
        console.warn("allAnimeList is not defined. Cannot determine anime status.");
        return "Unknown";
    }
    const anime = allAnimeList.find(a => a.title === animeTitle);
    if (anime) {
        if (anime.totalEpisodes > 0 && anime.episodes && anime.episodes.length > 0) {
            const lastEpisodeNumber = anime.episodes.reduce((max, ep) => Math.max(max, ep.episodeNum), 0);
            if (lastEpisodeNumber === anime.totalEpisodes) {
                return "Complete";
            }
        }
        if (anime.totalEpisodes > 0 && anime.episodes && anime.episodes.length >= anime.totalEpisodes) {
            return "Complete";
        } else {
            return "Ongoing";
        }
    }
    return "Unknown";
}
// --- Header/Nav Related Functions ---

// Function to toggle mobile menu visibility
function toggleMenu() {
      const links = document.getElementById('navLinks');
      links.classList.toggle('show');
    }

// Function to toggle search box visibility and manage content display
function toggleSearchBox() {
    const box = document.getElementById('searchBox');
    const mainContent = document.getElementById('mainContent');
    const searchResultsSection = document.getElementById('searchResultsSection');

    if (box) { // Check if searchBox exists
        if (box.style.display === 'block') {
            box.style.display = 'none';
            document.getElementById('searchInput').value = '';

            // Show main content again when search box is closed
            if (mainContent) mainContent.style.display = ''; // Restore main content's original display
            if (searchResultsSection) searchResultsSection.style.display = 'none'; // Hide search results

            if (typeof currentPage !== 'undefined' && typeof displayCurrentPage === 'function' && typeof allAnimeList !== 'undefined') {
                currentPage = 1;
                filteredAnimeList = [...allAnimeList]; // Reset filtered list to all anime
                displayCurrentPage(filteredAnimeList); // Redisplay first page of all anime
            }

            // Also ensure other sections are visible on index.html if search is cleared
            const latestAnimeSection = document.getElementById('latestAnimeSection');
            const latestAnimeNextButton = document.getElementById('latestAnimeNextButton');
            const recommendationSection = document.getElementById('recommendationSection');
            const genreSection = document.getElementById('genreSection');
            const seasonSection = document.getElementById('seasonSection');

            if (latestAnimeSection) latestAnimeSection.style.display = 'block';
            if (latestAnimeNextButton) latestAnimeNextButton.style.display = 'flex'; // Use flex to center the button
            if (recommendationSection) recommendationSection.style.display = 'block';
            if (genreSection) genreSection.style.display = 'block';
            if (seasonSection) seasonSection.style.display = 'block';


        } else {
            box.style.display = 'block';
            document.getElementById('searchInput').focus();

            // Hide main content when search box is opened
            if (mainContent) mainContent.style.display = 'none';
            // Show search results section (even if empty initially)
            if (searchResultsSection) {
                searchResultsSection.style.display = 'block';
                searchResultsSection.querySelector('h2').textContent = `Search Results`; // Initial heading
                searchResultsContainer.innerHTML = ''; // Clear previous results
            }
            filterAnime(); // Trigger filter to show all/relevant items in search section if search box opened with empty input
        }
    }
}

// Function to toggle light/dark theme
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon'); // Assuming this ID is on the icon

    body.classList.toggle('light');

    if (body.classList.contains('light')) {
        localStorage.setItem('theme', 'light');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    } else {
        localStorage.setItem('theme', 'dark');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
}

// Function to apply saved theme on page load
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('themeIcon');
    if (savedTheme === 'light') {
        document.body.classList.add('light');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    } else {
        document.body.classList.remove('light'); // default to dark if not set or is 'dark'
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
}


// --- Global Search Functionality ---
function filterAnime() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput || typeof allAnimeList === 'undefined') return;

    const searchText = searchInput.value.toLowerCase();
    const mainContent = document.getElementById('mainContent');
    const searchResultsSection = document.getElementById('searchResultsSection');
    const searchResultsContainer = document.getElementById('searchResultsContainer');

    if (!mainContent || !searchResultsSection || !searchResultsContainer) return;

    // Always show search results section if search is active (input not empty)
    if (searchText.length > 0) {
        mainContent.style.display = 'none';
        searchResultsSection.style.display = 'block';
        searchResultsSection.querySelector('h2').textContent = `Search Results for "${searchText}"`;
        searchResultsContainer.innerHTML = '';

        const results = allAnimeList.filter(anime =>
            anime.title.toLowerCase().includes(searchText) ||
            (Array.isArray(anime.genre) && anime.genre.some(g => g.toLowerCase().includes(searchText))) ||
            (typeof anime.genre === 'string' && anime.genre.toLowerCase().includes(searchText))
        );

        if (results.length > 0) {
            results.forEach(anime => {
                const link = document.createElement('a');
                link.href = `anime-detail.html?title=${encodeURIComponent(anime.title)}`;
                link.style.textDecoration = 'none';
                link.style.color = 'inherit';

                const statusText = getAnimeStatus(anime.title); // Use getAnimeStatus from this file
                const statusClass = statusText === "Complete" ? "complete" : "ongoing";

                const card = document.createElement('div');
                card.className = 'anime-card'; // Use minimal card for search results
                card.innerHTML = `
                    <img src="${anime.img}" alt="${anime.title}">
                    <div class="anime-info">
                        <div class="anime-title">${anime.title}</div>
                        <div class="status-episode ${statusClass}">${statusText} | ${anime.totalEpisodes || 'N/A'} Eps</div>
                        <div class="genre">${Array.isArray(anime.genre) ? anime.genre.join(', ') : (anime.genre || 'N/A')}</div>
                    </div>
                `;
                link.appendChild(card);
                searchResultsContainer.appendChild(link);
            });
        } else {
            searchResultsContainer.innerHTML = '<p style="color: var(--muted-text); text-align: center; padding: 20px;">No results found.</p>';
        }
    } else {
        // If search input is empty, hide search results and show main content
        mainContent.style.display = '';
        searchResultsSection.style.display = 'none';

        // Specific reset for all-anime.html (if applicable and its displayCurrentPage exists)
        if (typeof currentPage !== 'undefined' && typeof displayCurrentPage === 'function' && typeof allAnimeList !== 'undefined') {
            currentPage = 1;
            filteredAnimeList = [...allAnimeList]; // Reset filtered list to all anime
            displayCurrentPage(filteredAnimeList); // Redisplay first page of all anime
        }
        // Also ensure other sections are visible on index.html if search is cleared
        const latestAnimeSection = document.getElementById('latestAnimeSection');
        const latestAnimeNextButton = document.getElementById('latestAnimeNextButton');
        const recommendationSection = document.getElementById('recommendationSection');
        const genreSection = document.getElementById('genreSection');
        const seasonSection = document.getElementById('seasonSection');

        if (latestAnimeSection) latestAnimeSection.style.display = 'block';
        if (latestAnimeNextButton) latestAnimeNextButton.style.display = 'flex'; // Use flex to center the button
        if (recommendationSection) recommendationSection.style.display = 'block';
        if (genreSection) genreSection.style.display = 'block';
        if (seasonSection) seasonSection.style.display = 'block';
    }
}


// --- Pagination Variables (Global for all-anime.html) ---

let itemsPerPage = 16;
let currentPage = 1;
let filteredAnimeList = []; // This will hold the list for pagination

// --- Pagination Functions (Moved from all-anime.html) ---
function displayCurrentPage(animeListToDisplay) {
    const gridContainer = document.getElementById('allAnimeGrid');
    if (!gridContainer || typeof allAnimeList === 'undefined') return;

    gridContainer.innerHTML = ''; // Clear previous content

    if (animeListToDisplay.length === 0) {
        gridContainer.innerHTML = '<p style="color: var(--muted-text); text-align: center; padding: 20px;">No anime data available.</p>';
        updatePaginationControls(0);
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = animeListToDisplay.slice(startIndex, endIndex);

    if (currentItems.length === 0 && currentPage > 1) { // Edge case: if last page has no items, go back
        currentPage--;
        displayCurrentPage(animeListToDisplay);
        return;
    } else if (currentItems.length === 0) { // If no items on first page
        gridContainer.innerHTML = '<p style="color: var(--muted-text); text-align: center; padding: 20px;">No anime found matching criteria.</p>';
        updatePaginationControls(0);
        return;
    }


    currentItems.forEach(anime => {
        const animeCardElement = createAnimeCard(anime, false); // Ensure isRecommendation is false for all anime page
        gridContainer.appendChild(animeCardElement);
    });

    updatePaginationControls(animeListToDisplay.length);
}

function updatePaginationControls(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pageInfoSpan = document.getElementById('pageInfo');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');

    if (pageInfoSpan) pageInfoSpan.textContent = `Page ${currentPage} of ${totalPages || 1}`;
    if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
}

function nextPage() {
    const totalPages = Math.ceil(filteredAnimeList.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayCurrentPage(filteredAnimeList);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayCurrentPage(filteredAnimeList);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
    }
}

// --- Anime Detail Page Specific Function (Moved from anime-detail.html) ---

function displayAnimeDetails(anime) {
    const container = document.getElementById('animeDetailContainer');
    if (!container) {
        console.error("Anime detail container not found!");
        return;
    }

    // Main anime details structure
    container.innerHTML = `
            <img src="${anime.img}" alt="${anime.title} Cover" class="anime-detail-cover" id="animeCoverImg" />
        <div class="anime-detail-header">
          <h1>${anime.title}</h1>
          <p>${anime.description || 'No description available.'}</p>
        </div>

        <div class="anime-detail-info">
          <h2>Details</h2>
          <ul>
            <li><span>Status:</span> ${getAnimeStatus(anime.title)}</li>
            <li><span>Type:</span> ${anime.type || 'N/A'}</li>
            <li><span>Episodes:</span> ${anime.totalEpisodes || 'N/A'}</li>
            <li><span>Genre:</span> ${Array.isArray(anime.genre) ? anime.genre.join(', ') : (anime.genre || 'N/A')}</li>
            <li><span>Release Date:</span> ${anime.releaseDate || 'N/A'}</li>
          </ul>
        </div>
        <div class="anime-detail-actions">
            <a href="video-player.html?title=${encodeURIComponent(anime.title)}&ep=${anime.episodes && anime.episodes.length > 0 ? anime.episodes[0].episodeNum : 1}" class="watch-now-btn">
                Watch Now
            </a>
        </div>
        <section class="watch-anime-section">
            <h2 class="section-title">All Episodes ${anime.title}</h2>
            <div class="episode-nav">
                <a href="#" id="firstEpisodeLink">First Episode</a>
                <a href="#" id="lastEpisodeLink">Last Episode</a>
            </div>
            <div class="video-player-placeholder" id="videoPlayerPlaceholder">

            </div>
        </section>
        <section class="episode-list-section">
            <div class="episode-list-cards" id="episodeListCards">
                </div>
        </section>
    `;

    const animeCoverImg = document.getElementById('animeCoverImg');
    if (animeCoverImg) {
        animeCoverImg.src = anime.img;
        animeCoverImg.alt = `${anime.title} Cover`;
    }
    const episodeListCards = document.getElementById('episodeListCards');
    const videoPlayerPlaceholder = document.getElementById('videoPlayerPlaceholder');
    const firstEpisodeLink = document.getElementById('firstEpisodeLink');
    const lastEpisodeLink = document.getElementById('lastEpisodeLink');

    if (episodeListCards && anime.episodes && anime.episodes.length > 0) {
        episodeListCards.innerHTML = ''; // Clear previous episodes
        anime.episodes.forEach(episode => {
            const episodeCard = document.createElement('div');
            episodeCard.classList.add('episode-list-item-card');
            episodeCard.dataset.episodeNumber = episode.episodeNum;

            if (episode.imageUrl) {
                const image = document.createElement('img');
                image.src = episode.imageUrl;
                image.alt = `Episode ${episode.episodeNum} Thumbnail`;
                image.classList.add('episode-item-image');
                episodeCard.appendChild(image);
            }

            const details = document.createElement('div');
            details.classList.add('episode-item-details');

            const title = document.createElement('h3');
            title.classList.add('episode-item-title');
            title.textContent = episode.title || `Episode ${episode.episodeNum}`;
            details.appendChild(title);

            const number = document.createElement('span');
            number.classList.add('episode-item-number');
            number.textContent = `Ep ${episode.episodeNum}`;
            details.appendChild(number);

            episodeCard.appendChild(details);
            episodeListCards.appendChild(episodeCard);

            episodeCard.addEventListener('click', () => {
                window.location.href = `video-player.html?title=${encodeURIComponent(anime.title)}&ep=${episode.episodeNum}`;
            });
        });

        if (firstEpisodeLink) {
            firstEpisodeLink.href = `video-player.html?title=${encodeURIComponent(anime.title)}&ep=${anime.episodes[0].episodeNum}`;
            firstEpisodeLink.textContent = `First Episode ${anime.episodes[0].episodeNum}`;
        }
        if (lastEpisodeLink) {
            lastEpisodeLink.href = `video-player.html?title=${encodeURIComponent(anime.title)}&ep=${anime.episodes[anime.episodes.length - 1].episodeNum}`;
            lastEpisodeLink.textContent = `Last Episode ${anime.episodes[anime.episodes.length - 1].episodeNum}`;
        }

    } else if (episodeListCards) {
        episodeListCards.innerHTML = '<p>No episodes available for this anime.</p>';
    }
}


// --- New Function: Filter Anime by Genre (Moved from index.html) ---
function filterAnimeByGenre(selectedGenre) {
    const mainContent = document.getElementById('mainContent');
    const searchResultsSection = document.getElementById('searchResultsSection');
    const searchResultsContainer = document.getElementById('searchResultsContainer');

    if (!mainContent || !searchResultsSection || !searchResultsContainer || typeof allAnimeList === 'undefined') return;
    console.log("Filtering for genre:", selectedGenre);
    // Hide main sections
    mainContent.style.display = 'none';

    // Show search results section
    searchResultsSection.style.display = 'block';
    searchResultsSection.querySelector('h2').textContent = `Anime in Genre: "${selectedGenre}"`; // Update heading
    searchResultsContainer.innerHTML = ''; // Clear previous content

    const normalizedSelectedGenre = selectedGenre.toLowerCase();

    const filteredAnime = allAnimeList.filter(anime =>
        (Array.isArray(anime.genre) && anime.genre.includes(selectedGenre)) ||
        (typeof anime.genre === 'string' && anime.genre === selectedGenre)
    );
        console.log("Number of filtering anime:", filteredAnime.length);
    if (filteredAnime.length > 0) {
        filteredAnime.forEach(anime => {
            const link = document.createElement('a');
            link.href = `anime-detail.html?title=${encodeURIComponent(anime.title)}`;
            link.style.textDecoration = 'none';
            link.style.color = 'inherit';

            const statusText = getAnimeStatus(anime.title); // Use your getAnimeStatus function
            const statusClass = statusText === "Complete" ? "complete" : "ongoing";

            const card = document.createElement('div');
            card.className = 'anime-card'; // Use minimal card for search results
            card.innerHTML = `
                <img src="${anime.img}" alt="${anime.title}">
                <div class="anime-info">
                    <div class="anime-title">${anime.title}</div>
                    <div class="status-episode ${statusClass}">${statusText} | ${anime.totalEpisodes || 'N/A'} Eps</div>
                        <div class="genre">${Array.isArray(anime.genre) ? anime.genre.join(', ') : (anime.genre || 'N/A')}</div>
                    </div>
                `;
            link.appendChild(card);
            searchResultsContainer.appendChild(link);
        });
    } else {
        searchResultsContainer.innerHTML = `<p style="color: var(--muted-text); text-align: center; padding: 20px;">No anime found for genre: "${selectedGenre}".</p>`;
    }
}

window.filterAnimeByGenre = filterAnimeByGenre; 


// --- Setup Functions to attach Event Listeners ---
// These functions are called AFTER components are loaded to ensure elements exist
function setupSearchFunctionality() {
    // Check if search icon exists in the newly loaded header
    const searchIcon = document.querySelector('.header-bar .icon-button:first-of-type');
    const searchInput = document.getElementById('searchInput');

    if (searchIcon) {
        searchIcon.addEventListener('click', toggleSearchBox);
    } else {
        console.warn("Search icon not found for setup. Make sure it's in header.html.");
    }
    if (searchInput) {
        searchInput.addEventListener('keyup', filterAnime);
    } else {
        console.warn("Search input not found for setup. Make sure it's in header.html.");
    }
}

function setupMenuToggle() {
    // Check if menu toggle exists in the newly loaded nav
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    } else {
        console.warn("Menu toggle button not found for setup. Make sure it's in nav.html.");
    }
}

function setupThemeToggle() {
    // Check if theme toggle exists in the newly loaded header
    const themeToggle = document.getElementById('themeIcon');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    } else {
        console.warn("Theme toggle button not found for setup. Make sure it's in header.html.");
    }
}


// --- Main Component Loading Function ---
async function loadComponents() {
    try {
        console.log("Loading common components...");

        // Fetch and inject Header
        const headerResponse = await fetch('header.html');
        if (!headerResponse.ok) throw new Error(`HTTP error! status: ${headerResponse.status} for header.html`);
        const headerHtml = await headerResponse.text();
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            headerPlaceholder.innerHTML = headerHtml;
        } else {
            console.error("Header placeholder (ID: header-placeholder) not found in the DOM!");
        }

        // Fetch and inject Nav
        const navResponse = await fetch('nav.html');
        if (!navResponse.ok) throw new Error(`HTTP error! status: ${navResponse.status} for nav.html`);
        const navHtml = await navResponse.text();
        const navPlaceholder = document.getElementById('nav-placeholder');
        if (navPlaceholder) {
            navPlaceholder.innerHTML = navHtml;
        } else {
            console.error("Navigation placeholder (ID: nav-placeholder) not found in the DOM!");
        }

        // Fetch and inject Footer
        const footerResponse = await fetch('footer.html');
        if (!footerResponse.ok) throw new Error(`HTTP error! status: ${footerResponse.status} for footer.html`);
        const footerHtml = await footerResponse.text();
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = footerHtml;
        } else {
            console.error("Footer placeholder (ID: footer-placeholder) not found in the DOM!");
        }

        // --- Important: Attach event listeners AFTER components are loaded ---
        applySavedTheme(); // Apply theme settings first
        setupSearchFunctionality();
        setupMenuToggle();
        setupThemeToggle();

        console.log("Common components loaded and functionality setup.");

    } catch (error) {
        console.error('Error loading common components or setting up functionality:', error);
        // Display a user-friendly message if critical components fail to load
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = `<p style="color: red; text-align: center; padding: 20px;">
                Error loading essential parts of the page. Please try refreshing.
                If the problem persists, ensure you are running a local web server (e.g., Python's http.server).
            </p>`;
        }
    }
}

// Call loadComponents when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadComponents);

function getVideoUrlByEpisode(animeTitle, episodeNum) {
    console.log("getVideoUrlByEpisode called with:", animeTitle, episodeNum);
    const anime = allAnimeList.find(a => a.title === animeTitle);
    if (anime && anime.episodes) {
        const episode = anime.episodes.find(ep => ep.episodeNum === parseInt(episodeNum));
        return episode ? (console.log("Video URL Found:", episode.videoUrl), episode.videoUrl) : null;
    }
    return null;
}

// new series section
async function loadNewSeriesSection() {
  try {
    const response = await fetch('new-series-section.html');
    const html = await response.text();
    const newSeriesPlaceholder = document.getElementById('newSeriesPlaceholder');
    if (newSeriesPlaceholder) {
      newSeriesPlaceholder.innerHTML = html;
      loadAnimeDataForNewSeries();
    }
  } catch (error) {
    console.error('New Series section loading error:', error);
  }
}

function loadAnimeDataForNewSeries() {
  if (typeof allAnimeList === 'undefined') {
    const script = document.createElement('script');
    script.src = 'animeData.js';
    document.head.appendChild(script);
    script.onload = populateNewSeriesSection;
  } else {
    populateNewSeriesSection();
  }
}

function populateNewSeriesSection() {
    const newAnimeSeriesGrid = document.getElementById('newAnimeSeriesGrid');
    if (newAnimeSeriesGrid && typeof allAnimeList !== 'undefined') {
        const sortedAnimeList = [...allAnimeList].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

                const numberOfAnimeToShow = 10;
                 const limitedAnimeList = sortedAnimeList.slice(0, numberOfAnimeToShow);
       if (limitedAnimeList.length > 0) {
            newAnimeSeriesGrid.innerHTML = '';
            limitedAnimeList.forEach(anime => {
                const link = document.createElement('a');
                link.href = `anime-detail.html?title=${encodeURIComponent(anime.title)}`;
                link.style.textDecoration = 'none';
                link.style.color = 'inherit';

                const statusText = getAnimeStatus(anime.title);
                const statusClass = statusText === "Complete" ? "complete" : "ongoing";

                const card = document.createElement('div');
                card.className = 'anime-card';
                card.innerHTML = `
                    <img src="${anime.img}" alt="${anime.title}">
                    <div class="anime-info">
                        <div class="anime-title">${anime.title}</div>
                        <div class="status-episode ${statusClass}">${statusText} | ${anime.totalEpisodes || 'N/A'} Eps</div>
                        <div class="genre">${Array.isArray(anime.genre) ? anime.genre.join(', ') : (anime.genre || 'N/A')}</div>
                    </div>
                `;
                link.appendChild(card);
                newAnimeSeriesGrid.appendChild(link);
            });
        } else {
            newAnimeSeriesGrid.innerHTML = '<p style="color: var(--muted-text);">No anime available.</p>';
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
  loadNewSeriesSection();
});
// new series section end


// Genre section
async function loadGenreSection() {
  try {
    const response = await fetch('genre-section-template.html');
    const html = await response.text();
    const genreListPlaceholder = document.getElementById('genreListPlaceholder');
    if (genreListPlaceholder) {
      genreListPlaceholder.innerHTML = html;
      loadGenreDataForSection();
    }
  } catch (error) {
    console.error('Genre section loading error:', error);
  }
}

function loadGenreDataForSection() {
  if (typeof allAnimeList === 'undefined') {
    const script = document.createElement('script');
    script.src = 'animeData.js';
    document.head.appendChild(script);
    script.onload = populateGenreSection;
  } else {
    populateGenreSection();
  }
}

function populateGenreSection() {
  const genreListContainer = document.getElementById('genreListContainer');
  if (genreListContainer && typeof allAnimeList !== 'undefined') {
    const allGenres = new Set();
    allAnimeList.forEach(anime => {
      if (Array.isArray(anime.genre)) {
        anime.genre.forEach(g => allGenres.add(g));
      } else if (typeof anime.genre === 'string') {
        allGenres.add(anime.genre);
      }
    });

    // Clear any existing content
    genreListContainer.innerHTML = '';

    allGenres.forEach(genre => {
      const genreItem = document.createElement('div');
      genreItem.className = 'genre-item';
      genreItem.textContent = genre;
      genreItem.onclick = () => window.filterAnimeByGenre(genre); 
      genreListContainer.appendChild(genreItem);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadGenreSection();
});
// Genre section end