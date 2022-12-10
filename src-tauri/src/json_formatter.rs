use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct JsonFormatRequest {
    json_str: String,
}


#[derive(Debug, Serialize, Deserialize)]
pub struct JsonFormatResponse {
    formatted_str: String,
}

pub fn format(req: JsonFormatRequest) -> Result<JsonFormatResponse, String> {
    let ret = jsonxf::pretty_print(req.json_str.as_str());
    let formatted = match ret {
        Ok(v) => v,
        Err(e) => return Err(format!("不正なJsonです。[{}]", e))
    };
    Ok(JsonFormatResponse { formatted_str: formatted })
}

#[cfg(test)]
mod tests {
    use crate::json_formatter::{format, JsonFormatRequest};

    impl JsonFormatRequest {
        pub fn new(json_str: &str) -> Self {
            JsonFormatRequest { json_str: String::from(json_str) }
        }
    }

    #[test]
    fn test_run_root_object() {
        let data = r#"{"name": "John Doe","age": 43}"#;
        let req = JsonFormatRequest::new(data);
        let ret = format(req);

        assert_eq!(ret.unwrap().formatted_str, "{\n  \"name\": \"John Doe\",\n  \"age\": 43\n}");
    }

    #[test]
    fn test_run_root_array() {
        let data = r#"[{"name": "John Doe","age": 43}]"#;
        let req = JsonFormatRequest::new(data);
        let ret = format(req);

        assert_eq!(ret.unwrap().formatted_str, "[\n  {\n    \"name\": \"John Doe\",\n    \"age\": 43\n  }\n]");
    }
}