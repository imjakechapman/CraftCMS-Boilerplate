<?php

namespace OAuth\OAuth1;

use \Exception;

class Request
{
    /**
     * @var  integer  connection timeout
     */
    public $timeout = 10;

    /**
     * @var  boolean  send Authorization header?
     */
    public $send_header = true;

    /**
     * @var  string  request type name: token, authorize, access, resource
     */
    protected $name;

    /**
     * @var  string  request method: GET, POST, etc
     */
    protected $method = 'GET';

    /**
     * @var  string  request URL
     */
    protected $url;

    /**
     * @var   array   request parameters
     */
    protected $params = array();

    /**
     * @var  array  upload parameters
     */
    protected $upload = array();

    /**
     * @var  array  required parameters
     */
    protected $required = array();

    /**
     * Set the request URL, method, and parameters.
     *
     * @param  string  request method
     * @param  string  request URL
     * @param  array   request parameters
     * @uses   OAuth::parseUrl
     */
    public function __construct($method, $url, array $params = null)
    {
        if ($method) {
            // Set the request method
            $this->method = strtoupper($method);
        }

        // Separate the URL and query string, which will be used as additional
        // default parameters
        list ($url, $default) = OAuth::parseUrl($url);

        // Set the request URL
        $this->url = $url;

        if ($default) {
            // Set the default parameters
            $this->params($default);
        }

        if ($params) {
            // Set the request parameters
            $this->params($params);
        }

        if ($this->required('oauth_version') AND ! isset($this->params['oauth_version'])) {
            // Set the version of this request
            $this->params['oauth_version'] = OAuth::$version;
        }

        if ($this->required('oauth_timestamp') AND ! isset($this->params['oauth_timestamp'])) {
            // Set the timestamp of this request
            $this->params['oauth_timestamp'] = $this->timestamp();
        }

        if ($this->required('oauth_nonce') AND ! isset($this->params['oauth_nonce'])) {
            // Set the unique nonce of this request
            $this->params['oauth_nonce'] = $this->nonce();
        }
    }

    /**
     * Return the value of any protected class variable.
     *
     *     // Get the request parameters
     *     $params = $request->params;
     *
     *     // Get the request URL
     *     $url = $request->url;
     *
     * @param   string  variable name
     * @return mixed
     */
    public function __get($key)
    {
        return $this->$key;
    }

    /**
     * Generates the UNIX timestamp for a request.
     *
     *     $time = $request->timestamp();
     *
     * [!!] This method implements [OAuth 1.0 Spec 8](http://oauth.net/core/1.0/#rfc.section.8).
     *
     * @return integer
     */
    public function timestamp()
    {
        return time();
    }

    /**
     * Generates the nonce for a request.
     *
     *     $nonce = $request->nonce();
     *
     * [!!] This method implements [OAuth 1.0 Spec 8](http://oauth.net/core/1.0/#rfc.section.8).
     *
     * @return string
     * @uses    Text::random
     */
    public function nonce()
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

        $nonce = '';
        for ($i = 0; $i < 40; $i++) {
            $nonce .= $characters[rand(0, strlen($characters) - 1)];
        }

