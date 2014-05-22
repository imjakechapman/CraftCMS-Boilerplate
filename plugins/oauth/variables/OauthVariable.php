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

class OauthVariable
{
    public function callbackUrl($handle)
    {
        return craft()->oauth->callbackUrl($handle);
    }

    public function connect($handle, $scope = null, $namespace = null)
    {
        return craft()->oauth->connect($handle, $scope, $namespace);
    }

    public function disconnect($handle, $namespace = null)
    {
        return craft()->oauth->disconnect($handle, $namespace);
    }

    public function getAccount($handle, $namespace = null)
    {
        return craft()->oauth->getAccount($handle, $namespace);
    }

    public function getProvider($handle, $configuredOnly = true)
    {
        return craft()->oauth->getProvider($handle, $configuredOnly);
    }

    public function getProviders($configuredOnly = true)
    {
        return craft()->oauth->getProviders($configuredOnly);
    }

    public function getSystemToken($handle, $namespace)
    {
        return craft()->oauth->getSystemToken($handle, $namespace);
    }

    public function getSystemTokens()
    {
        return craft()->oauth->getSystemTokens();
    }

    public function getUserToken($handle, $userId = null)
    {
        return craft()->oauth->getUserToken($handle, $userId);
    }

    public function getUserTokens($userId = null)
    {
        return craft()->oauth->getUserTokens($userId);
    }

    public function pluginCheckUpdates($pluginHandle)
    {
        return craft()->oauth_plugin->checkUpdates($pluginHandle);
    }

    public function pluginUpdatePluginsUrl($plugins)
    {
        return craft()->oauth_plugin->pluginUpdatePluginsUrl($plugins);
    }
}
