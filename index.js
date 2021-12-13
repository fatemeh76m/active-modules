const fs = require('fs');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const getCommits = async () => {
  try {
    const commits = [];
    const date = new Date();
    date.setMonth(date.getMonth() - parseInt(process.env.STUDY_PERIOD_MONTH));
    let commitsLength = parseInt(process.env['PAGE_SIZE']);
    let page = 1;
    while (commitsLength === parseInt(process.env['PAGE_SIZE'])) {
      const response = await axios.get(`${process.env['GITHUB_REPO']}/commits`, {
        auth: {
          username: process.env['USERNAME'],
          password: process.env['SECRET']
        },
        params: {
          since: date.toISOString(),
          page,
          per_page: parseInt(process.env['PAGE_SIZE']),
          path: 'nova/'
        }
      });
      page += 1;
      commitsLength = response.data.length;
      commits.push(...response.data);
    }
    return commits;
  } catch (e) {
    console.log(e);
  }
};

const getCommitsInformation = async commits => {
  try {
    const commitUrls = commits.map(commit => commit.url);
    const commitDataPromise = commitUrls.map(url =>
      axios.get(url, {
        auth: {
          username: process.env['USERNAME'],
          password: process.env['SECRET']
        }
      })
    );
    const commitsDataResponse = await Promise.all(commitDataPromise);
    const commitsData = commitsDataResponse.map(d => d.data);
    fs.writeFileSync('./cache.json', JSON.stringify(commitsData), { encoding: 'utf-8' });
  } catch (e) {
    console.log(e);
  }
};

const filterCommits = () => {
  const cacheData = require('./cache.json');
  return cacheData.map(commit => {
    return { ...commit, files: commit.files.filter(file => file.filename.startsWith('nova/')) };
  });
};

const aggregateToModuleLevel = commits => {
  let aggregatedResult = {};
  commits.forEach(commit => {
    commit.files.forEach(file => {
      const splitFilename = file.filename.split('/');
      if (splitFilename.length > 2) {
        const moduleName = splitFilename[1];
        if (
          aggregatedResult[moduleName] &&
          aggregatedResult[moduleName]['files'] &&
          Array.isArray(aggregatedResult[moduleName]['files'])
        ) {
          aggregatedResult[moduleName]['files'].push(file);
          aggregatedResult[moduleName]['commitCount'] += 1;
          aggregatedResult[moduleName]['commitTimes'].push(commit.commit.committer.date);
        } else {
          aggregatedResult[moduleName] = {};
          aggregatedResult[moduleName]['files'] = [file];
          aggregatedResult[moduleName]['commitCount'] = 1;
          aggregatedResult[moduleName]['commitTimes'] = [commit.commit.committer.date];
        }
      }
    });
  });
  return aggregatedResult;
};

const generateReport = aggregatedResult => {
  const reports = [];
  Object.keys(aggregatedResult).forEach(module => {
    let moduleAddition = 0;
    let moduleDeletion = 0;
    aggregatedResult[module]['files'].forEach(file => {
      moduleAddition += file.additions;
      moduleDeletion += file.deletions;
    });
    const report = {
      moduleName: module,
      additions: moduleAddition,
      deletions: moduleDeletion,
      churn: moduleAddition + moduleDeletion,
      commitCount: aggregatedResult[module]['commitCount'],
      commitTimes: aggregatedResult[module]['commitTimes']
    };
    reports.push(report);
    console.log(`Module Name: ${report.moduleName}`);
    console.log(`\t Additions: ${report.additions}`);
    console.log(`\t Deletions: ${report.deletions}`);
    console.log(`\t Churns: ${report.churn}`);
    console.log(`\t Commits Count: ${report.commitCount}`);
    console.log(`\t Commits Times: ${report.commitTimes}`);
    console.log('--------------------------------------');
  });
  return reports;
};

const find12MostActiveModules = reports => {
  let commitCountSorted = [...reports];
  let churnSorted = [...reports];
  commitCountSorted = commitCountSorted
    .sort((firstItem, secondItem) => firstItem.commitCount - secondItem.commitCount)
    .map(array => array.moduleName);
  churnSorted = churnSorted.sort((firstItem, secondItem) => firstItem.churn - secondItem.churn).map(array => array.moduleName);
  console.log(
    `12 most actively modules based on commit count: ${commitCountSorted
      .slice(-parseInt(process.env.NUMBER_OF_OUTPUTS))
      .reverse()
      .join(',')}`
  );
  console.log(
    `12 most actively modules based on churn: ${churnSorted
      .slice(-parseInt(process.env.NUMBER_OF_OUTPUTS))
      .reverse()
      .join(',')}`
  );
};

const main = async () => {
  const commits = await getCommits();
  await getCommitsInformation(commits);
  const novaCommits = filterCommits();
  const aggregatedResult = aggregateToModuleLevel(novaCommits);
  const reports = generateReport(aggregatedResult);
  find12MostActiveModules(reports);
};

main();
