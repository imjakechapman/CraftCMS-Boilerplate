<?php

namespace OAuth\OAuth2;

use \OAuth\OAuth2\Token\Access;
use \OAuth\OAuth2\Token\Authorize;

/**
 * OAuth2 Provider
 *
 * @package    CodeIgniter/OAuth2
 * @category   Provider
 * @author     Phil Sturgeon
 * @copyright  (c) 2012 HappyNinjas Ltd
 * @license    http://philsturgeon.co.uk/code/dbad-license
 */

abstract class Provider
{
    /**
     * @var  string  provider name
     */
    public $name;

    /**
     * @var  string  uid key name
     */
    public $uid_key = 'uid';

    /**
     * @var  string  additional request parameters to be used for remote requests
     */
    public $callback;

    /**
     * @var  array  additional request parameters to be used for remote requests
     */
    protected $params = array();

    /**
     * @var  string  the method to use when requesting tokens
     */
    protected $method = 'GET';

    /**
     * @var  string  default scope (useful if a scope is required for user info)
     */
    protected $scope;

    /**
     * @var  string  scope separator, most use "," but some like Google are spaces
     */
    protected $scope_seperator = ',';

    /**
     * Overloads default class properties from the options.
     *
     * Any of the provider options can be set here, such as app_id or secret.
     *
     * @param  array     $options provider options
     * @throws Exception if a required option is not provided
     */
    public function __construct(array $options = array())
    {
        if (empty($options['id'])) {
            throw new Exception('Required option not provided: id');
        }

        if (empty($options['redirect_url'])) {
            throw new Exception('Required option not provided: redirect_url');
        }

        $this->client_id = $options['id'];

        isset($options['callback']) and $this->callback = $options['callback'];
        isset($options['secret']) and $this->client_secret = $options['secret'];
        isset($options['scope']) and $this->scope = $options['scope'];

        $this->redirect_uri = $options['redirect_url'];
    }

    /**
     * Return the value of any protected class variable.
     *
     *     // Get the provider signature
     *     $signature = $provider->signature;
     *
     * @param  string $key variable name
     * @return mixed
     */
    public function __get($key)
    {
        return $this->$key;
    }

    /**
     * Returns the authorization URL for the provider.
     *
     *     $url = $provider->url_authorize();
     *
     * @return string
     */
    abstract public function authorizeUrl();

    /**
     * Returns the access token endpoint for the provider.
     *
     *     $url = $provider->url_access_token();
     *
     * @return string
     */
    abstract public function accessTokenUrl();

    /**
     * @param  OAuth2_Token_Access $token
     * @return array               basic user info
     */
    abstract public function getUserInfo();

    public function process($process)
    {
        if (! isset($_GET['code'])) {
            // By sending no options it'll come back here
            $params = $this->authorize();

            return $process("{$this->authorizeUrl()}?".http_build_query($params));
        } else {
            $this->token = $this->access($_GET['code']);

            return $this;
        }
    }

    public function token()
    {
        return isset($this->token) ? $this->token : false;
    }

    public function setToken(Access $token)
    {
        $this->token = $token;

        return $this;
    }

    public function call($method = 'GET', $url, array $params = array(), array $post_params = array())
    {
        $url = "{$url}?".http_build_query(array_merge(array(
            'access_token' => $this->token->access_token,
        ), $params));

        $ch = curl_init();

        if (! empty($post_params)) {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
        }

        curl_setopt($ch, CURLOPT_URL, $url);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $response = curl_exec($ch);

        curl_close ($ch);

        return $response;
    }

    /*
    * Get an authorization code from Facebook.  Redirects to Facebook, which this redirects back to the app using the redirect address you've set.
    */
    public function authorize($options = array())
    {
        $state = md5(uniqid(rand(), true));

        $params = array(
            'client_id'         => $this->client_id,
            'redirect_uri'      => isset($options['redirect_uri']) ? $options['redirect_uri'] : $this->redirect_uri,
            'state'             => $state,
            'scope'             => is_array($this->scope) ? implode($this->scope_seperator, $this->scope) : $this->scope,
            'response_type'     => 'code',
            'approval_prompt'   => 'force' // - google force-recheck
        );

        $params = array_merge($params, $this->params);

        return $params;
    }

    /*
    * Get access to the API
    *
    * @param    string  The access code
    * @return   object  Success or failure along with the response details
    */
    public function access($code, $options = array())
    {
        $params = array(
            'client_id'     => $this->client_id,
            'client_secret' => $this->client_secret,
            'grant_type'    => isset($options['grant_type']) ? $options['grant_type'] : 'authorization_code',
        );

        $params = array_merge($params, $this->params);

        switch ($params['grant_type']) {
            case 'authorization_code':
                $params['code'] = $code;
                $params['redirect_uri'] = isset($options['redirect_uri']) ? $options['redirect_uri'] : $this->redirect_uri;
            break;

            case 'refresh_token':
                $params['refresh_token'] = $code;
            break;
        }

        $response = null;
        $url = $this->accessTokenUrl();

        switch ($this->method) {
            case 'GET':

                // Need to switch to Request library, but need to test it on one that works
                $url .= '?'.http_build_query($params);
                $response = file_get_contents($url);

                parse_str($response, $return);

            break;

            case 'POST':

                $opts = array(
                    'http' => array(
                        'method'  => 'POST',
                        'header'  => 'Content-type: application/x-www-form-urlencoded',
                        'content' => http_build_query($params),
                    )
                );

                $_default_opts = stream_context_get_params(stream_context_get_default());
                $context = stream_context_create(array_merge_recursive($_default_opts['options'], $opts));


                ExceptionThrower::Start();
                $response = file_get_contents($url, false, $context);
                ExceptionThrower::Stop();

                $return = json_decode($response, true);

            break;

            default:
                throw new \OutOfBoundsException("Method '{$this->method}' must be either GET or POST");
        }

        if ( ! empty($return['error'])) {
            throw new Exception($return);
        }

        switch ($params['grant_type']) {
            case 'authorization_code':
                return new Access($return);
            break;

            case 'refresh_token':
                return new Access($return);
            break;
        }

    }

}



class ExceptionThrower
{

    static $IGNORE_DEPRECATED = true;

    /**
     * Start redirecting PHP errors
     * @param int $level PHP Error level to catch (Default = E_ALL & ~E_DEPRECATED)
     */
    static function Start($level = null)
    {

        if ($level == null)
        {
            if (defined("E_DEPRECATED"))
            {
                $level = E_ALL & ~E_DEPRECATED ;
            }
            else
            {
                // php 5.2 and earlier don't support E_DEPRECATED
                $level = E_ALL;
                self::$IGNORE_DEPRECATED = true;
            }
        }
        set_error_handler("\OAuth\OAuth2\ExceptionThrower::HandleError", $level);
    }

    /**
     * Stop redirecting PHP errors
     */
    static function Stop()
    {
        restore_error_handler();
    }

    /**
     * Fired by the PHP error handler function.  Calling this function will
     * always throw an exception unless error_reporting == 0.  If the
     * PHP command is called with @ preceeding it, then it will be ignored
     * here as well.
     *
     * @param string $code
     * @param string $string
     * @param string $file
     * @param string $line
     * @param string $context
     */
    static function HandleError($code, $string, $file, $line, $context)
    {
        // ignore supressed errors
        if (error_reporting() == 0) return;
        if (self::$IGNORE_DEPRECATED && strpos($string,"deprecated") === true) return true;

        throw new \Exception($string);
    }
}
