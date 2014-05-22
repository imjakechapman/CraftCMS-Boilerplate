<?php

namespace OAuth\Provider;

use \OAuth\OAuth2\Token\Access;

/**
 * Windows Live OAuth2 Provider
 *
 * @package    CodeIgniter/OAuth2
 * @category   Provider
 * @author     Phil Sturgeon
 * @copyright  (c) 2012 HappyNinjas Ltd
 * @license    http://philsturgeon.co.uk/code/dbad-license
 */

class WindowsLive extends \OAuth\OAuth2\Provider
{
    protected $scope = array('wl.basic', 'wl.emails');

    /**
     * @var  string  the method to use when requesting tokens
     */
    protected $method = 'POST';

    // authorise url
    public function authorizeUrl()
    {
        return 'https://oauth.live.com/authorize';
    }

    // access token url
    public function accessTokenUrl()
    {
        return 'https://oauth.live.com/token';
    }

    // get basic user information
    /********************************
    ** this can be extended through the
    ** use of scopes, check out the document at
    ** http://msdn.microsoft.com/en-gb/library/hh243648.aspx#user
    *********************************/
    public function getUserInfo()
    {
        // define the get user information token
        $url = 'https://apis.live.net/v5.0/me?'.http_build_query(array(
            'access_token' => $this->token->access_token,
        ));

        // perform network request
        $user = json_decode(file_get_contents($url));

        // create a response from the request and return it
        return array(
            'uid'       => $user->id,
            'name'      => $user->name,
//          'location'  => $user[''], # scope wl.postal_addresses is required
                                          # but won't be implemented by default
            'locale'    => $user->locale,
            'urls'      => array('Windows Live' => $user->link),
        );
    }
}
