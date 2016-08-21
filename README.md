# hubot.js [![Build Status](https://travis-ci.org/hubot-js/hubot.js.svg?branch=master)](https://travis-ci.org/hubot-js/hubot.js)  [![Coverage Status](https://coveralls.io/repos/github/hubot-js/hubot.js/badge.svg?branch=master)](https://coveralls.io/github/hubot-js/hubot.js?branch=master)   [![Code Climate](https://img.shields.io/codeclimate/github/hubot-js/hubot.js.svg)](https://codeclimate.com/github/hubot-js/hubot.js)  [![dependencies-badge](https://david-dm.org/hubot-js/hubot.js.svg)](https://david-dm.org/hubot-js/hubot.js)  [![Docker Stars](https://img.shields.io/docker/stars/robsonbittencourt/hubot.js.svg)](https://hub.docker.com/r/robsonbittencourt/hubot.js/)  [![Docker Pulls](https://img.shields.io/docker/pulls/robsonbittencourt/hubot.js.svg)](https://hub.docker.com/r/robsonbittencourt/hubot.js/)  

> A small robot written in Javascript (He doesn't like coffeescript)

## Hello world

Hello! My name is Hubot. I'm a robot and my job is to do stuff in Slack chats. At first, I don't know many things, but when gears are attached everything is possible. I love new gears. Feel free to create them.

![start-deploy-gif](https://s10.postimg.org/jl5ptldnt/hubot_start_deploy2.gif)

## How to turn me on?

The first step is to create a bot user on Slack. For this, you can follow [these steps](https://api.slack.com/bot-users). With a bot user created and the token on hand we can go to the next step.

### Docker

To enable me with Docker it's a piece of cake. I have a recipe of how to build me in [Dockerhub](https://hub.docker.com/r/robsonbittencourt/hubot.js/). Just run the following command:

```
docker run -d -e BOT_API_KEY=your_slack_api_key \
   -e BOT_NAME=name_of_your_bot \
   --restart="unless-stopped"
   --name=hubot \
   robsonbittencourt/hubot.js
```

### Node.js

If you don't use Docker no problem. You can turn me on using Node.js commands. For this set variables before node command.

```
BOT_API_KEY=your_slack_api_key BOT_NAME=name_of_your_bot node app.js

```

## Usage

For now, I don't know how to do many things. But I'm able to understand and to use new gears (features). You can create your own gears. If you think they can be useful for other users, please share it with the world.

### Jenkins

I know  how to invoke your jobs in Jenkins. For this, you need to enter your authorization link to build me.

```
docker run -d -e BOT_API_KEY=your_slack_api_key \
   -e BOT_NAME=name_of_your_bot \
   -e JENKINS_AUTH_URL=your_jenkins_auth_url \
   --restart="unless-stopped" \
   --name=hubot \
   robsonbittencourt/hubot.js
```

It can be obtained from `yourJenkinsUrl/me/configure`. See more details [here](https://wiki.jenkins-ci.org/display/JENKINS/Authenticating+scripted+clients). After that, you can ask me to do your jobs.

```
hubot start job my-deploy
```

![start-deploy](https://s9.postimg.org/g9dt1se9b/hubot_job.png)

### Help

If you have doubt about the available commands, please ask me for help. I'll be glad to use my gears and knowledge to answer your questions.

```
hubot help
```

![hubot-help](https://s9.postimg.org/rf26x119b/hubot_help.png)

## Development setup
- Fork and clone this project
- In the main directory run ```npm install```to install dependencies.
- Use node command (see before) for run Hubot.js
- Write your code
- To run tests use ```npm test``` command

## Contributors
[Robson Rosa](https://github.com/robsonrosa)

## Meta
Robson Bittencourt - @rluizv - robson.luizv@gmail.com

Distributed under the MIT license. See [LICENSE](LICENSE) for more information.

https://github.com/robsonbittencourt/hubot.js
