const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const githubApiBaseUrl = process.env.BASE_URL;
const owner = process.env.OWNER;
const repo = process.env.REPO;
const githubToken = process.env.GITHUB_TOKEN;

module.exports.getContributions = async (req, res) => {
  try {
    const contributionsResponse = await axios.get(
      `${githubApiBaseUrl}/repos/${owner}/${repo}/stats/contributors`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
        },
      }
    );

    const mergedPRsResponse = await axios.get(
      `${githubApiBaseUrl}/repos/${owner}/${repo}/pulls`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
        },
        params: {
          state: 'closed',
          sort: 'updated',
          direction: 'desc',
        },
      }
    );

    const contributions = contributionsResponse.data.map((contributor) => {
      const mergedPRs = mergedPRsResponse.data
        .filter(
          (pr) => pr.merged_at && pr.user.login === contributor.author.login
        )
        .map((pr) => ({
          number: pr.number,
          title: pr.title,
          mergedAt: pr.merged_at,
        }));

      return {
        username: contributor.author.login,
        lineContributions: contributor.weeks.reduce(
          (total, week) => total + week.a + week.d,
          0
        ),
        commmits: contributor.weeks.reduce((total, week) => total + week.c, 0),
        mergedPRs,
      };
    });

    res.status(StatusCodes.ACCEPTED).json({ contributions });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' });
  }
};

module.exports.getPRsReviewedAndCreated = async (req, res) => {
  try {
    const username = req.params.username;
    const PRreviewed = await axios.get(
      `${githubApiBaseUrl}/repos/${owner}/${repo}/activity`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
        },
        params: {
          state: 'open',
          activity_type: 'pr_merge',
          actor: `${username}`,
        },
      }
    );

    const PRpending = await axios.get(
      `${githubApiBaseUrl}/repos/${owner}/${repo}/activity`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
        },
        params: {
          state: 'open',
          activity_type: 'merge_queue_merge',
          actor: `${username}`,
        },
      }
    );

    let PRCreated = PRpending.data.length + PRreviewed.data.length;
    let PRReviewed = PRreviewed.data.length;
    res.status(StatusCodes.ACCEPTED).json({ PRCreated, PRReviewed });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' });
  }
};
