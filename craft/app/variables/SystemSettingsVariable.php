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
 * Settings functions
 */
class SystemSettingsVariable
{
	/**
	 * Returns whether a setting category exists.
	 *
	 * @param string $category
	 * @return bool
	 */
	public function __isset($category)
	{
		return true;
	}

	/**
	 * Returns the system settings for a category.
	 *
	 * @param string $category
	 * @return array
	 */
	public function __get($category)
	{
		return craft()->systemSettings->getSettings($category);
	}
}
