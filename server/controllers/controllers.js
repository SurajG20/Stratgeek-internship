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
        fileContributions: contributor.weeks.reduce(
          (total, week) => total + week.c,
          0
        ),
        mergedPRs,
      };
    });

    res.status(StatusCodes.ACCEPTED).json({ contributions });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
};

module.exports.getPRsReviewedAndCreated = async (req, res) => {
  try {
    const createdPRsResponse = await axios.get(
      `${githubApiBaseUrl}/repos/${owner}/${repo}/pulls`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
        },
        params: {
          state: 'open',
        },
      }
    );

    const allPRsResponse = await axios.get(
      `${githubApiBaseUrl}/repos/${owner}/${repo}/pulls`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
        },
      }
    );

    const individuals = {};

    createdPRsResponse.data.forEach((pr) => {
      const creator = pr.user.login;
      individuals[creator] = individuals[creator] || {
        created: 0,
        reviewed: 0,
      };
      individuals[creator].created += 1;
    });

    allPRsResponse.data.forEach((pr) => {
      const reviewers = pr.requested_reviewers.map(
        (reviewer) => reviewer.login
      );
      reviewers.forEach((reviewer) => {
        individuals[reviewer] = individuals[reviewer] || {
          created: 0,
          reviewed: 0,
        };
        individuals[reviewer].reviewed += 1;
      });
    });

    res.status(StatusCodes.ACCEPTED).json({ individuals });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
};
