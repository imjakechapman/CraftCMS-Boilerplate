<?php
namespace Craft;

/**
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2014, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license Craft License Agreement
 * @link      http://buildwithcraft.com
 */

/**
 * XCache implements a cache application module based on {@link http://xcache.lighttpd.net/ xcache}.
 *
 * To use this application component, the XCache PHP extension must be loaded.
 * Flush functionality will only work correctly if "xcache.admin.enable_auth" is set to "Off" in php.ini.
 */
class XCache extends \CXCache
{

}
