/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

const { encode } = require('js-base64');
const axios = require('axios');

module.exports = (app) => {
  // Your code here
  app.log.info('Yay, the app was loaded!');

  app.on('issues.opened', async (context) => {
    const issueComment = context.issue({
      body: 'Thanks for creating an issue!',
    });
    return context.octokit.issues.createComment(issueComment);
  });

  // app.on('pull_request.opened', async (context) => {
  //   const pullComment = context.pullRequest({
  //     body: 'hello world',
  //   });
  //   console.log(pullComment);
  //   return context.octokit.issues.createComment({
  //     ...pullComment,
  //     issue_number: pullComment.pull_number,
  //   });
  //   // return context.octokit.rest.pulls.createReviewComment(pullComment);
  // });

  app.on('pull_request.opened', async (context) => {
    const filesGetRequestLink =
      context.payload.pull_request._links.self.href + '/files';
    axios.get(filesGetRequestLink).then((res) => {
      axios.get(res.data[0].raw_url).then((res) => {
        const encoded = encode(res.data);
        const previewLink =
          'https://www.theodinproject.com/lessons/preview?content=' +
          encodeURIComponent(encoded);
        const params = context.pullRequest({
          body: `[Live Preview Link](${previewLink})`,
        });
        return context.octokit.issues.createComment({
          ...params,
          issue_number: params.pull_number,
        });
      });
    });
  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
