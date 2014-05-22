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
 * Will validate that the given attribute is a valid site locale ID.
 */
class LocaleValidator extends \CValidator
{
	/**
	 * @param $object
	 * @param $attribute
	 */
	protected function validateAttribute($object, $attribute)
	{
		$locale = $object->$attribute;

		if ($locale && !in_array($locale, craft()->i18n->getSiteLocaleIds()))
		{
			$message = Craft::t('Your site isn’t set up to save content for the locale “{locale}”.', array('locale' => $locale));
			$this->addError($object, $attribute, $message);
		}
	}
}
