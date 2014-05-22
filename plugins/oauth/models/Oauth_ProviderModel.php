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

class Oauth_ProviderModel extends BaseModel
{

    public $providerSource;

    public function __construct($self = null)
    {
        if($self) {
            $this->id = $self->id;
            $this->class = $self->class;


            // client id and secret

            $clientId = false;
            $clientSecret = false;

            $oauthConfig = craft()->config->get('oauth');

            if($oauthConfig) {

                if(!empty($oauthConfig[$this->getHandle()]['clientId'])) {
                    $clientId = $oauthConfig[$this->getHandle()]['clientId'];
                }
                if(!empty($oauthConfig[$this->getHandle()]['clientSecret'])) {
                    $clientSecret = $oauthConfig[$this->getHandle()]['clientSecret'];
                }
            }

            if(!$clientId) {
                $clientId = $self->clientId;
            }

            if(!$clientSecret) {
                $clientSecret = $self->clientSecret;
            }

            $this->clientId = $clientId;
            $this->clientSecret = $clientSecret;


            // set client

            $this->providerSource = craft()->oauth->getProviderSource($this->class);
            $this->providerSource->setClient($this->clientId, $this->clientSecret);
        }
    }

    public function defineAttributes()
    {
        $attributes = array(
                'id'    => AttributeType::Number,
                'class' => array(AttributeType::String, 'required' => true),
                'clientId' => array(AttributeType::String, 'required' => false),
                'clientSecret' => array(AttributeType::String, 'required' => false),
            );

        return $attributes;
    }

    public function getAccount()
    {
        return $this->providerSource->getAccount();
    }

    public function getConsoleUrl()
    {
        return $this->providerSource->consoleUrl;
    }

    public function getHandle()
    {
        return strtolower($this->class);
    }

    public function getName()
    {
        return $this->providerSource->getName();
    }

    public function getRedirectUri()
    {
        return $this->providerSource->getRedirectUri();
    }

    public function getSource()
    {
        return $this->providerSource;
    }

    public function getToken()
    {
        return $this->providerSource->getToken();
    }

    public function getScope()
    {
        return $this->providerSource->getScope();
    }

    public function isConfigured()
    {
        if(!empty($this->clientId)) {
            return true;
        }

        return false;
    }

    public function setToken($token)
    {
        $this->providerSource->setToken($token);
    }

    public function connectScope($scope)
    {
        $this->providerSource->connectScope($scope);
    }

    public function refreshToken()
    {
        return $this->providerSource->tokenRefresh();
    }

}