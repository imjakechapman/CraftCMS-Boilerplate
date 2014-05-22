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
 *
 */
abstract class CacheMethod extends BaseEnum
{
	const APC          = 'apc';
	const Db           = 'db';
	const EAccelerator = 'eaccelerator';
	const File         = 'file';
	const MemCache     = 'memcache';
	const Redis        = 'redis';
	const WinCache     = 'wincache';
	const XCache       = 'xcache';
	const ZendData     = 'zenddata';
}
