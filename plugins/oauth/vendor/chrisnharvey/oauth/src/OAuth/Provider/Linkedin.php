<?php
/**
 * OAuth LinkedIn Provider
 *
 * Documents for implementing LinkedIn OAuth can be found at
 * <http://dev.twitter.com/pages/auth>.
 *
 * [!!] This class does not implement the LinkedIn API. It is only an
 * implementation of standard OAuth with Twitter as the service provider.
 *
 */

namespace OAuth\Provider;

use \OAuth\OAuth1\Request\Resource;

class Linkedin extends \OAuth\OAuth1\Provider
{
    public $name = 'linkedin';

    public function requestTokenUrl()
    {
        return 'https://api.linkedin.com/uas/oauth/requestToken';
    }

    public function authorizeUrl()
    {
        return 'https://api.linkedin.com/uas/oauth/authorize';
    }

    public function accessTokenUrl()
    {
        return 'https://api.linkedin.com/uas/oauth/accessToken';
    }

    public function getUserInfo()
    {
        // Create a new GET request with the required parameters
        $url = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,headline,member-url-resources,picture-url,location,public-profile-url)';
        $request = new Resource('GET', $url, array(
            'oauth_consumer_key' => $this->consumer->client_id,
            'oauth_token' => $this->token->access_token,
        ));

        // Sign the request using the consumer and token
        $request->sign($this->signature, $this->consumer, $this->token);

        $user = json_decode(json_encode((array)simplexml_load_string($request->execute())),1);

        // Create a response from the request
        return array(
            'uid' => $user['id'],
            'name' => $user['first-name'].' '.$user['last-name'],
            'nickname' => end(explode('/', $user['public-profile-url'])),
            'description' => $user['headline'],
            'location' => isset($user['location']['name']) ? $user['location']['name'] : null,
            'urls' => array(
              'Linked In' => $user['public-profile-url'],
            ),
        );
    }

} // End Provider_Dropbox
