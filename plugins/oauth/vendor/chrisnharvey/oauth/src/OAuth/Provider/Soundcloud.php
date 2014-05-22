<?php

namespace OAuth\Provider;

use \OAuth\OAuth2\Token\Access;

/**
 * Soundcloud OAuth2 Provider
 *
 * @package    CodeIgniter/OAuth2
 * @category   Provider
 * @author     Phil Sturgeon
 * @copyright  (c) 2012 HappyNinjas Ltd
 * @license    http://philsturgeon.co.uk/code/dbad-license
 */

class Soundcloud extends \OAuth\OAuth2\Provider
{
    /**
     * @var  string  the method to use when requesting tokens
     */
    protected $method = 'POST';

    public function authorizeUrl()
    {
        return 'https://soundcloud.com/connect';
    }

    public function accessTokenUrl()
    {
        return 'https://api.soundcloud.com/oauth2/token';
    }

    public function getUserInfo()
    {
        $url = 'https://api.soundcloud.com/me.json?'.http_build_query(array(
            'oauth_token' => $this->token->access_token,
        ));

        $user = json_decode(file_get_contents($url));

        // Create a response from the request
        return array(
            'uid' => $user->id,
            'nickname' => $user->username,
            'name' => $user->full_name,
            'location' => $user->country.' ,'.$user->country,
            'description' => $user->description,
            'image' => $user->avatar_url,
            'urls' => array(
                'MySpace' => $user->myspace_name,
                'Website' => $user->website,
            ),
        );
    }
}
