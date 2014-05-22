<?php

namespace OAuth\Provider;

use \OAuth\OAuth2\Token\Access;

/**
 * Foursquare OAuth2 Provider
 *
 * @package    CodeIgniter/OAuth2
 * @category   Provider
 * @author     Phil Sturgeon
 * @copyright  (c) 2012 HappyNinjas Ltd
 * @license    http://philsturgeon.co.uk/code/dbad-license
 */

class Foursquare extends \OAuth\OAuth2\Provider
{
    public $method = 'POST';

    public function authorizeUrl()
    {
        return 'https://foursquare.com/oauth2/authenticate';
    }

    public function accessTokenUrl()
    {
        return 'https://foursquare.com/oauth2/access_token';
    }

    public function getUserInfo()
    {
        $url = 'https://api.foursquare.com/v2/users/self?'.http_build_query(array(
            'oauth_token' => $this->token->access_token,
        ));

        $response = json_decode(file_get_contents($url));

        $user = $response->response->user;

        // Create a response from the request
        return array(
            'uid' => $user->id,
            //'nickname' => $user->login,
            'name' => sprintf('%s %s', $user->firstName, $user->lastName),
            'email' => $user->contact->email,
            'image' => $user->photo,
            'location' => $user->homeCity,
        );
    }
}
