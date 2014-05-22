<?php
namespace Craft;

class TypogrifyPlugin extends BasePlugin
{
    function getName()
    {
        return Craft::t('Typogrify');
    }

    function getVersion()
    {
        return '1.0';
    }

    function getDeveloper()
    {
        return 'Chief';
    }

    function getDeveloperUrl()
    {
        return 'http://withchief.com';
    }

    public function hookAddTwigExtension()
    {
        Craft::import('plugins.typogrify.twigextensions.TypogrifyTwigExtension');
        return new TypogrifyTwigExtension();
    }
}