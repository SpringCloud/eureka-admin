package cn.springcloud.eureka.http;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.Map;
import java.util.Map.Entry;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import com.alibaba.fastjson.JSON;

/**  
 * @author fuwei.deng
 * @Date 2017年6月9日 下午3:10:58
 * @version 1.0.0
 */
public class HttpUtil {

	private static final Logger logger = LoggerFactory.getLogger(HttpUtil.class);
	
	public static final String GET  = "GET";
	public static final String POST = "POST";
	public static final String CHARSET = "UTF-8";
	
	private HttpUtil() {}
	
	/**
	 * https 域名校验
	 */
	private class TrustAnyHostnameVerifier implements HostnameVerifier {
		public boolean verify(String hostname, SSLSession session) {
			return true;
		}
	}
	
	/**
	 * https 证书管理
	 */
	private class TrustAnyTrustManager implements X509TrustManager {
		public X509Certificate[] getAcceptedIssuers() {
			return null;  
		}
		public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {
		}
		public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {
		}
	}
	
	private static final SSLSocketFactory sslSocketFactory = initSSLSocketFactory();
	private static final TrustAnyHostnameVerifier trustAnyHostnameVerifier = new HttpUtil().new TrustAnyHostnameVerifier();
	
	private static SSLSocketFactory initSSLSocketFactory() {
		try {
			TrustManager[] tm = {new HttpUtil().new TrustAnyTrustManager() };  
			SSLContext sslContext = SSLContext.getInstance("SSL", "SunJSSE");  
			sslContext.init(null, tm, new java.security.SecureRandom());  
			return sslContext.getSocketFactory();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
	
	public static HttpURLConnection getHttpConnection(String url, String method, Map<String, String> headers) throws IOException, NoSuchAlgorithmException, NoSuchProviderException, KeyManagementException {
		URL _url = new URL(url);
		HttpURLConnection conn = (HttpURLConnection)_url.openConnection();
		if (conn instanceof HttpsURLConnection) {
			((HttpsURLConnection)conn).setSSLSocketFactory(sslSocketFactory);
			((HttpsURLConnection)conn).setHostnameVerifier(trustAnyHostnameVerifier);
		}
		
		conn.setRequestMethod(method);
		conn.setDoOutput(true);
		conn.setDoInput(true);
		
		conn.setConnectTimeout(19000);
		conn.setReadTimeout(19000);
		conn.setRequestProperty("Content-Type","application/x-www-form-urlencoded");
		conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.146 Safari/537.36");
		
		if (headers != null && !headers.isEmpty())
			for (Entry<String, String> entry : headers.entrySet())
				conn.setRequestProperty(entry.getKey(), entry.getValue());
		
		return conn;
	}
	
	/**

	 * 发送 get 请求

	 */
	public static String get(String url, Map<String, String> queryParas, Map<String, String> headers, String charset) {
		logger.info("get url:" + url);
		logger.info("params:" + JSON.toJSONString(queryParas));
		HttpURLConnection conn = null;
		try {
			conn = getHttpConnection(buildUrlWithQueryString(url, queryParas, charset), GET, headers);
			conn.connect();
			return readResponseString(conn, charset);
		} catch (Exception e) {
			throw new RuntimeException(e);
		} finally {
			if (conn != null) {
				conn.disconnect();
			}
		}
	}
	
	public static String get(String url, Map<String, String> queryParas) {
		return get(url, queryParas, null, CHARSET);
	}
	
	public static String get(String url) {
		return get(url, null, null, CHARSET);
	}
	
	/**

	 * 发送 POST 请求
	 * 考虑添加一个参数 Map<String, String> queryParas： getHttpConnection(buildUrl(url, queryParas), POST, headers);
	 */
	public static String post(String url, Map<String, String> queryParas, String data, Map<String, String> headers, String charset) {
		logger.info("post url:" + url);
		logger.info("params:" + JSON.toJSONString(queryParas));
		logger.info("data:" + data);
		HttpURLConnection conn = null;
		try {
			conn = getHttpConnection(buildUrlWithQueryString(url, queryParas, charset), POST, headers);
			conn.connect();
			OutputStream out = conn.getOutputStream();
			out.write(data.getBytes(charset));
			out.flush();
			out.close();
			
			return readResponseString(conn, charset);
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
		finally {
			if (conn != null) {
				conn.disconnect();
			}
		}
	}
	
	public static String post(String url, Map<String, String> queryParas, String data) {
		return post(url, queryParas, data, null, CHARSET);
	}
	
	public static String post(String url, String data, Map<String, String> headers) {
		return post(url, null, data, headers, CHARSET);
	}
	
	public static String post(String url, String data) {
		return post(url, null, data, null, CHARSET);
	}
	
	public static String post(String url, Map<String, String> queryParas) {
		return post(url, queryParas, null, null, CHARSET);
	}
	
	public static String postCharset(String url, Map<String, String> queryParas, String data, String charset) {
		return post(url, queryParas, data, null, charset);
	}
	
	public static String postCharset(String url, String data, Map<String, String> headers, String charset) {
		return post(url, null, data, headers, charset);
	}
	
	public static String postCharset(String url, String data, String charset) {
		return post(url, null, data, null, charset);
	}
	
	public static String postCharset(String url, Map<String, String> queryParas, String charset) {
		return post(url, queryParas, null, null, charset);
	}
	
	private static String readResponseString(HttpURLConnection conn, String charset) {
		StringBuilder sb = new StringBuilder();
		InputStream inputStream = null;
		try {
			inputStream = conn.getInputStream();
			BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, charset));
			String line = null;
			while ((line = reader.readLine()) != null){
				sb.append(line).append("\n");
			}
			logger.info("response:" + sb.toString());
			return sb.toString();
		}
		catch (Exception e) {
			try {
				logger.error("response code: " + conn.getResponseCode());
				logger.error("response msg: " + conn.getResponseMessage());
			} catch (IOException e1) {
				e1.printStackTrace();
			}
			throw new RuntimeException(e);
		}
		finally {
			if (inputStream != null) {
				try {
					inputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	/**
	 * 在 url 之后构造 queryString
	 */
	public static String buildUrlWithQueryString(String url, Map<String, String> queryParas, String charset) {
		if (queryParas == null || queryParas.isEmpty())
			return url;
		
		StringBuilder sb = new StringBuilder(url);
		boolean isFirst;
		if (url.indexOf("?") == -1) {
			isFirst = true;
			sb.append("?");
		}
		else {
			isFirst = false;
		}
		
		for (Entry<String, String> entry : queryParas.entrySet()) {
			if (isFirst) isFirst = false;	
			else sb.append("&");
			
			String key = entry.getKey();
			String value = entry.getValue();
			if (!StringUtils.isEmpty(value))
				try {value = URLEncoder.encode(value, charset);} catch (UnsupportedEncodingException e) {throw new RuntimeException(e);}
			sb.append(key).append("=").append(value);
		}
		return sb.toString();
	}
	
	public static String readIncommingRequestData(HttpServletRequest request) {
		BufferedReader br = null;
		try {
			StringBuilder result = new StringBuilder();
			br = request.getReader();
			for (String line=null; (line=br.readLine())!=null;) {
				result.append(line).append("\n");
			}
			
			return result.toString();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		finally {
			if (br != null){
				try {br.close();} catch (IOException e) {e.printStackTrace();}
			}
		}
	}
}
