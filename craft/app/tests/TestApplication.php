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
class TestApplication extends WebApp
{
	/**
	 * @param null $config
	 */
	public function __construct($config = null)
	{
		Craft::setApplication(null);
		clearstatcache();

		// SHOW EVERYTHING
		error_reporting(E_ALL & ~E_STRICT);
		ini_set('display_errors', 1);

		mb_internal_encoding('UTF-8');
		mb_http_input('UTF-8');
		mb_http_output('UTF-8');
		mb_detect_order('auto');

		// No matter how much you want to delete this line... DONT'T DO IT.
		Craft::$enableIncludePath = false;

		parent::__construct($config);
	}

	public function loadGlobalState()
	{
		parent::loadGlobalState();
	}

	public function saveGlobalState()
	{
		parent::saveGlobalState();
	}
}
