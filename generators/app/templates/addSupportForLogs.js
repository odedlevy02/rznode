import { startTimer, stopTimer } from './timerHelper';

//Middleware for registering to all routes and logging status and time
//All logic is inline since needed usage of closures
export function logRouteCalls() {
    const shouldLog = process.env.SHOULD_LOG_ROUTES == '1' ? true : false;
    if (shouldLog) {
      return (req, res, next) => {
        //In order to get the status code - need to overwrite method res.end - then when extracting result set the
        //original function back in place and call it with original paramter
        //Not using req.on("end") since it does not work when making calls to other services
        var end = res.end;
        res.end = (chunk, encoding) => {
          let statusCode = res.statusCode;
          const totalMs = stopTimer(startDate);
          console.debug(`Route call end: [${req.method}]${req.url} - Status: ${statusCode}. Total ms: ${totalMs}`);
          res.end = end;
          res.end(chunk, encoding);
        };
        const startDate = startTimer();
        console.log(`Route call start: [${req.method}]${req.url}`);
        next();
      };
    } else {
      return (req, res, next) => next();
    }
  }