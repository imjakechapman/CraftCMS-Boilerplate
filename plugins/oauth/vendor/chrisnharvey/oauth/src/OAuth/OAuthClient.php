<?php

namespace OAuth;

use \Guzzle\Http\Client;
use \OAuth\OAuth1\Token\Access as OAuth1Token;
use \OAuth\OAuth2\Token\Access as OAuth2Token;
use \InvalidArgumentException;

class OAuthClient extends Client
{
    protected $tokens;

    public function __construct($baseUrl = '', $config = null, $tokens = null)
    {
        if ($tokens) $this->setUserTokens($tokens);

        parent::__construct($baseUrl, $config);
    }

    public function setUserTokens($tokens)
    {
        if (! ($tokens instanceof OAuth1Token)
            and ! ($tokens instanceof OAuth2Token)) {

            throw new InvalidArgumentException('User tokens must be an instance of OAuth\OAuth1\Token\Access or OAuth\OAuth2\Token\Access');
        }
        
        $this->tokens = $tokens;
    }

    public function setBaseUrl($url)
    {
        $url .= strpos($url, '?') ? '&' : '?';
        $url .= http_build_query(array(
            'access_token' => $this->tokens->access_token
        ));

        $this->baseUrl = $url;

        return $this;
    }
}