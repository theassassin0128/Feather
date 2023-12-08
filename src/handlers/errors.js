async function errors(process) {
  const chalk = require("chalk");

  process.on("beforeExit", (code) => {
    console.log(
      chalk.yellow.dim(
        "[AntiCrash] | [BeforeExit_Logs] | [Start] : ==============="
      )
    );
    console.log(code);
    console.log(
      chalk.yellow("[AntiCrash] | [BeforeExit_Logs] | [End] : ===============")
    );
  });

  process.on("exit", (error) => {
    console.log(
      chalk.yellow("[AntiCrash] | [Exit_Logs] | [Start]  : ===============")
    );
    console.log(error);
    console.log(
      chalk.yellow("[AntiCrash] | [Exit_Logs] | [End] : ===============")
    );
  });

  process.on("unhandledRejection", async (reason, promise) => {
    console.log(
      chalk.yellow(
        "[AntiCrash] | [UnhandledRejection_Logs] | [start] : ==============="
      )
    );
    console.log(reason);
    console.log(
      chalk.yellow(
        "[AntiCrash] | [UnhandledRejection_Logs] | [end] : ==============="
      )
    );
  });

  process.on("rejectionHandled", (promise) => {
    console.log(
      chalk.yellow(
        "[AntiCrash] | [RejectionHandled_Logs] | [Start] : ==============="
      )
    );
    console.log(promise);
    console.log(
      chalk.yellow(
        "[AntiCrash] | [RejectionHandled_Logs] | [End] : ==============="
      )
    );
  });

  process.on("uncaughtException", (err, origin) => {
    console.log(
      chalk.yellow(
        "[AntiCrash] | [UncaughtException_Logs] | [Start] : ==============="
      )
    );
    console.log(err);
    console.log(
      chalk.yellow(
        "[AntiCrash] | [UncaughtException_Logs] | [End] : ==============="
      )
    );
  });

  process.on("warning", (warning) => {
    console.log(
      chalk.yellow("[AntiCrash] | [Warning_Logs] | [Start] : ===============")
    );
    console.log(warning);
    console.log(
      chalk.yellow("[AntiCrash] | [Warning_Logs] | [End] : ===============")
    );
  });
}

module.exports = { errors };
