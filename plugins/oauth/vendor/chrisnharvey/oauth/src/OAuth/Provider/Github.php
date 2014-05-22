<?php

namespace OAuth\Provider;

use \OAuth\OAuth2\Token\Access;

/**
 * GitHub OAuth2 Provider
 *
 * @package    CodeIgniter/OAuth2
 * @category   Provider
 * @author     Phil Sturgeon
 * @copyright  (c) 2012 HappyNinjas Ltd
 * @license    http://philsturgeon.co.uk/code/dbad-license
 */

class Github extends \OAuth\OAuth2\Provider
{
    public function authorizeUrl()
    {
        return 'https://github.com/login/oauth/authorize';
    }

    public function accessTokenUrl()
    {
        return 'https://github.com/login/oauth/access_token';
    }

    public function getUserInfo()
    {
        $url = 'https://api.github.com/user?'.http_build_query(array(
            'access_token' => $this->token->access_token,
        ));

        // Create a curl handle to a non-existing location
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); //Set curl to return the data instead of printing it to the browser.
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT,10); # timeout after 10 seconds, you can increase it
        curl_setopt($ch, CURLOPT_URL, $url); #set the url and get string together
        curl_setopt($ch, CURLOPT_USERAGENT, 'dukt-oauth'); #set the url and get string together

        $json = '';

        if( ($json = curl_exec($ch) ) === false)
        {
            throw new \Exception(curl_error($ch));
        }

        curl_close($ch);


        $user = json_decode($json);

        if(!isset($user->id))
        {
            throw new \Exception($json);
        }

        // Create a response from the request
        return array(
            'uid' => $user->id,
            'nickname' => $user->login,
            'name' => $user->name,
            'email' => $user->email,
            'urls' => array(
              'GitHub' => 'http://github.com/'.$user->login,
              'Blog' => $user->blog,
            ),
        );
    }
}
