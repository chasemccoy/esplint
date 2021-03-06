const { run } = require("./engine");
const yargs = require("yargs");
const log = require("./log");
const chalk = require("chalk");

function cli() {
  const argv = yargs
    .usage("$0 [options] file.js [file.js] [dir]")
    .option("overwrite", {
      default: false,
      describe: "ignore existing record file",
      type: "boolean"
    })
    .help().argv;

  try {
    const { results, hasError } = run(getOptions(argv), getFiles(argv));
    outputResults(results);
    if (hasError) {
      log.log(
        `\nUse the ${chalk.bold(
          "--overwrite"
        )} flag to ignore these errors and force the record to be rewritten.`
      );
      process.exit(1);
    } else if (results.length === 0) {
      log.log(log.createSuccess("Looking good!"));
    }
  } catch (error) {
    log.error(error);
    process.exit(1);
  }
}

function getOptions({ overwrite }) {
  return { overwrite };
}

function getFiles({ _ }) {
  return _;
}

function outputResults(results) {
  results.forEach(({ type, message }) => {
    switch (type) {
      case "error":
        log.error(log.createError(message));
        return;
      case "warning":
        log.warn(log.createWarning(message));
        return;
      default:
        log.log(message);
    }
  });
}

module.exports = cli;
