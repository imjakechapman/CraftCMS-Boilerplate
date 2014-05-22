<?php

namespace OAuth\OAuth1;

use \OAuth\OAuth1\Request;
use \OAuth\OAuth1\Consumer;
use \OAuth\OAuth1\Token;

abstract class Signature
{

    /**
     * @var  string  signature name: HMAC-SHA1, PLAINTEXT, etc
     */
    protected $name;

    /**
     * Return the value of any protected class variables.
     *
     *     $name = $signature->name;
     *
     * @param   string  variable name
     * @return mixed
     */
    public function __get($key)
    {
        return $this->$key;
    }

    /**
     * Get a signing key from a consumer and token.
     *
     *     $key = $signature->key($consumer, $token);
     *
     * [!!] This method implements the signing key of [OAuth 1.0 Spec 9](http://oauth.net/core/1.0/#rfc.section.9).
     *
     * @param   Consumer  consumer
     * @param   Token     token
     * @return string
     * @uses    OAuth::urlencode
     */
    public function key(Consumer $consumer, Token $token = null)
    {
        $key = OAuth::urlencode($consumer->secret).'&';

        if ($token) {
            $key .= OAuth::urlencode($token->secret);
        }

        return $key;
    }

    abstract public function sign(Request $request, Consumer $consumer, Token $token = null);

    abstract public function verify($signature, Request $request, Consumer $consumer, Token $token = null);

} // End Signature
