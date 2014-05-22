<?php

/**
 * Craft OAuth by Dukt
 *
 * @package   Craft OAuth
 * @author    Benjamin David
 * @copyright Copyright (c) 2014, Dukt
 * @license   https://dukt.net/craft/oauth/docs/license
 * @link      https://dukt.net/craft/oauth/
 */

namespace Craft;

class Oauth_TokenModel extends BaseModel
{
    /**
     * Define Attributes
     */
    public function defineAttributes()
    {
        $attributes = array(
                'id'    => AttributeType::Number,
	            'userMapping' => array(AttributeType::String, 'required' => false),
	            'namespace' => array(AttributeType::String, 'required' => false),
	            'provider' => array(AttributeType::String, 'required' => true),
	            'scope' => array(AttributeType::Mixed, 'required' => false),
	            'token' => array(AttributeType::String, 'column' => ColumnType::Text),
	            'userId'  => AttributeType::Number,
            );

        return $attributes;
    }

    public function getAccessToken()
    {
        $realToken = $this->getRealToken();

        if(isset($realToken->access_token)) {
            return $realToken->access_token;
        }
    }

    public function getSecret()
    {
        $realToken = $this->getRealToken();

        if(isset($realToken->secret)) {
            return $realToken->secret;
        }
    }

    public function getDecodedToken()
    {
        return $this->getRealToken();
    }

    public function getEncodedToken()
    {
        return $this->token;
    }

    public function getMd5Token()
    {
        return md5($this->token);
    }

    public function getRealToken()
    {
        if(!$this->token) {
            return false;
        }

        return @unserialize(base64_decode($this->token));
    }

    public function hasScope($scope)
    {
        return \Craft\craft()->oauth->scopeIsEnough($scope, $this->scope);
    }
}
