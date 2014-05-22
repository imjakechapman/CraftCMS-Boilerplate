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
 * Fieldtype interface
 */
interface IFieldType extends ISavableComponentType
{
	/**
	 * @return mixed
	 */
	public function defineContentAttribute();

	/**
	 * @param string $name
	 * @param mixed  $value
	 * @return string
	 */
	public function getInputHtml($name, $value);

	/**
	 * @param mixed $value
	 * @return mixed
	 */
	public function prepValueFromPost($value);

	/**
	 * @param mixed $value
	 * @return true|string|array
	 */
	public function validate($value);

	/**
	 * @param mixed $value
	 * @return string
	 */
	public function getSearchKeywords($value);

	/**
	 */
	public function onBeforeSave();

	/**
	 */
	public function onAfterSave();

	/**
	 */
	public function onBeforeDelete();

	/**
	 */
	public function onAfterDelete();

	/**
	 */
	public function onAfterElementSave();

	/**
	 * @param mixed $value
	 * @return mixed
	 */
	public function prepValue($value);

	/**
	 * @param DbCommand $query
	 * @param mixed     $value
	 * @return null|false
	 */
	public function modifyElementsQuery(DbCommand $query, $value);
}
