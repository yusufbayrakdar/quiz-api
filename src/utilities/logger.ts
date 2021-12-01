import * as moment from "moment";
import * as chalk from "chalk";
import * as morgan from "morgan";

console.log(
  "\n ---xxx---------xxx-------xxx--------- ",
  chalk.black.bgGreen("\n  ENVIRONMENT: ", process.env.NODE_ENV, "   \n")
);

const statusCodeColorize = (status) =>
  status >= 500
    ? chalk.black.bgRed(status)
    : status >= 400
    ? chalk.black.bgYellow(status)
    : status >= 300
    ? chalk.black.bgCyan(status)
    : status >= 200
    ? chalk.black.bgGreen(status)
    : status;

const whoTheHellAreYou = (req) =>
  req.headers.token ? "👤 " : req.headers.tokenstaff ? "🖥  " : "🍄 ";

export const loggerMiddleware = morgan(
  process.env.NODE_ENV === "production"
    ? "combined"
    : function (tokens, req, res) {
        return [
          whoTheHellAreYou(req),
          chalk
            .hex("#34ace0")
            .bold(
              tokens.method(req, res) +
                (["GET", "PUT"].includes(tokens.method(req, res)) ? " " : "")
            ),
          statusCodeColorize(" " + tokens.status(req, res) + " "),
          chalk.hex("#ff5252").bold(tokens.url(req, res)),
          chalk
            .hex("#2ed573")
            .bold("| ⌛️ " + tokens["response-time"](req, res) + " ms"),
          chalk
            .hex("#f78fb3")
            .bold("| 🕑 " + moment(tokens.date(req, res)).format())
        ].join(" ");
      }
);
