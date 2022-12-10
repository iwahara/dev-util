use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct JsonFormatRequest {
    json_str: String,
    pub is_minify: bool,
}


#[derive(Debug, Serialize, Deserialize)]
pub struct JsonFormatResponse {
    formatted_str: String,
}

pub fn format(req: JsonFormatRequest) -> Result<JsonFormatResponse, String> {
    let ret = json_print(&req);
    let formatted = match ret {
        Ok(v) => v,
        Err(e) => return Err(format!("不正なJsonです。[{}]", e))
    };
    Ok(JsonFormatResponse { formatted_str: formatted })
}
fn json_print(req: &JsonFormatRequest) -> Result<String,String>{
    if req.is_minify {
        jsonxf::minimize(req.json_str.as_str())
    }else {
        jsonxf::pretty_print(req.json_str.as_str())
    }
}


#[cfg(test)]
mod tests {
    use crate::json_formatter::{format, JsonFormatRequest};

    impl JsonFormatRequest {
        pub fn new(json_str: &str, is_minify:bool) -> Self {
            JsonFormatRequest { json_str: String::from(json_str),is_minify:is_minify }
        }
    }

    #[test]
    fn test_run_root_object() {
        let data = r#"{"name": "John Doe","age": 43}"#;
        let req = JsonFormatRequest::new(data,false);
        let ret = format(req);

        assert_eq!(ret.unwrap().formatted_str, "{\n  \"name\": \"John Doe\",\n  \"age\": 43\n}");
    }

    #[test]
    fn test_run_root_array() {
        let data = r#"[{"name": "John Doe","age": 43}]"#;
        let req = JsonFormatRequest::new(data,false);
        let ret = format(req);

        assert_eq!(ret.unwrap().formatted_str, "[\n  {\n    \"name\": \"John Doe\",\n    \"age\": 43\n  }\n]");
    }

    #[test]
    fn test_run_minify(){
        let data = r#"[{"name": "John Doe","age": 43}]"#;
        let req = JsonFormatRequest::new(data,true);
        let ret = format(req);

        assert_eq!(ret.unwrap().formatted_str, "[{\"name\":\"John Doe\",\"age\":43}]");

    }
}