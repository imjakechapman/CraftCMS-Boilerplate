<?php

namespace OAuth\Provider;

use \OAuth\OAuth2\Token\Access;

/**
 * PayPal OAuth2 Provider
 *
 * @package    CodeIgniter/OAuth2
 * @category   Provider
 * @author     Phil Sturgeon
 * @copyright  (c) 2012 HappyNinjas Ltd
 * @license    http://philsturgeon.co.uk/code/dbad-license
 */

class Paypal extends \OAuth\OAuth2\Provider
{
    /**
     * @var  string  default scope (useful if a scope is required for user info)
     */
    protected $scope = array('https://identity.x.com/xidentity/resources/profile/me');

    /**
     * @var  string  the method to use when requesting tokens
     */
    protected $method = 'POST';

    public function authorizeUrl()
    {
        return 'https://identity.x.com/xidentity/resources/authorize';
    }

    public function accessTokenUrl()
    {
        return 'https://identity.x.com/xidentity/oauthtokenservice';
    }

    public function getUserInfo()
    {
        $url = 'https://identity.x.com/xidentity/resources/profile/me?' . http_build_query(array(
            'oauth_token' => $this->token->access_token
        ));

        $user = json_decode(file_get_contents($url),true);
        $user = $user['identity'];

        return array(
            'uid' => $user['userId'],
            'name' => $user['fullName'],
            'first_name' => $user['firstName'],
            'last_name' => $user['lastName'],
            'email' => $user['emails'][0],
            'location' => $user->addresses[0],
            'image' => null,
            'description' => null,
            'urls' => array(
                'PayPal' => null
            )
        );
    }

}
