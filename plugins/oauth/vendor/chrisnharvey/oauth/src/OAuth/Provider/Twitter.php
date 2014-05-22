<?php

namespace OAuth\Provider;

use \OAuth\OAuth1\Token;
use \OAuth\OAuth1\Token\Access;
use \OAuth\OAuth1\Consumer;
use \OAuth\OAuth1\Request\Resource;
use \Exception;

class Twitter extends \OAuth\OAuth1\Provider
{

    public $name = 'twitter';

    public $uid_key = 'user_id';

    public function requestTokenUrl()
    {
        return 'https://api.twitter.com/oauth/request_token';
    }

    public function authorizeUrl()
    {
        return 'https://api.twitter.com/oauth/authorize';
    }

    public function accessTokenUrl()
    {
        return 'https://api.twitter.com/oauth/access_token';
    }

    public function getUserInfo()
    {
        if (! $this->token instanceof Access) {
            throw new Exception('Token must be an instance of Access');
        }

        // Create a new GET request with the required parameters
        $request = new Resource('GET', 'https://api.twitter.com/1.1/account/verify_credentials.json', array(
            'oauth_consumer_key' => $this->consumer->client_id,
            'oauth_token' => $this->token->access_token,
        ));

        // Sign the request using the consumer and token
        $request->sign($this->signature, $this->consumer, $this->token);

        $user = json_decode($request->execute());

        // Create a response from the request
        return array(
            'uid' => $user->id,
            'nickname' => $user->screen_name,
            'name' => $user->name ? $user->name : $user->screen_name,
            'location' => $user->location,
            'image' => $user->profile_image_url,
            'description' => $user->description,
            'urls' => array(
              'Website' => $user->url,
              'Twitter' => 'http://twitter.com/'.$user->screen_name,
            ),
        );
    }

} // End Provider_Twitter
