/* eslint-disable no-console */
// @ts-check
/** @param {import('@types/github-script').AsyncFunctionArguments} AsyncFunctionArguments */
module.exports = async ({ context, github, changedFiles }) => {
  console.log("Running pull-request-check")
  console.log("Deleting old comments...")
  await deleteOldComments(github, context)

  console.log("Checking native changes...")
  const nativeChanges = checkNativeChanges(changedFiles)
  if (nativeChanges) {
    console.log("Native changes found")
    console.log(nativeChanges)
  } else {
    console.log("No native changes found")
  }

  console.log("Composing comment...")
  const comment = composeComment(context.workflow, nativeChanges)
  if (!comment) {
    console.log("No issues found")
    return
  }
  console.log("Commenting on PR...")
  console.log(comment)
  github.rest.issues.createComment({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: comment,
  })
}

/**
 *
 * @param changedFiles {string[]}
 * @returns {string | null}
 */
const checkNativeChanges = (changedFiles) => {
  const nativeFiles = changedFiles.filter(isNativeFile)
  if (nativeFiles.length === 0) {
    return null
  }
  return `This pull request contains changes to native code. Please make sure to use \`minor\` version in the changeset file. These are the native files that have been changed:
    ${nativeFiles.map((file) => `- ${file}`).join("\n")}
`
}

/**
 * @param workflow {string}
 * @param nativeChanges {string}
 * @returns {string|null}
 */
const composeComment = (workflow, nativeChanges) => {
  const messages = []
  if (nativeChanges) {
    messages.push({ title: "Native Changes", body: nativeChanges })
  }
  if (messages.length === 0) {
    return null
  }
  return `Hi there! 👋

I have noticed some potential issues with this pull request. Please review the following:

${messages.map((message) => `1. **${message.title}**:\n${message.body.replace(/\n\s*\n/g, "\n")}`).join("\n")}

${composeFooter(workflow)}
`
}

/**
 * Returns true if the file is a native file.
 * Native files are those that are in the `packages/` directory and have the following extension: swift, m, mm, h, infoplist, java, kt, podspec, a, pbxproj, jar, xml.
 * @param file {string}
 * @returns {boolean}
 */
const isNativeFile = (file) => file.match(/packages\/.*\.(swift|m|mm|h|infoplist|java|kt|podspec|a|pbxproj|jar|xml)$/)

/**
 * @param workflow {string}
 * @returns {string}
 */
const composeFooter = (workflow) => `*Created by \`${workflow}\`*`

const deleteOldComments = async (github, context) => {
  const comments = await github.rest.issues.listComments({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
  })
  for (const comment of comments.data) {
    if (comment.user.login === "github-actions[bot]" && comment.body.includes(composeFooter(context.workflow))) {
      github.rest.issues.deleteComment({
        comment_id: comment.id,
        owner: context.repo.owner,
        repo: context.repo.repo,
      })
    }
  }
}
