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
class JsonHelper extends \CJSON
{
	/**
	 * @static
	 */
	public static function sendJsonHeaders()
	{
		// TODO: After next breakpoint release, replace with HeaderHelper code below
		header('Cache-Control: no-cache, must-revalidate');
		header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
		header('Content-Type: application/json; charset=utf-8');

		//HeaderHelper::setNoCache();
		//HeaderHelper::setContentTypeByExtension('json');
	}
}
