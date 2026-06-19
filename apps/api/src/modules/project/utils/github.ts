export function parseGithubUrl(url: string) {
  const parts = url
    .replace("https://github.com/", "")
    .split("/");

  return {
    owner: parts[0],
    repo: parts[1],
  };
}