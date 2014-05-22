<?php

namespace Craft;

class StowTwigExtension extends \Twig_Extension
{
    public function __construct()
    {
        
    }

    public function getName()
    {
        return 'stow';
    }

    public function getCacheStrategy()
    {
        Craft::import('plugins.stow.twigextensions.CacheStrategy.StowCacheStrategy');
        return new StowCacheStrategy();
    }

    public function getTokenParsers()
    {
        Craft::import('plugins.stow.twigextensions.TokenParser.CacheTokenParser');

        return array(
            new CacheTokenParser(),
        );
    }
}