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
 * Stores the info for a Craft release.
 */
class AppNewReleaseModel extends BaseModel
{
	/**
	 * @access protected
	 * @return array
	 */
	protected function defineAttributes()
	{
		$attributes['version']       = AttributeType::String;
		$attributes['build']         = AttributeType::String;
		$attributes['date']          = AttributeType::DateTime;
		$attributes['notes']         = AttributeType::String;
		$attributes['type']          = AttributeType::String;
		$attributes['critical']      = AttributeType::Bool;
		$attributes['manual']        = AttributeType::Bool;
		$attributes['breakpoint']    = AttributeType::Bool;

		return $attributes;
	}
}
