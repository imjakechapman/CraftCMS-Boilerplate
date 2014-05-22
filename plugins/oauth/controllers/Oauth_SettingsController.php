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

class Oauth_SettingsController extends BaseController
{
    public function actionProviderSave()
    {
        Craft::log(__METHOD__, LogLevel::Info, true);

        $handle = craft()->request->getParam('providerHandle');

        $attributes = craft()->request->getPost('provider');

        $provider = craft()->oauth->getProvider($handle, false);

        $provider->setAttributes($attributes);

        if (craft()->oauth->providerSave($provider)) {
            Craft::log(__METHOD__." : Service Saved", LogLevel::Info, true);

            craft()->userSession->setNotice(Craft::t('Service saved.'));

            $redirect = craft()->request->getPost('redirect');

            $this->redirect($redirect);
        } else {
            Craft::log(__METHOD__." : Could not save service", LogLevel::Info, true);

            craft()->userSession->setError(Craft::t("Couldn't save service."));

            craft()->urlManager->setRouteVariables(array('service' => $provider));
        }
    }

    public function actionDeleteToken()
    {
        Craft::log(__METHOD__, LogLevel::Info, true);

        $id = craft()->request->getRequiredParam('id');

        craft()->oauth->tokenDeleteById($id);

        craft()->userSession->setNotice(Craft::t('Token deleted.'));

        $this->redirect($_SERVER['HTTP_REFERER']);
    }
}