#!/usr/bin/env node
"use strict";

const chalk = require("chalk");
const fetch = require("node-fetch");
const inquirer = require("inquirer");
const wrapText = require("./wrapText.js");
const version = require("../package.json").version;
const resume = require("./resume.json");

const green = chalk.bold.green;
const blue = chalk.bold.underline.blueBright;
const cyan = chalk.cyan;
const dimWhite = chalk.dim.white;
const white = chalk.white;

const resumePrompts = {
  type: "list",
  name: "resumeOptions",
  message: "What do you want to know about me?",
  choices: [...Object.keys(resume), "Exit"]
};

function resumeHandler() {
  inquirer.prompt(resumePrompts).then(answer => {
    if (answer.resumeOptions == "Exit") {
      return;
    }
    const option = answer.resumeOptions;
    console.log(green("---------------------------------------------"));
    resume[`${option}`].forEach(info => {
      console.log(
        green("|   => " + blue(info.title) + " " + white(info.content))
      );
      if (info.description) {
        wrapText(info.description, 50, text => {
          console.log(green("|      " + dimWhite(text)));
        });
      }
    });
    console.log(green("---------------------------------------------"));

    inquirer
      .prompt({
        type: "list",
        name: "exitBack",
        message: "Go back or Exit?",
        choices: ["Back", "Exit"]
      })
      .then(choice => {
        if (choice.exitBack == "Back") {
          resumeHandler();
        } else {
          return;
        }
      });
  });
}

function main() {
  console.log("Hello, My name is Blake Noll and welcome to my resume");
  resumeHandler();
}

module.exports = function run() {
  fetch("https://registry.npmjs.org/blakenoll")
    .then(res => res.json())
    .then(json => {
      const currentVersion = json["dist-tags"].latest;
      // check for new version
      if (currentVersion !== version) {
        console.log("");
        console.log(green("---------------------------------------------"));
        console.log(
          "Update available! " +
            dimWhite(`${version}`) +
            " => " +
            green(`${currentVersion}`)
        );
        console.log(
          white("Run: ") +
            cyan("npm i -g blakeNollResume") +
            white(" to upgrade")
        );
        console.log(green("---------------------------------------------"));
      } else {
        main();
      }
    })
    .catch(() => {
      // if fetch fails run main()
      main();
    });
};
