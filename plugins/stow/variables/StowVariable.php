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

class StowVariable
{
    public function fetchAllCache()
    {
        return craft()->stow->fetchAllCache();
    }
}