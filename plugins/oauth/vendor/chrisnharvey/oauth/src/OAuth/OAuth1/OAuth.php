<?php

namespace OAuth\OAuth1;

use \Exception;

class OAuth
{
    /**
     * @var  string  OAuth compliance version
     */
    public static $version = '1.0';

    /**
     * Returns the output of a remote URL. Any [curl option](http://php.net/curl_setopt)
     * may be used.
     *
     *     // Do a simple GET request
     *     $data = Remote::get($url);
     *
     *     // Do a POST request
     *     $data = Remote::get($url, array(
     *         CURLOPT_POST       => true,
     *         CURLOPT_POSTFIELDS => http_build_query($array),
     *     ));
     *
     * @param   string   remote URL
     * @param   array    curl options
     * @return string
     * @throws Exception
     */
    public static function remote($url, array $options = null)
    {
        // The transfer must always be returned
        $options[CURLOPT_RETURNTRANSFER] = true;

        // Open a new remote connection
        $remote = curl_init($url);

        // Set connection options
        if ( ! curl_setopt_array($remote, $options)) {
            throw new Exception('Failed to set CURL options, check CURL documentation: http://php.net/curl_setopt_array');
        }

        // Get the response
        $response = curl_exec($remote);

        // Get the response information
        $code = curl_getinfo($remote, CURLINFO_HTTP_CODE);

        if ($code AND ($code < 200 OR $code > 299)) {
            $error = $response;
        } elseif ($response === false) {
            $error = curl_error($remote);
        }

        // Close the connection
        curl_close($remote);

        if (isset($error)) {
            throw new Exception(sprintf('Error fetching remote %s [ status %s ] %s', $url, $code, $error));
        }

        return $response;
    }
    /**
     * RFC3986 compatible version of urlencode. Passing an array will encode
     * all of the values in the array. Array keys will not be encoded.
     *
     *     $input = OAuth::urlencode($input);
     *
     * Multi-dimensional arrays are not allowed!
     *
     * [!!] This method implements [OAuth 1.0 Spec 5.1](http://oauth.net/core/1.0/#rfc.section.5.1).
     *
     * @param   mixed   input string or array
     * @return mixed
     */
    public static function urlencode($input)
    {
        if (is_array($input)) {
            // Encode the values of the array
            return array_map(array('OAuth\OAuth1\OAuth', 'urlencode'), $input);
        }

        // Encode the input
        $input = rawurlencode($input);

        return $input;
    }

    /**
     * RFC3986 complaint version of urldecode. Passing an array will decode
     * all of the values in the array. Array keys will not be encoded.
     *
     *     $input = OAuth::urldecode($input);
     *
     * Multi-dimensional arrays are not allowed!
     *
     * [!!] This method implements [OAuth 1.0 Spec 5.1](http://oauth.net/core/1.0/#rfc.section.5.1).
     *
     * @param   mixed  input string or array
     * @return mixed
     */
    public static function urldecode($input)
    {
        if (is_array($input)) {
            // Decode the values of the array
            return array_map(array('OAuth', 'urldecode'), $input);
        }

        // Decode the input
        return rawurldecode($input);
    }

    /**
     * Normalize all request parameters into a string.
     *
     *     $query = OAuth::normalizeParams($params);
     *
     * [!!] This method implements [OAuth 1.0 Spec 9.1.1](http://oauth.net/core/1.0/#rfc.section.9.1.1).
     *
     * @param   array   request parameters
     * @return string
     * @uses    OAuth::urlencode
     */
    public static function normalizeParams(array $params = null)
    {
        if (! $params) {
            // Nothing to do
            return '';
        }

        // Encode the parameter keys and values
        $keys   = OAuth::urlencode(array_keys($params));
        $values = OAuth::urlencode(array_values($params));

        // Recombine the parameters
        $params = array_combine($keys, $values);

        // OAuth Spec 9.1.1 (1)
        // "Parameters are sorted by name, using lexicographical byte value ordering."
        uksort($params, 'strcmp');

        // Create a new query string
        $query = array();

        foreach ($params as $name => $value) {
            if (is_array($value)) {
                // OAuth Spec 9.1.1 (1)
                // "If two or more parameters share the same name, they are sorted by their value."
                $value = natsort($value);

                foreach ($value as $duplicate) {
                    $query[] = $name.'='.$duplicate;
                }
            } else {
                $query[] = $name.'='.$value;
            }
        }

        return implode('&', $query);
    }

    /**
     * Parse the query string out of the URL and return it as parameters.
     * All GET parameters must be removed from the request URL when building
     * the base string and added to the request parameters.
     *
     *     // parsed parameters: array('oauth_key' => 'abcdef123456789')
     *     list($url, $params) = OAuth::parseUrl('http://example.com/oauth/access?oauth_key=abcdef123456789');
     *
     * [!!] This implements [OAuth Spec 9.1.1](http://oauth.net/core/1.0/#rfc.section.9.1.1).
     *
     * @param   string  URL to parse
     * @return array (clean_url, params)
     * @uses    OAuth::parseParams
     */
    public static function parseUrl($url)
    {
        if ($query = parse_url($url, PHP_URL_QUERY)) {
            // Remove the query string from the URL
            list($url) = explode('?', $url, 2);

            // Parse the query string as request parameters
            $params = OAuth::parseParams($query);
        } else {
            // No parameters are present
            $params = array();
        }

        return array($url, $params);
    }

    /**
     * Parse the parameters in a string and return an array. Duplicates are
     * converted into indexed arrays.
     *
     *     // Parsed: array('a' => '1', 'b' => '2', 'c' => '3')
     *     $params = OAuth::parseParams('a=1,b=2,c=3');
     *
     *     // Parsed: array('a' => array('1', '2'), 'c' => '3')
     *     $params = OAuth::parseParams('a=1,a=2,c=3');
     *
     * @param   string  parameter string
     * @return array
     */
    public static function parseParams($params)
    {
        // Split the parameters by &
        $params = explode('&', trim($params));

        // Create an array of parsed parameters
        $parsed = array();

        foreach ($params as $param) {
            // Split the parameter into name and value
            list($name, $value) = explode('=', $param, 2);

            // Decode the name and value
            $name  = OAuth::urldecode($name);
            $value = OAuth::urldecode($value);

            if (isset($parsed[$name])) {
                if ( ! is_array($parsed[$name])) {
                    // Convert the parameter to an array
                    $parsed[$name] = array($parsed[$name]);
                }

                // Add a new duplicate parameter
                $parsed[$name][] = $value;
            } else {
                // Add a new parameter
                $parsed[$name] = $value;
            }
        }

        return $parsed;
    }

} // End OAuth
