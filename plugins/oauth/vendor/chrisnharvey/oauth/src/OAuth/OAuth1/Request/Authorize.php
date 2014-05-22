<?php

namespace OAuth\OAuth1\Request;

class Authorize extends \OAuth\OAuth1\Request
{
    protected $name = 'request';

    // http://oauth.net/core/1.0/#rfc.section.6.2.1
    protected $required = array(
        'oauth_token' => true,
    );

    public function execute(array $options = null)
    {
        return redirect($this->asUrl());
    }

} // End Request_Authorize
