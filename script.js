const repositoryList = document.querySelector("#repository-list");
const repositoryCount = document.querySelector("#repository-count");

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium"
  }).format(new Date(dateString));
}

function repositoryTemplate(event) {
  const repositoryName = event.repo.name;
  const repositoryUrl = `https://github.com/${repositoryName}`;

  return `
    <article class="repository">
      <div>
        <h3 class="repository-name">
          <a href="${repositoryUrl}" target="_blank" rel="noreferrer">${repositoryName}</a>
        </h3>
        <p class="repository-date">Starred ${formatDate(event.created_at)}</p>
      </div>
      <span class="star" aria-label="Starred repository">Starred</span>
    </article>
  `;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");

    if (!response.ok) {
      throw new Error(`Could not load events: ${response.status}`);
    }

    const events = await response.json();
    const starredRepositories = events
      .filter((event) => event.type === "WatchEvent" && event.payload.action === "started")
      .sort((first, second) => new Date(second.created_at) - new Date(first.created_at));

    repositoryCount.textContent = `${starredRepositories.length} repositories`;
    repositoryList.innerHTML = starredRepositories.length
      ? starredRepositories.map(repositoryTemplate).join("")
      : '<p class="status">No starred repositories yet.</p>';
  } catch (error) {
    repositoryList.innerHTML = '<p class="status error">Unable to load repositories right now.</p>';
    repositoryCount.textContent = "";
    console.error(error);
  }
}

loadRepositories();