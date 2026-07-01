export async function deployToGithubPages(pat, repoName, htmlString, logCallback) {
  const headers = {
    'Authorization': `token ${pat}`,
    'Accept': 'application/vnd.github.v3+json'
  };

  try {
    // 1. Get the authenticated username
    logCallback('Authenticating with GitHub...');
    let userResp = await fetch('https://api.github.com/user', { headers });
    if (!userResp.ok) throw new Error('Authentication failed. Check your PAT.');
    const userData = await userResp.json();
    const owner = userData.login;
    logCallback(`Authenticated as ${owner}.`);

    // 2. Create the repository
    logCallback(`Creating public repository: ${repoName}...`);
    let createRepoResp = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: repoName,
        description: 'Auto-generated Portfolio by PortGen',
        homepage: `https://${owner}.github.io/${repoName}/`,
        private: false,
        auto_init: true
      })
    });
    
    let defaultBranch = 'main';

    if (createRepoResp.status === 422) {
      logCallback(`Repository ${repoName} already exists. Proceeding to update...`);
      // Fetch the existing repo to get its default branch
      const getRepoResp = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, { headers });
      if (getRepoResp.ok) {
        const repoData = await getRepoResp.json();
        defaultBranch = repoData.default_branch || 'main';
      }
    } else if (!createRepoResp.ok) {
      throw new Error(`Failed to create repository: ${createRepoResp.statusText}`);
    } else {
      const repoData = await createRepoResp.json();
      defaultBranch = repoData.default_branch || 'main';
    }

    // Give GitHub API a brief moment if repo was just created
    await new Promise(r => setTimeout(r, 1500));

    // 3. Push index.html to the repository
    logCallback('Pushing index.html to repository...');
    
    // Check if index.html already exists to get its SHA for update
    let sha = undefined;
    const getFileResp = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/index.html?ref=${defaultBranch}`, { headers });
    if (getFileResp.ok) {
      const fileData = await getFileResp.json();
      sha = fileData.sha;
    }

    // Robust Base64 encoding for potentially large UTF-8 strings
    const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8' });
    const encodedContent = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(blob);
    });
    
    const pushResp = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/index.html`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: 'Deploy Portfolio via PortGen',
        content: encodedContent,
        sha: sha,
        branch: defaultBranch
      })
    });

    if (!pushResp.ok) throw new Error(`Failed to push index.html: ${pushResp.statusText}`);
    logCallback('index.html pushed successfully.');

    // 4. Enable GitHub Pages
    logCallback('Requesting GitHub Pages enablement...');
    const pagesResp = await fetch(`https://api.github.com/repos/${owner}/${repoName}/pages`, {
      method: 'POST',
      headers: {
        ...headers,
        'Accept': 'application/vnd.github.v3+json' 
      },
      body: JSON.stringify({
        source: { branch: defaultBranch, path: '/' }
      })
    });

    if (!pagesResp.ok && pagesResp.status !== 409) {
      logCallback(`Note: Automatic Pages enablement ran into an issue (${pagesResp.status}). You might need to enable it manually in Repo Settings.`);
    } else {
      logCallback('GitHub Pages enablement triggered.');
    }

    logCallback('Deployment Success!');
    return `https://${owner}.github.io/${repoName}/`;

  } catch (error) {
    throw error;
  }
}
