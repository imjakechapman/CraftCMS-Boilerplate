<?php

namespace OAuth\Provider;

use \OAuth\OAuth2\Token\Access;

/**
 * Stripe OAuth2 Provider
 *
 * @package    CodeIgniter/OAuth2
 * @category   Provider
 * @author     Benjamin David
 * @copyright  (c) 2013 dukt.net
 * @license    http://opensource.org/licenses/MIT
 */

class Stripe extends \OAuth\OAuth2\Provider
{
    public function authorizeUrl()
    {
        return 'https://connect.stripe.com/oauth/authorize';
    }

    public function accessTokenUrl()
    {
        return 'https://connect.stripe.com/oauth/token';
    }

    public function getUserInfo()
    {
        $url = 'https://api.stripe.com/v1/account?'.http_build_query(array(
            'access_token' => $this->token->access_token,
        ));

        $user = json_decode(file_get_contents($url));

        var_dump($user);

        die();

        // Create a response from the request
        return array(
            'uid' => $user->id,
            'nickname' => $user->login,
            'name' => $user->name,
            'email' => $user->email,
            'urls' => array(
              'Stripe' => 'http://Stripe.com/'.$user->login,
              'Blog' => $user->blog,
            ),
        );
    }
}
