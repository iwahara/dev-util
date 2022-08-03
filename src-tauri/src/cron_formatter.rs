use serde::{Serialize, Deserialize};
use chrono::{DateTime, Local, TimeZone, Utc};

#[derive(Debug, Serialize, Deserialize)]
pub struct CronParserRequest {
    cron: String,
    now: String,
}

impl CronParserRequest {
    pub fn new(cron: &String, now: &String) -> Self {
        CronParserRequest { cron: String::from(cron), now: String::from(now) }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CronParserResponse {
    next: String,
}

impl CronParserResponse {
    pub fn get_next(&self) -> &String {
        &self.next
    }
}

pub fn parse(req: CronParserRequest) -> Result<CronParserResponse, String> {
    let parse_result = DateTime::parse_from_rfc3339(req.now.as_str());
    let date_now = match &parse_result {
        Ok(date_now) => date_now,
        Err(e) => return Err(format!("不正な日付です。[{}]", e))
    };
    let ret = cron_parser::parse(req.cron.as_str(), date_now);
    let next = match ret {
        Ok(next) => next.to_rfc3339(),
        Err(e) => return Err(format!("cron文字列のパースに失敗しました。[{}]", e))
    };

    Ok(CronParserResponse { next })
}

#[cfg(test)]
mod tests {
    use crate::cron_formatter::{CronParserRequest, parse};

    #[test]
    fn test_run_success() {
        let req = CronParserRequest::new(&String::from("* * * * *"), &String::from("2022-08-01T00:00:00+09:00"));
        let ret = parse(req);
        let next = ret.unwrap().next;

        assert_eq!(next, "2022-08-01T00:01:00+09:00");
    }

    #[test]
    fn test_run_success_jst() {
        let req = CronParserRequest::new(&String::from("* 0 * * *"), &String::from("2022-08-01T00:00:00+09:00"));
        let ret = parse(req);
        let next = ret.unwrap().next;

        assert_eq!(next, "2022-08-01T00:01:00+09:00");
    }
}