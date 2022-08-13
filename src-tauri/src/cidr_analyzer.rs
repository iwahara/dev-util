use std::net::Ipv4Addr;
use ipnet::{Ipv4Net, PrefixLenError};
use serde::{Serialize, Deserialize};


#[derive(Debug, Serialize, Deserialize)]
pub struct CidrAnalyzerRequest {
    first_octet: u8,
    second_octet: u8,
    third_octet: u8,
    fourth_octet: u8,
    prefix_len: u8,
}

impl CidrAnalyzerRequest {
    pub fn new(first_octet: u8, second_octet: u8, third_octet: u8, fourth_octet: u8, prefix_len: u8) -> Self {
        CidrAnalyzerRequest { first_octet, second_octet, third_octet, fourth_octet, prefix_len }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CidrAnalyzerResponse {
    formatted_ip: String,
    formatted_cidr: String,
    subnet: String,
    ip_address_range_start: String,
    ip_address_range_end: String,
    address_range_length: u32,
    network_ip_address: String,
    broadcast_ip_address: String,
}

pub fn parse(req: CidrAnalyzerRequest) -> Result<CidrAnalyzerResponse, String> {
    let result = Ipv4Net::new(Ipv4Addr::new(req.first_octet, req.second_octet, req.third_octet, req.fourth_octet), req.prefix_len);
    let net = match &result {
        Ok(net) => net,
        Err(e) => return Err(format!("不正な指定です。[{}]", e))
    };
    let formatted_ip = net.to_string();
    let formatted_cidr = net.trunc().to_string();
    let subnet = net.netmask().to_string();
    let hosts_start_result = Iterator::min(net.hosts());
    let ip_address_range_start = match &hosts_start_result {
        Some(v) => v,
        None => return Err(String::from("IPアドレスの開始が見つかりません")),
    }.to_string();
    let hosts_end_result = Iterator::max(net.hosts());
    let ip_address_range_end = match &hosts_end_result {
        Some(v) => v,
        None => return Err(String::from("IPアドレスの終了が見つかりません")),
    }.to_string();
    let address_range_length = net.hosts().count() as u32;
    let network_ip_address = net.network().to_string();
    let broadcast_ip_address = net.broadcast().to_string();

    Ok(CidrAnalyzerResponse { formatted_ip, formatted_cidr, subnet, ip_address_range_start, ip_address_range_end, address_range_length, network_ip_address, broadcast_ip_address })
}

#[cfg(test)]
mod tests {
    use crate::cidr_analyzer::{parse, CidrAnalyzerRequest};

    #[test]
    fn test_run_success() {
        let req = CidrAnalyzerRequest::new(10, 0, 0, 0, 24);
        let ret = parse(req);
        let res = ret.unwrap();
        assert_eq!(res.formatted_cidr, "10.0.0.0/24");
        assert_eq!(res.subnet, "255.255.255.0");
        assert_eq!(res.ip_address_range_start, "10.0.0.1");
        assert_eq!(res.ip_address_range_end, "10.0.0.254");
        assert_eq!(res.address_range_length, 254);
        assert_eq!(res.network_ip_address, "10.0.0.0");
        assert_eq!(res.broadcast_ip_address, "10.0.0.255");
    }
}