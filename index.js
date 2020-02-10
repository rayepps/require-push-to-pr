const github = require('@actions/github')
const core = require('@actions/core')

// This should be a token with access to your repository scoped in as a secret.
// The YML workflow will need to set myToken with the GitHub Secret Token
// github-token: ${{ secrets.GITHUB_TOKEN }}
// https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret
const token = core.getInput('github-token')

async function run() {

  // Type: https://developer.github.com/v3/activity/events/types/#pushevent
  const event = github.context.payload

  const repo = event.repository.name
  const owner = event.repository.owner.login
  const push_commmit_sha = event.after

  const octokit = new github.GitHub(token)

  const { data: pulls } = await octokit.pulls.list({ owner, repo })

  const pull = pulls.find(p => p.head.sha == push_commmit_sha)

  const pass = pull ? 'true' : 'false'

  core.debug(`Check complete. The pushed commit is to an open PR - ${pass}`)
  core.setOutput('pass', pass)

}

run()
