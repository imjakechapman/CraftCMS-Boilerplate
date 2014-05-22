<?php

namespace OAuth\Provider;

use \OAuth\OAuth2\Token\Access;

/**
 * Instagram OAuth2 Provider
 *
 * @package    CodeIgniter/OAuth2
 * @category   Provider
 * @author     Phil Sturgeon
 * @copyright  (c) 2012 HappyNinjas Ltd
 * @license    http://philsturgeon.co.uk/code/dbad-license
 */

class Instagram extends \OAuth\OAuth2\Provider
{
    /**
     * @var  string  scope separator, most use "," but some like Google are spaces
     */
    public $scope_seperator = '+';

    /**
     * @var  string  the method to use when requesting tokens
     */
    public $method = 'POST';

    public function authorizeUrl()
    {
        return 'https://api.instagram.com/oauth/authorize';
    }

    public function accessTokenUrl()
    {
        return 'https://api.instagram.com/oauth/access_token';
    }

    public function getUserInfo()
    {
        $user = $this->token->user;

        return array(
            'uid' => $user->id,
            'nickname' => $user->username,
            'name' => $user->full_name,
            'image' => $user->profile_picture,
            'urls' => array(
              'website' => $user->website,
            ),
        );
    }
}
