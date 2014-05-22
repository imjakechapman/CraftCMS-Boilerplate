<?php

namespace OAuth\Provider;

use \OAuth\OAuth2\Token\Access;

/**
 * App.net OAuth2 Provider
 *
 * @package    CodeIgniter/OAuth2
 * @category   Provider
 * @author     Brennan Novak
 */

class Appnet extends \OAuth\OAuth2\Provider
{
    /**
     * @array scope items for App.net
     */
    protected $scope = array('stream','email','write_post','follow','messages','export');

    public $name = 'appnet';

    /**
     * @var  string  scope separator, most use "," but some like Google are spaces
     */
    public $scope_seperator = ',';

    /**
     * @var  string  the method to use when requesting tokens
     */

    public function authorizeUrl()
    {
        return 'https://alpha.app.net/oauth/authenticate';
    }

    public function accessTokenUrl()
    {
        return 'https://alpha.app.net/oauth/access_token';
    }

    public function getUserInfo()
    {
        $url = 'https://alpha-api.app.net/stream/0/users/me?'.http_build_query(array(
            'access_token' => $this->token->access_token,
        ));

        $user = json_decode(file_get_contents($url));

        // Create a response from the request
        return array(
            'uid' => $user->id,
            'nickname' => $user->username,
            'name' => $user->name
        );

    }

}
