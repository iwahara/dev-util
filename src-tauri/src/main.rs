#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

mod cron_formatter;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            simple_command,
            command_with_message,
            command_with_object,
            command_with_error,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn simple_command() {
    println!("I was invoked from JS!")
}

#[tauri::command]
fn command_with_message(message: String) -> String {
    format!("hello {}", message)
}

use serde::{Serialize, Deserialize};
use crate::cron_formatter::CronParserRequest;

#[derive(Debug, Serialize, Deserialize)]
struct MyMessage {
    field_str: String,
    field_u32: u32,
}

#[tauri::command]
fn command_with_object(message: MyMessage) -> MyMessage {
    let MyMessage {
        field_str,
        field_u32,
    } = message;

    MyMessage {
        field_str: format!("hello {}", field_str),
        field_u32: field_u32 + 1,
    }
}

#[tauri::command]
async fn command_with_error(arg: u32) -> Result<String, String> {
    if arg % 2 == 0 {
        Ok(format!("even value {}", arg))
    } else {
        Err(format!("odd value {}", arg))
    }
}


#[derive(Debug, Serialize, Deserialize)]
struct CronMessage {
    cron: String,
    now: String,
    count: u8,
}

#[tauri::command]
async fn command_cron_formatter(msg: CronMessage) -> Result<Vec<String>, String> {
    let mut result = Vec::new();
    let mut now = msg.now;
    let cron = msg.cron;
    let mut req: CronParserRequest;
    for i in 0..msg.count {
        req = cron_formatter::CronParserRequest::new(&cron, &now);
        let ret = cron_formatter::parse(req);
        let res = match ret {
            Ok(r) => {
                result.push(String::from(r.get_next()));
                now = String::from(r.get_next());
            }
            Err(e) => return Err(e)
        };
    }
    Ok(result)
}

#[cfg(test)]
mod tests {
    use crate::{command_cron_formatter, CronMessage};

    #[tokio::test]
    async fn test_command_cron_formatter_success() {
        let msg = CronMessage { cron: String::from("* * * * *"), now: String::from("2022-08-01T00:00:00+09:00"), count: 5 };
        let result = command_cron_formatter(msg).await;
        let lines = match result {
            Ok(lines) => lines,
            Err(e) => panic!("件数不一致")
        };
        assert_eq!(lines.len(), 5);
        assert_eq!(lines[0], "2022-08-01T00:01:00+09:00");
        assert_eq!(lines[1], "2022-08-01T00:02:00+09:00");
        assert_eq!(lines[2], "2022-08-01T00:03:00+09:00");
        assert_eq!(lines[3], "2022-08-01T00:04:00+09:00");
        assert_eq!(lines[4], "2022-08-01T00:05:00+09:00");
    }
}