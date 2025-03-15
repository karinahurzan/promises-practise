"use strict";

async function fetchGitHubName(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.name || null;
  } catch (error) {
    console.error("Error fetching GitHub user:", error);
    return null;
  }
}

fetchGitHubName("karinahurzan").then((name) => console.log(name));

async function fetchNamesOfAllPublicRepos(username) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`
    );
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error("User is not found!");
    }
    const data = await response.json();
    return data.map((repo) => repo.name);
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    return [];
  }
}

fetchNamesOfAllPublicRepos("karinahurzan").then((repos) => console.log(repos));

async function fetchClosedPullRequests(username, repo) {
  const baseUrl = `https://api.github.com/repos/${username}/${repo}/pulls?state=closed&per_page=100`;
  let page = 1;
  let allPrIds = [];

  try {
    while (true) {
      const response = await fetch(`${baseUrl}&page=${page}`);
      if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.length === 0) break;
      allPrIds.push(...data.map((pr) => pr.id));
      page++;
    }
  } catch (error) {
    console.error("Error fetching closed pull requests:", error);
    return [];
  }

  return allPrIds;
}

fetchClosedPullRequests("karinahurzan", "project-serious-team").then((ids) =>
  console.log(ids)
);
