<?php

namespace OAuth\OAuth1\Request;

use OAuth\OAuth1\Response;

class Access extends \OAuth\OAuth1\Request
{
    protected $name = 'access';

    protected $required = array(
        'oauth_consumer_key'     => true,
        'oauth_token'            => true,
        'oauth_signature_method' => true,
        'oauth_signature'        => true,
        'oauth_timestamp'        => true,
        'oauth_nonce'            => true,
        // 'oauth_verifier'         => true,
        'oauth_version'          => true,
    );

    public function execute(array $options = null)
    {
        return new Response(parent::execute($options));
    }

} // End Request_Access
