<?php

namespace OAuth\Provider;

use \OAuth\OAuth2\Token\Access;
use \OAuth\OAuth2\Exception;

/**
 * Google OAuth2 Provider
 *
 * @package    CodeIgniter/OAuth2
 * @category   Provider
 * @author     Phil Sturgeon
 * @copyright  (c) 2012 HappyNinjas Ltd
 * @license    http://philsturgeon.co.uk/code/dbad-license
 */

class Google extends \OAuth\OAuth2\Provider
{
    /**
     * @var  string  the method to use when requesting tokens
     */
    public $method = 'POST';

    /**
     * @var  string  scope separator, most use "," but some like Google are spaces
     */
    public $scope_seperator = ' ';

    /**
     * @var string The access type (online/offline)
     */
    protected $access_type = 'offline';

    public function authorizeUrl()
    {
        return 'https://accounts.google.com/o/oauth2/auth';
    }

    public function accessTokenUrl()
    {
        return 'https://accounts.google.com/o/oauth2/token';
    }

    public function __construct(array $options = array())
    {
        // Now make sure we have the default scope to get user data
        empty($options['scope']) and $options['scope'] = array(
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        );

        // Array it if its string
        $options['scope'] = (array) $options['scope'];

        isset($options['access_type'])
            and $this->access_type = $options['access_type'];

        parent::__construct($options);
    }

    public function authorize($options = array())
    {
        $state = md5(uniqid(rand(), true));

        $params = array(
            'client_id'         => $this->client_id,
            'redirect_uri'      => isset($options['redirect_uri']) ? $options['redirect_uri'] : $this->redirect_uri,
            'state'             => $state,
            'scope'             => is_array($this->scope) ? implode($this->scope_seperator, $this->scope) : $this->scope,
            'response_type'     => 'code',
            'approval_prompt'   => 'force', // - google force-recheck
            'access_type'       => $this->access_type
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
        if ($code === null) {
            throw new Exception(array('message' => 'Expected Authorization Code from '.ucfirst($this->name).' is missing'));
        }

        return parent::access($code, $options);
    }

    public function getUserInfo()
    {
        $url = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&'.http_build_query(array(
            'access_token' => $this->token->access_token,
        ));

        $user = json_decode(file_get_contents($url), true);

        return array(
            'uid' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'location' => null,
            'image' => isset($user['picture']) ? $user['picture'] : null,
            'description' => null,
            'urls' => array(),
        );
    }
}
