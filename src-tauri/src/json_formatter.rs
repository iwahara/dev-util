use serde::{Serialize, Deserialize};
use serde_json::Value;

#[derive(Debug, Serialize, Deserialize)]
pub struct JsonFormatRequest {
    json_str: String,
}

impl JsonFormatRequest {
    pub fn new(json_str: &str) -> Self {
        JsonFormatRequest { json_str: String::from(json_str) }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct JsonFormatResponse {
    formatted_str: String,
}

pub fn format(req: JsonFormatRequest) -> Result<JsonFormatResponse, String> {
    let from_ret: Result<Value, serde_json::error::Error> = serde_json::from_str(req.json_str.as_str());
    let j = match &from_ret {
        Ok(v) => v,
        Err(e) => return Err(format!("不正なJson文字列です。[{}]", e))
    };
    if j.is_array() {
        return Ok(JsonFormatResponse { formatted_str: serde_json::to_string_pretty(j.as_array().unwrap()).unwrap() });
    }

    Ok(JsonFormatResponse { formatted_str: serde_json::to_string_pretty(j.as_object().unwrap()).unwrap() })
}

#[cfg(test)]
mod tests {
    use crate::json_formatter::{format, JsonFormatRequest};

    #[test]
    fn test_run_root_object() {
        let data = r#"{"name": "John Doe","age": 43}"#;
        let req = JsonFormatRequest::new(data);
        let ret = format(req);

        assert_eq!(ret.unwrap().formatted_str, "{\n  \"age\": 43,\n  \"name\": \"John Doe\"\n}");
    }

    #[test]
    fn test_run_root_array() {
        let data = r#"[{"name": "John Doe","age": 43}]"#;
        let req = JsonFormatRequest::new(data);
        let ret = format(req);

        assert_eq!(ret.unwrap().formatted_str, "[\n  {\n    \"age\": 43,\n    \"name\": \"John Doe\"\n  }\n]");
    }
}