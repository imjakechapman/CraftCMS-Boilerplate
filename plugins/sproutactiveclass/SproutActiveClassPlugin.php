<?php
namespace Craft;

class SproutActiveClassPlugin extends BasePlugin
{
    public function getName()
    {
        return Craft::t('Active Class');
    }

    public function getVersion()
    {
        return '0.3.0';
    }

    public function getDeveloper()
    {
        return 'Barrel Strength Design';
    }

    public function getDeveloperUrl()
    {
        return 'http://barrelstrengthdesign.com';
    }

    public function hasCpSection()
    {
        return false;
    }

    public function AddTwigExtension()
    {
        Craft::import('plugins.sproutactiveclass.twigextensions.SproutActiveClassTwigExtension');
        
        return new SproutActiveClassTwigExtension();
    }

}
