<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

The purpose of this project is to identify 12 most actively modified modules in the OpenStack Nova project (located here: https://github.com/openstack/nova) from the last six months. Two types of activity indicators are explored in this project:

1) How many commits occurred during the studied period?

2) How much churn* occurred during the studied period? (churn is defined as the sum of added and removed lines by all commits)


<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

Major frameworks/libraries used in the project are listed below.

* [Node.js](https://nodejs.org/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

After going through the prerequisites, clone the repository and install the packages. For the purpose of removing GitHub rate limit, you must set your github username and password in the .env file of the project. Eventually you can run the project with command mentioned in the usage section.

### Prerequisites

Since this project is written in Node.js, if you don't have npm installed, you can install it using the bellow command.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

For starting the project you need to clone the GitHub repository and install the NPM packages.

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. According to the GitHub policies, for unauthenticated requests, the rate limit allows for up to 60 requests per hour. When using the built-in GITHUB_TOKEN in GitHub Actions, the rate limit is 1,000 requests per hour per repository. For this reason, please add your GitHub username and secret token in the .env file.
   ```js
   const USERNAME = 'ENTER YOUR USERNAME';
   const SECRET = 'ENTER YOUR PERSONAL ACCESS TOKEN';
   ```

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Usage

Run the project using the bellow command. A report including the number of commits, number of churns, and time of commits will be reported. At the end the 12 most active modules will be shown in a sorted order.
```sh
   npm run start
   ```

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Fatemeh Maddahzadeh  - fatemeh76m@gmail.com

Project Link: [https://github.com/fatemeh76m/active-modules.git](https://github.com/fatemeh76m/active-modules.git)

<p align="right">(<a href="#top">back to top</a>)</p>