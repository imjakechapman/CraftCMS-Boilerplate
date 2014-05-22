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

require(CRAFT_PLUGINS_PATH.'oauth/vendor/autoload.php');

class Oauth_PublicController extends BaseController
{
    protected $allowAnonymous = true;

    public function actionConnect()
    {
        Craft::log(__METHOD__, LogLevel::Info, true);

        $namespace = craft()->oauth->sessionAdd('oauth.namespace', craft()->request->getParam('namespace'));


        // minimum scope

        $scope          = craft()->httpSession->get('oauth.scope');
        $providerHandle = craft()->httpSession->get('oauth.providerClass');

        $provider = craft()->oauth->getProvider($providerHandle);

        $minimumScope = $provider->getScope();

        $scope = craft()->oauth->scopeMix($scope, $minimumScope);

        craft()->httpSession->add('oauth.scope', $scope);


        // connect user or system

        if($namespace) {
            $this->_connectSystem();
        } else {
            $this->_connectUser();
        }
    }

    public function actionDisconnect()
    {
        Craft::log(__METHOD__, LogLevel::Info, true);

        // redirect url

        $redirect = craft()->httpSession->get('oauth.referer');

        if(!$redirect) {
            $redirect = $_SERVER['HTTP_REFERER'];
        }


        // get request params

        $providerHandle = craft()->request->getParam('provider');
        $namespace = craft()->request->getParam('namespace');



        if($namespace) {
            $userMode = false;
        } else {
            if(craft()->userSession->user) {
                $userMode = true;
            } else {
                $this->_redirect($redirect);
            }
        }

        // remove cache

        if($namespace) {

            $token = craft()->oauth->getSystemToken($providerHandle, $namespace);

            if($token) {
                $token = $token->getRealToken();
            }
        }



        // criteria conditions & params

        $conditions = 'provider=:provider';
        $params = array(':provider' => $providerHandle);

        if($namespace) {
            $conditions .= ' AND namespace=:namespace';
            $params[':namespace']  = $namespace;
        }

        if($userMode) {
            $conditions .= ' AND userId=:userId';
            $params[':userId']  = craft()->userSession->user->id;
        }


        // delete all matching records

        Oauth_TokenRecord::model()->deleteAll($conditions, $params);


        // redirect

        $this->_redirect($redirect);
    }

    private function _connectUser()
    {
        Craft::log(__METHOD__, LogLevel::Info, true);

        // session variables

        $opts = array();

        $providerHandle = $opts['oauth.providerClass'] = craft()->httpSession->get('oauth.providerClass');
        $social         = $opts['oauth.social'] = craft()->httpSession->get('oauth.social');
        $socialCallback = $opts['oauth.socialCallback'] = craft()->httpSession->get('oauth.socialCallback');
        $referer        = $opts['oauth.referer'] = craft()->httpSession->get('oauth.referer');

        $token = craft()->oauth->getToken($providerHandle);
        $provider = craft()->oauth->getProvider($providerHandle);


        // scope

        $scope          = craft()->httpSession->get('oauth.scope');

        if(!$scope) {

            // tokenScope

            $tokenScope = @unserialize(base64_decode($token->scope));


            // is scope enough ?

            $scopeEnough = craft()->oauth->scopeIsEnough($scope, $tokenScope);


            // scope is not enough, connect user with new scope

            if(!$scopeEnough) {
                $scope = craft()->oauth->scopeMix($scope, $tokenScope);

                craft()->httpSession->add('oauth.scope', $scope);
            }
        }

        $opts['oauth.scope'] = $scope;


        // instantiate provider

        if(!$provider) {
            craft()->userSession->setError(Craft::t("Provider not configured."));
            craft()->httpSession->add('error', Craft::t("Provider not configured."));
            $this->redirect($referer);
            return;
        }

        try {
            $provider->connectScope($scope);
        } catch(\Exception $e) {
            craft()->userSession->setError(Craft::t($e->getMessage()));
            craft()->httpSession->add('error', Craft::t($e->getMessage()));
            $this->redirect($referer);
        }


        // post-connect

        if($provider) {


            // ----------------------
            // social bypass
            // ----------------------


            $oauthToken = $opts['oauth.token'] = base64_encode(serialize($provider->getToken()));

            if($social) {

                $redirect = craft()->social->loginCallback($opts);

                $this->redirect($redirect);

                return;
            }


            // ----------------------
            // save userToken record
            // ----------------------

            // craft user must be logged in

            if(!craft()->userSession->user) {
                return null;
            }


            // set default scope if none set

            if(!$scope) {
                $scope = $provider->getScope();
            }

            try {

                $account = $provider->getAccount();

            } catch(\Exception $e) {

                craft()->userSession->setError(Craft::t($e->getMessage()));
                craft()->httpSession->add('error', Craft::t($e->getMessage()));

                // template errors

                $this->_redirect($referer);
            }


            // save token

            $token = craft()->oauth->getTokenFromUserMapping($providerHandle, $account['uid']);

            if($token) {
                if($token->userId != craft()->userSession->user->id) {

                    Craft::log(__METHOD__.$provider->name." account already used by another user.", LogLevel::Warning);

                    // cp errors

                    craft()->userSession->setError(Craft::t($provider->name." account already used by another user."));
                    craft()->httpSession->add('error', Craft::t($provider->name." account already used by another user."));

                    // template errors

                    $this->_redirect($referer);

                    return null;

                }
            } else {
                $token = new Oauth_TokenModel;
            }

            $token->userId = craft()->userSession->user->id;
            $token->provider = strtolower($providerHandle);
            $token->userMapping = $account['uid'];
            $token->token = base64_encode(serialize($provider->getToken()));
            $token->scope = $scope;

            craft()->oauth->tokenSave($token);

        } else {
            Craft::log(__METHOD__.'Could not post-connect user', LogLevel::Error);
        }


        // remove httpSession variables

        craft()->oauth->sessionClean();


        // redirect

        $this->_redirect($referer);
    }

    private function _connectSystem()
    {
        Craft::log(__METHOD__, LogLevel::Info, true);

        // namespace

        $namespace = craft()->oauth->sessionAdd('oauth.namespace', craft()->request->getParam('namespace'));


        // session vars

        $providerHandle = craft()->httpSession->get('oauth.providerClass');
        $scope         = craft()->httpSession->get('oauth.scope');
        $referer       = craft()->httpSession->get('oauth.referer');


        // connect provider

        $provider = craft()->oauth->getProvider($providerHandle);

        $userSession = craft()->userSession;

        try {
            $provider->connectScope($scope);
        } catch(\Exception $e) {

            $userSession->setError(Craft::t($e->getMessage()));
            craft()->httpSession->add('error', Craft::t($e->getMessage()));

            $this->redirect($referer);
        }

        // save token

        if($provider) {

            // remove any existing token with this namespace

            craft()->oauth->tokenDeleteByNamespace($providerHandle, $namespace);


            // token

            $token = $provider->getToken();

            $token = base64_encode(serialize($token));



            // scope

            if(!$scope) {
                $scope = $provider->getScope();
            }


            // save token

            $model = new Oauth_TokenModel();
            $model->provider = $providerHandle;
            $model->namespace = $namespace;
            $model->token = $token;
            $model->scope = $scope;

            craft()->oauth->tokenSave($model);


        } else {
            Craft::log(__METHOD__.'Could not post-connect system', LogLevel::Error);
        }


        $this->_redirect($referer);
    }

    private function _redirect($referer)
    {
        Craft::log(__METHOD__." : Referer : ".$referer, LogLevel::Info, true);

        $this->redirect($referer);
    }
}