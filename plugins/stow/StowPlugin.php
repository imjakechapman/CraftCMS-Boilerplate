<?php

/**
 * Stow
 *
 * @package     Stow
 * @version     Version 1.0
 * @author      Connor Smith
 * @copyright   Copyright (c) 2013
 * @link        sphinx.io
 *
 */

namespace Craft;

class StowPlugin extends BasePlugin
{
    /**
     * Get Name
     */
    function getName()
    {
        return Craft::t('Stow');
    }
    
    // --------------------------------------------------------------------

    /**
     * Get Version
     */
    function getVersion()
    {
        return '1.0';
    }
    
    // --------------------------------------------------------------------

    /**
     * Get Developer
     */
    function getDeveloper()
    {
        return 'Connor Smith';
    }
    
    // --------------------------------------------------------------------

    /**
     * Get Developer URL
     */
    function getDeveloperUrl()
    {
        return 'http://sphinx.io';
    }

    // --------------------------------------------------------------------

    /**
     * Has CP Section
     */
    public function hasCpSection()
    {
        return true;
    }

    public function addTwigExtension()
    {
        Craft::import('plugins.stow.twigextensions.StowTwigExtension');
        return new StowTwigExtension();
    }
}