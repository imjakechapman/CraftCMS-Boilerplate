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
 * Savable component type interface
 */
interface ISavableComponentType extends IComponentType
{
	/**
	 * @return BaseModel
	 */
	public function getSettings();

	/**
	 * @param array $values
	 */
	public function setSettings($values);

	/**
	 * @param array $settings
	 * @return array
	 */
	public function prepSettings($settings);

	/**
	 * @return string|null
	 */
	public function getSettingsHtml();
}