        return $nonce;
    }

    /**
     * Get the base signature string for a request.
     *
     *     $base = $request->baseString();
     *
     * [!!] This method implements [OAuth 1.0 Spec A5.1](http://oauth.net/core/1.0/#rfc.section.A.5.1).
     *
     * @param   Request   request to sign
     * @return string
     * @uses    OAuth::urlencode
     * @uses    OAuth::normalizeParams
     */
    public function baseString()
    {
        $url = $this->url;

        // Get the request parameters
        $params = array_diff_key($this->params, $this->upload);

        // "oauth_signature" is never included in the base string!
        unset($params['oauth_signature']);

        // method & url & sorted-parameters
        return implode('&', array(
            $this->method,
            OAuth::urlencode($url),
            OAuth::urlencode(OAuth::normalizeParams($params)),
        ));
    }

    /**
     * Parameter getter and setter. Setting the value to `null` will remove it.
     *
     *     // Set the "oauth_consumer_key" to a new value
     *     $request->param('oauth_consumer_key', $key);
     *
     *     // Get the "oauth_consumer_key" value
     *     $key = $request->param('oauth_consumer_key');
     *
     * @param   string   parameter name
     * @param   mixed    parameter value
     * @param   boolean  allow duplicates?
     * @return mixed when getting
     * @return  $this    when setting
     * @uses    Arr::get
     */
    public function param($name, $value = null, $duplicate = false)
    {
        if ($value === null) {
            // Get the parameter
            return isset($this->params[$name]) ? $this->params[$name] : null;
        }

        if (isset($this->params[$name]) AND $duplicate) {
            if ( ! is_array($this->params[$name])) {
                // Convert the parameter into an array
                $this->params[$name] = array($this->params[$name]);
            }

            // Add the duplicate value
            $this->params[$name][] = $value;
        } else {
            // Set the parameter value
            $this->params[$name] = $value;
        }

        return $this;
    }

    /**
     * Set multiple parameters.
     *
     *     $request->params($params);
     *
     * @param   array    parameters
     * @param   boolean  allow duplicates?
     * @return  $this
     * @uses    Request::param
     */
    public function params(array $params, $duplicate = false)
    {
        foreach ($params as $name => $value) {
            $this->param($name, $value, $duplicate);
        }

        return $this;
    }

    /**
     * Upload getter and setter. Setting the value to `null` will remove it.
     *
     *     // Set the "image" file path for uploading
     *     $request->upload('image', $file_path);
     *
     *     // Get the "image" file path
     *     $key = $request->param('oauth_consumer_key');
     *
     * @param   string   upload name
     * @param   mixed    upload file path
     * @return mixed when getting
     * @return  $this    when setting
     * @uses    Request::param
     */
    public function upload($name, $value = null)
    {
        if ($value !== null) {
            // This is an upload parameter
            $this->upload[$name] = true;

            // Get the mime type of the image
            $mime = get_mime_by_extension($value);

            // Format the image path for CURL
            $value = "@{$value};type={$mime}";
        }

        return $this->param($name, $value, false);
    }

    /**
     * Get and set required parameters.
     *
     *     $request->required($field, $value);
     *
     * @param   string   parameter name
     * @param   boolean  field value
     * @return boolean when getting
     * @return  $this    when setting
     */
    public function required($param, $value = null)
    {
        if ($value === null) {
            // Get the current status
            return ! empty($this->required[$param]);
        }

        // Change the requirement value
        $this->required[$param] = (boolean) $value;

        return $this;
    }

    /**
     * Convert the request parameters into an `Authorization` header.
     *
     *     $header = $request->asHeader();
     *
     * [!!] This method implements [OAuth 1.0 Spec 5.4.1](http://oauth.net/core/1.0/#rfc.section.5.4.1).
     *
     * @return string
     */
    public function asHeader()
    {
        $header = array();

        foreach ($this->params as $name => $value) {
            if (strpos($name, 'oauth_') === 0) {
                // OAuth Spec 5.4.1
                // "Parameter names and values are encoded per Parameter Encoding [RFC 3986]."
                $header[] = OAuth::urlencode($name).'="'.OAuth::urlencode($value).'"';
            }
        }

        return 'OAuth '.implode(', ', $header);
    }

    /**
     * Convert the request parameters into a query string, suitable for GET and
     * POST requests.
     *
     *     $query = $request->asQuery();
     *
     * [!!] This method implements [OAuth 1.0 Spec 5.2 (2,3)](http://oauth.net/core/1.0/#rfc.section.5.2).
     *
     * @param   boolean   include oauth parameters?
     * @param   boolean   return a normalized string?
     * @return string
     */
    public function asQuery($include_oauth = null, $as_string = true)
    {
        if ($include_oauth === null) {
            // If we are sending a header, OAuth parameters should not be
            // included in the query string.
            $include_oauth = ! $this->send_header;
        }

        if ($include_oauth) {
            $params = $this->params;
        } else {
            $params = array();
            foreach ($this->params as $name => $value) {
                if (strpos($name, 'oauth_') !== 0) {
                    // This is not an OAuth parameter
                    $params[$name] = $value;
                }
            }
        }

        return $as_string ? OAuth::normalizeParams($params) : $params;
    }

    /**
     * Return the entire request URL with the parameters as a GET string.
     *
     *     $url = $request->asUrl();
     *
     * @return string
     * @uses    Request::as_query
     */
    public function asUrl()
    {
        return $this->url.'?'.$this->asQuery(true);
    }

    /**
     * Sign the request, setting the `oauth_signature_method` and `oauth_signature`.
     *
     * @param   Signature  signature
     * @param   Consumer   consumer
     * @param   Token      token
     * @return  $this
     * @uses    Signature::sign
     */
    public function sign(Signature $signature, Consumer $consumer, Token $token = null)
    {
        // Create a new signature class from the method
        $this->param('oauth_signature_method', $signature->name);

        // Sign the request using the consumer and token
        $this->param('oauth_signature', $signature->sign($this, $consumer, $token));

        return $this;
    }

    /**
     * Checks that all required request parameters have been set. Throws an
     * exception if any parameters are missing.
     *
     *     try
     *     {
     *         $request->check();
     *     }
     *     catch (Exception $e)
     *     {
     *         // Request has missing parameters
     *     }
     *
     * @return true
     * @throws Exception
     */
    public function check()
    {
        foreach ($this->required as $param => $required) {
            if ($required AND ! isset($this->params[$param])) {
                throw new Exception(sprintf('Request to %s requires missing parameter "%s"', $this->url, $param));
            }
        }

        return true;
    }

    /**
     * Execute the request and return a response.
     *
     * @param   array    additional cURL options
     * @return string request response body
     * @uses    Request::check
     * @uses    Arr::get
     * @uses    Remote::get
     */
    public function execute(array $options = null)
    {
        // Check that all required fields are set
        $this->check();

        // Get the URL of the request
        $url = $this->url;

        if ( ! isset($options[CURLOPT_CONNECTTIMEOUT])) {
            // Use the request default timeout
            $options[CURLOPT_CONNECTTIMEOUT] = $this->timeout;
        }

        if ($this->send_header) {
            // Get the the current headers
            $headers = isset($options[CURLOPT_HTTPHEADER]) ? $options[CURLOPT_HTTPHEADER] : array();

            // Add the Authorization header
            $headers[] = 'Authorization: '.$this->asHeader();

            // Store the new headers
            $options[CURLOPT_HTTPHEADER] = $headers;
        }

        if ($this->method === 'POST') {
            // Send the request as a POST
            $options[CURLOPT_POST] = true;

            if ($post = $this->asQuery(null, empty($this->upload))) {
                // Attach the post fields to the request
                $options[CURLOPT_POSTFIELDS] = $post;
            }
        } elseif ($query = $this->asQuery()) {
            // Append the parameters to the query string
            $url = "{$url}?{$query}";
        }

        return OAuth::remote($url, $options);
    }

} // End Request
