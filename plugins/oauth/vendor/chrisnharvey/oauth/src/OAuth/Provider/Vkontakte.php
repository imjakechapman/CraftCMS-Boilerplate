<?php

namespace OAuth\Provider;

use \OAuth\OAuth2\Token\Access;

/**
 * Vkontakte OAuth2 Provider
 *
 * @package    CodeIgniter/OAuth2
 * @category   Provider
 * @author     Lavr Lyndin
 */

class Vkontakte extends \OAuth\OAuth2\Provider
{
    protected $method = 'POST';
    public $uid_key = 'user_id';

    public function authorizeUrl()
    {
        return 'http://oauth.vk.com/authorize';
    }

    public function accessTokenUrl()
    {
        return 'https://oauth.vk.com/access_token';
    }

    public function getUserInfo()
    {
        $scope = array('nickname', 'screen_name','photo_big');
        $url = 'https://api.vk.com/method/users.get?'.http_build_query(array(
            'uids' => $this->token->uid,
            'fields' => implode(",",$scope),
            'access_token' => $this->token->access_token,
        ));

        $user = json_decode(file_get_contents($url))->response;

        if(sizeof($user)==0)

            return null;
        else
            $user = $user[0];

        return array(
            'uid' => $user->uid,
            'nickname' => isset($user->nickname) ? $user->nickname : null,
            'name' => isset($user->name) ? $user->name : null,
            'first_name' => isset($user->first_name) ? $user->first_name : null,
            'last_name' => isset($user->last_name) ? $user->last_name : null,
            'email' => null,
            'location' => null,
            'description' => null,
            'image' => isset($user->photo_big) ? $user->photo_big : null,
            'urls' => array(),
        );
    }
}
