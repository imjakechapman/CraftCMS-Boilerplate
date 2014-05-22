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

class Oauth_PluginController extends BaseController
{

    private $pluginService;
    private $referer;

    public function __construct()
    {
        $this->pluginService = craft()->oauth_plugin;
    }

    public function actionUpdate()
    {
        Craft::log(__METHOD__, LogLevel::Info, true);

        $plugin = $this->pluginService->checkUpdates('Facebook', 'facebook');

        if($plugin) {

            Craft::log(__METHOD__." : Updates checked", LogLevel::Info, true);

            $this->redirect($_SERVER['HTTP_REFERER']);

        } else {
            Craft::log(__METHOD__." : Coudln't check updates", LogLevel::Info, true);

            $this->redirect($_SERVER['HTTP_REFERER']);
        }
    }

    public function actionUpdateAllPlugins()
    {
        Craft::log(__METHOD__, LogLevel::Info, true);

        $plugins = array(
                array('pluginClass' => 'Oauth', 'pluginHandle' => 'oauth'),
                array('pluginClass' => 'Facebook', 'pluginHandle' => 'facebook')
            );

        foreach($plugins as $p) {
            $this->pluginService->download($p['pluginClass'], $p['pluginHandle']);
        }

        $this->redirect($_SERVER['HTTP_REFERER']);
    }

    public function actionUpdatePlugins()
    {
        Craft::log(__METHOD__, LogLevel::Info, true);

        $plugins = craft()->request->getParam('plugins');

        $pluginHandles = explode(",", $plugins);

        foreach($pluginHandles as $handle) {
            $this->pluginService->download($handle);
        }

        $this->redirect($_SERVER['HTTP_REFERER']);
    }

    public function actionCheckUpdates()
    {
        Craft::log(__METHOD__, LogLevel::Info, true);

        $plugin = $this->pluginService->checkUpdates('Facebook', 'facebook');

        $this->returnJson($plugin);
    }
}