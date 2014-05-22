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
 * Tool interface
 */
interface ITool extends IComponentType
{
	/**
	 * @return string
	 */
	public function getIconValue();

	/**
	 * @return string
	 */
	public function getOptionsHtml();

	/**
	 * @return string
	 */
	public function getButtonLabel();

	/**
	 * @param array $params
	 * @return array
	 */
	public function performAction($params = array());
}
