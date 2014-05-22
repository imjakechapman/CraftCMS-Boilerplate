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
 * Will validate that the given attribute is a valid URL format.
 */
class UrlFormatValidator extends \CValidator
{
	/**
	 * @var bool Whether we should ensure that "{slug}" is used within the URL format.
	 */
	public $requireSlug = false;

	/**
	 * @param $object
	 * @param $attribute
	 */
	protected function validateAttribute($object, $attribute)
	{
		$urlFormat = $object->$attribute;

		if ($urlFormat)
		{
			// Remove any leading or trailing slashes
			$urlFormat = trim($urlFormat, '/');
			$object->$attribute = $urlFormat;

			if ($this->requireSlug)
			{
				if (!ElementHelper::doesUrlFormatHaveSlugTag($urlFormat))
				{
					$this->addError($object, $attribute, Craft::t('{attribute} must contain “{slug}”'));
				}
			}
		}
	}
}
