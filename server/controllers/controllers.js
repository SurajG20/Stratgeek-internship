const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const githubApiBaseUrl = process.env.BASE_URL;
const owner = process.env.OWNER;
const repo = process.env.REPO;
const githubToken = process.env.GITHUB_TOKEN;

const fetchPRs = async (state, activityType) => {
  try {
    const response = await axios.get(
      `${githubApiBaseUrl}/repos/${owner}/${repo}/activity`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
        },
        params: {
          state,
          activity_type: activityType,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching PRs:', error);
    throw error;
  }
};

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
    const prsCreated = await fetchPRs('open', 'pr_merge');
    const prsReviewed = await fetchPRs('open', 'merge_queue_merge');

    const prsData = {};

    prsCreated.forEach((pr) => {
      const username = pr.actor.login;
      if (!prsData[username]) {
        prsData[username] = {
          prsCreated: [],
          prsReviewed: [],
        };
      }
      prsData[username].prsCreated.push({
        number: pr.number,
        title: pr.title,
        createdAt: pr.created_at,
      });
    });

    prsReviewed.forEach((pr) => {
      const username = pr.actor.login;
      if (!prsData[username]) {
        prsData[username] = {
          prsCreated: [],
          prsReviewed: [],
        };
      }
      prsData[username].prsReviewed.push({
        number: pr.number,
        title: pr.title,
        createdAt: pr.created_at,
      });
    });

    res.status(StatusCodes.ACCEPTED).json(prsData);
  } catch (error) {
    console.error('Error fetching PRs data:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' });
  }
};
