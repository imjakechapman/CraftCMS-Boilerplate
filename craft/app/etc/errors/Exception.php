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
class Exception extends \CException
{
	/**
	 * @param     $message
	 * @param int $code
	 */
	function __construct($message, $code = 0)
	{
		Craft::log($message, LogLevel::Error);
		parent::__construct($message, $code);
	}
}
